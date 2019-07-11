import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Steps,
  Input,
  Modal,
  Radio,
  Switch,
  Select,
  message,
  Button,
  Tag,
  Checkbox,
} from 'antd';
import { Link } from 'umi';

const { Step } = Steps;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ flowReject, loading, basicData, user }) => ({
  flowReject,
  loading: loading.models.flowReject,
  basicData,
  fBindEmpID: user.currentUser.fBindEmpID,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class RejectForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    const { dispatch } = props;

    dispatch({
      type: 'basicData/getOperator',
    });
  }

  componentDidMount() {
    const {
      dispatch,
      values: { fInterID },
    } = this.props;
    dispatch({
      type: 'flowReject/getRejctDepts',
      payload: {
        fInterID: fInterID,
      },
    });
  }

  okHandle = () => {
    const { form, dispatch, handleSucess, handleModalVisible, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fInterID } = values;
      dispatch({
        type: 'flowReject/reject',
        payload: {
          fFlowID: fInterID,
          ...fieldsValue,
        },
      }).then(() => {
        const {
          flowReject: { queryResult },
        } = this.props;

        if (queryResult.status === 'ok') {
          message.success('拒收成功.');
          if (handleSucess) handleSucess();
          handleModalVisible(false, values);
        } else if (queryResult.status === 'warning') {
          message.warning(queryResult.message);
        } else {
          message.error(queryResult.message);
        }
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      modalVisible,
      handleModalVisible,
      basicData: { operators },
      values,
      fBindEmpID,
      flowReject: { rejectDepts },
    } = this.props;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            流程单-拒收 <Tag color="blue">{values.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        width={650}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退回工序">
          {values.fCurrentDeptName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拒收工序">
          {getFieldDecorator('fRejectDeptID', {
            rules: [{ required: true, message: '请输入部门' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择部门"
              dropdownMatchSelectWidth
              defaultActiveFirstOption
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {rejectDepts &&
                rejectDepts.map(x => (
                  <Option key={x.fDeptID} value={x.fDeptID}>
                    {x.fDeptName + ' - ' + x.fDeptNumber}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作员">
          {getFieldDecorator('fOperatorID', {
            rules: [{ required: true, message: '请选择操作员' }],
            initialValue: fBindEmpID,
          })(
            <Select
              placeholder="请选择操作员"
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {operators &&
                operators.map(x => (
                  <Option key={x.fItemID} value={x.fItemID}>
                    {x.fName + ' - ' + x.fNumber}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={'原因'}>
          {getFieldDecorator('fReason', {})(
            <TextArea style={{ minHeight: 32 }} placeholder="请输入原因" rows={3} />
          )}
        </FormItem>
      </Modal>
    );
  }
}
