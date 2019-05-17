import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Switch, Select, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import GlobalConst from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@connect(({ defectManage, loading, basicData }) => ({
  defectManage,
  loading: loading.models.defectManage,
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
      type: 'basicData/getDeptTreeData',
    });
  }

  okHandle = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      this.handleSubmit(fieldsValue);
    });
  };

  handleSubmit = fields => {
    const { dispatch, handleModalVisible, handleSuccess } = this.props;
    dispatch({
      type: 'defectManage/add',
      payload: fields,
    }).then(() => {
      const {
        defectManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('新增成功');
        handleModalVisible(false);
        // 成功后再次刷新列表
        if (handleSuccess) handleSuccess();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  render() {
    const { modalVisible, form, handleSubmit, handleModalVisible, basicData } = this.props;

    return (
      <Modal
        destroyOnClose
        title="新建记录"
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
