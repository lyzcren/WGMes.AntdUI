import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Modal,
  message,
  Steps,
  Table,
  Tooltip,
  Divider,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';


// const FormItem = Form.Item;
// const { Option } = Select;
const {
  Header, Footer, Sider, Content,
} = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;


/* eslint react/no-multi-comp:0 */
@connect(({ mOPlanManage, moPlanProfile, loading, menu, }) => ({
  mOPlanManage,
  moPlanProfile,
  loading: loading.models.moPlanProfile,
  menu,
}))
@Form.create()
class Profile extends PureComponent {
  state = {
  };

  componentDidMount () {
    const { data: { guid } } = this.props;
    this.loadData(guid);
  }

  componentDidUpdate (preProps) {
    const { dispatch, data: { fInterID } } = this.props;
    if (fInterID !== preProps.data.fInterID) {
      this.loadData(fInterID);
    }
  }

  loadData (guid) {
    const { dispatch, } = this.props;
    dispatch({
      type: 'moPlanProfile/initModel',
      payload: { guid },
    });
  }

  save () {
    const { dispatch, data: { fInterID } } = this.props;
    dispatch({
      type: 'moPlanProfile/saveStep',
      payload: { fInterID },
    }).then(() => {
      const { moPlanProfile: { queryResult } } = this.props;
      if (queryResult.status === 'ok') {
        message.success('保存成功');
        // 成功后关闭界面
        this.close();
      } else {
        message.warning(queryResult.message);
      }
    });
  }

  check (isCheck = true) {
    const { dispatch, data: { fInterID } } = this.props;
    const checkType = 'routeManage/' + (isCheck ? 'check' : 'uncheck');
    dispatch({
      type: checkType,
      payload: { fInterID },
    }).then(() => {
      const { routeManage: { queryResult } } = this.props;
      if (queryResult.status === 'ok') {
        message.success((isCheck ? '审批' : '反审批') + '成功');
        // 成功后关闭界面
        this.close();
      } else {
        message.warning(queryResult.message);
      }
    });
  }

  close () {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/MOPlan/profile' },
    });
  }

  render () {
    const {
      moPlanProfile: { data, steps, currentStep, },
      loading,
      form: { getFieldDecorator },
    } = this.props;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description term="任务单号">{data.fMoBillNo}</Description>
        <Description term="订单号">{data.fSoBillNo}</Description>
        <Description term="日期">{moment(data.fDate).format('YYYY-MM-DD')}</Description>
        <Description term="计划完工日期">{moment(data.fPlanFinishDate).format('YYYY-MM-DD')}</Description>
        <Description term="工艺路线">{data.fRoutingName}</Description>
        <Description term="产品名称">{data.fProductName}</Description>
        <Description term="优先级">{data.fPriority}</Description>
      </DescriptionList>
    );
    // const menu = (
    //   <Menu>
    //     <Menu.Item key="1">选项一</Menu.Item>
    //     <Menu.Item key="2">选项二</Menu.Item>
    //     <Menu.Item key="3">选项三</Menu.Item>
    //   </Menu>
    // );

    const action = (
      <Fragment>
        <ButtonGroup>
          {/* {data.fStatusNumber === "Created" && <Button onClick={() => this.check()}>审批</Button>}
          {data.fStatusNumber === "Checked" && <Button onClick={() => this.check(false)}>反审批</Button>} */}
          {/* <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
        </ButtonGroup>
        {/* <Button type="primary" onClick={() => this.save()}>保存</Button> */}
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{data.fStatusName}</div>
        </Col>
        {/* <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>订单金额</div>
          <div className={styles.heading}>¥ 568.08</div>
        </Col> */}
      </Row>
    );

    return (
      <WgPageHeaderWrapper
        title={data.fMoBillNo}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="产品信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="名称">{data.fProductName}</Description>
            <Description term="全称">{data.fProductFullName}</Description>
            <Description term="编码">{data.fProductNumber}</Description>
            <Description term="规格型号">{data.fModel}</Description>
            <Description term="分类">{data.fErpClsName}</Description>
            <Description term="父件型号">{data.fParentModel}</Description>
          </DescriptionList>
        </Card>
        <Card title="数量信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="计划">{data.fPlanQty}</Description>
            <Description term="投入">{data.fInputQty}</Description>
            <Description term="完工">{data.fFinishQty}</Description>
            <Description term="合格">{data.fPassQty}</Description>
            <Description term="报废">{data.fScrapQty}</Description>
          </DescriptionList>
        </Card>
        <Card title="其他信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="车间">{data.fWorkShopName}</Description>
            <Description term="车间编号">{data.fWorkShopNumber}</Description>
            <Description term="工艺路线">{data.fRoutingName}</Description>
            <Description term="制单日期">{moment(data.fCreateDate).format('YYYY-MM-DD')}</Description>
            <Description term="审核日期">{moment(data.fCheckDate).format('YYYY-MM-DD')}</Description>
            <Description term="同步日期">{moment(data.fErpSyncDate).format('YYYY-MM-DD')}</Description>
            <Description term="备注">{data.fComments}</Description>
          </DescriptionList>
        </Card>
      </WgPageHeaderWrapper>
    );
  }
}

export default Profile;
