import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Switch, Select } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ basicData }) => ({
  basicData,
}))
@Form.create()
export class CreateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Role' },
    });
  }

  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  render() {
    const {
      modalVisible,
      afterClose,
      form,
      handleAdd,
      handleModalVisible,
      pageMapper,
      basicData: { billNo },
    } = this.props;
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
        title="新建角色"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        afterClose={afterClose}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
          {form.getFieldDecorator('fNumber', {
            rules: [{ required: true, message: '请输入编码' }],
            initialValue: billNo.Role,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
          {form.getFieldDecorator('fName', {
            rules: [
              { required: true, message: '请输入角色名' },
              // 正则匹配（提示错误，阻止表单提交）
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ],
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
  }
}
