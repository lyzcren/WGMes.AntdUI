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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { UpdateForm } from './UpdateForm';
import { CreateForm } from './CreateForm';
import { default as ColumnConfig } from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';


const FormItem = Form.Item;
const { Option } = Select;
const {
  Header, Footer, Sider, Content,
} = Layout;
const Step = Steps.Step;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;


/* eslint react/no-multi-comp:0 */
@connect(({ routeManage, loading }) => ({
  routeManage,
  loading: loading.models.routeManage,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: {},
  };

  render () {
    console.log(this.props);
    const {
      routeManage,
      data,
      loading,
    } = this.props;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        {/* <Description term="名称">{data.fName}</Description> */}
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
        <Button type="primary">主操作</Button>
      </Fragment>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>待审批</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>订单金额</div>
          <div className={styles.heading}>¥ 568.08</div>
        </Col>
      </Row>
    );

    return (
      <Layout>
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
        >
        </WgPageHeaderWrapper>

        <Content style={{ margin: '24px 0' }}>
          <Layout style={{ backgroundColor: '#ffffff' }}>
            <Sider>
              <GridContent>
                <Card bordered={false}>
                  <Steps direction="vertical" current={1}>
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                  </Steps>
                </Card>
              </GridContent>
            </Sider>
            <Content>
              <GridContent>
                <Card bordered={false}>
                  <Steps direction="vertical" current={1}>
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                    <Step title="Finished" description="This is a description." />
                    <Step title="In Progress" description="This is a description." />
                    <Step title="Waiting" description="This is a description." />
                  </Steps>
                </Card>
              </GridContent>
            </Content>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default TableList;
