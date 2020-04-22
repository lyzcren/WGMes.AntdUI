import DescriptionList from '@/components/DescriptionList';
import { hasAuthority } from '@/utils/authority';
import { defaultDateFormat, defaultDateTimeFormat } from '@/utils/GlobalConst';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import { Button, Card, Form, Input, Layout, Select, Table, message } from 'antd';
import { connect } from 'dva';
import numeral from 'numeral';
import React, { Fragment, PureComponent } from 'react';
import { ProfileResult } from './components/ResultModel';

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
  state = {
    resultVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      location: { id },
    } = this.props;
    dispatch({
      type: 'reportProfile/init',
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
      payload: { path: '/defect/report/update', location: { id }, handleChange },
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
      type: 'reportProfile/check',
      payload: { id },
    }).then(queryResult => {
      this.showResult(true, queryResult);
    });
  }

  uncheck() {
    const {
      dispatch,
      location: { id },
      handleChange,
    } = this.props;

    dispatch({
      type: 'reportProfile/uncheck',
      payload: { id },
    }).then(queryResult => {
      this.showResult(true, queryResult);
    });
  }

  showResult(flag, queryResult) {
    this.setState({ resultVisible: !!flag, queryResult });
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/report/profile' },
    });
  }

  renderActions = () => {
    const {
      reportProfile: { fStatusNumber },
    } = this.props;
    return (
      <Fragment>
        <ButtonGroup>
          {fStatusNumber === 'Created' && hasAuthority('DefectReport_Update') ? (
            <Button type="primary" onClickCapture={() => this.update()}>
              修改
            </Button>
          ) : null}
          {fStatusNumber === 'Created' && hasAuthority('DefectReport_Check') ? (
            <Button onClickCapture={() => this.check()}>审核</Button>
          ) : null}
          {fStatusNumber === 'Checked' && hasAuthority('DefectReport_Check') ? (
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
        title: '报废数量',
        dataIndex: 'fQty',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
      },
      {
        title: '订单号',
        dataIndex: 'fSoBillNo',
      },
      {
        title: '物料名称',
        dataIndex: 'fProductName',
      },
      {
        title: '物料编码',
        dataIndex: 'fProductNumber',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];

    return columns;
  };

  renderDescription = () => {};

  renderBaseCard = () => {
    const { reportProfile } = this.props;
    return (
      <Card title="基本信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col="4">
          <Description term="岗位">{reportProfile.fDeptName}</Description>
          <Description term="岗位编码">{reportProfile.fDeptNumber}</Description>
          <Description term="日期">{defaultDateFormat(reportProfile.fDate)}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderDetailsCard = () => {
    const {
      loading,
      reportProfile: { details },
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

  renderResult = () => {
    const { dispatch } = this.props;
    const { queryResult = {}, resultVisible } = this.state;

    return (
      <ProfileResult
        dispatch={dispatch}
        modalVisible={resultVisible}
        queryResult={queryResult}
        handleModalVisible={flag => this.showResult(flag)}
      />
    );
  };

  render() {
    const {
      reportProfile: { fBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`不良报废：${fBillNo}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.renderActions()}
        // content={this.renderDescription()}
        // extraContent={extra}
        wrapperClassName={styles.main}
        loading={loading}
      >
        {this.renderBaseCard()}
        {this.renderDetailsCard()}
        {this.renderCommentsCard()}
        {this.renderOtherCard()}
        {this.renderResult()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Profile;
