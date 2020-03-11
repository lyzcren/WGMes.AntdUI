import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button } from 'antd';

import styles from './ScanSignForm.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ quickScan, loading, menu }) => ({
  quickScan,
  loading: loading.models.quickScan,
  menu,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ScanSignForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const { queryDeptID } = props;
    this.state = {
      queryDeptID,
    };
  }

  componentDidMount() {
    const { queryDeptID } = this.props;
    this.state = {
      queryDeptID,
    };
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.sign();
    }
  }

  sign = () => {
    const {
      dispatch,
      form,
      handleSign,
      quickScan: { data },
      dept: { fItemID: fDeptID },
    } = this.props;
    const fFullBatchNo = form.getFieldValue('fFullBatchNo');
    dispatch({
      type: 'quickScan/signByBatchNo',
      payload: {
        fFullBatchNo,
        fDeptID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success('签收成功');
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
      form.resetFields();
    });
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
        title="签收"
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
      </Modal>
    );
  }
}
