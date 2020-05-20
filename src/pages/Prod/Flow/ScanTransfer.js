import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import {
  Form,
  Table,
  Modal,
  Switch,
  Select,
  Tag,
  message,
  Button,
  Input,
  Badge,
  Card,
  Alert,
  Row,
  Col,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './ScanTransfer.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ scanTransfer, loading, user, basicData }) => ({
  scanTransfer,
  loading: loading.models.scanTransfer,
  submitLoading: loading.effects['scanTransfer/submit'],
  fBindEmpID: user.currentUser.fBindEmpID,
  basicData,
}))
@Form.create()
export class ScanTransferForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => { },
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch, dept } = this.props;

    dispatch({
      type: 'scanTransfer/initModel',
      payload: { deptId: dept.fItemID },
    });
    dispatch({
      type: 'basicData/getOperator',
    });
    dispatch({
      type: 'basicData/getDebuggers',
    });
  }

  handleKeyPress(e) {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (e.key === 'Enter') {
      this.scanFlow();
      setFieldsValue({ fFullBatchNo: '' });
    }
  }

  scanFlow = () => {
    const { form, dispatch, dept } = this.props;

    const fFullBatchNo = form.getFieldValue('fFullBatchNo');
    dispatch({
      type: 'scanTransfer/scan',
      payload: {
        fFullBatchNo,
        deptId: dept.fItemID,
      },
    });
  };

  handleOperatorChange = value => {
    const {
      basicData: { operators },
    } = this.props;
    const selectedOperator = operators.find(x => x.fItemID === value);
    if (selectedOperator && selectedOperator.fMachineID) {
      this.setState({ fMachineID: selectedOperator.fMachineID });
    }
    if (selectedOperator && selectedOperator.fWorkTimeID) {
      this.setState({ fWorkTimeID: selectedOperator.fWorkTimeID });
    }
  };

  submit = () => {
    const {
      form,
      dispatch,
      dept,
      scanTransfer: { records },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fOperatorID, fDebuggerID, fMachineID } = fieldsValue;

      dispatch({
        type: 'scanTransfer/transfer',
        payload: {
          fInterIDs: records.map(x => x.fCurrentRecordID),
          fOperatorID,
          fDebuggerID,
          fMachineID,
        },
      });
    });
  };

  render() {
    const {
      loading,
      submitLoading,
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      dept,
      scanTransfer: { messageInfo, records, machineData },
      afterClose,
      basicData: { operators, debuggers },
      fBindEmpID,
    } = this.props;

    const columns = [
      {
        title: '批号',
        dataIndex: 'fFullBatchNo',
        key: 'fFullBatchNo',
      },
      {
        title: '投入数量',
        dataIndex: 'fInputQty',
      },
      {
        title: '结果',
        dataIndex: 'result',
        render: (val, record) => {
          if (record.result && record.result.status === 'ok') {
            return <Badge status="success" text={'转序成功'} />;
          }
          else if (record.result && record.result.status === 'warning') {
            return <Badge status="warning" text={record.result.message} />;
          } else if (record.result && record.result.status === 'err') {
            return <Badge status="error" text={record.result.message} />;
          }
        },
      },
    ];
    const footer = (
      <div>
        <Button
          loading={submitLoading}
          type={'primary'}
          onClick={() => this.submit()}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
          disabled={records.length <= 0}
        >
          确认转序
        </Button>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Modal
        maskClosable={false}
        closable={false}
        destroyOnClose
        title={<h2 align="center">扫码转序-{dept.fName}</h2>}
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => afterClose()}
      >
        <FormItem label="">
          {getFieldDecorator('fFullBatchNo', {
            rules: [{ required: false, message: '请扫描条码/二维码' }],
          })(
            <Input
              ref={node => {
                this.inputFullBatchNo = node;
              }}
              placeholder="请扫描条码/二维码"
              autoFocus
              onKeyPress={e => this.handleKeyPress(e)}
            />
          )}
          {messageInfo && <Alert message={messageInfo} type={'error'} />}
        </FormItem>
        <Form>
          <FormItem key="fOperatorID" label="操作员">
            {getFieldDecorator('fOperatorID', {
              rules: [{ required: true, message: '请选择操作员' }],
              initialValue: fBindEmpID ? fBindEmpID : null,
            })(
              <Select
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择操作员"
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={this.handleOperatorChange}
              >
                {operators &&
                  operators.map(x => (
                    <Option key={x.fItemID} value={x.fItemID}>
                      {`${x.fName} - ${x.fNumber}`}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
          <FormItem key="fDebuggerID" label="调机员">
            {getFieldDecorator('fDebuggerID', {
              rules: [{ required: false, message: '请选择调机员' }],
              initialValue: null,
            })(
              <Select
                placeholder="请选择调机员"
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {debuggers &&
                  debuggers.map(x => (
                    <Option key={x.fItemID} value={x.fItemID}>
                      {`${x.fName} - ${x.fNumber}`}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
          <FormItem key="fMachineID" label="机台">
            {getFieldDecorator('fMachineID', {
              rules: [{ required: false, message: '请选择机台' }],
              initialValue: null,
            })(
              <Select
                placeholder="请选择机台"
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {machineData &&
                  machineData.map(x => (
                    <Option key={x.fItemID} value={x.fItemID}>
                      {`${x.fName} - ${x.fNumber}`}
                    </Option>
                  ))}
              </Select>
            )}
          </FormItem>
        </Form>
        {records && records.length > 0 && (
          <Table
            rowKey="fInterID"
            size={'small'}
            loading={loading}
            columns={columns}
            dataSource={records}
            pagination={false}
          />
        )}
      </Modal>
    );
  }
}
