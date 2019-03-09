import React, { PureComponent, Fragment } from 'react';
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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';
import { DeptForm } from './DeptForm';

import styles from './List.less';


// const FormItem = Form.Item;
// const { Option } = Select;
const {
  Header, Footer, Sider, Content,
} = Layout;
const Step = Steps.Step;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;


/* eslint react/no-multi-comp:0 */
@connect(({ routeProfile, loading, menu, }) => ({
  routeProfile,
  loading: loading.models.routeManage,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
  };

  close () {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/techStd/route/profile' },
    });
  }

  nextStep () {
    const { dispatch, } = this.props;
    dispatch({
      type: 'routeProfile/nextStep',
    });
  }

  prevStep () {
    const { dispatch, } = this.props;
    dispatch({
      type: 'routeProfile/prevStep',
    });
  }

  deleteStep () {
    const { dispatch, } = this.props;
    dispatch({
      type: 'routeProfile/deleteStep',
    });
  }

  render () {
    const {
      routeProfile: { steps, currentStep, },
      data,
      loading,
      form: { getFieldDecorator },
    } = this.props;
    console.log(steps);

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="名称">{data.fName}</Description>
        <Description term="编码">{data.fNumber}</Description>
        <Description term="创建时间">{data.fCreateDate}</Description>
        <Description term="备注">{data.fComments}</Description>
      </DescriptionList>
    );
    const menu = (
      <Menu>
        <Menu.Item key="1">选项一</Menu.Item>
        <Menu.Item key="2">选项二</Menu.Item>
        <Menu.Item key="3">选项三</Menu.Item>
      </Menu>
    );

    const action = (
      <Fragment>
        <ButtonGroup>
          <Button>操作</Button>
          <Button>操作</Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        </ButtonGroup>
        <Button type="primary">保存</Button>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>待审批</div>
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
        />
        <Layout style={{ backgroundColor: '#ffffff', margin: '24px 0' }}>
          <Sider style={{ backgroundColor: '#ffffff' }}>
            <Card bordered={false}>
              <Steps direction="vertical" current={currentStep}>
                {steps.map(step => <Step key={step.fGroupID} title={step.fName}
                  description={
                    <div>
                      {step.depts.map(dept => <div>{dept.fDeptName}</div>)}
                    </div>} />
                )}
              </Steps>
            </Card>
          </Sider>
          <Content>
            <GridContent style={{ marginLeft: '10px' }}>
              <Card title={'操作'} bordered={true}>
                <div className="steps-action" style={{ margin: '10px' }}>
                  <Button type="primary" onClick={() => this.nextStep()}>下一步</Button>
                  {
                    currentStep > 0
                    && <Button style={{ marginLeft: 8 }} onClick={() => this.prevStep()}>上一步</Button>
                  }
                  {
                    currentStep > 0
                    && <Button type="danger" style={{ marginLeft: 8 }} onClick={() => this.deleteStep()}>删除</Button>
                  }
                </div>
              </Card>
              <div>
                <Card title={'第 ' + (currentStep + 1) + ' 步'} bordered={true}>
                  <DeptForm depts={steps[currentStep].depts} currentStep={currentStep} />
                </Card>
              </div>
            </GridContent>
          </Content>
        </Layout>
      </div >
    );
  }
}

export default TableList;
