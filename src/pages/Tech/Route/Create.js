import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Layout, Row, Col, Card, Form, Button, message, Select, Steps, Input, Switch } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import RouteSteps from './RouteSteps';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const { Step } = Steps;
const { Description } = DescriptionList;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData, routeCreate, loading, menu }) => ({
  basicData,
  routeCreate,
  loading: loading.models.routeCreate,
  menu,
}))
@Form.create()
class Create extends PureComponent {
  static defaultProps = { location: {} };

  state = {};

  componentDidMount() {
    this.initData();
  }

  componentDidUpdate(prevProps) {
    const {
      location: { fInterID },
    } = this.props;
    const {
      location: { fInterID: prevInterID },
    } = prevProps;
    if (fInterID != prevInterID) {
      this.initData();
    }
  }

  initData = () => {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Route' },
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
    if (location && location.fInterID) {
      dispatch({
        type: 'routeCreate/initModel',
        payload: { fInterID: location.fInterID },
      });
    }
  };

  changeSteps = payload => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeCreate/changeSteps',
      payload,
    });
  };

  save() {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'routeCreate/submit',
        payload: fieldsValue,
      }).then(() => {
        const {
          routeCreate: { queryResult },
        } = this.props;
        if (queryResult.status === 'ok') {
          message.success('创建工艺路线成功');
          // 成功后关闭界面
          this.close();
        } else {
          message.warning(queryResult.message);
        }
      });
    });
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/techStd/route/create' },
    });
  }

  render() {
    const {
      routeCreate: {
        data: { fName, fComments },
        steps,
        currentStep,
      },
      loading,
      form: { getFieldDecorator },
      basicData: { billNo, processDeptTree },
    } = this.props;

    const content = (
      <Form layout="vertical">
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('fNumber', {
                rules: [{ required: true, message: '请输入编码' }],
                initialValue: billNo.Route,
              })(<Input placeholder="请输入编码" />)}
            </FormItem>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('fName', {
                rules: [{ required: true, message: '请输入名称' }],
                initialValue: fName,
              })(<Input placeholder="请输入名称" />)}
            </FormItem>
          </Col>
          <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
            <FormItem label="是否启用">
              {getFieldDecorator('fIsActive', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Switch />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    );

    const action = (
      <Fragment>
        <Button type="primary" onClick={() => this.save()}>
          保存
        </Button>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    return (
      <div>
        <WgPageHeaderWrapper
          title="新建工艺路线"
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
              <RouteSteps
                loading={loading}
                processDeptTree={processDeptTree}
                steps={steps}
                currentStep={currentStep}
                onChange={this.changeSteps}
              />
            </Card>
          </GridContent>
          <Card title="备注信息">
            <Row>
              <Col lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label="备注">
                  {getFieldDecorator('fComments', {
                    rules: [{ required: false, message: '请输入备注' }],
                    initialValue: fComments,
                  })(<TextArea rows={4} placeholder="请输入备注" />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Layout>
      </div>
    );
  }
}

export default Create;
