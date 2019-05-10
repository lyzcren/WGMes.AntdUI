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
  InputNumber,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';


const FormItem = Form.Item;
const { Option } = Select;
const {
  Header, Footer, Sider, Content,
} = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;


/* eslint react/no-multi-comp:0 */
@connect(({ flowTransfer, loading, menu, basicData, }) => ({
  flowTransfer,
  loading: loading.models.flowTransfer,
  menu,
  basicData,
}))
@Form.create()
class Transfer extends PureComponent {
  state = {
  };

  componentDidMount () {
    const { dispatch, data: { fInterID, fCurrentDeptID } } = this.props;
    dispatch({
      type: 'basicData/getMachineData',
      payload: { fDeptID: fCurrentDeptID }
    });
    this.loadData(fInterID);
  }

  componentDidUpdate (preProps) {
    const { dispatch, data: { fInterID } } = this.props;
    if (fInterID !== preProps.data.fInterID) {
      this.loadData(fInterID);
    }
  }

  loadData (fInterID) {
    const { dispatch, } = this.props;
    dispatch({
      type: 'flowTransfer/initModel',
      payload: { fInterID },
    });
  }

  close () {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/flow/profile' },
    });
  }

  render () {
    const {
      flowTransfer: { data, },
      loading,
      form: { getFieldDecorator },
      basicData: { machineData }
    } = this.props;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description term="任务单号">{data.fMoBillNo}</Description>
        <Description term="订单号">{data.fSoBillNo}</Description>
        <Description term="产品编码">{data.fProductNumber}</Description>
        <Description term="产品名称">{data.fProductName}</Description>
        <Description term="规格型号">{data.fModel}</Description>
        <Description term="父件型号">{data.fParentModel}</Description>
        <Description term="流程单数量">{data.fFlowInputQty}</Description>
        <Description term="投入数量">{data.fInputQty}</Description>
        <Description term="合格数量">{data.fPassQty}</Description>
      </DescriptionList>
    );

    const action = (
      <Fragment>
        <ButtonGroup>
        </ButtonGroup>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{data.fStatusName}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>工序</div>
          <div className={styles.heading}>{data.fDeptName}</div>
        </Col>
      </Row>
    );

    return (
      <WgPageHeaderWrapper
        title={"流程单：" + data.fFullBatchNo}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="机台模具" style={{ marginBottom: 24 }} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="机台">
                  {getFieldDecorator('machineId', {
                    rules: [{ required: true, message: '请选择机台' }],
                  })(
                    <Select placeholder="请选择机台" autoFocus>
                      {machineData.map(x => <Option key={x.fItemID} value={x.fItemID}>{x.fName}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="模具">
                  {getFieldDecorator('machineId', {
                    rules: [{ required: false, message: '请选择模具' }],
                  })(
                    <Select placeholder="请选择模具">
                      <Option value="xiao">AAAA</Option>
                      <Option value="mao">BBBBBBBB</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="不良" style={{ marginBottom: 24 }} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="机台">
                  {getFieldDecorator('machineId', {
                    rules: [{ required: false, message: '请选择机台' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="模具">
                  {getFieldDecorator('machineId', {
                    rules: [{ required: false, message: '请选择模具' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="仓库">
                  {getFieldDecorator('owner', {
                    rules: [{ required: false, message: '请选择管理员' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="工艺参数" style={{ marginBottom: 24 }} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="机台">
                  {getFieldDecorator('machineId', {
                    rules: [{ required: false, message: '请选择机台' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="模具">
                  {getFieldDecorator('machineId', {
                    rules: [{ required: false, message: '请选择模具' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1} />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label="仓库">
                  {getFieldDecorator('owner', {
                    rules: [{ required: false, message: '请选择管理员' }],
                  })(
                    <InputNumber
                      placeholder="请输入"
                      min={1} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </WgPageHeaderWrapper>
    );
  }
}

export default Transfer;
