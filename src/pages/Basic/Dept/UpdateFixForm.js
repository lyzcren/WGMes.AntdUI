import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Tag } from 'antd';
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
      formVals: {
        fItemID: props.values.fItemID,
        fPrefix: props.values.fPrefix,
        fSuffix: props.values.fSuffix,
      },
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {values.fName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
          {values.fNumber}
        </FormItem>
        {values && values.fEnName && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
            {values.fEnName}
          </FormItem>
        )}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="流程单前缀">
          {form.getFieldDecorator('fPrefix', {
            rules: [{ required: false, message: '请输入流程单前缀' }],
            initialValue: values.fPrefix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="流程单后缀">
          {form.getFieldDecorator('fSuffix', {
            rules: [{ required: false, message: '请输入流程单后缀' }],
            initialValue: values.fSuffix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="返修单前缀">
          {form.getFieldDecorator('fRepairPrefix', {
            rules: [{ required: false, message: '请输入返修单前缀' }],
            initialValue: values.fRepairPrefix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="返修单后缀">
          {form.getFieldDecorator('fRepairSuffix', {
            rules: [{ required: false, message: '请输入返修单后缀' }],
            initialValue: values.fRepairSuffix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}
