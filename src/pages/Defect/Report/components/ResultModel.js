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
class BaseResult extends PureComponent {
  static defaultProps = {};
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleRefreshList = () => {
    const {
      dispatch,
      handleModalVisible,
      model: {
        newBill: { fBillNo },
      },
      closeCurrent,
    } = this.props;
    handleModalVisible(false);
    closeCurrent();

    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/report', location: { fBillNo } },
    });
  };

  handleViewProfile = () => {
    const {
      dispatch,
      handleModalVisible,
      model: { newBill },
      closeCurrent,
    } = this.props;
    handleModalVisible(false);
    closeCurrent();

    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/report/profile', location: { id: newBill.fInterID } },
    });
  };

  handleIWillRetry = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  renderDescription = () => {
    const {
      queryResult: { status },
      model: { newBill },
    } = this.props;

    if (status === 'ok') {
      return (
        <DescriptionList col="1">
          <Description term="不良报废单号">{newBill.fBillNo}</Description>
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
          <Button type="primary" onClick={() => this.handleRefreshList()}>
            刷新列表
          </Button>
          <Button onClick={() => this.handleViewProfile()}>查看详情</Button>
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

  onCancel = () => {
    const { queryResult, handleModalVisible, closeCurrent } = this.props;
    const { status, message } = queryResult;
    handleModalVisible(false);
    if (status === 'ok') {
      closeCurrent();
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
        title={<div>不良报废结果</div>}
        visible={modalVisible}
        onCancel={this.onCancel}
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

@connect(({ reportCreate, menu }) => ({
  model: reportCreate,
  menu,
}))
export class CreateResult extends BaseResult {
  constructor(props) {
    super(props);
    this.state = {};
  }

  closeCurrent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/report/create' },
    });
  };

  render() {
    return <BaseResult {...this.props} closeCurrent={this.closeCurrent} />;
  }
}

@connect(({ reportUpdate, menu }) => ({
  model: reportUpdate,
  menu,
}))
export class UpdateResult extends BaseResult {
  constructor(props) {
    super(props);
    this.state = {};
  }

  closeCurrent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/report/update' },
    });
  };

  render() {
    return <BaseResult {...this.props} closeCurrent={this.closeCurrent} />;
  }
}

@connect(({ reportProfile, menu }) => ({
  model: reportProfile,
  menu,
}))
export class ProfileResult extends BaseResult {
  constructor(props) {
    super(props);
    this.state = {};
  }

  closeCurrent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/report/profile' },
    });
  };

  render() {
    return <BaseResult {...this.props} closeCurrent={this.closeCurrent} />;
  }
}
