import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import QRCode from 'qrcode.react';
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
  message,
  Table,
  Tooltip,
  TreeSelect,
  Modal,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import ColumnConfig from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';
import { WgStandardTable } from '@/wg_components/WgStandardTable';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => "'" + obj[key] + "'")
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ batchSplitManage, basicData, loading }) => ({
  batchSplitManage,
  basicData,
  loading: loading.models.batchSplitManage,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    ColumnConfig.handleViewFlow = record => this.handleViewFlow(record.fFullBatchNo);
    ColumnConfig.handleRollback = record => this.handleRollback(record);

    this.state = {
      // 界面是否可见
      modalVisible: {
        columnConfig: false,
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
    this.columnConfigKey = 'batchSplitRecord';
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'batchSplitManage/fetch',
      payload: this.currentPagination,
    });
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
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
      type: 'batchSplitManage/fetch',
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
    if (fieldsValue.queryDept)
      queryFilters.push({ name: 'fDeptID', compare: '=', value: fieldsValue.queryDept });
    if (fieldsValue.queryBatchNo)
      queryFilters.push({ name: 'fFullBatchNo', compare: '%*%', value: fieldsValue.queryBatchNo });

    this.setState({
      formValues: values,
      queryFilters: queryFilters,
    });

    const { pageSize, filters, sorter } = this.currentPagination;
    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters,
    };

    return this.currentPagination;
  };

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      dispatch({
        type: 'batchSplitManage/fetch',
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
    });

    const { pageSize, filters, sorter } = this.currentPagination;
    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters: [],
    };

    dispatch({
      type: 'batchSplitManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          const fileName = '导出-第' + pagination.current + '页.xls';
          exportExcel('/api/batchSplit/export', pagination, fileName);
          break;
        case 'allPage':
          pagination.exportPage = false;
          exportExcel('/api/batchSplit/export', pagination, '导出.xls');
          break;
        default:
          break;
      }
    });
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

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'batchSplitManage/remove',
      payload: {
        fItemID: record.fItemID,
      },
    }).then(() => {
      this.setState({
        selectedRows: [],
      });
      const {
        batchSplitManage: { queryResult },
      } = this.props;
      this.showResult(queryResult, () => {
        message.success('【' + record.fName + '】' + '删除成功');
        // 成功后再次刷新列表
        this.search();
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

  handleViewFlow(fBatchNo) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/flow', fBatchNo },
    });
  }

  handleRollback(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'batchSplitManage/rollback',
      payload: { id: record.id },
    }).then(() => {
      const {
        batchSplitManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(`已成功撤销，批号【${record.fFullBatchNo}】.`);
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  }

  handleBatchRollback = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '撤销',
      content: '确定撤销吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        selectedRows.map(x => this.handleRollback(x));
      },
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      basicData: { authorizeProcessTree },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator('queryDept', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={authorizeProcessTree}
                  treeDefaultExpandAll
                  allowClear={true}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="批号">
              {getFieldDecorator('queryBatchNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm} hidden>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    return this.renderSimpleForm;
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderOperator() {
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('BatchSplit_Delete')}>
          删除
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{ overflow: 'hidden' }}>
        <Authorized authority="BatchSplit_Export">
          <Dropdown
            overlay={
              <Menu onClick={this.handleExport} selectedKeys={[]}>
                <Menu.Item key="currentPage">当前页</Menu.Item>
                <Menu.Item key="allPage">所有页</Menu.Item>
              </Menu>
            }
          >
            <Button>
              导出 <Icon type="down" />
            </Button>
          </Dropdown>
        </Authorized>
        {selectedRows.length > 0 && (
          <span>
            <Authorized authority="BatchSplit_Rollback">
              <Button onClick={this.handleBatchRollback}>撤销</Button>
            </Authorized>
          </span>
        )}
        <div style={{ float: 'right', marginRight: 24 }}>
          <Button
            icon="menu"
            onClick={() => {
              this.handleModalVisible({ key: 'columnConfig', flag: true });
            }}
          >
            列配置
          </Button>
        </div>
      </div>
    );
  }

  expandedRowRender = record => {
    const columns = [
      {
        title: '批号',
        dataIndex: 'fFullBatchNo',
        width: '20%',
        render: (val, record) => {
          return (
            <div style={{ display: 'flex' }}>
              {val && (
                <Tooltip
                  placement="topLeft"
                  title={<QRCode value={val} size={200} fgColor="#000000" />}
                >
                  <QRCode style={{ marginRight: '6px' }} value={val} size={19} fgColor="#666666" />
                </Tooltip>
              )}
              <a onClick={() => this.handleViewFlow(record.fFullBatchNo)}>{val}</a>
            </div>
          );
        },
      },
      {
        title: '数量',
        dataIndex: 'fQty',
        width: '20%',
      },
      {
        title: '',
        dataIndex: 'non',
      },
    ];
    return (
      <Table
        rowKey="fFullBatchNo"
        columns={columns}
        dataSource={record.details}
        pagination={false}
      />
    );
  };

  render() {
    const {
      dispatch,
      batchSplitManage: { data, queryResult },
      loading,
    } = this.props;
    const { selectedRows, modalVisible } = this.state;

    const columns = ColumnConfig.getColumns();

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>{this.renderOperator()}</div>
              <WgStandardTable
                rowKey="id"
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                expandedRowRender={this.expandedRowRender}
                // 以下属性与列配置相关
                configKey={this.columnConfigKey}
                configModalVisible={modalVisible.columnConfig}
                handleConfigModalVisible={flag =>
                  this.handleModalVisible({ key: 'columnConfig', flag })
                }
              />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default TableList;
