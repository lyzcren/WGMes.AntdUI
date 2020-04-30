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
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './ScanSign.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ scanSign, loading }) => ({
  scanSign,
  loading: loading.models.scanSign,
  submitLoading: loading.effects['scanSign/submit'],
}))
@Form.create()
export class ScanSignForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch, dept } = this.props;

    dispatch({
      type: 'scanSign/initModel',
      payload: { deptId: dept.fItemID },
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fFullBatchNo } = fieldsValue;
      dispatch({
        type: 'scanSign/scan',
        payload: {
          fFullBatchNo,
          deptId: dept.fItemID,
        },
      });
    });
  };

  submit = () => {
    const {
      dispatch,
      dept,
      scanSign: { records },
    } = this.props;

    records.forEach(record => {
      dispatch({
        type: 'scanSign/sign',
        payload: {
          fInterID: record.fInterID,
          fDeptID: dept.fItemID,
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
      scanSign: { messageInfo, records },
      afterClose,
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
            return <Badge status="success" text={'签收成功'} />;
          }
          if (record.result && record.result.status === 'warning') {
            return <Badge status="warning" text={record.result.message} />;
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
          确认签收
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
        title={<h2 align="center">扫码签收-{dept.fName}</h2>}
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => afterClose()}
      >
        <FormItem label="">
          {getFieldDecorator('fFullBatchNo', {
            rules: [{ required: true, message: '请扫描条码/二维码', min: 1 }],
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
