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
@connect(({ repairProfile, loading, menu, basicData }) => ({
  repairProfile,
  loading: loading.models.repairProfile,
  menu,
  basicData,
}))
@Form.create()
class Profile extends PureComponent {
  state = {};

  componentDidMount() {
    const {
      dispatch,
      location: { id },
    } = this.props;
    dispatch({
      type: 'repairProfile/init',
      payload: { id },
    });
  }

  update() {
    const {
      dispatch,
      location: { id },
      handleChange,
    } = this.props;

    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/repair/update', location: { id }, handleChange },
    }).then(() => {
      this.close();
    });
  }

  check() {
    const {
      dispatch,
      location: { id },
      handleChange,
    } = this.props;

    dispatch({
      type: 'repairProfile/check',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'repairProfile/init',
        payload: { id },
      });
      // 成功后再次刷新列表
      if (handleChange) handleChange();
    });
  }

  uncheck() {
    const {
      dispatch,
      location: { id },
      handleChange,
    } = this.props;

    dispatch({
      type: 'repairProfile/uncheck',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'repairProfile/init',
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
      payload: { path: '/defect/repair/profile' },
    });
  }

  renderActions = () => {
    const {
      repairProfile: { fStatusNumber },
    } = this.props;
    return (
      <Fragment>
        <ButtonGroup>
          {fStatusNumber === 'Created' && hasAuthority('Repair_Update') ? (
            <Button type="primary" onClickCapture={() => this.update()}>
              修改
            </Button>
          ) : null}
          {fStatusNumber === 'Created' && hasAuthority('Repair_Check') ? (
            <Button onClickCapture={() => this.check()}>审核</Button>
          ) : null}
          {fStatusNumber === 'Checked' && hasAuthority('Repair_Check') ? (
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
        title: '不良类型',
        dataIndex: 'fDefectName',
      },
      {
        title: '不良编码',
        dataIndex: 'fDefectNumber',
      },
      {
        title: '返修数量',
        dataIndex: 'fQty',
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

  renderDescription = () => {
    const { repairProfile } = this.props;
    return (
      <DescriptionList className={styles.headerList} size="small" col="3" style={{ flex: 'auto' }}>
        <Description term="任务单号">{repairProfile.fMoBillNo}</Description>
        <Description term="订单号">{repairProfile.fSoBillNo}</Description>
        <Description term="物料名称">{repairProfile.fProductName}</Description>
        <Description term="物料编码">{repairProfile.fProductNumber}</Description>
        <Description term="规格型号">{repairProfile.fProductModel}</Description>
      </DescriptionList>
    );
  };

  renderBaseCard = () => {
    const { repairProfile } = this.props;
    return (
      <Card title="基本信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col="4">
          <Description term="岗位">{repairProfile.fDeptName}</Description>
          <Description term="岗位编码">{repairProfile.fDeptNumber}</Description>
          <Description term="工艺路线">{repairProfile.fRouteName}</Description>
          <Description term="工艺路线编码">{repairProfile.fRouteNumber}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderDetailsCard = () => {
    const {
      loading,
      repairProfile: { details },
    } = this.props;
    const sum = details.reduce((acc, cur) => acc.add(cur.fQty), numeral());

    return (
      <Card title="明细信息" bordered={false}>
        <Table
          rowKey="fEntryID"
          bordered
          loading={loading}
          columns={this.getColumns()}
          dataSource={details}
          footer={() => `总数量：${sum ? sum.value() : 0}`}
          pagination={false}
        />
      </Card>
    );
  };

  renderCommentsCard = () => {
    const {
      repairProfile: { fComments },
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
      repairProfile: {
        fCreatorName,
        fCreatorNumber,
        fCreateDate,
        fEditorName,
        fEditorNumber,
        fEditDate,
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
          <Description term="修改人">{fEditorName}</Description>
          <Description term="修改人编码">{fEditorNumber}</Description>
          <Description term="修改日期">{defaultDateTimeFormat(fEditDate)}</Description>
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
      repairProfile: { fBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`不良返修汇报：${fBillNo}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.renderActions()}
        content={this.renderDescription()}
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
