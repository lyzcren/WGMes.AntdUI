import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Select, TreeSelect, Modal, Radio, Progress, notification } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  validatePhone,
  validatePassword,
  getPasswordStatus,
  passwordProgressMap,
} from '@/utils/validators';
import { pageMapper } from '@/utils/GlobalConst';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const { SHOW_PARENT } = TreeSelect;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData }) => ({
  basicData,
}))
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

    this.state = {
      formVals: {
        fItemID: props.values.fItemID,
        fNumber: props.values.fNumber,
        fName: props.values.fName,
        fPhone: props.values.fPhone,
        fIdCardNumber: props.values.fIdCardNumber,
        fSex: props.values.fSex,
        fBindEmpID: props.values.fBindEmpID,
      },
    };

    const { dispatch } = props;
    dispatch({
      type: 'basicData/getOperator',
    });
    dispatch({
      type: 'basicData/getDeptTreeData',
    });
  }

  okHandle = () => {
    const { form, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = this.state.formVals.fItemID;
      handleUpdate(fieldsValue);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      updateModalVisible,
      handleUpdateModalVisible,
      values,
      basicData: { operators, deptTreeData },
    } = this.props;
    const { formVals } = this.state;
    const expandItems = deptTreeData.find(d => d.fParentID === 0);
    const treeExpandedKeys =
      deptTreeData && deptTreeData.length ? deptTreeData.map(d => d.key) : [];

    return (
      <Modal
        destroyOnClose
        title="修改用户"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {getFieldDecorator('fNumber', {
            initialValue: formVals.fNumber,
            rules: [
              { required: true, message: '请输入至少五个字符的用户名！' },
              // 正则匹配（提示错误，阻止表单提交）
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {getFieldDecorator('fName', {
            initialValue: formVals.fName,
            rules: [
              { required: true, message: '请输入姓名' },
              // 正则匹配（提示错误，阻止表单提交）
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {getFieldDecorator('fPhone', {
            initialValue: formVals.fPhone,
            rules: [{ required: false, message: '请输入手机号码！' }, { validator: validatePhone }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作员">
          {getFieldDecorator('fBindEmpID', {
            rules: [{ required: false, message: '请选择操作员' }],
            initialValue: formVals.fBindEmpID ? formVals.fBindEmpID : null,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择操作员"
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {operators.map(x => (
                <Option key={x.fItemID} value={x.fItemID}>
                  {x.fName + ' - ' + x.fNumber}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工卡卡号">
          {getFieldDecorator('fIdCardNumber', {
            rules: [{ required: false, message: '请扫描工卡！' }],
            initialValue: formVals.fIdCardNumber,
          })(<Input placeholder="请扫描工卡" />)}
        </FormItem>
        <FormItem key="fSex" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
          {getFieldDecorator('fSex', {
            initialValue: formVals.fSex,
          })(
            <RadioGroup>
              <RadioButton value={1}>男</RadioButton>
              <RadioButton value={2}>女</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="授权岗位">
          {getFieldDecorator('fDeptID', {
            rules: [{ required: true, message: '请选择岗位' }],
            initialValue: values.deptList && values.deptList.map(x => x.fDeptID),
          })(
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              treeData={deptTreeData}
              treeDefaultExpandedKeys={treeExpandedKeys}
            />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="默认首页">
          {getFieldDecorator('fIndexPage', {
            initialValue: values.fIndexPage,
          })(
            <Select style={{ width: '100%' }} placeholder="请选择默认首页" allowClear={true}>
              {Object.keys(pageMapper).map(x => (
                <Option key={x} value={x}>
                  {pageMapper[x]}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}
