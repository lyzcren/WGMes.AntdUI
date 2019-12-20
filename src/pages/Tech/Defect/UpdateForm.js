import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Tag, Select, TreeSelect } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  validatePhone,
  validatePassword,
  getPasswordStatus,
  passwordProgressMap,
} from '@/utils/validators';
import { GlobalConst } from '@/utils/GlobalConst';

const FormItem = Form.Item;
const Option = Select.Option;
const TypeData = GlobalConst.DefectTypeData;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData }) => ({
  basicData,
}))
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
      formVals: props.values,
    };
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
      // 设置fItemId
      fieldsValue.fItemID = this.state.formVals.fItemID;
      handleSubmit(fieldsValue);
    });
  };

  render() {
    const { form, modalVisible, handleModalVisible, values, basicData } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            修改 <Tag color="blue">{formVals.fName}</Tag>
          </div>
        }
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('fName', {
            initialValue: formVals.fName,
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
            initialValue: formVals.fNumber,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('fTypeID', {
            rules: [{ required: true, message: '请输入类型' }],
            initialValue: formVals.fTypeID,
          })(
            <Select style={{ width: 120 }}>
              {TypeData.map(t => (
                <Option key={t.value} value={t.value}>
                  {t.text}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="岗位">
          {form.getFieldDecorator('fDeptID', {
            rules: [{ required: true, message: '请选择岗位' }],
            initialValue: formVals.fDeptIdList,
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
            rules: [{ required: false }],
            valuePropName: 'checked',
            initialValue: formVals.fIsActive,
          })(<Switch />)}
        </FormItem>
      </Modal>
    );
  }
}
