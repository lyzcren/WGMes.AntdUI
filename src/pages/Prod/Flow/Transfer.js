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
import { NumericInput } from '@/components/WgInputNumber';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

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
      type: 'flowTransfer/initModel',
      payload: { fInterID },
    }).then(() => {
      const {
        flowTransfer: {
          data: { fRouteID, fRouteEntryID, fDeptID },
        },
      } = this.props;
      dispatch({
        type: 'flowTransfer/getParams',
        payload: { fInterID: fRouteID, fEntryID: fRouteEntryID },
      });
      dispatch({
        type: 'flowTransfer/getMachineData',
        payload: { fDeptID },
      });
      dispatch({
        type: 'flowTransfer/getDefect',
        payload: { fDeptID },
      });
    });
    dispatch({
      type: 'basicData/getDefectData',
    });
    dispatch({
      type: 'basicData/getOperator',
    });
  }

  transfer() {
    const {
      form,
      dispatch,
      flowTransfer: { data },
      successCallback,
    } = this.props;
    const { fBeginDate, fTransferDateTime } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      data.fOperatorID = fieldsValue.fOperatorID;
      data.fMachineID = fieldsValue.fMachineID;
      data.fMoldID = fieldsValue.fMoldID;
      data.fBeginDate = fBeginDate ? fBeginDate.format('YYYY-MM-DD HH:mm:ss') : undefined;
      data.fTransferDateTime = fTransferDateTime
        ? fTransferDateTime.format('YYYY-MM-DD HH:mm:ss')
        : undefined;
      data.defects = [];
      data.params = [];
      for (let key in fieldsValue) {
        if (key.indexOf('detailDefectID') === 0 && fieldsValue[key]) {
          data.defects.push({
            fDefectID: key.replace('detailDefectID', ''),
            fValue: fieldsValue[key],
          });
        } else if (key.indexOf('paramsID') === 0) {
          data.params.push({ fParamID: key.replace('paramsID', ''), fValue: fieldsValue[key] });
        }
      }

      dispatch({
        type: 'flowTransfer/transfer',
        payload: { ...data },
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
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/flow/transfer' },
    });
  }

  handleFieldChange(fValue, fDefectID) {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowTransfer/changeDefect',
      payload: { fDefectID, fValue },
    }).then(() => {
      const { flowTransfer } = this.props;
      // console.log(flowTransfer);
    });
  }

  // handleOtherDefectChange (value) {
  //   value = value.replace(/\.$/g, '');
  //   this.setState({ moreDefectValue: value });
  //   const { form, dispatch } = this.props;
  //   const fieldsValue = form.getFieldsValue();
  //   dispatch({
  //     type: 'flowTransfer/changeDefect',
  //     payload: { fDefectID: fieldsValue.fOtherDefectID, fValue: value },
  //   }).then(() => {
  //     const { flowTransfer } = this.props;
  //     // console.log(flowTransfer);
  //   });
  // }

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
    }).then(() => {
      const { flowTransfer } = this.props;
      // console.log(flowTransfer);
    });
  }

  handleShowMoreDefect = () => {
    const { showMoreDefect } = this.state;
    this.setState({ showMoreDefect: !showMoreDefect });
  };

  disabledDate = (date, fSignDate) => {
    return date < moment(fSignDate) || date >= moment();
  };

  handleChangeDate = value => {
    console.log(
      'onOK: ',
      value[0].format('YYYY-MM-DD HH:mm:ss'),
      '--',
      value[1].format('YYYY-MM-DD HH:mm:ss')
    );
    this.setState({ fBeginDate: value[0], fTransferDateTime: value[1] });
  };

  render() {
    const {
      flowTransfer: { data, machineData, defectList, paramList },
      loading,
      form: { getFieldDecorator },
      basicData: { defectData, operators },
      fBindEmpID,
    } = this.props;
    const { showMoreDefect, moreDefectValue, qtyFormat, qtyDecimal } = this.state;

    const description = (
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description term="任务单号">{data.fMoBillNo}</Description>
        <Description term="订单号">{data.fSoBillNo}</Description>
        <Description term="产品编码">{data.fProductNumber}</Description>
        <Description term="产品名称">{data.fProductName}</Description>
        <Description term="规格型号">{data.fModel}</Description>
        <Description term="父件型号">{data.fParentModel}</Description>
        <Description term="单位">{data.fUnitName}</Description>
        <Description term="流程单数量">{numeral(data.fFlowInputQty).format(qtyFormat)}</Description>
        <Description term="投入数量">{numeral(data.fInputQty).format(qtyFormat)}</Description>
        <Description term="合格数量">{numeral(data.fPassQty).format(qtyFormat)}</Description>
        <Description term="盘点盈亏数量">
          {numeral(data.fInvCheckDeltaQty).format(qtyFormat)}
        </Description>
        <Description term="取走数量">{numeral(data.fTakeQty).format(qtyFormat)}</Description>
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
          <Button type="primary" onClickCapture={() => this.transfer()}>
            转序
          </Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
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
        title={'流程单：' + data.fFullBatchNo}
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
                <FormItem key="fOperatorID" label="操作员">
                  {getFieldDecorator('fOperatorID', {
                    rules: [{ required: true, message: '请选择操作员' }],
                    initialValue: fBindEmpID,
                  })(
                    <Select
                      placeholder="请选择操作员"
                      autoFocus
                      showSearch
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {operators &&
                        operators.map(x => (
                          <Option key={x.fItemID} value={x.fItemID}>
                            {x.fName + ' - ' + x.fNumber}
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
                            {x.fName + ' - ' + x.fNumber}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fMoldID" label="模具">
                  {getFieldDecorator('fMoldID', {
                    rules: [{ required: false, message: '请选择模具' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
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
                      disabledDate={value => {
                        return this.disabledDate(value, data.fSignDate);
                      }}
                      onOk={this.handleChangeDate}
                    />
                  )}
                </FormItem>
              </Col>
              {/* <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fBeginDate" label="开工时间">
                  {getFieldDecorator('fBeginDate', {
                    rules: [{ required: true, message: '请选择开工时间' }],
                    initialValue: moment(data.fSignDate)
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fTransferDate" label="转序时间">
                  {getFieldDecorator('fTransferDate', {
                    rules: [{ required: true, message: '请选择转序时间' }],
                    initialValue: moment()
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </FormItem>
              </Col> */}
            </Row>
          </Form>
        </Card>
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
                  <FormItem key={'detailDefectID' + d.fItemID} label={d.fName}>
                    {getFieldDecorator('detailDefectID' + d.fItemID, {
                      rules: [{ required: false, message: '' }],
                      initialValue: d.fValue,
                    })(
                      <InputNumber
                        onChange={val => this.handleFieldChange(val, d.fItemID)}
                        style={{ width: '100%' }}
                        placeholder="请输入数量"
                        min={Math.pow(0.1, qtyDecimal)}
                        step={Math.pow(0.1, qtyDecimal)}
                        precision={qtyDecimal}
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
                              {x.fName + ' - ' + x.fNumber}
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
                        title={'按回车确认添加'}
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
                  key={'paramsCol' + i}
                  xl={i % 3 === 0 ? {} : { span: 6, offset: 2 }}
                  lg={i % 3 === 0 ? 6 : { span: 8 }}
                  md={12}
                  sm={24}
                >
                  <FormItem key={'paramsID' + d.fParamID} label={d.fParamName}>
                    {getFieldDecorator('paramsID' + d.fParamID, {
                      rules: [{ required: false, message: '' }],
                      initialValue: d.fDefaultValue,
                    })(
                      <Select
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
    );
  }
}

export default Transfer;
