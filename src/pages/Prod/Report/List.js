import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
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
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Table,
  Divider,
  Radio,
  Popover,
  Switch,
  Progress,
  notification,
  Popconfirm,
  TreeSelect,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';
import { print, getColumns } from '@/utils/wgUtils';
import WgStandardTable from '@/wg_components/WgStandardTable';
import { columns } from '@/columns/Prod/Report';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => `'${obj[key]}'`)
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ reportManage, loading, menu, basicData }) => ({
  reportManage,
  loading: loading.models.reportManage,
  menu,
  basicData,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      // 界面是否可见
      modalVisible: {
        add: false,
        update: false,
      },
      formValues: {},
      // 当前操作选中列的数据
      currentFormValues: {},
      // expandForm: 是否展开更多查询条件
      expandForm: false,
      selectedRows: [],
      queryFilters: [],
    };

    // 列表查询参数
    this.currentPagination = {
      current: 1,
      pageSize: 10,
    };
    this.columnConfigKey = 'report';
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/fetch',
      payload: this.currentPagination,
    });
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    dispatch({
      type: 'basicData/getStatus',
      payload: { number: 'reportStatus' },
    });
    if (hasAuthority('Report_Print')) {
      dispatch({
        type: 'reportManage/getPrintTemplates',
      });
    }
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, queryFilters } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const { current, pageSize } = pagination;
    this.currentPagination = {
      current,
      pageSize,
      filters,
      ...formValues,
      queryFilters,
    };
    if (sorter.field) {
      this.currentPagination.sorter = {};
      this.currentPagination.sorter[sorter.field] = sorter.order.replace('end', '');
    }

    dispatch({
      type: 'reportManage/fetch',
      payload: this.currentPagination,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.search();
  };

  getSearchParam = fieldsValue => {
    const values = {
      ...fieldsValue,
    };
    // 查询条件处理
    const queryFilters = [];
    const detailFilters = [];
    // 表头查询条件
    if (fieldsValue.fDeptID)
      queryFilters.push({ name: 'fDeptID', compare: '=', value: fieldsValue.fDeptID });
    if (fieldsValue.fBillNo)
      queryFilters.push({ name: 'fBillNo', compare: '%*%', value: fieldsValue.fBillNo });
    if (fieldsValue.fMoRptBillNo)
      queryFilters.push({ name: 'fMoRptBillNo', compare: '%*%', value: fieldsValue.fMoRptBillNo });
    if (fieldsValue.fCreatorName)
      queryFilters.push({ name: 'fCreatorName', compare: '%*%', value: fieldsValue.fCreatorName });
    if (fieldsValue.fCreatorNumber)
      queryFilters.push({
        name: 'fCreatorNumber',
        compare: '%*%',
        value: fieldsValue.fCreatorNumber,
      });
    // if (fieldsValue.fCreateDate)
    //   queryFilters.push({ name: 'fCreateDate', compare: '%*%', value: fieldsValue.fCreateDate });
    if (fieldsValue.fEditorName)
      queryFilters.push({ name: 'fEditorName', compare: '%*%', value: fieldsValue.fEditorName });
    if (fieldsValue.fEditorNumber)
      queryFilters.push({
        name: 'fEditorNumber',
        compare: '%*%',
        value: fieldsValue.fEditorNumber,
      });
    // if (fieldsValue.fEditDate)
    //   queryFilters.push({ name: 'fEditDate', compare: '%*%', value: fieldsValue.fEditDate });
    if (fieldsValue.fCheckerName)
      queryFilters.push({ name: 'fCheckerName', compare: '%*%', value: fieldsValue.fCheckerName });
    if (fieldsValue.fCheckerNumber)
      queryFilters.push({
        name: 'fCheckerNumber',
        compare: '%*%',
        value: fieldsValue.fCheckerNumber,
      });
    // if (fieldsValue.fCheckDate)
    //   queryFilters.push({ name: 'fCheckDate', compare: '%*%', value: fieldsValue.fCheckDate });

    // 明细列查询条件
    if (fieldsValue.fSoBillNo)
      detailFilters.push({ name: 'fSoBillNo', compare: '%*%', value: fieldsValue.fSoBillNo });
    if (fieldsValue.fMoBillNo)
      detailFilters.push({ name: 'fMoBillNo', compare: '%*%', value: fieldsValue.fMoBillNo });
    if (fieldsValue.fFullBatchNo)
      detailFilters.push({ name: 'fFullBatchNo', compare: '%*%', value: fieldsValue.fFullBatchNo });
    if (fieldsValue.fWorkShopName)
      detailFilters.push({
        name: 'fWorkShopName',
        compare: '%*%',
        value: fieldsValue.fWorkShopName,
      });
    if (fieldsValue.fWorkShopNumber)
      detailFilters.push({
        name: 'fWorkShopNumber',
        compare: '%*%',
        value: fieldsValue.fWorkShopNumber,
      });
    if (fieldsValue.fProductName)
      detailFilters.push({ name: 'fProductName', compare: '%*%', value: fieldsValue.fProductName });
    if (fieldsValue.fProductFullName)
      detailFilters.push({
        name: 'fProductFullName',
        compare: '%*%',
        value: fieldsValue.fProductFullName,
      });
    if (fieldsValue.fProductNumber)
      detailFilters.push({
        name: 'fProductNumber',
        compare: '%*%',
        value: fieldsValue.fProductNumber,
      });
    if (fieldsValue.fProductModel)
      detailFilters.push({
        name: 'fProductModel',
        compare: '%*%',
        value: fieldsValue.fProductModel,
      });
    if (fieldsValue.fRowComments)
      detailFilters.push({ name: 'fRowComments', compare: '%*%', value: fieldsValue.fRowComments });

    this.setState({
      formValues: values,
      queryFilters,
    });

    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters,
      detailFilters,
    };

    return this.currentPagination;
  };

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      dispatch({
        type: 'reportManage/fetch',
        payload: pagination,
      });
      this.handleSelectRows([]);
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      queryFilters: [],
      detailFilters: [],
    });

    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters: [],
      detailFilters: [],
    };

    dispatch({
      type: 'reportManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
  };

  handleCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/check',
      payload: { fInterID: record.fInterID },
    }).then(() => {
      const {
        reportManage: { queryResult },
      } = this.props;
      this.showResult(queryResult, () => {
        message.success(`【${record.fBillNo}】` + `审核成功`);
      });
    });
  };

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

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          const fileName = `生产任务汇报-第${pagination.current}页.xls`;
          exportExcel('/api/report/export', pagination, fileName);
          break;
        case 'allPage':
          pagination.exportPage = false;
          exportExcel('/api/report/export', pagination, '生产任务汇报.xls');
          break;
        default:
          break;
      }
    });
  };

  // 应用URL协议启动WEB报表客户端程序，根据参数 option 调用对应的功能
  webapp_start(templateId, interId, type) {
    const option = {
      baseurl: `http://${window.location.host}`,
      report: `/api/PrintTemplate/grf?id=${templateId}`,
      data: `/api/report/getPrintData?id=${interId}`,
      selfsql: false,
      type,
    };

    // 创建启动WEB报表客户端的URL协议参数
    window.location.href = `grwebapp://${JSON.stringify(option)}`;
  }

  handlePrint = (key, record) => {
    const { dispatch, form } = this.props;
    const { selectedRows } = this.state;

    const templateId = key;
    // this.webapp_start(templateId, record.fInterID, 'preview');
    print('report', templateId, record.fInterID);
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        this.handleBatchDeleteClick();
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = ({ key, flag }, record) => {
    const { modalVisible, currentFormValues } = this.state;
    modalVisible[key] = !!flag;
    currentFormValues[key] = record;
    this.setState({
      modalVisible: { ...modalVisible },
      currentFormValues: { ...currentFormValues },
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/remove',
      payload: {
        id: record.fInterID,
      },
    }).then(() => {
      const {
        reportManage: { queryResult },
      } = this.props;
      this.setState({
        selectedRows: [],
      });
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `删除成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(`【${record.fBillNo}】${queryResult.message}`);
      } else {
        message.error(`【${record.fBillNo}】${queryResult.message}`);
      }
    });
  };

  handleCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/check',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `审核成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleUnCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/uncheck',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `反审核成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleBatchDeleteClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '删除记录',
      content: '确定批量删除记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchDelete(selectedRows),
    });
  };

  batchDelete = selectedRows => {
    const { dispatch } = this.props;
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    selectedRows.forEach(selectedRow => {
      this.handleDelete(selectedRow);
    });
  };

  queryDeptChange = value => {
    setTimeout(() => {
      this.search();
    }, 200);
  };

  renderOperation = record => {
    const {
      reportManage: { printTemplates },
    } = this.props;
    return (
      <Fragment>
        <a onClick={() => this.handleProfile(record)}>详情</a>
        {/* <Authorized authority="Report_Update">
          <Divider type="vertical" />
          <a disabled={record.fStatus != 0} onClick={() => this.handleUpdate(record)}>
            修改
          </a>
        </Authorized> */}
        <Authorized authority="Report_Check">
          <Divider type="vertical" />
          {record.fStatus === 0 ? (
            <a onClick={() => this.handleCheck(record)}>审核</a>
          ) : (
            <a onClick={() => this.handleUnCheck(record)}>反审核</a>
          )}
        </Authorized>
        <Authorized authority="Report_Delete">
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
        </Authorized>
        {printTemplates.length > 0 ? (
          <Authorized authority="Report_Print">
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => this.handlePrint(key, record)}>
                  {printTemplates.map(val => (
                    <Menu.Item key={val.fInterID}>{val.fName}</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <a>
                <Divider type="vertical" />
                打印 <Icon type="down" />
              </a>
            </Dropdown>
          </Authorized>
        ) : null}
      </Fragment>
    );
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      basicData: {
        authorizeProcessTree,
        status: { reportStatus },
      },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator('fDeptID', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={authorizeProcessTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.queryDeptChange}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('fBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="ERP汇报单号">
              {getFieldDecorator('fMoRptBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      basicData: {
        authorizeProcessTree,
        status: { flowStatus, recordStatus },
      },
    } = this.props;
    const { fDeptID } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginRight: '30px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator('fDeptID', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={authorizeProcessTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.queryDeptChange}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('fBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="ERP汇报单号">
              {getFieldDecorator('fMoRptBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建人">
              {getFieldDecorator('fCreatorName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建人编码">
              {getFieldDecorator('fCreatorNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="修改人">
              {getFieldDecorator('fEditorName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="修改人编码">
              {getFieldDecorator('fEditorNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审核人">
              {getFieldDecorator('fCheckerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审核人编码">
              {getFieldDecorator('fCheckerNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('fSoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="任务单号">
              {getFieldDecorator('fMoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="批号">
              {getFieldDecorator('fFullBatchNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车间">
              {getFieldDecorator('fWorkShopName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车间编码">
              {getFieldDecorator('fWorkShopNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('fProductName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品全称">
              {getFieldDecorator('fProductFullName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品编码">
              {getFieldDecorator('fProductNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="规格型号">
              {getFieldDecorator('fProductModel')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="行备注">
              {getFieldDecorator('fRowComments')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderOperator() {
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('Report_Delete')}>
          删除
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{ overflow: 'hidden' }}>
        <Authorized authority="Report_Create">
          <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
            新建
          </Button>
        </Authorized>
        <Authorized authority="Report_Export">
          <Dropdown
            overlay={
              <Menu onClick={this.handleExport} selectedKeys={[]}>
                <Menu.Item key="currentPage">当前页</Menu.Item>
                <Menu.Item key="allPage">所有页</Menu.Item>
              </Menu>
            }
          >
            <Button icon="download">
              导出 <Icon type="down" />
            </Button>
          </Dropdown>
        </Authorized>
        {selectedRows.length > 0 && (
          <span>
            <Authorized authority="Report_Delete">
              <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
            </Authorized>
            <Authorized authority={['Report_Delete']}>
              <Dropdown overlay={menu}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </Authorized>
          </span>
        )}
      </div>
    );
  }

  handleAdd() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/create', handleChange: this.search },
    });
  }

  handleProfile(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/profile', id: record.fInterID, handleChange: this.search },
    });
  }

  handleUpdate(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/update', id: record.fInterID, handleChange: this.search },
    });
  }

  expandedRowRender = record => {
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
        dataIndex: 'fReportingQty',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];
    return (
      <Table rowKey="fInvID" columns={columns} dataSource={record.details} pagination={false} />
    );
  };

  getColumns = () => {
    const columnOps = [
      {
        dataIndex: 'fBillNo',
        render: (val, record) => <a onClick={() => this.handleProfile(record)}>{val}</a>,
      },
      {
        dataIndex: 'operators',
        width: 240,
        render: (text, record) => this.renderOperation(record),
      },
    ];
    return getColumns({
      columns,
      columnOps,
    });
  };

  render() {
    const {
      dispatch,
      reportManage: { data, queryResult },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, currentFormValues } = this.state;

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>{this.renderOperator()}</div>
              <WgStandardTable
                rowKey="fInterID"
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.getColumns()}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                expandedRowRender={this.expandedRowRender}
                // 以下属性与列配置相关
                configKey={this.columnConfigKey}
                refShowConfig={showConfig => {
                  this.showConfig = showConfig;
                }}
              />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default TableList;
