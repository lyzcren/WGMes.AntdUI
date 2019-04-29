import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Input,
  Modal,
  Switch,
  Tag,
  Select,
  TreeSelect,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';


const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData }) => ({
  basicData,
}))
@Form.create()
export class FlowForm extends PureComponent {
  static defaultProps = {
    handleSubmit: () => { },
    handleModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: props.values,
    };
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getDeptTreeData',
    });
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

  render () {
    const { form, modalVisible, handleModalVisible, values, basicData } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        title={<div>开流程单 <Tag color="blue">{formVals.fMoBillNo}</Tag></div>}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('fName', {
            initialValue: formVals.fName,
            rules: [{ required: true, message: '请输入名称', min: 1 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
          {form.getFieldDecorator('fNumber', {
            rules: [{ required: true, message: '请输入编码', min: 1 }],
            initialValue: formVals.fNumber,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门">
          {form.getFieldDecorator('fDeptID', {
            rules: [{ required: true, message: '请选择部门' }],
            initialValue: formVals.fDeptID,
          })(<TreeSelect
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={basicData.deptTreeData}
            treeDefaultExpandAll
          />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
          {form.getFieldDecorator('fIsActive', {
            rules: [{ required: false }],
            valuePropName: 'checked',
            initialValue: formVals.fIsActive,
          })(<Switch />)}
        </FormItem>
      </Modal>
    );
  }
};
