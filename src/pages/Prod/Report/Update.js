import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import numeral from 'numeral';
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
  Modal,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';

import { ScanForm } from './components/ScanForm';
import { ChooseForm } from './components/ChooseForm';

import styles from './Update.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ reportManage, reportUpdate, reportScan, loading, menu, basicData }) => ({
  reportManage,
  reportUpdate,
  reportScan,
  loading: loading.models.reportUpdate,
  loadingDetail: loading.effects['reportUpdate/scan'],
  menu,
  basicData,
}))
@Form.create()
class Update extends PureComponent {
  state = {
    scanVisible: false,
    addVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    this.loadData();
  }

  loadData = () => {
    const { dispatch, id } = this.props;
    dispatch({
      type: 'reportUpdate/init',
      payload: { id },
    });
  };

  handleDetailRowChange({ fEntryID }, field, value) {
    const {
      dispatch,
      reportUpdate: { details },
    } = this.props;
    const findItem = details.find(x => x.fEntryID === fEntryID);
    findItem[field] = value;

    dispatch({
      type: 'reportUpdate/changeDetails',
      payload: { details },
    });
  }

  handleDeleteRow(record) {
    const {
      dispatch,
      reportUpdate: { details },
    } = this.props;
    const newDetails = details.filter(x => x.fInterID !== record.fInterID);

    dispatch({
      type: 'reportUpdate/changeDetails',
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
      type: 'reportUpdate/scan',
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
      id,
      dispatch,
      handleChange,
      reportUpdate: { details },
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
        type: 'reportUpdate/submit',
        payload: { ...payload, id, check: bCheck },
      }).then(queryResult => {
        const { status } = queryResult;
        if (status === 'ok') {
          message.success(queryResult.message);
          if (!bCheck) {
            this.loadData(id);
          } else {
            this.openProfile();
            this.close();
          }
        } else if (status === 'warning') {
          message.warning(queryResult.message);
        } else {
          message.error(queryResult.message);
        }
        // 成功后再次刷新列表
        if (handleChange) handleChange();
      });
    });
  }

  openProfile = () => {
    const { id, dispatch, handleChange } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/profile', id, handleChange: this.search },
    });
  };

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/report/update' },
    });
  }

  handleDeptChange = value => {
    const {
      reportUpdate: { details },
    } = this.props;
    if (details.length > 0) {
      Modal.confirm({
        title: '变更岗位',
        content: '变更岗位将清空明细信息，是否继续？',
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
      type: 'reportUpdate/changeDetails',
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
      reportUpdate: { details },
    } = this.props;
    rows.forEach(row => {
      if (!details.find(d => d.fInterID === row.fInterID)) {
        // 设置默认汇报数量为可汇报数量
        details.push({ ...row, fReportingQty: row.fUnReportQty });
      }
    });
    const newDetails = details.filter(d => !rowsUnSelect.find(r => r.fInterID === d.fInterID));
    dispatch({
      type: 'reportUpdate/changeDetails',
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
      reportUpdate: { fDeptID },
    } = this.props;
    return (
      <Card title="基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col lg={8} md={8} sm={24}>
              <FormItem label="岗位">
                {getFieldDecorator('fDeptID', {
                  rules: [{ required: true, message: '请输入岗位' }],
                  initialValue: fDeptID,
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
      reportUpdate: { details },
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
      reportUpdate: { fComments },
    } = this.props;
    return (
      <Card title="备注信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              {getFieldDecorator('fComments', {
                initialValue: fComments,
              })(<TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />)}
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  renderOtherCard = () => {
    const {
      reportUpdate: {
        fCreatorName,
        fCreatorNumber,
        fCreateDate,
        fCheckerName,
        fCheckerNumber,
        fCheckDate,
      },
    } = this.props;
    return (
      <Card title="其他信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col={4}>
          <Description term="创建人">{fCreatorName}</Description>
          <Description term="创建人编码">{fCreatorNumber}</Description>
          <Description term="创建日期">{defaultDateTimeFormat(fCreateDate)}</Description>
        </DescriptionList>
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
      reportUpdate: { details },
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
      reportUpdate: { fBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`生产任务汇报：${fBillNo}`}
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
        {this.renderOtherCard()}
        {this.renderScanForm()}
        {this.renderChooseForm()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Update;
