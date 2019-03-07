import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Modal,
  Radio,
  Switch,
  Select,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import GlobalConst from '@/utils/GlobalConst'

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;


/* eslint react/no-multi-comp:0 */
@connect(({ basicData }) => ({
  basicData,
}))
// export const CreateForm = Form.create()(props => {
@Form.create()
export class CreateForm extends PureComponent {
  static defaultProps = {
  };

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount () {
    const { dispatch } = this.props;
  }

  okHandle = () => {
    const { form, handleSubmit, } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleSubmit(fieldsValue);
    });
  };

  render () {
    const { modalVisible, form, handleSubmit, handleModalVisible, basicData } = this.props;

    return (
      <Modal
        destroyOnClose
        title="新建工艺路线"
        visible={modalVisible}
        onOk={this.okHandle}
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('fComments', {
            rules: [{ required: false, message: '请输入备注', min: 1 }],
          })(<TextArea rows={4} placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
          {form.getFieldDecorator('fIsActive', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Switch />)}
        </FormItem>
      </Modal>
    );
  }
};