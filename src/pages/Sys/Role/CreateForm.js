import React, { PureComponent } from 'react';
import { Form, Input, Modal, Radio, Switch, Select } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;

// @Form.create()
export const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, pageMapper } = props;
  const indexPages = [];
  for (let x in pageMapper) {
    indexPages.push(
      <Option key={x} value={x}>
        {pageMapper[x]}
      </Option>
    );
  }

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
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
        {form.getFieldDecorator('fNumber', {
          rules: [{ required: true, message: '请输入编码' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
        {form.getFieldDecorator('fName', {
          rules: [{ required: true, message: '请输入角色名', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="默认首页">
        {form.getFieldDecorator('fIndexPage', {})(
          <Select style={{ width: '100%' }} placeholder="请选择默认首页" allowClear={true}>
            {indexPages.map(x => x)}
          </Select>
        )}
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
