import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Switch, Select, TreeSelect } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { SHOW_CHILD } = TreeSelect;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData }) => ({
  basicData,
}))
@Form.create()
/* eslint react/no-multi-comp:0 */
export class CreateForm extends PureComponent {
  okHandle = () => {
    const { form, handleSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleSubmit(fieldsValue);
    });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getParamType',
    });
    dispatch({
      type: 'basicData/getDeptTreeData',
    });
  }

  render() {
    const {
      basicData: { billNo, paramType, deptTreeData },
      modalVisible,
      form,
      handleSubmit,
      handleModalVisible,
    } = this.props;
    const expandItems = deptTreeData.find(d => d.fParentID === 0);
    const treeExpandedKeys =
      deptTreeData && deptTreeData.length ? deptTreeData.map(d => d.key) : [];

    return (
      <Modal
        destroyOnClose
        title="新建工艺参数"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
        afterClose={() => handleModalVisible()}
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
            initialValue: billNo.TechnicalParam,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
          {form.getFieldDecorator('fIsActive', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Switch />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('fType', {})(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择"
              onChange={val => console.log(val)}
            >
              {paramType.map(x => (
                <Option key={x.fKey} value={x.fKey}>
                  {x.fValue}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="适用岗位">
          {form.getFieldDecorator('deptIDs', {
            rules: [{ required: false, message: '请选择岗位' }],
          })(
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeCheckable={true}
              showCheckedStrategy={SHOW_CHILD}
              treeData={deptTreeData}
              treeDefaultExpandedKeys={treeExpandedKeys}
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}
