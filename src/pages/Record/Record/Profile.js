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
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
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
    const { dispatch } = this.props;

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

  renderDescription = () => {
    const {
      recordProfile: {
        data: {
          defectList,
          paramList,
          fMoBillNo,
          fSoBillNo,
          fProductNumber,
          fProductName,
          fModel,
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
          fQtyDecimal,
          fQtyFormat,
          fConvertDecimal,
          fConvertUnitID,
          fConvertUnitName,
          fConvertInputQty,
          fConvertPassQty,
          fConvertQtyFormat,
          fMesSelf001,
          fMesSelf002,
          fMesSelf003,
        },
      },
    } = this.props;

    return (
      <div style={{ display: 'flex' }}>
        {fFullBatchNo && (
          <QRCode
            style={{ flex: 'auto', marginRight: '20px' }}
            value={fFullBatchNo}
            // size={200}
            fgColor="#000000"
          />
        )}
        <DescriptionList className={styles.headerList} size="small" col="3">
          <Description term="流程单号">{fFullBatchNo}</Description>
          <Description term="任务单号">{fMoBillNo}</Description>
          <Description term="订单号">{fSoBillNo}</Description>

          <Description term="产品编码">{fProductNumber}</Description>
          <Description term="产品名称">{fProductName}</Description>
          <Description term="规格型号">{fModel}</Description>

          <Description term="父件型号">{fMesSelf002}</Description>
          <Description term="底色编号">{fMesSelf001}</Description>
          <Description term="内部订单号">{fMesSelf003}</Description>

          <Description term="流程单数量">{numeral(fFlowInputQty).format(fQtyFormat)}</Description>
          <Description term="投入数量">
            {numeral(fInputQty).format(fQtyFormat)}
            {fConvertUnitName ? (
              <a>
                （{`${numeral(fConvertInputQty).format(fConvertQtyFormat)} ${fConvertUnitName}`}）
              </a>
            ) : null}
          </Description>
          <Description term="合格数量">
            {numeral(fPassQty).format(fQtyFormat)}
            {fConvertUnitName ? (
              <a>
                （{`${numeral(fConvertPassQty).format(fConvertQtyFormat)} ${fConvertUnitName}`}）
              </a>
            ) : null}
          </Description>
          <Description term="盘点盈亏数量">
            {numeral(fInvCheckDeltaQty).format(fQtyFormat)}
          </Description>
          <Description term="取走数量">{numeral(fTakeQty).format(fQtyFormat)}</Description>
        </DescriptionList>
      </div>
    );
  };

  render() {
    const {
      recordProfile: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const {
      fFullBatchNo,
      fPassQty,
      fInputQty,
      fDeptName,
      defectList,
      paramList,
      fOperatorName,
      fOperatorNumber,
      fMachineName,
      fMachineNumber,
      fSignDate,
      fBeginDate,
      fTransferDateTime,
      fWorkTimeName,
      fWorkTimeNumber,
      fQtyDecimal,
      fConvertDecimal,
      fQtyFormat,
    } = data;

    const action = (
      <Fragment>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const extra = (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>良率</div>
          <div className={styles.heading}>
            {`${numeral((fPassQty * 100) / fInputQty).format('0.00')}%`}
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
        title={`生产记录：${fFullBatchNo}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={this.renderDescription()}
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
              {fSignDate ? moment(fSignDate).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Description>
            <Description term="开始生产时间">
              {fBeginDate ? moment(fBeginDate).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Description>
            <Description term="结束生产时间">
              {fTransferDateTime ? moment(fTransferDateTime).format('YYYY-MM-DD HH:mm:ss') : ''}
            </Description>
            <Description term="生产时长">
              {fBeginDate && fTransferDateTime
                ? getTimeDiff(new Date(fBeginDate), new Date(fTransferDateTime))
                : ''}
            </Description>
            <Description term="班次">{fWorkTimeName}</Description>
            <Description term="班次编码">{fWorkTimeNumber}</Description>
          </DescriptionList>
        </Card>
        {defectList && defectList.length > 0 && (
          <Card title="不良" style={{ marginBottom: 24 }} bordered={false}>
            <DescriptionList className={styles.headerList} size="small" col="3">
              {defectList.map((d, i) => (
                <Description key={d.fDefectName} term={d.fDefectName}>
                  {numeral(d.fQty).format(fQtyFormat)}
                </Description>
              ))}
            </DescriptionList>
          </Card>
        )}
        {paramList && paramList.length > 0 && (
          <Card title="工艺参数" style={{ marginBottom: 24 }} bordered={false}>
            <DescriptionList className={styles.headerList} size="small" col="3">
              {paramList.map((d, i) => (
                <Description key={d.fParamName} term={d.fParamName}>
                  {d.fValue}
                </Description>
              ))}
            </DescriptionList>
          </Card>
        )}
      </WgPageHeaderWrapper>
    );
  }
}

export default Transfer;
