import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button } from 'antd';
import { routerRedux } from 'dva/router';

import styles from './ScanSign.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ scanSign, loading, menu }) => ({
  scanSign,
  loading: loading.models.scanSign,
  menu,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ScanTransferForm extends PureComponent {
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
      scanSign: { data },
      dept: { fDeptID },
      operator: { fEmpID },
      worktime: { fWorkTimeID },
      machine,
    } = this.props;
    const fFullBatchNo = form.getFieldValue('fFullBatchNo');
    dispatch({
      type: 'scanSign/get',
      payload: {
        fFullBatchNo,
      },
    }).then(() => {
      const {
        scanSign: { data },
      } = this.props;
      if (data == null) {
        message.warning('未找到流程单');
      } else {
        dispatch(
          routerRedux.push({
            pathname: '/quickOps/transfer',
            data,
            fEmpID,
            fWorkTimeID: fWorkTimeID,
            fMachineID: machine.fItemID,
          })
        );
      }
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
        title="转序"
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
