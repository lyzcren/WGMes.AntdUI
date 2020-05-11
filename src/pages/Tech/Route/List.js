import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
  Modal,
  message,
} from 'antd';

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import ParamForm from './ParamForm';
import ColumnConfig from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';
import WgStandardTable from '@/wg_components/WgStandardTable';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ routeManage, loading, menu }) => ({
  routeManage,
  loading: loading.models.routeManage,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      exporting: false,
      // 新增界面
      modalVisible: {
        param: false,
      },
      formValues: {},
      currentFormValues: {},
      // 其他
      expandForm: false,
      selectedRows: [],
      queryFilters: [],
    };

    // 列表查询参数
    this.currentPagination = {
      current: 1,
      pageSize: 10,
    };
    this.columnConfigKey = 'route';
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeManage/fetch',
      payload: this.currentPagination,
    });
    // 列配置相关方法
    ColumnConfig.profileModalVisible = record => this.handleProfileModalVisible(true, record);
    ColumnConfig.UpdateModalVisibleCallback = record => this.handleUpdatePageVisible(record);
    ColumnConfig.copyHandler = record => this.handleCopyPageVisible(record);
    ColumnConfig.DeleteCallback = record => this.handleDelete(record);
    ColumnConfig.ActiveCallback = record => this.handleActive(record, !record.fIsActive);
    ColumnConfig.CheckCallback = record =>
      this.handleCheck(record, record.fStatusNumber === 'Created');
    ColumnConfig.ParamCallback = record =>
      this.handleModalVisible({ key: 'param', flag: true }, record);
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
      type: 'routeManage/fetch',
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
    if (fieldsValue.queryName)
      queryFilters.push({ name: 'fName', compare: '%*%', value: fieldsValue.queryName });
    if (fieldsValue.queryIsActive)
      queryFilters.push({ name: 'fIsActive', compare: '=', value: fieldsValue.queryIsActive });

    this.setState({
      formValues: values,
      queryFilters,
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
        type: 'routeManage/fetch',
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
      type: 'routeManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
  };

  handleExport = e => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      let fileName = '工艺路线.xls';
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          fileName = `工艺路线-第${pagination.current}页.xls`;
          break;
        case 'allPage':
          pagination.exportPage = false;
          break;
        default:
          break;
      }
      exportExcel('/api/route/export', pagination, fileName);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
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
      case 'check':
        this.handleBatchCheckClick();
        break;
      case 'uncheck':
        this.handleBatchUncheckClick();
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

  handleCreatePageVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/techStd/route/create' },
    });
  };

  handleCopyPageVisible = record => {
    const { dispatch } = this.props;
    const { fInterID } = record;
    dispatch({
      type: 'menu/openMenu',
      payload: {
        path: '/techStd/route/create',
        location: { fInterID, record },
      },
    });
  };

  handleUpdatePageVisible = record => {
    const { dispatch } = this.props;
    const { fInterID } = record;
    dispatch({
      type: 'menu/openMenu',
      payload: {
        path: '/techStd/route/update',
        location: { fInterID, record },
      },
    });
  };

  handleProfileModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    const { fInterID } = record;
    dispatch({
      type: 'menu/openMenu',
      payload: {
        path: '/techStd/route/profile',
        location: { fInterID, record },
      },
    });
  };

  handleActive = (record, fIsActive) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeManage/active',
      payload: {
        fInterID: record.fInterID,
        fIsActive,
      },
    }).then(() => {
      const {
        routeManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(`【${record.fName}】${fIsActive ? '启用' : '禁用'}成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeManage/remove',
      payload: {
        fInterID: record.fInterID,
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        const {
          routeManage: { queryResult },
        } = this.props;
        if (queryResult.status === 'ok') {
          message.success(`【${record.fName}】` + `删除成功`);
          // 成功后再次刷新列表
          this.search();
        } else if (queryResult.status === 'warning') {
          message.warning(queryResult.message);
        } else {
          message.error(queryResult.message);
        }
      },
    });
  };

  handleCheck(record, isCheck = true) {
    const { dispatch } = this.props;
    const { fInterID } = record;
    const checkType = `routeManage/${isCheck ? 'check' : 'uncheck'}`;
    dispatch({
      type: checkType,
      payload: { fInterID },
    }).then(() => {
      const {
        routeManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(`${isCheck ? '审批' : '反审批'}成功`);
        // 成功后再次刷新列表
        this.search();
      } else {
        message.warning(queryResult.message);
      }
    });
  }

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

  handleBatchCheckClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '审批',
      content: '确定批量审批吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchCheck(selectedRows, true),
    });
  };

  handleBatchUncheckClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '反审批',
      content: '确定批量反审批吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchCheck(selectedRows, false),
    });
  };

  batchActive = (selectedRows, fIsActive) => {
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    selectedRows.forEach(selectedRow => {
      this.handleActive(selectedRow, fIsActive);
    });
  };

  batchCheck = (selectedRows, isCheck) => {
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    selectedRows.forEach(selectedRow => {
      this.handleCheck(selectedRow, isCheck);
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="名称">
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

  renderAdvancedForm() {
    return this.renderSimpleForm;
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderOperator() {
    const { selectedRows, exporting } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('Route_Delete')}>
          删除
        </Menu.Item>
        <Menu.Item key="active" disabled={!hasAuthority('Route_Active')}>
          批量启用
        </Menu.Item>
        <Menu.Item key="deactive" disabled={!hasAuthority('Route_Active')}>
          批量禁用
        </Menu.Item>
        {/* <Menu.Item key="check" disabled={!hasAuthority('Route_Check')}>
          批量审批
        </Menu.Item>
        <Menu.Item key="uncheck" disabled={!hasAuthority('Route_Check')}>
          批量反审批
        </Menu.Item> */}
      </Menu>
    );

    return (
      <div style={{ overflow: 'hidden' }}>
        <Authorized authority="Route_Create">
          <Button icon="plus" type="primary" onClick={() => this.handleCreatePageVisible()}>
            新建
          </Button>
        </Authorized>
        <Authorized authority="Route_Export">
          <Dropdown
            overlay={
              <Menu onClick={this.handleExport} selectedKeys={[]}>
                <Menu.Item key="currentPage">当前页</Menu.Item>
                <Menu.Item key="allPage">所有页</Menu.Item>
              </Menu>
            }
          >
            <Button icon="download" loading={exporting}>
              导出 <Icon type="down" />
            </Button>
          </Dropdown>
        </Authorized>
        {selectedRows.length > 0 && (
          <span>
            <Authorized authority="Route_Delete">
              <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
            </Authorized>
            <Authorized authority={['Route_Delete', 'Route_Active']}>
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

  render() {
    const {
      routeManage: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, currentFormValues } = this.state;

    const paramMethods = {
      handleModalVisible: (flag, record) => this.handleModalVisible({ key: 'param', flag }, record),
    };
    return (
      <div style={{ margin: '-24px 0 0 -24px' }}>
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
                columns={ColumnConfig.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                // 以下属性与列配置相关
                configKey={this.columnConfigKey}
                refShowConfig={showConfig => {
                  this.showConfig = showConfig;
                }}
              />
            </div>
          </Card>
          {currentFormValues.param && Object.keys(currentFormValues.param).length ? (
            <ParamForm
              {...paramMethods}
              modalVisible={modalVisible.param}
              values={currentFormValues.param}
            />
          ) : null}
        </GridContent>
      </div>
    );
  }
}

export default TableList;
