import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
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
  InputNumber,
  Tabs,
  Table,
} from 'antd';
import { Link } from 'umi';
import { deepStrictEqual } from 'assert';
import { declareTypeAlias } from '@babel/types';

const { TabPane } = Tabs;
const { Step } = Steps;
const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ flowSplit, loading, basicData, user }) => ({
  flowSplit,
  loading: loading.models.flowSplit,
  basicData,
  fBindEmpID: user.currentUser.fBindEmpID,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class SplitForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    const { dispatch } = props;

    this.state = {
      currentStep: 0,
      details: [],
    };
    dispatch({
      type: 'basicData/getOperator',
    });
  }

  componentDidMount() {
    const {
      values: { fInterID },
    } = this.props;
  }

  componentDidUpdate(preProps) {}

  okHandle = () => {
    const { form, dispatch, handleSucess, handleModalVisible, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fInterID } = values;
      const { details } = this.state;
      const lessZero = 0;
      details.forEach(detail => {
        if (details.fQty <= 0) {
          lessZero++;
        }
      });
      if (lessZero) {
        message.warning('每批数量必须大于0.');
        return;
      }
      dispatch({
        type: 'flowSplit/split',
        payload: {
          fFlowID: fInterID,
          ...fieldsValue,
          details,
        },
      }).then((queryResult) => {
        if (queryResult.status === 'ok') {
          message.success('分批成功.');
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

  nextStep = () => {
    const { currentStep } = this.state;
    const {
      form,
      values: { fCurrentPassQty },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const details = [];
      let remainQty = fCurrentPassQty;
      const batchQty = fCurrentPassQty / fieldsValue.fTotalBatchCount;
      for (let i = 0; i < fieldsValue.fTotalBatchCount - 1; i++) {
        const qty = remainQty;
        details.push({ fEntryID: i + 1, fQty: batchQty, fEditable: true });
        remainQty -= batchQty;
      }
      details.push({ fEntryID: fieldsValue.fTotalBatchCount, fQty: remainQty, fEditable: false });
      this.setState({ currentStep: currentStep + 1, details });
    });
  };

  preStep = () => {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep - 1, details: [] });
  };

  handleFieldChange(fEntryID, qty) {
    const { details } = this.state;
    const {
      values: { fQtyDecimal },
    } = this.props;
    const findItem = details.find(x => x.fEntryID === fEntryID);
    let changeQty = findItem.fQty - qty;
    findItem.fQty = qty;
    const lastDetail = details.find(x => !x.fEditable);
    // console.log(fQtyDecimal, lastDetail, changeQty);
    lastDetail.fQty = (lastDetail.fQty + changeQty).toFixed(fQtyDecimal) * 1;
    this.setState({ details });
  }

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
    const { currentStep, details } = this.state;
    const { fQtyDecimal } = values;
    // 根据单位的小数位数配置相关数量的小数位
    const qtyDecimalPart = '00000000'.slice(0, fQtyDecimal);
    const qtyFormat = `0.${qtyDecimalPart}`;

    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false, values)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          取消
        </Button>
        {currentStep > 0 && (
          <Button
            type="primary"
            loading={false}
            onClick={this.preStep}
            prefixCls="ant-btn"
            ghost={false}
            block={false}
          >
            上一步
          </Button>
        )}
        {currentStep < 1 && (
          <Button
            type="primary"
            loading={false}
            onClick={this.nextStep}
            prefixCls="ant-btn"
            ghost={false}
            block={false}
          >
            下一步
          </Button>
        )}
        {currentStep === 1 && (
          <Button
            type="primary"
            loading={loading}
            onClick={this.okHandle}
            prefixCls="ant-btn"
            ghost={false}
            block={false}
          >
            提交
          </Button>
        )}
      </div>
    );

    const columns = [
      {
        title: '批号',
        dataIndex: 'fEntryID',
        width: '40%',
      },
      {
        title: '数量',
        dataIndex: 'fQty',
        width: '40%',
        render: (text, record) => {
          if (record.fEditable) {
            return getFieldDecorator('fQty_' + record.fEntryID, {
              rules: [{ required: true, message: '请输入' }],
              initialValue: text,
            })(
              <InputNumber
                min={Math.pow(0.1, fQtyDecimal)}
                step={Math.pow(0.1, fQtyDecimal)}
                precision={fQtyDecimal}
                onChange={value => this.handleFieldChange(record.fEntryID, value)}
              />
            );
          } else {
            return numeral(text).format(qtyFormat);
          }
        },
      },
    ];

    return (
      <Modal
        destroyOnClose
        confirmLoading={loading}
        title={
          <div>
            流程单 - 分批 <Tag color="blue"> {values.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        width={650}
        footer={footer}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Fragment>
          {/* <Steps current={currentStep} style={{ margin: '0 auto 20px ' }} >
            <Step title="基本分批情况" />
            <Step title="具体分批数量" />
            <Step title="完成" />
          </Steps> */}
          <Tabs tabBarStyle={{ visible: false }} activeKey={currentStep.toString()}>
            <TabPane tab="基本分批情况" key="0">
              <Form>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="当前岗位">
                  {values.fCurrentDeptName}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="可分批数量">
                  {numeral(values.fCurrentPassQty).format(qtyFormat)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={'分批批数'}>
                  {getFieldDecorator('fTotalBatchCount', {
                    rules: [{ required: true }],
                    initialValue: 2,
                  })(<InputNumber min={2} />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作员">
                  {getFieldDecorator('fOperatorID', {
                    rules: [{ required: true, message: '请选择操作员' }],
                    initialValue: fBindEmpID ? fBindEmpID : null,
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
              </Form>
            </TabPane>
            <TabPane tab="具体分批数量" key="1">
              <Table rowKey="fEntryID" columns={columns} dataSource={details} pagination={false} />
            </TabPane>
          </Tabs>
        </Fragment>
      </Modal>
    );
  }
}
