import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Select, Switch, Tag, TreeSelect } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  validatePhone,
  validatePassword,
  getPasswordStatus,
  passwordProgressMap,
} from '@/utils/validators';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ loading, basicData }) => ({
  loading: loading.models.deptManage,
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
      formVals: {
        fItemID: props.values.fItemID,
        fName: props.values.fName,
        fNumber: props.values.fNumber,
        fEnName: props.values.fEnName,
        fParentID: props.values.fParentID,
        fTypeID: props.values.fTypeID,
        fIsActive: props.values.fIsActive,
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getWorkTime',
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
    const {
      form,
      treeData,
      updateModalVisible,
      handleModalVisible,
      values,
      typeData,
      basicData: { workTimes },
    } = this.props;
    const { formVals } = this.state;
    const workTimeIds = values.workTimeList && values.workTimeList.map(x => x.fWorkTimeID);

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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名称">
          {form.getFieldDecorator('fEnName', {
            rules: [{ required: false, message: '请输入英文名称' }],
            initialValue: formVals.fEnName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        {formVals.fParentID > 0 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属车间">
            {form.getFieldDecorator('fParentID', {
              rules: [{ required: true, message: '请输入所属车间' }],
              initialValue: formVals.fParentID,
            })(
              <TreeSelect
                placeholder="请选择"
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                treeDefaultExpandAll
              />
            )}
          </FormItem>
        )}
        {formVals.fParentID > 0 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
            {form.getFieldDecorator('fTypeID', {
              initialValue: typeData.some(x => x.fKey === formVals.fTypeID)
                ? formVals.fTypeID
                : null,
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                {typeData &&
                  typeData.map(x => (
                    <Option key={x.fKey} value={x.fKey}>
                      {x.fValue}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        )}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="班次">
          {form.getFieldDecorator('fWorkTimeIds', {
            rules: [{ required: false, message: '请选择班次' }],
            initialValue: workTimeIds,
          })(
            <Select
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              mode="multiple"
            >
              {workTimes &&
                workTimes.map(workTime => (
                  <Option key={workTime.fItemID} value={workTime.fItemID}>
                    {workTime.fName}
                  </Option>
                ))}
            </Select>
          )}
        </FormItem>
        {formVals.fParentID > 0 && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
            {form.getFieldDecorator('fIsActive', {
              rules: [{ required: false }],
              valuePropName: 'checked',
              initialValue: formVals.fIsActive,
            })(<Switch />)}
          </FormItem>
        )}
      </Modal>
    );
  }
}
