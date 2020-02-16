import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button } from 'antd';

import styles from './ScanForm.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ invCheckScan, loading, menu }) => ({
  invCheckScan,
  loading: loading.models.invCheckScan,
  menu,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ScanForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const { queryDeptID } = props;
    this.state = {
      queryDeptID,
      showSignField: false,
    };
  }

  componentDidMount() {
    const { queryDeptID } = this.props;
    this.state = {
      queryDeptID,
    };
  }

  componentDidUpdate() {}

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.scanFlow();
    }
  }

  handleSignKeyPress(e) {
    if (e.key === 'Enter') {
      this.sign();
    }
  }

  scanFlow = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fFullBatchNo } = fieldsValue;
      dispatch({
        type: 'invCheckScan/get',
        payload: {
          fFullBatchNo,
        },
      }).then(this.afterScan);
    });
  };

  afterScan = () => {
    const {
      form,
      handleScanTransfer,
      transferModalVisible,
      invCheckScan: { data },
    } = this.props;
    const { queryDeptID } = this.state;
    const fFullBatchNo = form.getFieldValue('fFullBatchNo');
    if (!data) {
      message.error(`未找到流程单【${fFullBatchNo}】.`);
      form.resetFields();
    } else {
      const { fStatusNumber, fRecordStatusNumber } = data;
      // 判断是否可签收
      if (fStatusNumber === 'EndProduce' || fStatusNumber === 'NonProduced') {
        message.info('当前流程单已结束生产.');
      } else if (fRecordStatusNumber !== 'ManufProducing') {
        // handleSign(data);
        this.setState({ showSignField: true });
      } else if (fRecordStatusNumber === 'ManufProducing') {
        handleScanTransfer(data);
        form.resetFields();
        this.close();
      }
    }
  };

  sign = () => {
    const {
      form,
      handleSign,
      invCheckScan: { data },
    } = this.props;
    const signBatchNo = form.getFieldValue('signBatchNo');
    if (signBatchNo !== data.fFullBatchNo) {
      message.error('两次扫描条码不一致.');
    } else {
      handleSign(data);
      form.resetFields();
      this.setState({ showSignField: false });
      this.inputFullBatchNo.focus();
    }
  };

  close = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
    } = this.props;
    const { showSignField } = this.state;

    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          取消
        </Button>
      </div>
    );

    return (
      <Modal
        destroyOnClose
        title="扫描"
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible()}
        wrapClassName={styles.modalWrap}
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
        </FormItem>
        {showSignField && (
          <FormItem label="">
            {getFieldDecorator('signBatchNo', {
              rules: [{ required: true, message: '再次扫描确认签收', min: 1 }],
            })(
              <Input
                ref={node => {
                  this.inputSignBatchNo = node;
                }}
                placeholder="再次扫描确认签收"
                autoFocus
                onKeyPress={e => this.handleSignKeyPress(e)}
              />
            )}
          </FormItem>
        )}
      </Modal>
    );
  }
}
