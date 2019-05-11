import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Switch, TreeSelect } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';

const FormItem = Form.Item;

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
        title="新建机台"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('fName', {
            rules: [{ required: true, message: '请输入名称', min: 1 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门">
          {form.getFieldDecorator('fDeptID', {
            rules: [{ required: true, message: '请选择部门' }],
          })(
            <TreeSelect
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={basicData.processDeptTree}
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
