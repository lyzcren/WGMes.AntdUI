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
  message,
  Table,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import ColumnConfig from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => "'" + obj[key] + "'")
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ batchSplitManage, loading }) => ({
  batchSplitManage,
  loading: loading.models.batchSplitManage,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    formValues: {},
    // expandForm: 是否展开更多查询条件
    expandForm: false,
    selectedRows: [],
    queryFilters: [],
  };

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'batchSplitManage/fetch',
      payload: this.currentPagination,
    });
    ColumnConfig.handleViewFlow = record => this.handleViewFlow(record.fFullBatchNo);
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

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
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

  expandedRowRender = record => {
    const columns = [
      {
        title: '批号',
        dataIndex: 'fFullBatchNo',
        width: '20%',
        render: (val, record) => {
          return <a onClick={() => this.handleViewFlow(record.fFullBatchNo)}>{val}</a>;
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
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('BatchSplit_Delete')}>
          删除
        </Menu.Item>
      </Menu>
    );

    const scrollX = ColumnConfig.columns
      .map(c => {
        return c.width;
      })
      .reduce(function(sum, width, index) {
        return sum + width;
      });
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
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
              </div>
              <StandardTable
                rowKey="id"
                bordered
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={ColumnConfig.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                expandedRowRender={this.expandedRowRender}
                scroll={{ x: scrollX }}
              />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default TableList;
