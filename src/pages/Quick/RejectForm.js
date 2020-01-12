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
@connect(({ quickReject, loading, basicData, user }) => ({
  quickReject,
  loading: loading.models.quickReject,
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
      type: 'quickReject/getRejctDepts',
      payload: {
        fInterID: fInterID,
      },
    });
  }

  okHandle = () => {
    const {
      form,
      dispatch,
      handleSucess,
      handleModalVisible,
      values,
      bindDept,
      bindOperator,
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fInterID } = values;
      dispatch({
        type: 'quickReject/reject',
        payload: {
          fFlowID: fInterID,
          fRejectDeptID: bindDept.fItemID,
          fOperatorID: bindOperator.fEmpID,
          ...fieldsValue,
        },
      }).then(() => {
        const {
          quickReject: { queryResult },
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
      quickReject: { rejectDepts },
      deptID,
      bindDept,
      bindOperator,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        confirmLoading={loading}
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退回岗位">
          {values.fCurrentDeptName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="拒收岗位">
          {bindDept.fDeptName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作员">
          {bindOperator.fEmpName}
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
