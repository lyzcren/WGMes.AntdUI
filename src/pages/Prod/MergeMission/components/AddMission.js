import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  Form,
  Button,
  Row,
  Col,
  Icon,
  Steps,
  Card,
  Modal,
  Dropdown,
  Menu,
  Tag,
  Input,
  Typography,
} from 'antd';
import Result from '@/components/Result';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

const { TextArea } = Input;
const { Text } = Typography;

@Form.create()
export class AddMission extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  okHandle = () => {
    const { form, okHandle, handleModalVisible } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      okHandle(fieldsValue.billNo);
      handleModalVisible(false);
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={<div>多行添加</div>}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
        <Card bordered={false}>
          <Text style={{ marginBottom: '20px' }} type="warning">
            可输入多个任务单号，每一行系统识别为一个任务单。
          </Text>
          {getFieldDecorator('billNo', {
            rules: [{ required: false, message: '请输入任务单号' }],
          })(<TextArea rows={6} autoFocus />)}
        </Card>
      </Modal>
    );
  }
}
