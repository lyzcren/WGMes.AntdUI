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
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { UpdateForm } from './UpdateForm';
import { CreateForm } from './CreateForm';
import { ParamForm } from './ParamForm';
import { default as ColumnConfig } from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ routeManage, routeProfile, loading, menu }) => ({
  routeManage,
  loading: loading.models.routeManage,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    exporting: false,
    // 新增界面
    modalVisible: { add: false, update: false, param: false },
    formValues: {},
    currentFormValues: {},
    // 其他
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
    const params = { pagination: this.currentPagination };
    dispatch({
      type: 'routeManage/fetch',
      payload: params,
    });
    // 列配置相关方法
    ColumnConfig.ProfileModalVisibleCallback = record =>
      this.handleProfileModalVisible(true, record);
    ColumnConfig.UpdateModalVisibleCallback = record => this.handleUpdateModalVisible(true, record);
    ColumnConfig.DeleteCallback = record => this.handleDelete(record);
    ColumnConfig.ActiveCallback = record => this.handleActive(record, !record.fIsActive);
    ColumnConfig.CheckCallback = record =>
      this.handleCheck(record, record.fStatusNumber === 'Created');
    ColumnConfig.ParamCallback = record => this.handleParamModalVisible(true, record);
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

    const params = { pagination: this.currentPagination };

    dispatch({
      type: 'routeManage/fetch',
      payload: params,
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
      queryFilters: queryFilters,
    });

    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters,
    };
    const params = { pagination: this.currentPagination };

    return params;
  };

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const params = this.getSearchParam(fieldsValue);
      dispatch({
        type: 'routeManage/fetch',
        payload: params,
      });
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
    const params = { pagination: this.currentPagination };

    dispatch({
      type: 'routeManage/fetch',
      payload: params,
    });
  };

  handleExport = e => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let params = this.getSearchParam(fieldsValue);
      let fileName = '导出.xls';
      switch (e.key) {
        case 'currentPage':
          params = { ...params, exportPage: true };
          fileName = '导出-第' + params.pagination.current + '页.xls';
          break;
        case 'allPage':
          params = { ...params, exportAll: true };
          break;
        default:
          break;
      }

      exportExcel('/api/route/export', params, fileName);
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

  handleParamModalVisible = (flag, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: { ...modalVisible, param: !!flag },
      currentFormValues: record || {},
    });
  };

  handleProfileModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/techStd/route/profile', data: record },
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeManage/add',
      payload: fields,
    }).then(() => {
      const {
        routeManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('添加成功');
        this.handleModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else {
        message.warning(queryResult.message);
      }
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'routeManage/update',
      payload: fields,
    }).then(() => {
      const {
        routeManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('修改成功');
        this.handleUpdateModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
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
        message.success('【' + record.fName + '】' + (fIsActive ? '启用' : '禁用') + '成功');
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
          message.success('【' + record.fName + '】' + '删除成功');
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
    const checkType = 'routeManage/' + (isCheck ? 'check' : 'uncheck');
    dispatch({
      type: checkType,
      payload: { fInterID },
    }).then(() => {
      const {
        routeManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success((isCheck ? '审批' : '反审批') + '成功');
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

  renderAdvancedForm() {
    return renderSimpleForm;
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      routeManage: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, currentFormValues, exporting } = this.state;
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
        <Menu.Item key="check" disabled={!hasAuthority('Route_Check')}>
          批量审批
        </Menu.Item>
        <Menu.Item key="uncheck" disabled={!hasAuthority('Route_Check')}>
          批量反审批
        </Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleSubmit: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleSubmit: this.handleUpdate,
    };
    const paramMethods = {
      handleModalVisible: this.handleParamModalVisible,
      handleSubmit: this.handleUpdate,
    };
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Authorized authority="Route_Create">
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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
                    <Button loading={exporting}>
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
              <StandardTable
                rowKey="fInterID"
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={ColumnConfig.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible.add} />
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={modalVisible.update}
              values={currentFormValues}
            />
          ) : null}
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <ParamForm
              {...paramMethods}
              modalVisible={modalVisible.param}
              values={currentFormValues}
            />
          ) : null}
        </GridContent>
      </div>
    );
  }
}

export default TableList;
