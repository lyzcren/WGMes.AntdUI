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
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
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
  loadingDetail: loading.effects['reportCreate/scan'],
  menu,
  basicData,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    scanVisible: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Report' },
    });
    dispatch({
      type: 'reportCreate/init',
    });
  }

  componentDidUpdate(preProps) {}

  handleDetailRowChange({ fEntryID }, field, value) {
    const {
      dispatch,
      reportCreate: { details },
    } = this.props;
    const findItem = details.find(x => x.fEntryID === fEntryID);
    findItem[field] = value;

    dispatch({
      type: 'reportCreate/changeDetails',
      payload: { details },
    });
  }

  handleDeleteRow(record) {
    const {
      dispatch,
      reportCreate: { details },
    } = this.props;
    const newDetails = details.filter(x => x.fInterID !== record.fInterID);

    dispatch({
      type: 'reportCreate/changeDetails',
      payload: { details: newDetails },
    });
  }

  showScan(flag) {
    this.setState({
      scanVisible: !!flag,
    });
  }

  handleScan = batchNo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportCreate/scan',
      payload: {
        batchNo,
      },
    }).then(result => {
      if (!result.success) {
        message.warning(result.message);
      }
    });
  };

  save(bCheck) {
    const {
      form,
      dispatch,
      handleSuccess,
      reportCreate: { details },
    } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (details.length <= 0) {
        message.warning(`未录入汇报明细，无法保存.`);
        return;
      }

      const payload = {
        fComments: fieldsValue.fComments,
        details,
      };

      dispatch({
        type: 'reportCreate/submit',
        payload,
      })
        .then(queryResult => {
          const { status, model } = queryResult;
          if (status === 'ok') {
            message.success(`新建汇报单成功.单号：${model.fBillNo}`);
            if (bCheck) {
              return dispatch({
                type: 'reportManage/check',
                payload: { fInterID: model.fInterID },
              });
            }
          } else {
            this.showResult(queryResult);
          }
        })
        .then(queryResult => {
          if (!queryResult) return;
          const { status, model } = queryResult;
          if (status === 'ok') {
            message.success(`审核成功`);
          } else {
            this.showResult(queryResult);
          }
        })
        .then(() => {
          this.close();
          // 成功后再次刷新列表
          if (handleSuccess) handleSuccess();
        });
    });
  }

  showResult(queryResult) {
    const { status, message, model } = queryResult;

    if (status === 'ok') {
      message.success(message);
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
      loadingDetail,
      form: { getFieldDecorator },
      reportCreate: { details },
    } = this.props;

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
        title: '任务单号',
        dataIndex: 'fMoBillNo',
      },
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
        title: '可汇报数量',
        dataIndex: 'fUnReportQty',
      },
      {
        title: '汇报数量',
        dataIndex: 'fReportingQty',
        render: (val, record) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`fReportingQty_${record.fInterID}`, {
              rules: [{ required: true, message: '请输入投入数量' }],
              initialValue: record.fUnReportQty,
            })(
              <InputNumber
                max={record.fUnReportQty}
                min={0}
                onChange={value => {
                  this.handleDetailRowChange(record, 'fReportingQty', value);
                }}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
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
        title={`生产任务汇报：${billNo.Report}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        // content={description}
        // extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="明细信息" style={{ marginBottom: 24 }} bordered={false}>
          <Table rowKey="fInterID" loading={loadingDetail} columns={columns} dataSource={details} />
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
          loading={loadingDetail}
        />
      </WgPageHeaderWrapper>
    );
  }
}

export default Create;
