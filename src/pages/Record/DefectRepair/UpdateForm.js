import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Tag, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;

@connect(({ defectRepairManage, loading, basicData }) => ({
  defectRepairManage,
  loading: loading.models.defectRepairManage,
  basicData,
}))
@Form.create()
/* eslint react/no-multi-comp:0 */
export class UpdateForm extends PureComponent {
  static defaultProps = {
    handleSuccess: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: props.values,
    };
  }

  okHandle = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = this.state.formVals.fItemID;
      this.handleSubmit(fieldsValue);
    });
  };

  handleSubmit = fields => {
    const { dispatch, handleModalVisible, handleSuccess } = this.props;
    dispatch({
      type: 'defectRepairManage/update',
      payload: fields,
    }).then(() => {
      const {
        defectRepairManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('修改成功');
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
    const { form, modalVisible, handleModalVisible, values } = this.props;
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
            rules: [{ required: true, message: '请输入名称', min: 1 }],
            initialValue: formVals.fName,
          })(<Input placeholder="请输入" />)}
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
