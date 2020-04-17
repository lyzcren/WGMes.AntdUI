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
const { Description } = DescriptionList;

/* eslint react/no-multi-comp:0 */
@Form.create()
@connect(({ mergeMissionCreate, menu }) => ({
  mergeMissionCreate,
  menu,
}))
export class CreateResult extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleViewMission = () => {
    const {
      dispatch,
      handleModalVisible,
      mergeMissionCreate: {
        newBill: { fMoBillNo },
      },
    } = this.props;
    handleModalVisible(false);

    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/mission', location: { fMoBillNo } },
    });
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/mergeMission/create' },
    });
  };

  handleViewProfile = () => {
    const {
      dispatch,
      handleModalVisible,
      mergeMissionCreate: { newBill },
    } = this.props;
    handleModalVisible(false);
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/mergeMission/profile', location: { id: newBill.fInterID } },
    });
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/mergeMission/create' },
    });
  };

  handleIWillRetry = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  renderDescription = () => {
    const {
      mergeMissionCreate: { newBill },
    } = this.props;

    if (status === 'ok') {
      return (
        <DescriptionList col="1">
          <Description term="任务单号">{newBill.fMoBillNo}</Description>
        </DescriptionList>
      );
    } else {
      return null;
    }
  };

  renderAction = () => {
    const {
      handleModalVisible,
      queryResult: { status },
    } = this.props;

    if (status === 'ok') {
      return (
        <Fragment>
          <Button type="primary" onClick={() => this.handleViewMission()}>
            查看任务单
          </Button>
          <Button onClick={() => this.handleViewProfile()}>查看合单详情</Button>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Button type="primary" onClick={() => this.handleIWillRetry()}>
            我知道了
          </Button>
        </Fragment>
      );
    }
  };

  render() {
    const { queryResult, modalVisible, handleModalVisible } = this.props;
    const { status, message } = queryResult;
    let type = '';
    if (status === 'ok') {
      type = 'success';
    } else {
      type = 'error';
    }

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={<div>合并任务单结果</div>}
        visible={modalVisible}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
        footer={null}
      >
        <Card bordered={false}>
          <Result
            type={type}
            title={message}
            description={this.renderDescription()}
            actions={this.renderAction()}
            style={{ marginBottom: 25 }}
          />
        </Card>
      </Modal>
    );
  }
}
