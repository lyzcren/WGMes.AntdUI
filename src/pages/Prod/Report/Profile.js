import DescriptionList from '@/components/DescriptionList';
import { hasAuthority } from '@/utils/authority';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import { Button, Card, Form, Input, Layout, Select, Table, message } from 'antd';
import { connect } from 'dva';
import numeral from 'numeral';
import React, { Fragment, PureComponent } from 'react';
import styles from './Profile.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ reportProfile, loading, menu, basicData }) => ({
  reportProfile,
  loading: loading.models.reportProfile,
  menu,
  basicData,
}))
@Form.create()
class Profile extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'reportProfile/init',
      payload: { id },
    });
  }

  update() {
    const { dispatch, id, handleChange } = this.props;

    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/update', id, handleChange },
    }).then(() => {
      this.close();
    });
  }

  check() {
    const { dispatch, id, handleChange } = this.props;

    dispatch({
      type: 'reportProfile/check',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'reportProfile/init',
        payload: { id },
      });
      // 成功后再次刷新列表
      if (handleChange) handleChange();
    });
  }

  uncheck() {
    const { dispatch, id, handleChange } = this.props;

    dispatch({
      type: 'reportProfile/uncheck',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'reportProfile/init',
        payload: { id },
      });
      // 成功后再次刷新列表
      if (handleChange) handleChange();
    });
  }

  showResult(queryResult) {
    const { status, message, model } = queryResult;

    if (status === 'ok') {
      message.success(queryResult.message);
    } else if (status === 'warning') {
      message.warning(queryResult.message);
    } else {
      message.error(queryResult.message);
    }
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/report/profile' },
    });
  }

  renderActions = () => {
    const {
      reportProfile: { fStatusNumber },
    } = this.props;
    return (
      <Fragment>
        <ButtonGroup>
          {fStatusNumber === 'Created' && hasAuthority('Report_Update') ? (
            <Button type="primary" onClickCapture={() => this.update()}>
              修改
            </Button>
          ) : null}
          {fStatusNumber === 'Created' && hasAuthority('Report_Check') ? (
            <Button onClickCapture={() => this.check()}>审核</Button>
          ) : null}
          {fStatusNumber === 'Checked' && hasAuthority('Report_Check') ? (
            <Button type="danger" onClickCapture={() => this.uncheck()}>
              反审核
            </Button>
          ) : null}
        </ButtonGroup>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );
  };

  getColumns = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
      },
      {
        title: '批号',
        dataIndex: 'fFullBatchNo',
      },
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
        title: '汇报数量',
        dataIndex: 'fReportingQty',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];

    return columns;
  };

  renderBaseCard = () => {
    const {
      reportProfile: { fDeptName, fDeptNumber },
    } = this.props;
    return (
      <Card title="基本信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col="4">
          <Description term="岗位">{fDeptName}</Description>
          <Description term="岗位编码">{fDeptNumber}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderDetailsCard = () => {
    const {
      loading,
      reportProfile: { details },
    } = this.props;
    const sum = details.reduce((acc, cur) => acc.add(cur.fReportingQty), numeral());

    return (
      <Card title="明细信息" bordered={false}>
        <Table
          rowKey="fInvID"
          bordered
          loading={loading}
          columns={this.getColumns()}
          dataSource={details}
          footer={() => `总汇报数量：${sum ? sum.value() : 0}`}
          pagination={false}
        />
      </Card>
    );
  };

  renderCommentsCard = () => {
    const {
      reportProfile: { fComments },
    } = this.props;
    return (
      <Card title="备注信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small">
          <Description term="备注">{fComments}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderOtherCard = () => {
    const {
      reportProfile: {
        fCreatorName,
        fCreatorNumber,
        fCreateDate,
        fCheckerName,
        fCheckerNumber,
        fCheckDate,
      },
    } = this.props;
    return (
      <Card title="其他信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col={4}>
          <Description term="创建人">{fCreatorName}</Description>
          <Description term="创建人编码">{fCreatorNumber}</Description>
          <Description term="创建日期">{defaultDateTimeFormat(fCreateDate)}</Description>
        </DescriptionList>
        <DescriptionList className={styles.headerList} size="small" col={4}>
          <Description term="审核人">{fCheckerName}</Description>
          <Description term="审核人编码">{fCheckerNumber}</Description>
          <Description term="审核日期">{defaultDateTimeFormat(fCheckDate)}</Description>
        </DescriptionList>
      </Card>
    );
  };

  render() {
    const {
      reportProfile: { fBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`生产任务汇报：${fBillNo}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.renderActions()}
        // content={description}
        // extraContent={extra}
        wrapperClassName={styles.main}
        loading={loading}
      >
        {this.renderBaseCard()}
        {this.renderDetailsCard()}
        {this.renderCommentsCard()}
        {this.renderOtherCard()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Profile;
