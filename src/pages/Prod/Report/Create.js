import DescriptionList from '@/components/DescriptionList';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Table,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import numeral from 'numeral';
import React, { Fragment, PureComponent } from 'react';
import { ChooseForm } from './components/ChooseForm';
import { ScanForm } from './components/ScanForm';
import styles from './Create.less';

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
    scanVisible: false,
    addVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Report' },
    });
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    dispatch({
      type: 'reportCreate/init',
    });
  }

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

  showAdd(flag) {
    const {
      form: { getFieldValue },
    } = this.props;
    const deptId = getFieldValue('fDeptID');
    if (!deptId) {
      message.info('请先选择岗位');
      return;
    }
    this.setState({
      addVisible: !!flag,
    });
  }

  handleScan = batchNo => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    const deptId = getFieldValue('fDeptID');
    dispatch({
      type: 'reportCreate/scan',
      payload: {
        deptId,
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
      handleChange,
      reportCreate: { details },
    } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (details.length <= 0) {
        message.warning(`未录入汇报明细，无法保存.`);
        return;
      }

      const payload = {
        ...fieldsValue,
        details,
      };

      dispatch({
        type: 'reportCreate/submit',
        payload: { ...payload, check: bCheck },
      }).then(queryResult => {
        this.showResult(queryResult);
        // 成功后再次刷新列表
        if (handleChange) handleChange();
        this.close();
      });
    });
  }

  showResult(queryResult) {
    const { status, model } = queryResult;

    if (status === 'ok') {
      message.success(queryResult.message);
    } else if (status === 'warning') {
      message.warning(queryResult.message);
    } else {
      message.error(queryResult.message);
    }
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/report/create' },
    });
  }

  handleDeptChange = value => {
    const {
      reportCreate: { details },
    } = this.props;
    if (details.length > 0) {
      Modal.confirm({
        title: '更换岗位',
        content: '更换岗位将清空明细信息，是否继续？',
        okText: '确认',
        cancelText: '取消',
        onOk: this.clearDetails,
      });
    } else if (value) {
      setTimeout(() => {
        this.showAdd(true);
      }, 100);
    }
  };

  clearDetails = () => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    dispatch({
      type: 'reportCreate/changeDetails',
      payload: { details: [] },
    });
    setTimeout(() => {
      const deptId = getFieldValue('fDeptID');
      if (deptId) {
        this.showAdd(true);
      }
    }, 100);
  };

  handleSelectRows = (rows, rowsUnSelect) => {
    const {
      dispatch,
      reportCreate: { details },
    } = this.props;
    rows.forEach(row => {
      if (!details.find(d => d.fInterID === row.fInterID)) {
        // 设置默认汇报数量为可汇报数量
        details.push({ ...row, fReportingQty: row.fUnReportQty });
      }
    });
    const newDetails = details.filter(d => !rowsUnSelect.find(r => r.fInterID === d.fInterID));
    dispatch({
      type: 'reportCreate/changeDetails',
      payload: { details: newDetails },
    });
  };

  renderActions = () => (
    <Fragment>
      <ButtonGroup>
        <Button icon="add_manually" onClickCapture={() => this.showAdd(true)}>
          手动添加
        </Button>
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

  getColumns = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
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
            {getFieldDecorator(`fReportingQty_${record.fInvID}`, {
              rules: [{ required: true, message: '请输入投入数量' }],
              initialValue: record.fReportingQty,
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
            {getFieldDecorator(`fRowComments_${record.fInvID}`, {
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

    return columns;
  };

  renderBaseCard = () => {
    const {
      basicData: { authorizeProcessTree },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card title="基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col lg={8} md={8} sm={24}>
              <FormItem label="岗位">
                {getFieldDecorator('fDeptID', {
                  rules: [{ required: true, message: '请输入岗位' }],
                  // initialValue: authorizeProcessTree[0].fDeptID,
                })(
                  <TreeSelect
                    treeData={authorizeProcessTree}
                    treeDefaultExpandAll
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    onChange={this.handleDeptChange}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  renderDetailsCard = () => {
    const {
      loadingDetail,
      reportCreate: { details },
    } = this.props;
    const sum = details.reduce((acc, cur) => acc.add(cur.fReportingQty), numeral());

    return (
      <Card title="明细信息" bordered={false}>
        <Table
          rowKey="fInvID"
          bordered
          loading={loadingDetail}
          columns={this.getColumns()}
          dataSource={details}
          footer={() => `总汇报数量：${sum ? sum.value() : 0}`}
          pagination={false}
        />
      </Card>
    );
  };

  renderCommentsCard = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
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
    );
  };

  renderScanForm = () => {
    const { loadingDetail } = this.props;
    return (
      <ScanForm
        handleModalVisible={flag => this.showScan(flag)}
        modalVisible={this.state.scanVisible}
        handleScan={this.handleScan}
        loading={loadingDetail}
      />
    );
  };

  renderChooseForm = () => {
    const {
      loading,
      reportCreate: { details },
      form: { getFieldValue },
    } = this.props;
    const deptId = getFieldValue('fDeptID');
    return deptId ? (
      <ChooseForm
        handleModalVisible={flag => this.showAdd(flag)}
        modalVisible={this.state.addVisible}
        deptId={deptId}
        selectedRowKeys={details.map(d => d.fInterID)}
        handleSelectRows={this.handleSelectRows}
        loading={loading}
      />
    ) : null;
  };

  render() {
    const {
      basicData: { billNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`生产任务汇报：${billNo.Report}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.renderActions()}
        // content={description}
        // extraContent={extra}
        wrapperClassName={styles.main}
        loading={loading}
      >
        {this.renderBaseCard()}
        {this.renderDetailsCard()}
        {this.renderCommentsCard()}
        {this.renderScanForm()}
        {this.renderChooseForm()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Create;
