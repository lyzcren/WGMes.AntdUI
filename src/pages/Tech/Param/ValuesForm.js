import React, { PureComponent } from 'react';
import moment from 'moment';
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  Switch,
  Tag,
  Select,
  message, Popconfirm, Divider,
} from 'antd';
import isEqual from 'lodash/isEqual';
import { formatMessage, FormattedMessage } from 'umi/locale';
import GlobalConst from '@/utils/GlobalConst'

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TypeData = GlobalConst.DefectTypeData;

@Form.create()
export class ValuesForm extends PureComponent {
  static defaultProps = {
    handleSubmit: () => { },
    handleModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      data: props.data,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      formVals: props.values,
    };
  }

  okHandle = () => {
    const { form, handleSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = this.state.formVals.fItemID;
      handleSubmit(fieldsValue);
    });
  };

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'paramManage/fetchValue',
      payload: { fItemID: this.state.formVals.fItemID },
    }).then(() => {
      this.setState({ data: this.props.data });
    });
  };

  handleAdd = (records) => {
    const { dispatch, queryResult } = this.props;
    records.forEach(record => {
      dispatch({
        type: 'paramManage/addValue',
        payload: {
          fValue: record.fValue, fItemID: this.state.formVals.fItemID
        },
      }).then(() => {
        if (queryResult.status && queryResult.status == 'ok') {
        } else {
          message.warning(queryResult.message);
        }
      });
    });
  };


  index = 0;

  cacheOriginData = {};

  static getDerivedStateFromProps (nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  getRowByKey (guid, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.guid === guid)[0];
  }

  toggleEditable = (e, guid) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[guid] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newItem = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      guid: `NEW_TEMP_ID_${this.index}`,
      fValue: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove (guid) {
    const { dispatch, queryResult } = this.props;
    dispatch({
      type: 'paramManage/removeValue',
      payload: {
        guid: guid
      },
    }).then(() => {
      if (queryResult.status && queryResult.status == 'ok') {
        this.reloadData();
      } else {
        message.warning(queryResult.message);
      }
    });
  }

  handleKeyPress (e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange (e, fieldName, guid) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow (e, guid) {
    e.persist();
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(guid) || {};
    if (!target.fValue) {
      message.error('请填写参数值。');
      e.target.focus();
      return;
    }
    delete target.isNew;
    this.toggleEditable(e, guid);
    const { data } = this.state;
    this.handleAdd(data);
  }

  cancel (e, guid) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (this.cacheOriginData[guid]) {
      Object.assign(target, this.cacheOriginData[guid]);
      delete this.cacheOriginData[guid];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }


  render () {
    const { loading, form, modalVisible, handleModalVisible, values } = this.props;
    const { data, formVals } = this.state;
    const columns = [
      {
        title: '参数值',
        dataIndex: 'fValue',
        key: 'fValue',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'fValue', record.guid)}
                onKeyPress={e => this.handleKeyPress(e, record.guid)}
                placeholder="成员姓名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.guid)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.guid)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.guid)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.guid)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.guid)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.guid)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Modal
        destroyOnClose
        title={<div>修改 <Tag color="blue">{formVals.fName}</Tag> 参数值</div>}
        visible={modalVisible}
        okButtonProps={{ disabled: true }}
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
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newItem}
          icon="plus"
        >
          新增参数值
        </Button>
      </Modal>
    );
  }
};
