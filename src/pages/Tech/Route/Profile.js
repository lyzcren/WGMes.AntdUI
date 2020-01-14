import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Button,
  message,
  Select,
  Steps,
  Input,
  Switch,
  Descriptions,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import ViewRouteSteps from './ViewRouteSteps';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const { Step } = Steps;
const { Description } = DescriptionList;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData, routeProfile, loading, menu }) => ({
  basicData,
  routeProfile,
  loading: loading.models.routeProfile,
  menu,
}))
@Form.create()
class Profile extends PureComponent {
  state = {};

  componentDidMount() {
    const {
      dispatch,
      location: { fInterID },
    } = this.props;
    dispatch({
      type: 'routeProfile/initModel',
      payload: { fInterID },
    });
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      location: { fInterID },
    } = this.props;
    const {
      location: { fInterID: preInterID },
    } = prevProps;
    if (fInterID !== preInterID) {
      dispatch({
        type: 'routeProfile/initModel',
        payload: { fInterID },
      });
    }
  }

  changeSteps = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeProfile/changeSteps',
      payload,
    });
  };

  handleUpdatePageVisible = () => {
    const {
      dispatch,
      location: { fInterID },
    } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: {
        path: '/techStd/route/update',
        location: { fInterID },
      },
    });
  };

  handleCopyPageVisible = () => {
    const {
      dispatch,
      location: { fInterID },
    } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: {
        path: '/techStd/route/create',
        location: { fInterID },
      },
    });
  };

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/techStd/route/profile' },
    });
  }

  render() {
    const {
      routeProfile: {
        data: {
          fNumber,
          fName,
          fIsActive,
          fCreatorName,
          fCreateDate,
          fEditorName,
          fEditDate,
          fComments,
        },
        steps,
        currentStep,
      },
      loading,
      form: { getFieldDecorator },
      basicData: { processDeptTree },
    } = this.props;

    console.log(steps, currentStep);

    const content = (
      <DescriptionList size="small" col="4">
        <Description term="编码">{fNumber}</Description>
        <Description term="名称">{fName}</Description>
        <Description term="是否启用">
          <Switch checked={fIsActive} disabled />
        </Description>
      </DescriptionList>
    );

    const action = (
      <Fragment>
        <Button type="primary" onClick={() => this.handleUpdatePageVisible()}>
          修改
        </Button>
        <Button onClick={() => this.handleCopyPageVisible()}>复制</Button>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    return (
      <div>
        <WgPageHeaderWrapper
          title="查看工艺路线"
          logo={
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
          }
          action={action}
          content={content}
          // extraContent={extra}
          // tabList={tabList}
          wrapperClassName={styles.advancedForm}
          loading={loading}
        />
        <Layout style={{ backgroundColor: '#ffffff', margin: '24px 32px 0 0' }}>
          <GridContent style={{ marginLeft: '10px' }}>
            <Card bordered title="工艺路线详情">
              <ViewRouteSteps
                loading={loading}
                steps={steps}
                currentStep={currentStep}
                onChange={this.changeSteps}
              />
            </Card>
          </GridContent>
          <Card title="备注信息">
            <DescriptionList size="small" col="1">
              <Description term="备注">{fComments}</Description>
            </DescriptionList>
          </Card>
          <Card title="其他信息">
            <DescriptionList size="small" col="4">
              <Description term="创建人">{fCreatorName}</Description>
              <Description term="创建日期">{defaultDateTimeFormat(fCreateDate)}</Description>
              <Description term="修改人">{fEditorName}</Description>
              <Description term="修改日期">{defaultDateTimeFormat(fEditDate)}</Description>
            </DescriptionList>
          </Card>
        </Layout>
      </div>
    );
  }
}

export default Profile;
