import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button, Table, Input, message } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';

import styles from './List.less';

const FormItem = Form.Item;
const { Description } = DescriptionList;
// const { Option } = Select;
const { TextArea } = Input;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ reportManage, reportProfile, loading, menu, basicData }) => ({
  reportManage,
  reportProfile,
  loading: loading.models.reportProfile,
  menu,
  basicData,
}))
@Form.create()
class Profile extends PureComponent {
  state = {
    fInterID: null,
    fBillNo: '',
    fDate: Date.now(),
    fTotalDeltaQty: 0,
    fDeptID: null,
    fComments: '',
    details: [],
    handleSuccess: () => {},
  };

  componentDidMount() {
    const { handleSuccess } = this.props;
    this.setState({ handleSuccess });
    this.reload();
  }

  componentDidProfile(preProps) {
    const preRecord = preProps.record;
    const { record } = this.props;
    if (preRecord.fInterID !== record.fInterID) {
      this.reload();
    }
  }

  reload() {
    const {
      dispatch,
      record: { fInterID },
      handleSuccess,
    } = this.props;
    dispatch({
      type: 'reportProfile/get',
      payload: {
        fInterID,
      },
    }).then(() => {
      const {
        reportProfile: { profile },
      } = this.props;
      this.setState({ ...profile, handleSuccess });
    });
  }

  handleUpdate() {
    const { dispatch } = this.props;
    const { handleSuccess } = this.state;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/update', record: this.state, handleSuccess },
    });
    this.close();
  }

  check = () => {
    const { dispatch } = this.props;
    const { fInterID, fBillNo, handleSuccess } = this.state;
    dispatch({
      type: 'reportManage/check',
      payload: {
        fInterID,
      },
    }).then(() => {
      const {
        reportManage: { queryResult },
      } = this.props;
      this.showResult(queryResult, () => {
        message.success(`【${fBillNo}】` + `反审核成功`);
        this.reload();
        // 成功后再次刷新列表
        if (handleSuccess) handleSuccess();
      });
    });
  };

  uncheck = () => {
    const { dispatch } = this.props;
    const { fInterID, fBillNo, handleSuccess } = this.state;
    dispatch({
      type: 'reportManage/uncheck',
      payload: {
        fInterID,
      },
    }).then(() => {
      const {
        reportManage: { queryResult },
      } = this.props;
      this.showResult(queryResult, () => {
        message.success(`【${fBillNo}】` + `审核成功`);
        this.reload();
        // 成功后再次刷新列表
        if (handleSuccess) handleSuccess();
      });
    });
  };

  showResult(queryResult, successCallback) {
    const { status, message, model } = queryResult;

    if (status === 'ok') {
      if (successCallback) successCallback(model);
      else {
        message.success(message);
      }
    } else if (status === 'warning') {
      message.warning(message);
    } else {
      message.error(message);
    }
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/report/profile' },
    });
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
    } = this.props;

    const {
      fBillNo,
      fDeptName,
      fDate,
      fComments,
      fStatus,
      fStatusName,
      fTotalDeltaQty,
      details,
    } = this.state;

    const action = (
      <Fragment>
        <ButtonGroup>
          {fStatus === 0 && <Button onClickCapture={() => this.handleUpdate()}>修改</Button>}
          {fStatus === 0 ? (
            <Button onClickCapture={() => this.check()}>审核</Button>
          ) : (
            <Button onClickCapture={() => this.uncheck()}>反审核</Button>
          )}
        </ButtonGroup>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const columns = [
      {
        title: '产品',
        dataIndex: 'fProductName',
      },
      {
        title: '产品编码',
        dataIndex: 'fProductNumber',
      },
      {
        title: '规格型号',
        dataIndex: 'fProductModel',
      },
      {
        title: '不良',
        dataIndex: 'fDefectName',
      },
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '盘点数量',
        dataIndex: 'fQty',
      },
      {
        title: '数量',
        dataIndex: 'fInvQty',
      },
      {
        title: '盈亏',
        dataIndex: 'fDeltaQty',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description term="单号">{fBillNo}</Description>
        <Description term="岗位">{fDeptName}</Description>
        <Description term="日期">{moment(fDate).format('YYYY-MM-DD')}</Description>
        <Description term="备注">{fComments}</Description>
      </DescriptionList>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>盈亏</div>
          <div className={styles.heading}>{numeral(fTotalDeltaQty).format('0.00')}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{fStatusName}</div>
        </Col>
      </Row>
    );

    return (
      <WgPageHeaderWrapper
        title={`不良盘点单：${fBillNo}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="明细信息" style={{ marginBottom: 24 }} bordered={false}>
          <Table rowKey="fEntryID" loading={loading} columns={columns} dataSource={details} />
        </Card>
      </WgPageHeaderWrapper>
    );
  }
}

export default Profile;
