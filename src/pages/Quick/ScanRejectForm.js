import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button } from 'antd';

import { RejectForm } from './RejectForm';

import styles from './ScanRejectForm.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ quickOps, loading, menu }) => ({
  quickOps,
  loading: loading.effects['quickOps/getFlowByBatchNo'],
  menu,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ScanRejectForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: {
        reject: false,
      },
    };
  }

  handleModalVisible = ({ key, flag }, record) => {
    const { modalVisible } = this.state;
    modalVisible[key] = !!flag;
    this.setState({
      modalVisible: { ...modalVisible },
      flow: record,
    });
  };

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.reject();
    }
  }

  reject = () => {
    const { dispatch, form } = this.props;
    const fFullBatchNo = form.getFieldValue('fFullBatchNo');
    dispatch({
      type: 'quickOps/getFlowByBatchNo',
      payload: {
        fFullBatchNo,
      },
    }).then(() => {
      const {
        quickOps: { flow },
        dept,
      } = this.props;
      if (!flow || Object.keys(flow).length <= 0) {
        message.warning('未找到流程单');
      } else if (!flow.fRemaindRecords.find(x => x.fDeptID == dept.fItemID)) {
        if (flow.fFinishedRecords.find(x => x.fDeptID == dept.fItemID)) {
          message.warning('无法拒签，当前岗位已完成。');
        } else {
          message.warning('无法拒签，流程单未经过当前岗位。');
        }
      } else {
        this.handleModalVisible({ key: 'reject', flag: true }, flow);
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
      dispatch,
      loading,
      form: { getFieldDecorator },
      handleModalVisible,
      quickOps: { flow },
      dept,
      operator,
    } = this.props;
    const { modalVisible } = this.state;

    const footer = (
      <div>
        <Button
          loading={loading}
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
      <div>
        <Modal
          destroyOnClose
          title="拒签"
          visible={this.props.modalVisible}
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
        {flow && (
          <RejectForm
            dispatch={dispatch}
            handleModalVisible={(flag, record) =>
              this.handleModalVisible({ key: 'reject', flag }, record)
            }
            modalVisible={modalVisible.reject}
            values={flow}
            bindDept={dept}
            bindOperator={operator}
          />
        )}
      </div>
    );
  }
}
