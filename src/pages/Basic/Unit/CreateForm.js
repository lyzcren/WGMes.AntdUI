import React, { PureComponent } from 'react';
import { Form, Input, Modal, Radio, Switch, InputNumber } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;

export const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleSubmit, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleSubmit(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建单位"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('fName', {
          rules: [{ required: true, message: '请输入名称', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
        {form.getFieldDecorator('fNumber', {
          rules: [{ required: true, message: '请输入编码', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="简码">
        {form.getFieldDecorator('fShortNumber', {
          rules: [{ required: true, message: '请输入简码', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="小数位">
        {form.getFieldDecorator('fPrecision')(<InputNumber placeholder="请输入" min={0} max={4} />)}
      </FormItem>
    </Modal>
  );
});
