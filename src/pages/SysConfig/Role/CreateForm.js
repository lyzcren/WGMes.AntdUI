import React, { PureComponent } from 'react';
import { Form, Input, Modal, Radio, Switch } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;

export const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建角色"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
        {form.getFieldDecorator('fName', {
          rules: [{ required: true, message: '请输入角色名', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
        {form.getFieldDecorator('fIsActive', {})(<Switch defaultChecked />)}
      </FormItem>
    </Modal>
  );
});
