import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, DatePicker, Modal, message, Button } from 'antd';

import styles from './SyncForm.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ missionSync, loading, menu }) => ({
  missionSync,
  loading: loading.models.missionManage,
  menu,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class SyncForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  scanFlow = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fFullBatchNo } = fieldsValue;
      dispatch({
        type: 'flowScan/get',
        payload: {
          fFullBatchNo,
        },
      }).then(this.afterScan);
    });
  };

  okHandler = () => {
    const {
      form,
      dispatch,
      handleSync,
      handleModalVisible,
      missionSync: { isSyncing },
    } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      handleSync(fieldsValue);
      handleModalVisible();
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
      missionSync: { isSyncing },
    } = this.props;

    return (
      <Modal
        destroyOnClose
        title="同步生产任务单"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        onOk={this.okHandler}
        wrapClassName={styles.modalWrap}
        loading={isSyncing}
      >
        <FormItem label="开始日期">
          {getFieldDecorator('fBeginDate', {
            rules: [{ required: false, message: '请选择同步开始日期' }],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </FormItem>
        <FormItem label="结束日期">
          {getFieldDecorator('fEndDate', {
            rules: [{ required: false, message: '请选择同步结束日期' }],
          })(<DatePicker format="YYYY-MM-DD" />)}
        </FormItem>
      </Modal>
    );
  }
}
