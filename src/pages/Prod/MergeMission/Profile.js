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
@connect(({ mergeMissionProfile, loading, menu, basicData }) => ({
  mergeMissionProfile,
  loading: loading.models.mergeMissionProfile,
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
      type: 'mergeMissionProfile/init',
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
      payload: { path: '/prod/mergeMission/update', location: { id }, handleChange },
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
      type: 'mergeMissionProfile/check',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'mergeMissionProfile/init',
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
      type: 'mergeMissionProfile/uncheck',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'mergeMissionProfile/init',
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
      payload: { path: '/prod/mergeMission/profile' },
    });
  }

  renderActions = () => {
    const {
      mergeMissionProfile: { fStatusNumber },
    } = this.props;
    return (
      <Fragment>
        <ButtonGroup>
          {fStatusNumber === 'Created' && hasAuthority('MergeMission_Update') ? (
            <Button type="primary" onClickCapture={() => this.update()}>
              修改
            </Button>
          ) : null}
          {fStatusNumber === 'Created' && hasAuthority('MergeMission_Check') ? (
            <Button onClickCapture={() => this.check()}>审核</Button>
          ) : null}
          {fStatusNumber === 'Checked' && hasAuthority('MergeMission_Check') ? (
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
        title: '产品',
        dataIndex: 'fProductName',
      },
      {
        title: '产品编码',
        dataIndex: 'fProductNumber',
      },
      {
        title: '规格型号',
        dataIndex: 'fModel',
      },
      {
        title: '计划数量',
        dataIndex: 'fPlanQty',
      },
      {
        title: '计划上限',
        dataIndex: 'fAuxInHighLimitQty',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
    ];

    return columns;
  };

  renderBaseCard = () => {
    const { mergeMissionProfile } = this.props;
    return (
      <Card title="基本信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col="4">
          <Description term="物料名称">{mergeMissionProfile.fProductName}</Description>
          <Description term="物料编码">{mergeMissionProfile.fProductNumber}</Description>
          <Description term="规格型号">{mergeMissionProfile.fModel}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderDetailsCard = () => {
    const {
      loading,
      mergeMissionProfile: { details },
    } = this.props;
    const sum = details.reduce((acc, cur) => acc.add(cur.fPlanQty), numeral());

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
      mergeMissionProfile: { fComments },
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
      mergeMissionProfile: {
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
      mergeMissionProfile: { fMoBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`单据：${fMoBillNo}`}
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
