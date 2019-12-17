import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Steps, Input, Modal, Radio, Switch, Select, message, Button, Tag } from 'antd';
import { Link } from 'umi';

const FormItem = Form.Item;

@connect(({ chooseOperator, loading }) => ({
  chooseOperator,
  submitting: loading.models.chooseOperator,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ChooseOperatorForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.scan();
    }
  }

  scan = () => {
    const { form, dispatch, handleSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fNumber } = fieldsValue;
      dispatch({
        type: 'chooseOperator/scan',
        payload: {
          type: 'idcard',
          idCard: fNumber,
        },
      }).then(() => {
        const {
          chooseOperator: { currentUser },
        } = this.props;
        if (currentUser != null && Object.keys(currentUser).length <= 0) {
          message.warning('未找到操作员');
        } else if (!currentUser.fBindEmpID) {
          message.warning('扫码用户未绑定操作员');
        } else {
          const { fBindEmpID, fBindEmpName, fBindEmpNumber } = currentUser;
          handleSubmit({ fEmpID: fBindEmpID, fEmpName: fBindEmpName, fNumber: fBindEmpNumber });
        }
      });
      form.resetFields();
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      modalVisible,
      handleModalVisible,
      handleSubmit,
      operatorList,
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
          关闭
        </Button>
      </div>
    );

    return (
      <Modal
        destroyOnClose
        title={'选择操作员'}
        visible={modalVisible}
        footer={footer}
        width={650}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
        loading={loading}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('fNumber', {
              rules: [{ required: true, message: '请扫描条码/二维码', min: 1 }],
            })(
              <Input
                placeholder="请扫描条码/二维码"
                autoFocus
                onKeyPress={e => this.handleKeyPress(e)}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
