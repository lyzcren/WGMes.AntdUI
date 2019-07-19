import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Switch, Select } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  validatePhone,
  validatePassword,
  getPasswordStatus,
  passwordProgressMap,
} from '@/utils/validators';

const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@Form.create()
export class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  okHandle = () => {
    const { form, handleUpdate, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = values.fItemID;
      handleUpdate(fieldsValue);
    });
  };

  render() {
    const { form, updateModalVisible, handleUpdateModalVisible, values, pageMapper } = this.props;
    const indexPages = [];
    for (let x in pageMapper) {
      indexPages.push(
        <Option key={x} value={x}>
          {pageMapper[x]}
        </Option>
      );
    }

    return (
      <Modal
        destroyOnClose
        title="修改角色"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
          {form.getFieldDecorator('fNumber', {
            initialValue: values.fNumber,
            rules: [{ required: true, message: '请输入编码' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
          {form.getFieldDecorator('fName', {
            initialValue: values.fName,
            rules: [{ required: true, message: '请输入角色名', min: 1 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="默认首页">
          {form.getFieldDecorator('fIndexPage', {
            initialValue: values.fIndexPage,
          })(
            <Select style={{ width: '100%' }} placeholder="请选择默认首页" allowClear={true}>
              {indexPages.map(x => x)}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
          {form.getFieldDecorator('fIsActive', {
            rules: [{ required: false }],
            valuePropName: 'checked',
            initialValue: values.fIsActive,
          })(<Switch />)}
        </FormItem>
      </Modal>
    );
  }
}
