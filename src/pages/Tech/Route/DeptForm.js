import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
  message,
  Popconfirm,
  Divider,
  TreeSelect,
} from 'antd';
import isEqual from 'lodash/isEqual';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { GlobalConst } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TypeData = GlobalConst.DefectTypeData;

/* eslint react/no-multi-comp:0 */
@connect(({ routeProfile, basicData }) => ({
  routeProfile,
  basicData,
}))
@Form.create()
/* eslint react/no-multi-comp:0 */
export class DeptForm extends PureComponent {
  // static defaultProps = {
  //   handleSubmit: () => { },
  //   handleModalVisible: () => { },
  //   depts: [],
  //   currentStep: 0,
  // };

  MaxEntryID = 0;
  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.MaxEntryID = props.depts.length;

    this.state = {
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      depts: props.depts,
      currentStep: props.currentStep,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
  }

  componentDidUpdate(preProps) {
    const {
      route: { fInterID },
      depts,
      currentStep,
    } = this.props;
    if (fInterID !== preProps.route.fInterID || currentStep !== preProps.currentStep) {
      this.setState({ fInterID, depts, currentStep });
      this.MaxEntryID = depts.length > 0 ? Math.max(...depts.map(d => d.fEntryID)) : 0;
    }
  }

  getRowByKey(fEntryID, newData) {
    const { depts } = this.state;
    return (newData || depts).filter(item => item.fEntryID === fEntryID)[0];
  }

  newItem = () => {
    const { dispatch } = this.props;
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    newData.push({
      fEntryID: ++this.MaxEntryID,
      fDeptID: '',
      fDeptName: '',
    });
    this.setState({ depts: newData });
  };

  remove(fEntryID) {
    const { depts } = this.state;
    const newData = depts.filter(v => v.fEntryID !== fEntryID);
    this.setState({ depts: newData });

    const { dispatch } = this.props;
    dispatch({
      type: 'routeProfile/changeStep',
      payload: { depts: newData },
    });
  }

  handleDeptChange(deptId, deptName, fEntryID) {
    const { dispatch } = this.props;
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      target.fDeptID = deptId;
      target.fDeptName = deptName;
      this.setState({ depts: newData });
    }
    dispatch({
      type: 'routeProfile/changeStep',
      payload: { depts: newData },
    });
  }

  handleFieldChange(fieldName, value, fEntryID) {
    const { dispatch } = this.props;
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ depts: newData });
    }
    dispatch({
      type: 'routeProfile/changeStep',
      payload: { depts: newData },
    });
  }

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      basicData: { processDeptTree },
    } = this.props;
    const profileLoading = this.props.loading;
    const { loading, depts, currentStep } = this.state;

    const columns = [
      {
        title: '岗位',
        dataIndex: 'fDeptName',
        width: '50%',
        render: (text, record) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator('fDeptID_' + record.fInterID, {
                rules: [{ required: true, message: '请输入' }],
                initialValue: record.fDeptID,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={processDeptTree}
                  treeDefaultExpandAll
                  onChange={(depts, label) =>
                    this.handleDeptChange(depts, label[0], record.fEntryID)
                  }
                />
              )}
            </FormItem>
          );
        },
      },
      {
        title: '机台必选',
        dataIndex: 'fRequireMachine',
        width: 100,
        render: (text, record) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(
                `fRequireMachine_${currentStep}${record.fInterID}${record.fEntryID}`,
                {
                  initialValue: !!record.fRequireMachine,
                  valuePropName: 'checked',
                }
              )(
                <Switch
                  onChange={checked => {
                    this.handleFieldChange('fRequireMachine', checked, record.fEntryID);
                  }}
                />
              )}
            </FormItem>
          );
        },
      },
      {
        title: '自动签收',
        dataIndex: 'fAutoSign',
        width: 100,
        render: (text, record) => {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {getFieldDecorator(`fAutoSign_${currentStep}${record.fInterID}${record.fEntryID}`, {
                initialValue: !!record.fAutoSign,
                valuePropName: 'checked',
              })(
                <Switch
                  onChange={checked => {
                    this.handleFieldChange('fAutoSign', checked, record.fEntryID);
                  }}
                />
              )}
            </FormItem>
          );
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          return (
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.fEntryID)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <Table
          rowKey="fEntryID"
          loading={loading || profileLoading}
          columns={columns}
          dataSource={depts}
          pagination={false}
          style={{ width: '65%', minWidth: '320px' }}
        />
        <Button
          style={{ width: '65%', minWidth: '320px', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newItem}
          icon="plus"
        >
          新增岗位
        </Button>
      </div>
    );
  }
}

export default DeptForm;
