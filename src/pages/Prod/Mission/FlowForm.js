import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Form,
  Input,
  Modal,
  Switch,
  Tag,
  Select,
  InputNumber,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';


const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@connect(({ missionManage, loading, basicData }) => ({
  missionManage,
  loading: loading.models.missionManage,
  basicData,
}))
@Form.create()
export class FlowForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: props.values,
    };
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: "Flow" }
    });
    dispatch({
      type: 'basicData/getRouteData',
    });
  }

  okHandle = () => {
    const { form, } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fInterID = this.state.formVals.fInterID;
      this.handleGenFlow(fieldsValue);
    });
  };

  handleGenFlow = fields => {
    const { dispatch, handleModalVisible, handleSuccess } = this.props;
    dispatch({
      type: 'missionManage/genFlow',
      payload: fields,
    }).then(() => {
      const { missionManage: { queryResult } } = this.props;
      if (queryResult.status === 'ok') {
        message.success('开流程单成功');
        handleModalVisible(false);
        // 成功后再次刷新列表
        if (handleSuccess) handleSuccess();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      }
      else {
        message.error(queryResult.message);
      }
    });
  };

  render () {
    const { form, modalVisible, handleModalVisible, values, basicData: { billNo, routeData } } = this.props;
    const { formVals } = this.state;
    const maxQty = formVals.fAuxInHighLimitQty - formVals.fInputQty;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={<div>开流程单 <Tag color="blue">{formVals.fMoBillNo}</Tag></div>}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="批号">
          {form.getFieldDecorator('fBatchNo', {
            initialValue: billNo.Flow,
          })(<Input readOnly />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="投入数量">
          {form.getFieldDecorator('fInputQty', {
            rules: [{ required: true, message: '请输入投入数量', }],
            initialValue: maxQty,
          })(
            <InputNumber
              placeholder="请输入"
              min={1}
              max={maxQty}
            />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="每批数量">
          {form.getFieldDecorator('fBatchQty', {
            rules: [{ required: true, message: '请输入每批数量', }],
            initialValue: maxQty,
          })(
            <InputNumber
              placeholder="请输入"
              min={1}
              max={maxQty}
            />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工艺路线">
          {form.getFieldDecorator('fRouteID', {
            rules: [{ required: true, message: '请选择工艺路线' }],
            initialValue: formVals.fRouteID,
          })(<Select
            style={{ width: 300 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}>
            {routeData.map(t => <Option key={t.fInterID} value={t.fInterID}>{t.fName}</Option>)}
          </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
};
