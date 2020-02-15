import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button } from 'antd';

import styles from './ScanForm.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@Form.create()
export class ScanForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      const { form, handleScan } = this.props;
      form.validateFields((err, fieldsValue) => {
        if (err) return;

        const { batchNo } = fieldsValue;
        handleScan(batchNo);
        form.resetFields();
      });
    }
  }

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

    const footer = (
      <div>
        <Button
          loading={loading}
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
        destroyOnClose
        loading={loading}
        title="扫描"
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible()}
        wrapClassName={styles.modalWrap}
      >
        <FormItem label="">
          {getFieldDecorator('batchNo', {
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
      </Modal>
    );
  }
}
