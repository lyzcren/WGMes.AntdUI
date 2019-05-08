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
  Divider,
  Radio, Popover, Switch, Progress, notification, Popconfirm,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { UpdateForm } from './UpdateForm';
import { CreateForm } from './CreateForm';
import { ViewStepForm } from './ViewStepForm';
import { default as ColumnConfig } from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';
import { tsImportType } from '@babel/types';


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ flowManage, loading }) => ({
  flowManage,
  loading: loading.models.flowManage,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 界面是否可见
    modalVisible: {
      add: false,
      update: false,
      route: false,
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


  componentDidMount () {
    const { dispatch } = this.props;
    var params = { pagination: this.currentPagination };
    dispatch({
      type: 'flowManage/fetch',
      payload: params,
    });
    // 列配置相关方法
    ColumnConfig.UpdateModalVisibleCallback = (record) => this.handleUpdateModalVisible(true, record);
    ColumnConfig.DeleteCallback = (record) => this.handleDelete(record);
    ColumnConfig.MissionModalVisibleCallback = (record) => this.handleMissionModalVisible(true, record);
    ColumnConfig.RouteModalVisibleCallback = (record) => this.handleRouteModalVisible(true, record);
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

    var params = { pagination: this.currentPagination };

    dispatch({
      type: 'flowManage/fetch',
      payload: params,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.search();
  };

  getSearchParam = (fieldsValue) => {
    const values = {
      ...fieldsValue,
    };
    // 查询条件处理
    const queryFilters = [];
    if (fieldsValue.queryName) queryFilters.push({ name: "fName", compare: "%*%", value: fieldsValue.queryName });
    if (fieldsValue.queryIsActive) queryFilters.push({ name: "fIsActive", compare: "=", value: fieldsValue.queryIsActive });

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
    var params = { pagination: this.currentPagination };

    return params;
  }

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      var params = this.getSearchParam(fieldsValue);
      dispatch({
        type: 'flowManage/fetch',
        payload: params,
      });
    });
  }

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
    var params = { pagination: this.currentPagination };

    dispatch({
      type: 'flowManage/fetch',
      payload: params,
    });
  };

  handleExport = (e) => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      var params = this.getSearchParam(fieldsValue);
      var fileName = '导出.xls';
      switch (e.key) {
        case 'currentPage':
          params = { ...params, exportPage: true }
          fileName = '导出-第' + params.pagination.current + '页.xls';
          break;
        case 'allPage':
          params = { ...params, exportAll: true }
          break;
        default:
          break;
      }
      exportExcel('/api/flow/export', params, fileName)
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
      case 'active':
        this.handleBatchActiveClick();
        break;
      case 'deactive':
        this.handleBatchDeactiveClick();
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

  handleMissionModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/mission/profile', data: { fInterID: record.fMoPlanID } },
    });
  };

  handleRouteModalVisible = (flag, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: { ...modalVisible, route: !!flag },
      currentFormValues: record || {},
    });
  };

  handleDelete = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowManage/remove',
      payload: {
        fItemID: record.fItemID,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        const { flowManage: { queryResult } } = this.props;
        if (queryResult.status === 'ok') {
          message.success('【' + record.fName + '】' + '删除成功');
          // 成功后再次刷新列表
          this.search();
        } else if (queryResult.status === 'warning') {
          message.warning(queryResult.message);
        }
        else {
          message.error(queryResult.message);
        }
      },
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

  batchDelete = (selectedRows) => {
    const { dispatch } = this.props;
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    selectedRows.forEach(selectedRow => {
      this.handleDelete(selectedRow);
    });
  };

  handleBatchActiveClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '启用记录',
      content: '确定批量启用记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchActive(selectedRows, true),
    });
  };

  handleBatchDeactiveClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '禁用记录',
      content: '确定批量禁用记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchActive(selectedRows, false),
    });
  };

  batchActive = (selectedRows, fIsActive) => {
    const { dispatch } = this.props;
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    selectedRows.forEach(selectedRow => {
      this.handleActive(selectedRow, fIsActive);
    });
  };

  renderSimpleForm () {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem id="queryName" label="名称">
              {getFieldDecorator('queryName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryIsActive')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              )}
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

  renderAdvancedForm () {
    return renderSimpleForm;
  }

  renderForm () {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render () {
    const {
      flowManage: { data, queryResult },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, currentFormValues, authorityModalVisible, authorizeUserModalVisible } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('Flow_Delete')}>删除</Menu.Item>
        <Menu.Item key="active" disabled={!hasAuthority('Flow_Active')}>批量启用</Menu.Item>
        <Menu.Item key="deactive" disabled={!hasAuthority('Flow_Active')}>批量禁用</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      dispatch: this.props.dispatch,
      handleModalVisible: this.handleModalVisible,
      handleSuccess: this.search,
    };
    const updateMethods = {
      dispatch: this.props.dispatch,
      handleModalVisible: this.handleUpdateModalVisible,
      handleSuccess: this.search,
    };
    const routeMethods = {
      dispatch: this.props.dispatch,
      handleModalVisible: this.handleRouteModalVisible,
    };
    const scrollX = ColumnConfig.columns
      .map(c => { return c.width; })
      .reduce(function (sum, width, index) {
        return sum + width;
      });
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Authorized authority="Flow_Create">
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新建
                </Button>
                </Authorized>
                <Authorized authority="Flow_Export">
                  <Dropdown overlay={
                    <Menu onClick={this.handleExport} selectedKeys={[]}>
                      <Menu.Item key="currentPage">当前页</Menu.Item>
                      <Menu.Item key="allPage">所有页</Menu.Item>
                    </Menu>
                  }>
                    <Button>
                      导出 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </Authorized>
                {selectedRows.length > 0 && (
                  <span>
                    <Authorized authority="Flow_Delete">
                      <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
                    </Authorized>
                    <Authorized authority={["Flow_Delete", "Flow_Active"]}>
                      <Dropdown overlay={menu}>
                        <Button>
                          更多操作 <Icon type="down" />
                        </Button>
                      </Dropdown>
                    </Authorized>
                  </span>
                )}
              </div>
              <StandardTable
                rowKey="fInterID"
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
          <CreateForm {...parentMethods} modalVisible={modalVisible.add} />
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              modalVisible={modalVisible.update}
              values={currentFormValues}
            />
          ) : null}
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <ViewStepForm
              {...routeMethods}
              modalVisible={modalVisible.route}
              fInterID={currentFormValues.fRouteID}
            />
          ) : null}
        </GridContent>
      </div>
    );
  }
}

export default TableList;
