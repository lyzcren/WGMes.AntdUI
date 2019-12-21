import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Layout, Row, Col, Card, Form, Button, message, Steps } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import DeptForm from './DeptForm';
import { RouteSteps } from '@/components/WgRouteSteps/RouteSteps';

import styles from './List.less';

// const FormItem = Form.Item;
// const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const { Step } = Steps;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ routeManage, routeProfile, loading, menu }) => ({
  routeManage,
  routeProfile,
  loading: loading.models.routeProfile,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
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
      type: 'routeProfile/initModel',
      payload: { fInterID },
    });
  }

  save() {
    const {
      dispatch,
      data: { fInterID },
    } = this.props;
    dispatch({
      type: 'routeProfile/saveStep',
      payload: { fInterID },
    }).then(() => {
      const {
        routeProfile: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('保存成功');
        // 成功后关闭界面
        this.close();
      } else {
        message.warning(queryResult.message);
      }
    });
  }

  check(isCheck = true) {
    const {
      dispatch,
      data: { fInterID },
    } = this.props;
    const checkType = `routeManage/${isCheck ? 'check' : 'uncheck'}`;
    dispatch({
      type: checkType,
      payload: { fInterID },
    }).then(() => {
      const {
        routeManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(`${isCheck ? '审批' : '反审批'}成功`);
        // 成功后关闭界面
        this.close();
      } else {
        message.warning(queryResult.message);
      }
    });
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/techStd/route/profile' },
    });
  }

  nextStep() {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeProfile/nextStep',
    });
  }

  prevStep() {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeProfile/prevStep',
    });
  }

  deleteStep() {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeProfile/deleteStep',
    });
  }

  render() {
    const {
      routeProfile: { data, steps, currentStep },
      loading,
      form: { getFieldDecorator },
    } = this.props;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="名称">{data.fName}</Description>
        <Description term="编码">{data.fNumber}</Description>
        <Description term="创建人">{data.fCreatorName}</Description>
        <Description term="创建时间">
          {data.fCreateDate ? moment(data.fCreateDate).format('YYYY-MM-DD HH:mm:ss') : ''}
        </Description>
        <Description term="备注">{data.fComments}</Description>
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
          {data.fStatusNumber === 'Created' && <Button onClick={() => this.check()}>审批</Button>}
          {data.fStatusNumber === 'Checked' && (
            <Button onClick={() => this.check(false)}>反审批</Button>
          )}
          {/* <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
        </ButtonGroup>
        <Button type="primary" onClick={() => this.save()}>
          保存
        </Button>
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
      <div>
        <WgPageHeaderWrapper
          title={data.fName}
          logo={
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
          }
          action={action}
          content={description}
          extraContent={extra}
          // tabList={tabList}
          wrapperClassName={styles.advancedForm}
          loading={loading}
        />
        <Layout style={{ backgroundColor: '#ffffff', margin: '24px 0' }}>
          <Sider style={{ backgroundColor: '#ffffff' }}>
            <Card bordered={false}>
              <RouteSteps loading={loading} steps={steps} currentStep={currentStep} />
            </Card>
          </Sider>
          {steps && steps[currentStep] && (
            <Content>
              <GridContent style={{ marginLeft: '10px' }}>
                <Card title="操作" bordered>
                  <div className="steps-action" style={{ margin: '10px' }}>
                    <Button type="primary" onClick={() => this.nextStep()}>
                      下一步
                    </Button>
                    {currentStep > 0 && (
                      <Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}>
                        上一步
                      </Button>
                    )}
                    {currentStep > 0 && (
                      <Button
                        type="danger"
                        style={{ marginLeft: 8 }}
                        onClick={() => this.deleteStep()}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                </Card>
                <div>
                  <Card title={`第 ${currentStep + 1} 步`} bordered>
                    <DeptForm
                      loading={loading}
                      route={data}
                      depts={steps[currentStep].depts}
                      currentStep={currentStep}
                    />
                  </Card>
                </div>
              </GridContent>
            </Content>
          )}
        </Layout>
      </div>
    );
  }
}

export default TableList;
