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
  Tag,
} from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import { getTimeDiff } from '@/utils/utils';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';

import styles from './List.less';

const { Description } = DescriptionList;

/* eslint react/no-multi-comp:0 */
@connect(({ flowProfile, basicData, loading, menu }) => ({
  flowProfile,
  basicData,
  loading: loading.models.flowProfile,
  menu,
}))
@Form.create()
class Profile extends PureComponent {
  state = {
    fBeginDate: '',
    fTransferDateTime: '',
  };

  componentDidMount() {
    // ReactDOM.findDOMNode(this.refs.select).click();
    const {
      data: { fInterID },
    } = this.props;
    this.loadData(fInterID);
  }

  componentDidUpdate(preProps) {
    const {
      data: { fInterID },
    } = this.props;
    if (fInterID !== preProps.data.fInterID) {
      this.loadData(fInterID);
    }
  }

  loadData(fInterID) {
    const { dispatch } = this.props;

    dispatch({
      type: 'flowProfile/initModel',
      payload: { fInterID },
    });
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/flow/profile' },
    });
  }

  renderDescription = () => {
    const {
      flowProfile: {
        data: {
          defectList,
          paramList,
          fMoBillNo,
          fSoBillNo,
          fProductNumber,
          fProductName,
          fModel,
          fUnitName,
          fInputQty,
          fCurrentPassQty,
          fTotalInvCheckDeltaQty,
          fTotalTakeQty,
          fTotalDefectQty,
          fStatusName,
          fDeptName,
          fFullBatchNo,
          fOperatorName,
          fOperatorNumber,
          fDebuggerName,
          fDebuggerNumber,
          fMachineName,
          fMachineNumber,
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
          fNextRecords,
          fAutoSign,
          fSignUserName,
          fSignDate,
          fWorkShopName,
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
          <Description term="车间">{fWorkShopName}</Description>

          <Description term="投入数量">
            {`${numeral(fInputQty).format(fQtyFormat)} ${fUnitName}`}
          </Description>
          <Description term="合格数量">
            {`${numeral(fCurrentPassQty).format(fQtyFormat)} ${fUnitName}`}
          </Description>
          <Description term="总盘点盈亏数量">
            {`${numeral(fTotalInvCheckDeltaQty).format(fQtyFormat)} ${fUnitName}`}
          </Description>
          <Description term="总取走数量">{`${numeral(fTotalTakeQty).format(
            fQtyFormat
          )} ${fUnitName}`}
          </Description>
          <Description term="总不良数量">
            {`${numeral(fTotalDefectQty).format(fQtyFormat)} ${fUnitName}`}
          </Description>
        </DescriptionList>
      </div>
    );
  };

  render() {
    const {
      flowProfile: { data },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const {
      fCurrentDeptName,
      fFullBatchNo,
      fCurrentPassQty,
      fCurrentRecordStatusName,
      fCurrentDeptNumber,
      fCurrentRecordStatusColor,
      fInputQty,
      fStatusName,
      defectList,
      paramList,
      fOperatorName,
      fOperatorNumber,
      fDebuggerName,
      fDebuggerNumber,
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
            {`${numeral((fCurrentPassQty * 100) / fInputQty).format('0.00')}%`}
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{fStatusName}</div>
        </Col>
      </Row>
    );

    return (
      <WgPageHeaderWrapper
        title={`流程单详情：${fFullBatchNo}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        content={this.renderDescription()}
        extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="在制岗位信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList className={styles.headerList} size="small" col="4">
            <Description term="在制岗位">{fCurrentDeptName}</Description>
            <Description term="在制岗位编码">{fCurrentDeptNumber}</Description>
            <Description term="状态">
              {fCurrentDeptName ? (
                <span style={{ color: fCurrentRecordStatusColor }}>{fCurrentRecordStatusName}</span>
              ) : (
                ''
              )}
            </Description>
            {/* <Description term="操作员">{fOperatorName}</Description>
            <Description term="操作员编码">{fOperatorNumber}</Description>
            <Description term="机台">{fMachineName}</Description>
            <Description term="调机员">{fDebuggerName}</Description>
            <Description term="调机员编码">{fDebuggerNumber}</Description>
            <Description term="机台编码">{fMachineNumber}</Description>
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
            <Description term="班次编码">{fWorkTimeNumber}</Description> */}
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
                <Description key={`${d.ParamID}${d.fValue}`} term={d.fParamName}>
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

export default Profile;
