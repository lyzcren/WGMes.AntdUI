import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  Switch,
  Tag,
  Select,
  message,
  Popconfirm,
  Divider,
} from 'antd';
import isEqual from 'lodash/isEqual';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { GlobalConst } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const TypeData = GlobalConst.DefectTypeData;

/* eslint react/no-multi-comp:0 */
@connect(({ deptParamsManage, loading, basicData }) => ({
  deptParamsManage,
  loading: loading.models.deptParamsManage,
  basicData,
}))
@Form.create()
export class TechParamForm extends PureComponent {
  static defaultProps = {
    handleSubmit: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      formVals: props.values,
    };
    const { dispatch } = props;
    dispatch({
      type: 'basicData/getParamData',
    });
    dispatch({
      type: 'deptParamsManage/fetch',
      payload: { fDeptID: props.values.fItemID },
    }).then(() => {
      const {
        deptParamsManage: { data },
      } = this.props;
      this.setState({ data });
    });
  }

  okHandle = () => {
    const { form } = this.props;
    const { data, formVals } = this.state;
    const retData = data.filter(x => x.fParamID);

    this.handleSubmit(formVals.fItemID, retData);
  };

  handleSubmit = (fDeptID, retData) => {
    const { dispatch, form, handleModalVisible } = this.props;
    dispatch({
      type: 'deptParamsManage/add',
      payload: { fDeptID, params: retData },
    }).then(() => {
      const {
        deptParamsManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('修改成功');
        handleModalVisible();
      } else {
        message.warning(queryResult.message);
      }
    });
  };

  index = 0;

  getRowByKey(guid, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.guid === guid)[0];
  }

  newItem = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const newItem = {
      guid: `NEW_TEMP_ID_${this.index}`,
      fParamID: '',
      fDefaultValue: '',
      fIsRequired: '',
    };
    newData.push(newItem);
    this.index += 1;
    this.setState({ data: newData });
  };

  remove(guid) {
    const { data } = this.state;
    const newData = data.filter(x => x.guid != guid);
    this.setState({ data: newData });
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
    }
  }

  handleFieldChange(guid, fieldName, value) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  handleParamIdChange(value, record) {
    const { data } = this.state;
    const existsOne = data.find(x => x.guid != record.guid && x.fParamID == value);
    if (existsOne) {
      message.warning('存在相同的工艺参数');
      setTimeout(() => {
        this.remove(record.guid);
        this.newItem();
      }, 300);
    } else {
      this.handleFieldValueChange('fParamID', value, record);
    }
  }

  handleFieldValueChange(fieldName, value, record) {
    const {
      basicData: { paramData },
    } = this.props;
    const { data } = this.state;
    if (record) {
      const item = data.find(x => x.guid == record.guid);
      item[fieldName] = value;
      // console.log(data);
      this.setState({ data });
    }
  }

  render() {
    const {
      form,
      modalVisible,
      handleModalVisible,
      values,
      basicData: { paramData },
    } = this.props;
    const { loading, data, formVals } = this.state;
    const columns = [
      {
        title: '工艺参数',
        dataIndex: 'fParamID',
        key: 'fParamID',
        width: '40%',
        render: (text, record) => {
          return (
            <Select
              placeholder="请选择工艺参数"
              style={{ width: '100%' }}
              onChange={val => this.handleParamIdChange(val, record)}
              defaultValue={record.fParamID}
              autoFocus
            >
              {paramData
                .filter(
                  x => x.fItemID == record.fParamID || !data.find(y => y.fParamID == x.fItemID)
                )
                .map(x => (
                  <Option key={x.fItemID} value={x.fItemID}>
                    {x.fName}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      {
        title: '默认值',
        dataIndex: 'fDefaultValue',
        key: 'fDefaultValue',
        width: '20%',
        render: (text, record) => {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(record.guid, 'fDefaultValue', e.target.value)}
              onKeyPress={e => this.handleKeyPress(e, record.guid)}
              placeholder="参数值"
            />
          );
        },
      },
      {
        title: '是否必填',
        dataIndex: 'fIsRequired',
        key: 'fIsRequired',
        width: '20%',
        render: (text, record) => {
          return (
            <Switch
              checked={text}
              onChange={(checked, e) => this.handleFieldChange(record.guid, 'fIsRequired', checked)}
              onKeyPress={e => this.handleKeyPress(e, record.guid)}
            />
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <a onClick={e => this.remove(record.guid)}>删除</a>
            </span>
          );
        },
      },
    ];

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            {' '}
            修改 <Tag color="blue"> {formVals.fName}</Tag> 工艺参数
          </div>
        }
        width={650}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Table
          rowKey="guid"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newItem}
          icon="plus"
        >
          新增工艺参数
        </Button>
      </Modal>
    );
  }
}
