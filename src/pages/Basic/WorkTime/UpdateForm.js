import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Tag, message, TimePicker } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const timeFormat = 'HH:mm';

@connect(({ workTimeManage, loading, basicData }) => ({
  workTimeManage,
  loading: loading.models.workTimeManage,
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
      this.handleSubmit(fieldsValue);
    });
  };

  handleSubmit = fields => {
    const { dispatch, handleModalVisible, handleSuccess } = this.props;
    dispatch({
      type: 'workTimeManage/update',
      payload: {
        ...fields,
        id: this.state.formVals.fItemID,
        fBeginTime: fields.fBeginTime.format('YYYY-MM-DD HH:mm:ss'),
        fEndTime: fields.fEndTime.format('YYYY-MM-DD HH:mm:ss'),
        fLastEndTime: fields.fLastEndTime
          ? fields.fLastEndTime.format('YYYY-MM-DD HH:mm:ss')
          : null,
      },
    }).then(() => {
      const {
        workTimeManage: { queryResult },
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
            rules: [{ required: true, message: '请输入名称' }],
            initialValue: values.fName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
          {values.fNumber}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开始时间">
          {form.getFieldDecorator('fBeginTime', {
            rules: [{ required: true, message: '请输入开始时间' }],
            initialValue: moment(values.fBeginTime, timeFormat),
          })(<TimePicker format={timeFormat} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="结束时间">
          {form.getFieldDecorator('fEndTime', {
            rules: [{ required: true, message: '请输入结束时间' }],
            initialValue: moment(values.fEndTime, timeFormat),
          })(<TimePicker format={timeFormat} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="最晚结束时间">
          {form.getFieldDecorator('fLastEndTime', {
            rules: [{ required: false, message: '请输入最晚结束时间' }],
            initialValue: moment(values.fLastEndTime, timeFormat),
          })(<TimePicker format={timeFormat} />)}
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
