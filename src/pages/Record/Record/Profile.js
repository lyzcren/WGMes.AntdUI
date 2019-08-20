import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import QRCode from 'qrcode.react';
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
    const {
      dispatch,
      data: { fQtyDecimal },
    } = this.props;
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
      payload: { path: '/record/record/profile' },
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
      fOperatorNumber,
      fMachineName,
      fMachineNumber,
      fSignDate,
      fBeginDate,
      fTransferDateTime,
      fWorkTimeName,
      fWorkTimeNumber,
    } = data;
    const { qtyFormat, qtyDecimal } = this.state;

    const description = (
      <div style={{ display: 'flex' }}>
        {data.fFullBatchNo && (
          <QRCode
            style={{ flex: 'auto', marginRight: '20px' }}
            value={data.fFullBatchNo}
            // size={200}
            fgColor="#000000"
          />
        )}
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
      </div>
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
          <div className={styles.textSecondary}>岗位</div>
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
          <DescriptionList className={styles.headerList} size="small" col="4">
            <Description term="操作员">{fOperatorName}</Description>
            <Description term="操作员编码">{fOperatorNumber}</Description>
            <Description term="机台">{fMachineName}</Description>
            <Description term="机台编码">{fMachineNumber}</Description>
            <Description term="签收时间">
              {moment(fSignDate).format('YYYY-MM-DD HH:mm:ss')}
            </Description>
            <Description term="开始生产时间">
              {moment(fBeginDate).format('YYYY-MM-DD HH:mm:ss')}
            </Description>
            <Description term="结束生产时间">
              {moment(fTransferDateTime).format('YYYY-MM-DD HH:mm:ss')}
            </Description>
            <Description term="生产时长">
              {getTimeDiff(new Date(fBeginDate), new Date(fTransferDateTime))}
            </Description>
            <Description term="班次">{fWorkTimeName}</Description>
            <Description term="班次编码">{fWorkTimeNumber}</Description>
            <Description term="流程单数量">{numeral(fFlowInputQty).format(qtyFormat)}</Description>
            <Description term="投入数量">{numeral(fInputQty).format(qtyFormat)}</Description>
            <Description term="合格数量">{numeral(fPassQty).format(qtyFormat)}</Description>
            <Description term="盘点盈亏数量">
              {numeral(fInvCheckDeltaQty).format(qtyFormat)}
            </Description>
            <Description term="取走数量">{numeral(fTakeQty).format(qtyFormat)}</Description>
          </DescriptionList>
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