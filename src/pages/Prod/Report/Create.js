import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Layout,
  Row,
  Col,
  Card,
  Select,
  Form,
  Button,
  TreeSelect,
  DatePicker,
  Table,
  Input,
  InputNumber,
  message,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';
import { ScanForm } from './ScanForm';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ reportManage, reportCreate, reportScan, loading, menu, basicData }) => ({
  reportManage,
  reportCreate,
  reportScan,
  loading: loading.models.reportCreate,
  menu,
  basicData,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    scanVisible: true,
    fBillNo: '',
    fComments: '',
    details: [],
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(preProps) {}

  loadData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Report' },
    });
    dispatch({
      type: 'reportManage/fetchGroupBy',
    });
  }

  handleDetailRowChange({ fEntryID }, field, value) {
    const { details } = this.state;
    const findItem = details.find(x => x.fEntryID === fEntryID);
    findItem[field] = value;
    this.setState({ details });
  }

  handleDeleteRow(record) {
    const { fDefectInvID } = record;
    const { details } = this.state;
    this.setState({ details: details.filter(x => x.fDefectInvID !== fDefectInvID) });
  }

  showScan(flag) {
    this.setState({
      scanVisible: !!flag,
    });
  }

  handleScan = batchNo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportScan/scan',
      payload: {
        batchNo,
      },
    }).then(() => this.afterScan(batchNo));
  };

  afterScan = batchNo => {
    const {
      reportScan: { data },
    } = this.props;
    if (!data) {
      message.error(`未找到流程单【${batchNo}】.`);
    } else {
      const { fStatusNumber } = data;
      // 判断是否可签收
      if (fStatusNumber !== 'EndProduce') {
        message.info('当前流程单不可汇报.');
      } else {
        const { details } = this.state;
        if (!details.find(x => x.fInterID === data.fInterID)) {
          details.push(data);
          this.setState({ details });
        } else {
          message.info('重复扫描.');
        }
      }
    }
  };

  save(bCheck) {
    const { form, dispatch, handleSuccess } = this.props;
    const { details } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      const payload = {
        fGroupBy: fieldsValue.fGroupBy,
        fComments: fieldsValue.fComments,
        details,
      };

      dispatch({
        type: 'reportCreate/add',
        payload,
      }).then(() => {
        const {
          reportCreate: { queryResult },
        } = this.props;
        const { model } = queryResult;

        this.showResult(queryResult, () => {
          message.success(`新建汇报单成功.单号：${model.fBillNo}`);
          if (bCheck) {
            dispatch({
              type: 'reportManage/check',
              payload: { fInterID: model.fInterID },
            }).then(() => {
              const checkResult = this.props.reportManage.queryResult;
              this.showResult(checkResult, () => {
                message.success(`【${model.fBillNo}】` + `审核成功`);
              });
            });
          }
          this.close();
          // 成功后再次刷新列表
          if (handleSuccess) handleSuccess();
        });
      });
    });
  }

  showResult(queryResult, successCallback) {
    const { status, message, model } = queryResult;

    if (status === 'ok') {
      if (successCallback) successCallback(model);
      else {
        message.success(message);
      }
    } else if (status === 'warning') {
      message.warning(message);
    } else {
      message.error(message);
    }
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/report/create' },
    });
  }

  render() {
    const {
      dispatch,
      basicData: { billNo, processDeptTree },
      loading,
      form: { getFieldDecorator },
      reportManage: { groupBys },
    } = this.props;

    const { fComments, details } = this.state;

    const action = (
      <Fragment>
        <ButtonGroup>
          <Button icon="scan" onClickCapture={() => this.showScan(true)}>
            扫码
          </Button>
          <Button type="primary" onClickCapture={() => this.save()}>
            保存
          </Button>
          <Button onClickCapture={() => this.save(true)}>审核</Button>
          {/* <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
        </ButtonGroup>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const columns = [
      {
        title: '批号',
        dataIndex: 'fFullBatchNo',
      },
      {
        title: '产品',
        dataIndex: 'fProductName',
      },
      {
        title: '产品编码',
        dataIndex: 'fProductNumber',
      },
      {
        title: '规格型号',
        dataIndex: 'fProductModel',
      },
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '数量',
        dataIndex: 'fCurrentPassQty',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
        render: (val, record) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`fRowComments_${record.fInterID}`, {
              initialValue: record.fRowComments,
            })(
              <Input
                onChange={e => {
                  const { value } = e.target;
                  this.handleDetailRowChange(record, 'fRowComments', value);
                }}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleDeleteRow(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <WgPageHeaderWrapper
        title={`流程单汇报：${billNo.Report}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        // content={description}
        // extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="基础信息" style={{ marginBottom: 24 }} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem key="fGroupBy" label="汇报明细分组">
                  {getFieldDecorator('fGroupBy', {
                    rules: [{ required: true, message: '请选择分组' }],
                  })(
                    <Select placeholder="请选择分组">
                      {groupBys &&
                        groupBys.map(x => (
                          <Option key={x.fKey} value={x.fKey}>
                            {x.fValue}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="明细信息" style={{ marginBottom: 24 }} bordered={false}>
          <Table rowKey="fEntryID" loading={loading} columns={columns} dataSource={details} />
        </Card>
        <Card title="备注信息" bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                {getFieldDecorator('fComments', {})(
                  <TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />
                )}
              </Col>
            </Row>
          </Form>
        </Card>
        <ScanForm
          dispatch
          handleModalVisible={flag => this.showScan(flag)}
          modalVisible={this.state.scanVisible}
          handleScan={this.handleScan}
        />
      </WgPageHeaderWrapper>
    );
  }
}

export default Create;
