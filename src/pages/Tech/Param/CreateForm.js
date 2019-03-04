import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  Radio,
  Switch,
} from 'antd';
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
      title="新建工艺参数"
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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
        {form.getFieldDecorator('fIsActive', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Switch />)}
      </FormItem>
    </Modal>
  );
});