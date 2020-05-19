import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Button, Alert, Card, Select } from 'antd';
import DescriptionList from '@/components/DescriptionList';

import styles from './CommentForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ flowComment, loading, menu, user }) => ({
  flowComment,
  menu,
  currentUser: user.currentUser,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class CommentForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const { queryDeptID } = props;
    this.state = {
      queryDeptID,
    };
  }

  componentDidMount() {}

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

  okHandler = () => {
    const {
      form,
      data: { fInterID },
      dispatch,
      handleModalVisible,
    } = this.props;
    const fComments = form.getFieldValue('fComments');

    dispatch({
      type: 'flowComment/comment',
      payload: {
        fInterID,
        fComments,
      },
    }).then(result => {
      if (result.status === 'ok') {
        message.success('已成功添加备注信息');
      } else {
        message.error(result.message);
      }
      handleModalVisible(false);
    });
  };

  close = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  afterClose = () => {};

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      modalVisible,
      data: { fComments } = {},
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
        loading={loading}
        destroyOnClose
        title="备注"
        visible={modalVisible}
        // footer={footer}
        onCancel={() => handleModalVisible()}
        onOk={this.okHandler}
        wrapClassName={styles.modalWrap}
        afterClose={() => {
          this.afterClose();
        }}
      >
        <FormItem label="">
          {getFieldDecorator('fComments', {
            initialValue: fComments,
          })(<TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />)}
        </FormItem>
      </Modal>
    );
  }
}
