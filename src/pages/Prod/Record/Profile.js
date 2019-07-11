import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'dva';
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Menu,
  InputNumber,
  DatePicker,
} from 'antd';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import { getTimeDiff } from '@/utils/utils';

import styles from './List.less';

const FormItem = Form.Item;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker;

/* eslint react/no-multi-comp:0 */
@connect(({ recordProfile, basicData, loading, menu }) => ({
  recordProfile,
  basicData,
  loading: loading.models.recordProfile,
  menu,
}))
@Form.create()
class Transfer extends PureComponent {
  state = {
    fBeginDate: '',
    fTransferDateTime: '',
    // qtyDecimal: 4,
    // qtyFormat: '0.0000'
    qtyDecimal: 0,
    qtyFormat: '0',
  };

  componentDidMount() {
    // ReactDOM.findDOMNode(this.refs.select).click();
    const {
      data: { fInterID, fCurrentDeptID },
    } = this.props;
    this.loadData(fInterID, fCurrentDeptID);
  }

  componentDidUpdate(preProps) {
    const {
      data: { fInterID, fCurrentDeptID },
    } = this.props;
    if (fInterID !== preProps.data.fInterID) {
      this.loadData(fInterID, fCurrentDeptID);
    }
  }

  loadData(fInterID) {
    const { dispatch, fQtyDecimal } = this.props;
    const qtyDecimal = fQtyDecimal ? fQtyDecimal : 0;

    // 根据单位的小数位数配置相关数量的小数位
    const qtyDecimalPart = '00000000'.slice(0, qtyDecimal);
    this.setState({ qtyDecimal, qtyFormat: `0.${qtyDecimalPart}` });

    dispatch({
      type: 'recordProfile/initModel',
      payload: { fInterID },
    });
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/record/profile' },
    });
  }

  render() {
    const {
      recordProfile: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const {
      defectList,
      paramList,
      fMoBillNo,
      fSoBillNo,
      fProductNumber,
      fProductName,
      fModel,
      fParentModel,
      fUnitName,
      fFlowInputQty,
      fInputQty,
      fPassQty,
      fInvCheckDeltaQty,
      fTakeQty,
      fStatusName,
      fDeptName,
      fFullBatchNo,
      fOperatorName,
      fMachineName,
      fSignDate,
      fBeginDate,
      fTransferDateTime,
    } = data;
    const { qtyFormat, qtyDecimal } = this.state;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description term="任务单号">{fMoBillNo}</Description>
        <Description term="订单号">{fSoBillNo}</Description>
        <Description term="产品编码">{fProductNumber}</Description>
        <Description term="产品名称">{fProductName}</Description>
        <Description term="规格型号">{fModel}</Description>
        <Description term="父件型号">{fParentModel}</Description>
        <Description term="单位">{fUnitName}</Description>
        <Description term="流程单数量">{numeral(fFlowInputQty).format(qtyFormat)}</Description>
        <Description term="投入数量">{numeral(fInputQty).format(qtyFormat)}</Description>
        <Description term="合格数量">{numeral(fPassQty).format(qtyFormat)}</Description>
        <Description term="盘点盈亏数量">
          {numeral(fInvCheckDeltaQty).format(qtyFormat)}
        </Description>
        <Description term="取走数量">{numeral(fTakeQty).format(qtyFormat)}</Description>
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
          {/* <Button type="primary" onClickCapture={() => this.transfer()}>
            转序
          </Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
        </ButtonGroup>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>良率</div>
          <div className={styles.heading}>
            {numeral((fPassQty * 100) / fInputQty).format('0.00') + '%'}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>工序</div>
          <div className={styles.heading}>{fDeptName}</div>
        </Col>
      </Row>
    );

    return (
      <WgPageHeaderWrapper
        title={'生产记录：' + fFullBatchNo}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={description}
        extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem key="fOperatorName" label="操作员">
                  {getFieldDecorator('fOperatorName', {
                    initialValue: fOperatorName,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fMachineNumber" label="机台">
                  {getFieldDecorator('fMachineNumber', {
                    initialValue: fMachineName,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              {/* <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fMoldID" label="模具">
                  {getFieldDecorator('fMoldID', {})(<Input readOnly placeholder="请输入" />)}
                </FormItem>
              </Col> */}
            </Row>
          </Form>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem key="fSignDate" label="签收时间">
                  {getFieldDecorator('fSignDate', {
                    initialValue: moment(fSignDate),
                  })(<DatePicker readOnly disabled format="YYYY-MM-DD HH:mm:ss" />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fBeginDate" label="生产时间">
                  {getFieldDecorator('fBeginDate', {
                    initialValue: [moment(fBeginDate), moment(fTransferDateTime)],
                  })(
                    <RangePicker
                      readOnly
                      disabled
                      showTime={{ format: 'HH:mm' }}
                      format="YYYY-MM-DD HH:mm"
                      placeholder={['开工时间', '完工时间']}
                    />
                  )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fDuration" label="生产时长">
                  {getFieldDecorator('fDuration', {
                    initialValue: getTimeDiff(new Date(fBeginDate), new Date(fTransferDateTime)),
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {defectList && (
          <Card title="不良" style={{ marginBottom: 24 }} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                {defectList.map((d, i) => (
                  <Col
                    key={'detailDefectCol' + i}
                    xl={i % 3 === 0 ? {} : { span: 6, offset: 2 }}
                    lg={i % 3 === 0 ? 6 : { span: 8 }}
                    md={12}
                    sm={24}
                  >
                    <FormItem key={'detailDefectID' + d.fDefectID} label={d.fDefectName}>
                      {getFieldDecorator('detailDefectID' + d.fDefectID, {
                        initialValue: d.fQty,
                      })(
                        <InputNumber
                          readOnly
                          style={{ width: '100%' }}
                          placeholder="请输入数量"
                          min={Math.pow(0.1, qtyDecimal)}
                          step={Math.pow(0.1, qtyDecimal)}
                          qtyDecimal={qtyDecimal}
                        />
                      )}
                    </FormItem>
                  </Col>
                ))}
              </Row>
            </Form>
          </Card>
        )}
        {paramList && (
          <Card title="工艺参数" style={{ marginBottom: 24 }} bordered={false}>
            <Form layout="vertical">
              <Row gutter={16}>
                {paramList.map((d, i) => (
                  <Col
                    key={'paramsCol' + i}
                    xl={i % 3 === 0 ? {} : { span: 6, offset: 2 }}
                    lg={i % 3 === 0 ? 6 : { span: 8 }}
                    md={12}
                    sm={24}
                  >
                    <FormItem key={'paramsID' + d.fParamID} label={d.fParamName}>
                      {getFieldDecorator('paramsID' + d.fParamID, {
                        initialValue: d.fValue,
                      })(<Input readOnly />)}
                    </FormItem>
                  </Col>
                ))}
              </Row>
            </Form>
          </Card>
        )}
      </WgPageHeaderWrapper>
    );
  }
}

export default Transfer;
