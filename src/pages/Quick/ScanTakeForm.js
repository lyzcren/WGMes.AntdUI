import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button } from 'antd';
import { TakeForm } from './TakeForm';

import styles from './ScanTakeForm.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ quickOps, loading, menu }) => ({
  quickOps,
  loading: loading.effects['quickOps/getFlowByBatchNo'],
  menu,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ScanTakeForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const { queryDeptID } = props;
    this.state = {
      queryDeptID,
      modalVisible: {
        take: false,
      },
    };
  }

  componentDidMount() {
    const { queryDeptID } = this.props;
    this.state = {
      queryDeptID,
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
      this.take();
    }
  }

  take = () => {
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
      } else if (flow.fNextDeptIDList.indexOf(dept.fDeptID) < 0) {
        message.warning('当前岗位无法拒签');
      } else {
        this.handleModalVisible({ key: 'take', flag: true }, flow);
      }
      form.resetFields();
    });
  };

  confirmTake = (fields, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'quickOps/take',
      payload: fields,
    }).then(() => {
      const {
        quickOps: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(`【${record.fFullBatchNo}】` + `取走成功`);
        this.handleModalVisible({ key: 'take', flag: false });
      } else if (queryResult.status === 'warning') {
        message.warning(`【${record.fFullBatchNo}】${queryResult.message}`);
      } else {
        message.error(`【${record.fFullBatchNo}】${queryResult.message}`);
      }
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
      <div>
        <Modal
          destroyOnClose
          title="取走"
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
          <TakeForm
            dispatch
            handleModalVisible={(flag, record) =>
              this.handleModalVisible({ key: 'take', flag }, record)
            }
            handleSubmit={fields => this.confirmTake(fields, flow)}
            modalVisible={modalVisible.take}
            values={flow}
            bindDept={dept}
            bindOperator={operator}
          />
        )}
      </div>
    );
  }
}
