import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Steps,
  Input,
  Modal,
  Radio,
  Switch,
  Select,
  message,
  Button,
  Tag,
  Checkbox,
} from 'antd';
import { Link } from 'umi';

const { Step } = Steps;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ quickRefund, loading, basicData, user }) => ({
  quickRefund,
  loading: loading.models.quickRefund,
  basicData,
  fBindEmpID: user.currentUser.fBindEmpID,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class RefundForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    const { dispatch } = props;

    this.state = {
      records: [],
      refundRecord: {},
      reproduceRecords: [],
      canReproduceRecords: [],
    };
    dispatch({
      type: 'basicData/getOperator',
    });
  }

  componentDidMount() {
    const {
      values: { fInterID },
    } = this.props;
    this.loadData(fInterID);
  }

  componentDidUpdate(preProps) {}

  loadData(fInterID) {
    const { dispatch } = this.props;
    dispatch({
      type: 'quickRefund/initModel',
      payload: { fInterID },
    }).then(() => {
      const {
        quickRefund: { records },
      } = this.props;
      const lastRecord = [...records]
        .reverse()
        .find(x => x.fStatusNumber === 'ManufEndProduce' && !x.fIsReproduce);
      let canReproduceRecords = [];
      if (lastRecord) {
        canReproduceRecords = records.filter(
          (x, y) =>
            y > records.indexOf(lastRecord) &&
            x.fStatusNumber === 'ManufEndProduce' &&
            !x.fIsReproduce
        );
      }
      this.setState({
        records,
        refundRecord: lastRecord ? lastRecord : {},
        reproduceRecords: lastRecord ? [lastRecord] : [],
        canReproduceRecords,
      });
    });
  }

  changeRefund = e => {
    const { records } = this.state;
    const refundRecordId = e.target.value;
    const refundRecord = records.find(x => x.fInterID === refundRecordId);
    const canReproduceRecords = records.filter(
      (x, y) =>
        y > records.indexOf(refundRecord) &&
        x.fStatusNumber === 'ManufEndProduce' &&
        !x.fIsReproduce
    );
    this.setState({ refundRecord, reproduceRecords: [refundRecord], canReproduceRecords });
  };

  changeReproduce = checkedValue => {
    const { records } = this.state;
    const reproduceRecords = records.filter(x => checkedValue.indexOf(x.fInterID) >= 0);
    this.setState({ reproduceRecords });
  };

  okHandle = () => {
    const { form, dispatch, handleSucess, handleModalVisible, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fInterID } = values;
      const { refundRecord, reproduceRecords } = this.state;
      const fRefundRecordId = refundRecord.fInterID;
      const fReproduceRecordIds = reproduceRecords.map(x => x.fInterID);

      // console.log(values, fRefundRecordId, fReproduceRecordIds, fieldsValue);

      dispatch({
        type: 'quickRefund/refund',
        payload: {
          fInterID,
          fRefundRecordId,
          fReproduceRecordIds,
          ...fieldsValue,
        },
      }).then(() => {
        const {
          quickRefund: { queryResult },
        } = this.props;

        if (queryResult.status === 'ok') {
          message.success('退回成功.');
          if (handleSucess) handleSucess();
          handleModalVisible(false, values);
        } else if (queryResult.status === 'warning') {
          message.warning(queryResult.message);
        } else {
          message.error(queryResult.message);
        }
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      modalVisible,
      handleModalVisible,
      basicData: { operators },
      values,
      fBindEmpID,
      bindOperator,
    } = this.props;
    const { records, refundRecord, reproduceRecords, canReproduceRecords } = this.state;

    return (
      <Modal
        destroyOnClose
        confirmLoading={loading}
        title={
          <div>
            流程单-退回 <Tag color="blue">{values.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        width={650}
        okButtonProps={{ disabled: reproduceRecords.length <= 0 }}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="当前岗位">
          {values.fCurrentDeptName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退回岗位">
          <Radio.Group
            value={refundRecord.fInterID}
            buttonStyle="solid"
            onChange={this.changeRefund}
          >
            {records.map(x => (
              <Radio.Button
                key={x.fInterID}
                value={x.fInterID}
                disabled={x.fIsReproduce || x.fStatusNumber !== 'ManufEndProduce'}
              >
                {x.fDeptName}
              </Radio.Button>
            ))}
          </Radio.Group>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="重做岗位">
          <CheckboxGroup
            value={reproduceRecords.map(x => x.fInterID)}
            onChange={this.changeReproduce}
          >
            {records.map(x => (
              <Checkbox
                key={x.fInterID}
                value={x.fInterID}
                disabled={canReproduceRecords.indexOf(x) < 0}
              >
                {x.fDeptName}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作员">
          {getFieldDecorator('fOperatorID', {
            rules: [{ required: true, message: '请选择操作员' }],
            initialValue: bindOperator ? bindOperator.fEmpID : fBindEmpID || null,
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
      </Modal>
    );
  }
}
