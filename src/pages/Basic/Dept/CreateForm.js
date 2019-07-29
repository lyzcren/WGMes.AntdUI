import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select, Radio, Switch, TreeSelect } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ loading, basicData }) => ({
  loading: loading.models.deptManage,
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
      payload: { fNumber: 'Dept' },
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
    const {
      treeData,
      modalVisible,
      form,
      handleSubmit,
      handleModalVisible,
      typeData,
      basicData: { billNo },
    } = this.props;

    return (
      <Modal
        destroyOnClose
        title="新建部门"
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
            initialValue: billNo.Dept,
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
          })(
            <TreeSelect
              placeholder="请选择"
              style={{ width: 300 }}
              treeData={treeData}
              treeDefaultExpandAll
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            />
          )}
        </FormItem>
        {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          {form.getFieldDecorator('fTypeID', {})(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              {typeData.map(x => (
                <Option key={x.fKey} value={x.fKey}>
                  {x.fValue}
                </Option>
              ))}
            </Select>
          )}
        </FormItem> */}
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
