import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  Select,
  Radio,
  Switch,
  TreeSelect,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;


export const CreateForm = Form.create()(props => {
  const { treeData, modalVisible, form, handleSubmit, handleModalVisible, typeData } = props;

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
      title="新建部门"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('fName', {
          rules: [{ required: true, message: '请输入名称', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
        {form.getFieldDecorator('fEnName', {
          rules: [{ required: false, message: '请输入英文名称' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
        {form.getFieldDecorator('fParentID', {
          rules: [{ required: true, message: '请输入所属部门' }],
        })(<TreeSelect placeholder="请选择" style={{ width: 300 }} treeData={treeData} treeDefaultExpandAll />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
        {form.getFieldDecorator('fTypeID', {
        })(<Select placeholder="请选择" style={{ width: '100%' }}>
          {typeData.map(x => (<Option key={x.fKey} value={x.fKey}>{x.fValue}</Option>))}
        </Select>)}
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