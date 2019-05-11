import React, { PureComponent } from 'react';
import moment from 'moment';
import { Form, Input, Modal, Select, Switch, Tag, TreeSelect } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  validatorPhone,
  validatePassword,
  getPasswordStatus,
  passwordProgressMap,
} from '@/utils/validators';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@Form.create()
export class UpdateForm extends PureComponent {
  static defaultProps = {
    handleSubmit: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        fItemID: props.values.fItemID,
        fName: props.values.fName,
        fEnName: props.values.fEnName,
        fParentID: props.values.fParentID,
        fTypeID: props.values.fTypeID,
        fIsActive: props.values.fIsActive,
      },
    };
  }

  okHandle = () => {
    const { form, handleSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = this.state.formVals.fItemID;
      handleSubmit(fieldsValue);
    });
  };

  render() {
    const { form, treeData, updateModalVisible, handleModalVisible, values, typeData } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            修改 <Tag color="blue">{formVals.fName}</Tag>
          </div>
        }
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('fName', {
            initialValue: formVals.fName,
            rules: [{ required: true, message: '请输入名称', min: 1 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
          {form.getFieldDecorator('fEnName', {
            rules: [{ required: false, message: '请输入英文名称' }],
            initialValue: formVals.fEnName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
          {form.getFieldDecorator('fParentID', {
            rules: [{ required: true, message: '请输入所属部门' }],
            initialValue: formVals.fParentID,
          })(
            <TreeSelect
              placeholder="请选择"
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              treeDefaultExpandAll
            />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('fTypeID', {
            initialValue: formVals.fTypeID,
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {typeData.map(x => (
                <Option key={x.fKey} value={x.fKey}>
                  {x.fValue}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
          {form.getFieldDecorator('fIsActive', {
            rules: [{ required: false }],
            valuePropName: 'checked',
            initialValue: formVals.fIsActive,
          })(<Switch />)}
        </FormItem>
      </Modal>
    );
  }
}
