import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Switch, Select, TreeSelect } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { GlobalConst } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TypeData = GlobalConst.DefectTypeData;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData }) => ({
  basicData,
}))
@Form.create()
export class CreateForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
  }

  okHandle = () => {
    const { form, handleSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleSubmit(fieldsValue);
    });
  };

  render() {
    const { modalVisible, form, handleSubmit, handleModalVisible, basicData } = this.props;

    return (
      <Modal
        destroyOnClose
        title="新建不良信息"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('fName', {
            rules: [
              { required: true, message: '请输入名称' },
              // 正则匹配（提示错误，阻止表单提交）
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
          {form.getFieldDecorator('fNumber', {
            rules: [
              { required: true, message: '请输入编码' },
              // 正则匹配（提示错误，阻止表单提交）
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('fTypeID', {
            rules: [{ required: true, message: '请输入类型' }],
          })(
            <Select style={{ width: 120 }}>
              {TypeData.map(t => (
                <Option key={t.value}>{t.text}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="岗位">
          {form.getFieldDecorator('fDeptID', {
            rules: [{ required: true, message: '请选择岗位' }],
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={basicData.processDeptTree}
              multiple
              treeDefaultExpandAll
            />
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
