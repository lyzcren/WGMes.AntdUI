import DescriptionList from '@/components/DescriptionList';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  InputNumber,
  Layout,
  message,
  Row,
  Select,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import QRCode from 'qrcode.react';
import React, { Fragment, PureComponent } from 'react';
import router from 'umi/router';
import DefectDrawer from './components/DefectDrawer';
import ParamsCard from './components/ParamsCard';
import styles from './List.less';
import { ViewUnitConverterForm } from './ViewUnitConverter';

const FormItem = Form.Item;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker;

/* eslint react/no-multi-comp:0 */
@connect(({ flowTransfer, basicData, loading, menu, user, columnManage }) => ({
  flowTransfer,
  basicData,
  loading: loading.models.flowTransfer,
  menu,
  fBindEmpID: user.currentUser.fBindEmpID,
  columnManage,
}))
@Form.create()
class Transfer extends PureComponent {
  state = {
    moreDefectValue: '',
    fBeginDate: '',
    fTransferDateTime: '',
    fMachineID: undefined,
    fWorkTimeID: undefined,
    unitConverterVisible: false,
  };

  componentDidMount() {
    // ReactDOM.findDOMNode(this.refs.select).click();
    const {
      location: {
        data: { fInterID, fCurrentDeptID },
        fMachineID,
        fWorkTimeID,
      },
    } = this.props;

    this.loadData(fInterID, fCurrentDeptID);
    this.setState({ fMachineID, fWorkTimeID });
  }

  componentDidUpdate(preProps) {
    const {
      location: {
        data: { fInterID, fCurrentDeptID },
      },
    } = this.props;
    if (fInterID !== preProps.location.data.fInterID) {
      this.loadData(fInterID, fCurrentDeptID);
    }
  }

  loadData(fInterID) {
    const { dispatch } = this.props;

    dispatch({
      type: 'flowTransfer/initModel',
      payload: { fInterID },
    });
    dispatch({
      type: 'basicData/getOperator',
    });
    dispatch({
      type: 'basicData/getDebuggers',
    });
    dispatch({
      type: 'columnManage/getFields',
    });
  }

  transfer() {
    const {
      form,
      dispatch,
      flowTransfer: { data, matchConverter },
      successCallback,
    } = this.props;
    const { fBeginDate, fTransferDateTime } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const newData = { ...data };
      newData.fOperatorID = fieldsValue.fOperatorID;
      newData.fDebuggerID = fieldsValue.fDebuggerID;
      newData.fMachineID = fieldsValue.fMachineID;
      newData.fMoldID = fieldsValue.fMoldID;
      newData.fBeginDate = fBeginDate ? fBeginDate.format('YYYY-MM-DD HH:mm:ss') : undefined;
      newData.fTransferDateTime = fTransferDateTime
        ? fTransferDateTime.format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      newData.fWorkTimeID = fieldsValue.fWorkTimeID;

      dispatch({
        type: 'flowTransfer/transfer',
        payload: { ...newData },
      }).then(queryResult => {
        const { status } = queryResult;
        if (status === 'ok') {
          message.success('转序成功');
          if (successCallback) successCallback();
          this.close();
        } else if (status === 'warning') {
          message.warning(queryResult.message);
        } else {
          message.error(queryResult.message);
        }
      });
    });
  }

  close() {
    const {
      dispatch,
      location: { tabMode },
    } = this.props;
    if (tabMode) {
      dispatch({
        type: 'menu/closeMenu',
        payload: { path: '/prod/flow/transfer' },
      });
    } else {
      router.goBack();
    }
  }

  handleOperatorChange = value => {
    const {
      basicData: { operators },
    } = this.props;
    const selectedOperator = operators.find(x => x.fItemID === value);
    if (selectedOperator && selectedOperator.fMachineID) {
      this.setState({ fMachineID: selectedOperator.fMachineID });
    }
    if (selectedOperator && selectedOperator.fWorkTimeID) {
      this.setState({ fWorkTimeID: selectedOperator.fWorkTimeID });
    }
  };

  handleFieldChange(fDefectID, fQty = 0) {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowTransfer/changeDefect',
      payload: { fDefectID, fQty: fQty ?? 0 },
    });
  }

  handleOtherDefectKeyPress(e) {
    if (e.key === 'Enter') {
      const { form, dispatch } = this.props;
      const fieldsValue = form.getFieldsValue();
      dispatch({
        type: 'flowTransfer/changeDefect',
        payload: {
          fDefectID: fieldsValue.fOtherDefectID,
          fQty: fieldsValue.fOtherDefectValue * 1.0,
        },
      }).then(() => {
        const { flowTransfer } = this.props;
        form.resetFields(['fOtherDefectValue']);
      });
      dispatch({
        type: 'flowTransfer/addDefect',
        payload: { fDefectID: fieldsValue.fOtherDefectID, fQty: e.target.value * 1.0 },
      }).then(() => {
        const { flowTransfer } = this.props;
        // 使其他不良下拉框获取焦点
        this.otherDefectRef.rcSelect.focus();
        this.setState({ moreDefectValue: '' });
        form.resetFields(['fOtherDefectID']);
      });
    }
  }

  disabledDate = (date, fSignDate) => date < moment(fSignDate) || date >= moment();

  handleChangeDate = value => {
    console.log(
      'onOK: ',
      value[0].format('YYYY-MM-DD HH:mm:ss'),
      '--',
      value[1].format('YYYY-MM-DD HH:mm:ss')
    );
    this.setState({ fBeginDate: value[0], fTransferDateTime: value[1] });
  };

  renderDescription = () => {
    const {
      flowTransfer: { data },
      columnManage: { fields },
    } = this.props;
    const { fQtyFormat, fQtyDecimal } = data;

    return (
      <div style={{ display: 'flex' }}>
        {data.fFullBatchNo && (
          <QRCode
            style={{ flex: 'auto', marginRight: '20px' }}
            value={data.fFullBatchNo}
            // size={200}
            fgColor="#000000"
          />
        )}
        <DescriptionList
          className={styles.headerList}
          size="small"
          col="3"
          style={{ flex: 'auto' }}
        >
          <Description term="流程单号">{data.fFullBatchNo}</Description>
          <Description term="任务单号">{data.fMoBillNo}</Description>
          <Description term="订单号">{data.fSoBillNo}</Description>

          <Description term="流程单数量">
            {`${numeral(data.fFlowInputQty).format(fQtyFormat)} ${data.fUnitName}`}
          </Description>
          <Description term="投入数量">
            {`${numeral(data.fInputQty).format(fQtyFormat)} ${data.fUnitName}`}
            {data.fConvertUnitName ? (
              <a onClick={() => this.handleUnitConverterVisible(true)}>
                （
                {`${numeral(data.fConvertInputQty).format(data.fConvertQtyFormat)} ${
                  data.fConvertUnitName
                  }`}
                ）
              </a>
            ) : null}
          </Description>
          <Description term="合格数量">
            {`${numeral(data.fPassQty).format(fQtyFormat)} ${data.fUnitName}`}
            {data.fConvertUnitName ? (
              <a onClick={() => this.handleUnitConverterVisible(true)}>
                （
                {`${numeral(data.fConvertPassQty).format(data.fConvertQtyFormat)} ${
                  data.fConvertUnitName
                  }`}
                ）
              </a>
            ) : null}
          </Description>

          <Description term="产品编码">{data.fProductNumber}</Description>
          <Description term="产品名称">{data.fProductName}</Description>
          <Description term="规格型号">{data.fModel}</Description>

          {fields
            .filter(f => f.fIsShow)
            .map(f => {
              // 因WebApi中属性使用大驼峰命名法，而当前项目中属性使用小驼峰命名法，故而字段名需要做转换
              const fieldName = f.fField.substring(0, 1).toLowerCase() + f.fField.substring(1);
              return (
                <Description key={f.fField} term={f.fName}>
                  {data[fieldName]}
                </Description>
              );
            })}
          {/* <Description term="父件型号">{data.fMesSelf002}</Description>
          <Description term="底色编号">{data.fMesSelf001}</Description>
          <Description term="内部订单号">{data.fMesSelf003}</Description> */}

          <Description term="盘点盈亏数量">
            {`${numeral(data.fInvCheckDeltaQty).format(fQtyFormat)} ${data.fUnitName}`}
          </Description>
          <Description term="取走数量">
            {`${numeral(data.fTakeQty).format(fQtyFormat)} ${data.fUnitName}`}
          </Description>
          <Description term="不良数量">
            {`${numeral(data.fDefectQty).format(fQtyFormat)} ${data.fUnitName}`}
          </Description>

          <Description term="签收人">
            {`${data.fAutoSign ? '自动签收' : data.fSignUserName}`}
          </Description>
          <Description term="签收日期">{`${defaultDateTimeFormat(data.fSignDate)}`}</Description>
          <Description term="下道岗位">
            {`${data.fNextRecords ? data.fNextRecords.map(rcd => rcd.fDeptName).join(', ') : ''}`}
          </Description>
        </DescriptionList>
      </div>
    );
  };

  renderExtraContent = () => {
    const {
      flowTransfer: { data },
    } = this.props;
    return (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{data.fStatusName}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>岗位</div>
          <div className={styles.heading}>{data.fDeptName}</div>
        </Col>
      </Row>
    );
  };

  handleUnitConverterVisible = flag => {
    this.setState({ unitConverterVisible: !!flag });
  };

  render() {
    const {
      flowTransfer: { data, machineData, workTimes, matchConverter },
      loading,
      form: { getFieldDecorator },
      basicData: { operators, debuggers },
      fBindEmpID,
      location: { fEmpID, tabMode },
    } = this.props;
    const { defectList } = data;

    const { moreDefectValue, unitConverterVisible } = this.state;
    const { fQtyDecimal, fConvertDecimal } = data;
    const defectQtyDecimal = fQtyDecimal;
    const defaultOperatorId = data.fOperatorID ? data.fOperatorID : fEmpID || (fBindEmpID || null);
    const defaultDebuggerId = data.fDebuggerID ? data.fDebuggerID : null;
    const beginDate = data.fBeginDate ? data.fBeginDate : data.fSignDate;
    const endDate = data.fTransferDateTime ? data.fTransferDateTime : new Date();
    // 默认机台
    const defaultMachineID = data.fMachineID
      ? data.fMachineID
      : machineData && machineData.find(x => x.fItemID === this.state.fMachineID)
        ? this.state.fMachineID
        : null;
    // 默认班次
    const defaultWorkTimeID = data.fWorkTimeID
      ? data.fWorkTimeID
      : workTimes && workTimes.find(x => x.fWorkTimeID === this.state.fWorkTimeID)
        ? this.state.fWorkTimeID
        : null;
    const currentTime = new Date();
    // 根据当前时间推算班次信息
    const currentWorkTime =
      workTimes &&
      workTimes.find(
        x =>
          moment(x.currentBeginTime) <= moment(currentTime) &&
          moment(x.currentEndTime) >= moment(currentTime)
      );
    const currentWorkTimeID = currentWorkTime ? currentWorkTime.fWorkTimeID : null;

    const action = (
      <Fragment>
        <ButtonGroup>
          <Button type="primary" loading={loading} onClickCapture={() => this.transfer()}>
            转序
          </Button>
          {/* <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
        </ButtonGroup>
        <Button onClick={() => this.close()}>{tabMode ? '关闭' : '返回'}</Button>
      </Fragment>
    );

    return (
      <div style={{ backgroundColor: 'rgb(240, 242, 245)' }}>
        <WgPageHeaderWrapper
          title={`流程单：${data.fFullBatchNo}`}
          logo={
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
          }
          action={action}
          content={this.renderDescription()}
          extraContent={this.renderExtraContent()}
          wrapperClassName={styles.advancedForm}
          loading={loading}
        >
          <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <FormItem key="fOperatorID" label="操作员">
                    {getFieldDecorator('fOperatorID', {
                      rules: [{ required: true, message: '请选择操作员' }],
                      initialValue: operators.find(x => x.fItemID === defaultOperatorId)
                        ? defaultOperatorId
                        : null,
                    })(
                      <Select
                        placeholder="请选择操作员"
                        autoFocus
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.handleOperatorChange}
                      >
                        {operators &&
                          operators.map(x => (
                            <Option key={x.fItemID} value={x.fItemID}>
                              {`${x.fName} - ${x.fNumber}`}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem key="fDebuggerID" label="调机员">
                    {getFieldDecorator('fDebuggerID', {
                      rules: [{ required: data.fRequireDebugger, message: '请选择调机员' }],
                      initialValue: defaultDebuggerId,
                    })(
                      <Select
                        placeholder="请选择调机员"
                        autoFocus
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={this.handleOperatorChange}
                      >
                        {debuggers &&
                          debuggers.map(x => (
                            <Option key={x.fItemID} value={x.fItemID}>
                              {`${x.fName} - ${x.fNumber}`}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem key="fMachineID" label="机台">
                    {getFieldDecorator('fMachineID', {
                      rules: [{ required: data.fRequireMachine, message: '请选择机台' }],
                      initialValue: defaultMachineID,
                    })(
                      <Select
                        placeholder="请选择机台"
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {machineData &&
                          machineData.map(x => (
                            <Option key={x.fItemID} value={x.fItemID}>
                              {`${x.fName} - ${x.fNumber}`}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                {/* <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fMoldID" label="模具">
                  {getFieldDecorator('fMoldID', {
                    rules: [{ required: false, message: '请选择模具' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col> */}
              </Row>
            </Form>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <FormItem key="fSignDate" label="签收时间">
                    {getFieldDecorator('fSignDate', {
                      rules: [{ required: false, message: '请选择开工时间' }],
                      initialValue: moment(data.fSignDate),
                    })(
                      <DatePicker
                        disabled
                        format="YYYY-MM-DD HH:mm:ss"
                        // disabledDate={current => current && current < data.fSignDate}
                        // disabledTime={disabledDateTime}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem key="fBeginDate" label="生产时间">
                    {getFieldDecorator('fBeginDate', {
                      rules: [{ required: true, message: '请选择生产时间' }],
                      initialValue: [moment(beginDate), moment(endDate)],
                    })(
                      <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['开工时间', '完工时间']}
                        disabledDate={value => this.disabledDate(value, data.fSignDate)}
                        onOk={this.handleChangeDate}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                  <FormItem label="班次">
                    {getFieldDecorator('fWorkTimeID', {
                      rules: [{ required: false, message: '请选择班次' }],
                      initialValue: defaultWorkTimeID || currentWorkTimeID,
                    })(
                      <Select>
                        {workTimes &&
                          workTimes.map(workTime => (
                            <Option key={workTime.fWorkTimeID} value={workTime.fWorkTimeID}>
                              {workTime.fWorkTimeName}
                            </Option>
                          ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="不良" style={{ marginBottom: 24 }} bordered={false}>
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                {defectList.map((d, i) => (
                  <Col
                    key={`detailDefectCol${i}`}
                    xl={i % 3 === 0 ? {} : { span: 6, offset: 2 }}
                    lg={i % 3 === 0 ? 6 : { span: 8 }}
                    md={12}
                    sm={24}
                  >
                    <FormItem key={`detailDefectID${d.fDefectID}`} label={d.fDefectName}>
                      {getFieldDecorator(`detailDefectID${d.fDefectID}`, {
                        rules: [{ required: false, message: '' }],
                        initialValue: d.fQty,
                      })(
                        <InputNumber
                          onChange={val => this.handleFieldChange(d.fDefectID, val)}
                          style={{ width: '100%' }}
                          placeholder="请输入数量"
                          min={0}
                          step={Math.pow(0.1, defectQtyDecimal)}
                          precision={defectQtyDecimal}
                        />
                      )}
                    </FormItem>
                  </Col>
                ))}
              </Row>
            </Form>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.handleShowMoreDefect}
              icon={'plus'}
            >
              {'更多不良'}
            </Button>
          </Card>
          <ParamsCard />
          <DefectDrawer
            refOpen={open => {
              this.handleShowMoreDefect = open;
            }}
          />
        </WgPageHeaderWrapper>
        {matchConverter && Object.keys(matchConverter).length > 0 && (
          <ViewUnitConverterForm
            modalVisible={unitConverterVisible}
            handleModalVisible={this.handleUnitConverterVisible}
            dataSource={{ ...matchConverter, fConvertRate: data.fConvertRate }}
          />
        )}
      </div>
    );
  }
}

export default Transfer;
