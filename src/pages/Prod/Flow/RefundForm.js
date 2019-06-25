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
import { WgModal } from '@/components/WgModal';

const { Step } = Steps;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ flowRefund, loading, basicData, user }) => ({
  flowRefund,
  loading: loading.models.flowRefund,
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

  componentDidUpdate(preProps) {
    const {
      values: { fInterID },
    } = this.props;
    if (preProps.values.fInterID !== fInterID) {
      this.loadData(fInterID);
    }
  }

  loadData(fInterID) {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowRefund/initModel',
      payload: { fInterID },
    }).then(() => {
      const {
        flowRefund: { records, lastRecord },
      } = this.props;
      const canReproduceRecords = records.filter(
        (x, y) => y > records.indexOf(lastRecord) && x.fStatus > 1
      );
      this.setState({
        records,
        refundRecord: lastRecord,
        reproduceRecords: [lastRecord],
        canReproduceRecords,
      });
    });
  }

  changeRefund = e => {
    const { records } = this.state;
    const refundRecordId = e.target.value;
    const refundRecord = records.find(x => x.fInterID === refundRecordId);
    const canReproduceRecords = records.filter(
      (x, y) => y > records.indexOf(refundRecord) && x.fStatus > 1
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
        type: 'flowRefund/refund',
        payload: {
          fInterID,
          fRefundRecordId,
          fReproduceRecordIds,
          ...fieldsValue,
        },
      }).then(() => {
        const {
          flowRefund: { queryResult },
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
    } = this.props;
    const { records, refundRecord, reproduceRecords, canReproduceRecords } = this.state;

    return (
      <WgModal
        destroyOnClose
        title={
          <div>
            流程单-退回 <Tag color="blue">{values.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        width={650}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="退回工序">
          <Radio.Group
            value={refundRecord.fInterID}
            buttonStyle="solid"
            onChange={this.changeRefund}
          >
            {records.map(x => (
              <Radio.Button key={x.fInterID} value={x.fInterID} disabled={x.fStatus <= 1}>
                {x.fDeptName}
              </Radio.Button>
            ))}
          </Radio.Group>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="重做工序">
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
