import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
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
  DatePicker,
} from 'antd';
import NumericInput from '@/wg_components/WgInputNumber';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';
import { isArray } from 'util';
import { ViewUnitConverterForm } from './ViewUnitConverter';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker;

/* eslint react/no-multi-comp:0 */
@connect(({ flowTransfer, basicData, loading, menu, user }) => ({
  flowTransfer,
  basicData,
  loading: loading.models.flowTransfer,
  menu,
  fBindEmpID: user.currentUser.fBindEmpID,
}))
@Form.create()
class Transfer extends PureComponent {
  state = {
    showMoreDefect: false,
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
      type: 'basicData/getDefectData',
    });
    dispatch({
      type: 'basicData/getOperator',
    });
    dispatch({
      type: 'basicData/getDebuggers',
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
      newData.defects = [];
      newData.params = [];
      for (const key in fieldsValue) {
        if (key.indexOf('detailDefectID') === 0 && fieldsValue[key]) {
          newData.defects.push({
            fDefectID: key.replace('detailDefectID', ''),
            fValue: fieldsValue[key],
          });
        } else if (key.indexOf('paramsID') === 0) {
          const paramValue = isArray(fieldsValue[key]) ? fieldsValue[key] : [fieldsValue[key]];
          newData.params.push({ fParamID: key.replace('paramsID', ''), fValue: paramValue });
        }
      }

      dispatch({
        type: 'flowTransfer/transfer',
        payload: { ...newData },
      }).then(() => {
        const {
          flowTransfer: {
            queryResult: { status, message },
          },
        } = this.props;
        if (status === 'ok') {
          message.success('转序成功');
          if (successCallback) successCallback();
          this.close();
        } else if (status === 'warning') {
          message.warning(message);
        } else {
          message.error(message);
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

  handleFieldChange(fValue, fDefectID) {
    fValue = fValue || 0;
    const { dispatch } = this.props;
    dispatch({
      type: 'flowTransfer/changeDefect',
      payload: { fDefectID, fValue },
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
          fValue: fieldsValue.fOtherDefectValue * 1.0,
        },
      }).then(() => {
        const { flowTransfer } = this.props;
        form.resetFields(['fOtherDefectValue']);
        // console.log(flowTransfer);
      });
      dispatch({
        type: 'flowTransfer/addDefect',
        payload: { fDefectID: fieldsValue.fOtherDefectID, fValue: e.target.value * 1.0 },
      }).then(() => {
        const { flowTransfer } = this.props;
        // 使其他不良下拉框获取焦点
        this.otherDefectRef.rcSelect.focus();
        this.setState({ moreDefectValue: '' });
        form.resetFields(['fOtherDefectID']);
        // console.log(flowTransfer);
      });
    }
  }

  handleParamChange(e, fParamID) {
    const fValue = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'flowTransfer/changeParam',
      payload: { fParamID, fValue },
    });
  }

  handleShowMoreDefect = () => {
    const { showMoreDefect } = this.state;
    this.setState({ showMoreDefect: !showMoreDefect });
  };

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

          <Description term="父件型号">{data.fMesSelf002}</Description>
          <Description term="底色编号">{data.fMesSelf001}</Description>
          <Description term="内部订单号">{data.fMesSelf003}</Description>

          <Description term="盘点盈亏数量">
            {`${numeral(data.fInvCheckDeltaQty).format(fQtyFormat)} ${data.fUnitName}`}
          </Description>
          <Description term="取走数量">
            {`${numeral(data.fTakeQty).format(fQtyFormat)} ${data.fUnitName}`}
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
      flowTransfer: { data, machineData, defectList, paramList, workTimes, matchConverter },
      loading,
      form: { getFieldDecorator },
      basicData: { defectData, operators, debuggers },
      fBindEmpID,
      location: { fEmpID, tabMode },
    } = this.props;

    const { showMoreDefect, moreDefectValue, unitConverterVisible } = this.state;
    const { fQtyDecimal, fConvertDecimal } = data;
    const defectQtyDecimal = fQtyDecimal;
    // 默认机台
    const defaultMachineID =
      machineData && machineData.find(x => x.fItemID === this.state.fMachineID)
        ? this.state.fMachineID
        : null;
    // 默认班次
    const defaultWorkTimeID =
      workTimes && workTimes.find(x => x.fWorkTimeID === this.state.fWorkTimeID)
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
                      initialValue: fEmpID || (fBindEmpID || null),
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
                      initialValue: [moment(data.fSignDate), moment()],
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
                    <FormItem key={`detailDefectID${d.fItemID}`} label={d.fName}>
                      {getFieldDecorator(`detailDefectID${d.fItemID}`, {
                        rules: [{ required: false, message: '' }],
                        initialValue: d.fValue,
                      })(
                        <InputNumber
                          onChange={val => this.handleFieldChange(val, d.fItemID)}
                          style={{ width: '100%' }}
                          placeholder="请输入数量"
                          min={Math.pow(0.1, defectQtyDecimal)}
                          step={Math.pow(0.1, defectQtyDecimal)}
                          precision={defectQtyDecimal}
                        />
                      )}
                    </FormItem>
                  </Col>
                ))}
              </Row>
              {showMoreDefect && (
                <Row gutter={16}>
                  <Col lg={6} md={12} sm={24}>
                    <FormItem label="其他不良">
                      {getFieldDecorator('fOtherDefectID', {
                        rules: [{ required: false, message: '请选择不良' }],
                      })(
                        <Select
                          showSearch
                          autoClearSearchValue
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="请选择不良"
                          autoFocus
                          ref={c => (this.otherDefectRef = c)}
                        >
                          {defectData
                            .filter(x => !defectList.find(y => y.fItemID === x.fItemID))
                            .map(x => (
                              <Option key={x.fItemID} value={x.fItemID}>
                                {`${x.fName} - ${x.fNumber}`}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <FormItem key="fOtherDefectValue" label="数量">
                      {getFieldDecorator('fOtherDefectValue', {
                        rules: [{ required: false, message: '请输入数量' }],
                      })(
                        <NumericInput
                          style={{ width: '100%' }}
                          placeholder="请输入数量"
                          title="按回车确认添加"
                          // value={moreDefectValue}
                          // onChange={val => this.handleOtherDefectChange(val)}
                          onPressEnter={e => this.handleOtherDefectKeyPress(e)}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              )}
            </Form>
            <Button
              style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
              type="dashed"
              onClick={this.handleShowMoreDefect}
              icon={showMoreDefect ? 'minus' : 'plus'}
            >
              {showMoreDefect ? '收起' : '更多不良'}
            </Button>
          </Card>
          <Card title="工艺参数" style={{ marginBottom: 24 }} bordered={false}>
            <Form layout="vertical">
              <Row gutter={16}>
                {paramList.map((d, i) => (
                  <Col
                    key={`paramsCol${i}`}
                    xl={i % 3 === 0 ? {} : { span: 6, offset: 2 }}
                    lg={i % 3 === 0 ? 6 : { span: 8 }}
                    md={12}
                    sm={24}
                  >
                    <FormItem key={`paramsID${d.fParamID}`} label={d.fParamName}>
                      {getFieldDecorator(`paramsID${d.fParamID}`, {
                        rules: [{ required: d.fIsRequired, message: `${d.fParamName}必填` }],
                        initialValue: d.fDefaultValue,
                      })(
                        <Select
                          mode={d.fTypeNumber === 'TagSelect' ? 'tags' : ''}
                          showSearch
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                          placeholder="请选择"
                          onChange={val => console.log(val)}
                        >
                          {d.values.map(x => (
                            <Option key={x} value={x}>
                              {x}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                ))}
              </Row>
            </Form>
          </Card>
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
