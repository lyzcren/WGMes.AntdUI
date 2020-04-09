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
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';

// const FormItem = Form.Item;
// const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ missionManage, missionProfile, loading, menu, columnManage }) => ({
  missionManage,
  missionProfile,
  loading: loading.models.missionProfile,
  menu,
  columnManage,
}))
@Form.create()
class Profile extends PureComponent {
  state = {};

  componentDidMount() {
    const {
      data: { fInterID },
    } = this.props;
    this.loadData(fInterID);
  }

  componentDidUpdate(preProps) {
    const {
      dispatch,
      data: { fInterID },
    } = this.props;
    if (fInterID !== preProps.data.fInterID) {
      this.loadData(fInterID);
    }
  }

  loadData(fInterID) {
    const { dispatch } = this.props;
    dispatch({
      type: 'missionProfile/initModel',
      payload: { fInterID },
    });
    dispatch({
      type: 'columnManage/getFields',
    });
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/mission/profile' },
    });
  }

  render() {
    const {
      missionProfile: { data, steps, currentStep },
      loading,
      form: { getFieldDecorator },
      columnManage: { fields },
    } = this.props;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description term="任务单号">{data.fMoBillNo}</Description>
        <Description term="订单号">{data.fSoBillNo}</Description>
        <Description term="日期">
          {data.fDate ? moment(data.fDate).format('YYYY-MM-DD') : ''}
        </Description>
        <Description term="计划完工日期">
          {data.fPlanFinishDate ? moment(data.fPlanFinishDate).format('YYYY-MM-DD') : ''}
        </Description>
        <Description term="工艺路线">{data.fRoutingName}</Description>
        <Description term="产品名称">{data.fProductName}</Description>
        <Description term="优先级">{data.fPriority}</Description>
      </DescriptionList>
    );

    const action = (
      <Fragment>
        <ButtonGroup />
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{data.fStatusName}</div>
        </Col>
      </Row>
    );

    return (
      <WgPageHeaderWrapper
        title={`生产任务单：${data.fMoBillNo}`}
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
            <Description term="工艺路线">{data.fRoutingName}</Description>
            <Description term="工艺路线编码">{data.fRoutingNumber}</Description>
            {fields
              .filter(f => f.fIsShow)
              .map(f => {
                // 因WebApi中属性使用大驼峰命名法，而当前项目中属性使用小驼峰命名法，故而字段名需要做转换
                const fieldName = f.fField.substring(0, 1).toLowerCase() + f.fField.substring(1);
                return (
                  <Description key={f.fField} term={f.fName}>
                    {data[fieldName]}
                  </Description>
                );
              })}
          </DescriptionList>
        </Card>
        <Card title="数量信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="单位">{data.fUnitName}</Description>
            <Description term="计划">{data.fPlanQty}</Description>
            <Description term="完工上限">{data.fAuxInHighLimitQty}</Description>
            <Description term="完工下限">{data.fAuxInLowLimitQty}</Description>
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
            <Description term="制单日期">
              {data.fCreateDate ? moment(data.fCreateDate).format('YYYY-MM-DD') : ''}
            </Description>
            <Description term="审核日期">
              {data.fCheckDate ? moment(data.fCheckDate).format('YYYY-MM-DD') : ''}
            </Description>
            <Description term="同步日期">
              {data.fErpSyncDate ? moment(data.fErpSyncDate).format('YYYY-MM-DD') : ''}
            </Description>
            <Description term="备注">{data.fComments}</Description>
          </DescriptionList>
        </Card>
      </WgPageHeaderWrapper>
    );
  }
}

export default Profile;
