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
  TreeSelect,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import ColumnConfig from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => "'" + obj[key] + "'")
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ changeRouteManage, loading, basicData, menu }) => ({
  changeRouteManage,
  loading: loading.models.changeRouteManage,
  basicData,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
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
  currentPagination = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'changeRouteManage/fetch',
      payload: this.currentPagination,
    });
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    ColumnConfig.handleViewFlow = fFullBatchNo => this.handleViewFlow(fFullBatchNo);
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
      type: 'changeRouteManage/fetch',
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
    if (fieldsValue.queryCreatorName)
      queryFilters.push({
        name: 'fCreatorName',
        compare: '%*%',
        value: fieldsValue.queryCreatorName,
      });
    if (fieldsValue.queryDept)
      queryFilters.push({ name: 'fDeptID', compare: '=', value: fieldsValue.queryDept });

    this.setState({
      formValues: values,
      queryFilters: queryFilters,
    });

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
        type: 'changeRouteManage/fetch',
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

    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters: [],
    };

    dispatch({
      type: 'changeRouteManage/fetch',
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
          const fileName = '工艺路线变更记录-第' + pagination.current + '页.xls';
          exportExcel('/api/changeRoute/export', pagination, fileName);
          break;
        case 'allPage':
          pagination.exportPage = false;
          exportExcel('/api/changeRoute/export', pagination, '工艺路线变更记录.xls');
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
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleModalVisible = flag => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: { ...modalVisible, add: !!flag },
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: { ...modalVisible, update: !!flag },
      currentFormValues: record || {},
    });
  };

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
          <Col md={6} sm={24}>
            <FormItem label="批号">
              {getFieldDecorator('queryBatchNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="变更人">
              {getFieldDecorator('queryCreatorName')(<Input placeholder="请输入" />)}
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
    return renderSimpleForm;
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      dispatch,
      changeRouteManage: { data, queryResult },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

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
                <Authorized authority="Flow_Read">
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
              </div>
              <StandardTable
                rowKey="guid"
                bordered
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={ColumnConfig.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
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
