import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Input, InputNumber, Modal, Switch, Tag, Col, Row } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone } from '@/utils/validators';
// import { getBillNoByRule } from '@/utils/utils';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@Form.create()
export class UpdateForm extends PureComponent {
  static defaultProps = {
    handleSubmit: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: props.values,
    };
  }

  okHandle = () => {
    const { form, handleSubmit } = this.props;
    const { formVals } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = formVals.fItemID;
      handleSubmit(fieldsValue);
    });
  };

  render() {
    const { form, updateModalVisible, handleModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            修改编码规则 <Tag color="blue">{formVals.fName}</Tag>
          </div>
        }
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="前缀">
          {form.getFieldDecorator('fPrefix', {
            rules: [{ required: true, message: '请输入前缀', min: 1 }],
            initialValue: formVals.fPrefix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="后缀">
          {form.getFieldDecorator('fSuffix', {
            rules: [{ required: false, message: '请输入后缀' }],
            initialValue: formVals.fSuffix,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <Row gutter={16}>
          <Col xl={{ span: 6, offset: 2 }} lg={6} md={12} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="年">
              {form.getFieldDecorator('fAppendYear', {
                rules: [{ required: false }],
                valuePropName: 'checked',
                initialValue: formVals.fAppendYear,
              })(<Switch />)}
            </FormItem>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="4位年">
              {form.getFieldDecorator('fLongYear', {
                rules: [{ required: false }],
                valuePropName: 'checked',
                initialValue: formVals.fLongYear,
              })(<Switch />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xl={{ span: 6, offset: 2 }} lg={6} md={12} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="月">
              {form.getFieldDecorator('fAppendMonth', {
                rules: [{ required: false }],
                valuePropName: 'checked',
                initialValue: formVals.fAppendMonth,
              })(<Switch />)}
            </FormItem>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="日">
              {form.getFieldDecorator('fAppendDate', {
                rules: [{ required: false }],
                valuePropName: 'checked',
                initialValue: formVals.fAppendDate,
              })(<Switch />)}
            </FormItem>
          </Col>
        </Row>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="流水号长度">
          {form.getFieldDecorator('fNoLength', {
            rules: [{ required: true, message: '请输入流水号长度' }],
            initialValue: formVals.fNoLength,
          })(<InputNumber min={1} max={6} placeholder="请输入流水号长度" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="当前编码">
          <Input disabled value={formVals.fCurrentNo} />
        </FormItem>
      </Modal>
    );
  }
}
