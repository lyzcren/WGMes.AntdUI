import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Select, Tag, message, InputNumber } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { WgModal } from '@/components/WgModal';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ flowManage, loading, basicData, user }) => ({
  flowManage,
  loading: loading.models.flowSign,
  basicData,
  fBindEmpID: user.currentUser.fBindEmpID,
}))
@Form.create()
export class TakeForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    const {
      dispatch,
      values: { fInterID },
    } = props;

    this.state = {
      formVals: props.values,
      precision: 0,
    };
    dispatch({
      type: 'basicData/getOperator',
    });
  }

  componentDidMount() {
    const {
      values: { fInterID, fCurrentDeptID, fPrecision },
    } = this.props;

    // 根据单位的小数位数配置相关数量的小数位
    if (fPrecision > 1) {
      const precisionPart = '00000000'.slice(0, 2);
      this.setState({ precision: fPrecision, qtyFormat: `0.${precisionPart}` });
    }
  }

  okHandle = () => {
    const { form, handleSubmit, values } = this.props;
    const { fInterID } = values;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      fieldsValue.fInterID = fInterID;
      handleSubmit(fieldsValue);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      values,
      flowManage: { nextDepts },
      basicData: { operators },
      fBindEmpID,
    } = this.props;
    const { formVals, precision } = this.state;

    return (
      <WgModal
        destroyOnClose
        title={
          <div>
            流程单-取走 <Tag color="blue">{formVals.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={'数量'}>
          {getFieldDecorator('fQty', {
            rules: [{ required: true, message: '' }],
            initialValue: formVals.fCurrentPassQty,
          })(
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入数量"
              max={formVals.fCurrentPassQty}
              min={Math.pow(0.1, precision)}
              step={Math.pow(0.1, precision)}
              precision={precision}
            />
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作员">
          {getFieldDecorator('fOperatorID', {
            rules: [{ required: true, message: '请选择操作员' }],
            initialValue: fBindEmpID,
          })(
            <Select
              placeholder="请选择操作员"
              style={{ width: '100%' }}
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={'原因'}>
          {getFieldDecorator('fReason', {})(
            <TextArea style={{ minHeight: 32 }} placeholder="请输入原因" rows={3} />
          )}
        </FormItem>
      </WgModal>
    );
  }
}
