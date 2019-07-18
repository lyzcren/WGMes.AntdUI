import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Tag, Divider, Switch } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@Form.create()
export class UpdateFixForm extends PureComponent {
  static defaultProps = {
    handleSubmit: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {},
    };
  }

  okHandle = () => {
    const { form, handleSubmit, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = values.fItemID;
      handleSubmit(fieldsValue);
    });
  };

  render() {
    const { form, modalVisible, handleModalVisible, values } = this.props;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            编码规则 <Tag color="blue">{values.fName}</Tag>
          </div>
        }
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Divider>流程单</Divider>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="前缀">
          {form.getFieldDecorator('fPrefix', {
            rules: [{ required: false, message: '请输入流程单前缀' }],
            initialValue: values.fPrefix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="后缀">
          {form.getFieldDecorator('fSuffix', {
            rules: [{ required: false, message: '请输入流程单后缀' }],
            initialValue: values.fSuffix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <Divider>返修</Divider>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="前缀">
          {form.getFieldDecorator('fRepairPrefix', {
            rules: [{ required: false, message: '请输入返修单前缀' }],
            initialValue: values.fRepairPrefix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="后缀">
          {form.getFieldDecorator('fRepairSuffix', {
            rules: [{ required: false, message: '请输入返修单后缀' }],
            initialValue: values.fRepairSuffix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <Divider>分批</Divider>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="继承原批号">
          {form.getFieldDecorator('fSplitInheritBatchNo', {
            initialValue: values.fSplitInheritBatchNo,
            valuePropName: 'checked',
          })(<Switch />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="前缀">
          {form.getFieldDecorator('fSplitPrefix', {
            rules: [{ required: false, message: '请输入分批单前缀' }],
            initialValue: values.fSplitPrefix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="后缀">
          {form.getFieldDecorator('fSplitSuffix', {
            rules: [{ required: false, message: '请输入分批单后缀' }],
            initialValue: values.fSplitSuffix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}
