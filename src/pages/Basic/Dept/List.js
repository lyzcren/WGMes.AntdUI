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
  Radio,
  Popover,
  Switch,
  Progress,
  notification,
  Popconfirm,
  Tag,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { UpdateForm } from './UpdateForm';
import { CreateForm } from './CreateForm';
import { UpdateFixForm } from './UpdateFixForm';
import { TechParamForm } from './TechParamForm';
import UnitConverterForm from './UnitConverterForm';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';
import StandardTable from '@/components/StandardTable';
import WgStandardTable from '@/wg_components/WgStandardTable';

import { getColumns } from '@/columns/columnsConfig';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ deptManage, deptUnitConverterManage, loading, basicData }) => ({
  deptManage,
  deptUnitConverterManage,
  loading: loading.models.deptManage,
  deptUnitConverterLoading: loading.models.deptUnitConverterManage,
  basicData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 新增界面
    modalVisible: {
      add: false,
      update: false,
      techParam: false,
      updateFix: false,
      unitConverter: false,
    },
    formValues: {},
    currentFormValues: {},
    // 其他
    expandForm: false,
    selectedRows: [],
    queryFilters: [],
  };

  columnConfigKey = 'dept';

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptManage/fetch',
      payload: this.currentPagination,
    });
    dispatch({
      type: 'deptManage/getType',
    });
    dispatch({
      type: 'basicData/getWorkShops',
    });
    if (hasAuthority('UnitConverter_Read')) {
      dispatch({
        type: 'basicData/getUnitConverter',
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
      type: 'deptManage/fetch',
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
    if (fieldsValue.queryWorkShop)
      queryFilters.push({ name: 'fWorkShop', compare: '=', value: fieldsValue.queryWorkShop });
    if (fieldsValue.queryName)
      queryFilters.push({ name: 'fName', compare: '%*%', value: fieldsValue.queryName });
    if (fieldsValue.queryIsActive)
      queryFilters.push({ name: 'fIsActive', compare: '=', value: fieldsValue.queryIsActive });

    this.setState({
      formValues: values,
      queryFilters,
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
        type: 'deptManage/fetch',
        payload: pagination,
      });
    });
    this.handleSelectRows([]);
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
      type: 'deptManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      let fileName = '岗位.xls';
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          fileName = `岗位-第${pagination.current}页.xls`;
          break;
        case 'allPage':
          break;
        default:
          break;
      }
      exportExcel('/api/dept/export', pagination, fileName);
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

  handleSync = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptManage/sync',
    }).then(() => {
      const {
        deptManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('同步成功');
        // 成功后再次刷新列表
        this.search();
      } else {
        message.warning(queryResult.message);
      }
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

  handleUpdateFixModalVisible = (flag, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: { ...modalVisible, updateFix: !!flag },
      currentFormValues: record || {},
    });
  };

  handleTechParamModalVisible = (flag, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: { ...modalVisible, techParam: !!flag },
      currentFormValues: record || {},
    });
  };

  handleUnitConverterModalVisible = (flag, record) => {
    const { modalVisible } = this.state;
    const { dispatch } = this.props;
    this.setState({
      modalVisible: { ...modalVisible, unitConverter: !!flag },
      currentFormValues: record || {},
    });
    if (record && record.fItemID) {
      dispatch({
        type: 'deptUnitConverterManage/get',
        payload: { id: record.fItemID },
      });
    }
  };

  handleAdd = fields => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'deptManage/add',
      payload: fields,
    }).then(() => {
      const {
        deptManage: { queryResult },
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
      type: 'deptManage/update',
      payload: fields,
    }).then(() => {
      const {
        deptManage: { queryResult },
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

  handleUpdateFix = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptManage/updateFix',
      payload: fields,
    }).then(() => {
      const {
        deptManage: { queryResult },
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

  handleTechParam = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptManage/updateTechParam',
      payload: fields,
    }).then(() => {
      const {
        deptManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('修改成功');
        this.handleTechParamModalVisible();
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
      type: 'deptManage/active',
      payload: {
        fItemID: record.fItemID,
        fIsActive,
      },
    }).then(() => {
      const {
        deptManage: { queryResult },
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
      type: 'deptManage/remove',
      payload: {
        fItemID: record.fItemID,
      },
    }).then(() => {
      this.setState({
        selectedRows: [],
      });
      const {
        deptManage: { queryResult },
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

  unitConverterSubmit = () => {
    const {
      dispatch,
      deptUnitConverterManage: { deptUnitConverters },
    } = this.props;
    const {
      currentFormValues: { fItemID },
    } = this.state;
    dispatch({
      type: 'deptUnitConverterManage/update',
      payload: {
        fItemID,
        fUnitConverterIDs: deptUnitConverters.map(x => x.fItemID),
      },
    }).then(() => {
      const {
        deptManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('修改成功');
        this.handleUnitConverterModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleUnitConverterChange = converters => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deptUnitConverterManage/change',
      payload: converters,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      basicData: { workshops },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="车间">
              {getFieldDecorator('queryWorkShop')(
                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                  {workshops &&
                    workshops.map(x => (
                      <Option key={x.fNumber} value={x.fItemID}>
                        {x.fName}
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('queryName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryIsActive')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
              )}
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

  renderOperator() {
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('Dept_Delete')}>
          删除
        </Menu.Item>
        <Menu.Item key="active" disabled={!hasAuthority('Dept_Active')}>
          批量启用
        </Menu.Item>
        <Menu.Item key="deactive" disabled={!hasAuthority('Dept_Active')}>
          批量禁用
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Authorized authority="Dept_Create">
          <Button icon="plus" type="primary" onClick={() => this.handleSync()}>
            从 ERP 同步
          </Button>
        </Authorized>
        <Authorized authority="Dept_Create">
          <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
            新建
          </Button>
        </Authorized>
        <Authorized authority="Dept_Export">
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
            <Authorized authority="Dept_Delete">
              <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
            </Authorized>
            <Authorized authority={['Dept_Delete', 'Dept_Active']}>
              <Dropdown overlay={menu}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </Authorized>
          </span>
        )}
        <div style={{ float: 'right', marginRight: 24 }}>
          <Button
            icon="menu"
            onClick={() => {
              if (this.showConfig) this.showConfig();
            }}
          >
            列配置
          </Button>
        </div>
      </div>
    );
  }

  getColumnOps = () => {
    return [
      {
        dataIndex: 'workTimeList',
        render(val) {
          return (
            val &&
            val.map(x => (
              <Tag key={x.fWorkTimeID} color={x.fIsActive ? 'green' : undefined}>
                {x.fWorkTimeName}
              </Tag>
            ))
          );
        },
      },
      {
        dataIndex: 'fIsActive',
        filters: [
          {
            text: '启用',
            value: 1,
          },
          {
            text: '禁用',
            value: 0,
          },
        ],
        render(val) {
          return <Switch disabled checked={val} />;
        },
      },
      {
        dataIndex: 'operators',
        render: (text, record) => (
          <Fragment>
            <Authorized authority="Dept_Update">
              <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
              <Divider type="vertical" />
            </Authorized>
            <Authorized authority="Dept_Delete">
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDelete(record)}>
                <a>删除</a>
              </Popconfirm>
            </Authorized>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="updateBillNoRule"
                    disabled={
                      !hasAuthority('BillNoRule_Update') || record.fTypeNumber !== 'WorkShop'
                    }
                    onClick={() => this.handleUpdateFixModalVisible(true, record)}
                  >
                    编码规则
                  </Menu.Item>
                  <Menu.Item
                    key="updateParams"
                    disabled={!hasAuthority('Dept_Update') || record.fTypeNumber !== 'Process'}
                    onClick={() => this.handleTechParamModalVisible(true, record)}
                  >
                    工艺参数
                  </Menu.Item>
                  {hasAuthority('UnitConverter_Read') && (
                    <Menu.Item
                      key="unitConverter"
                      disabled={!hasAuthority('Dept_Update') || record.fTypeNumber !== 'Process'}
                      onClick={() => this.handleUnitConverterModalVisible(true, record)}
                    >
                      单位转换
                    </Menu.Item>
                  )}
                  <Menu.Item
                    key="active"
                    disabled={!hasAuthority('Dept_Active')}
                    onClick={() => this.handleActive(record, !record.fIsActive)}
                  >
                    {record.fIsActive ? '禁用' : '启用'}
                  </Menu.Item>
                </Menu>
              }
            >
              <a>
                <Divider type="vertical" />
                更多 <Icon type="down" />
              </a>
            </Dropdown>
          </Fragment>
        ),
      },
    ];
  };

  render() {
    const {
      deptManage: { data, queryResult, treeData, typeData },
      deptUnitConverterManage: { deptUnitConverters },
      loading,
      deptUnitConverterLoading,
      dispatch,
      basicData: { unitConverters },
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      currentFormValues,
      authorityModalVisible,
      authorizeUserModalVisible,
    } = this.state;

    const parentMethods = {
      handleSubmit: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleModalVisible: this.handleUpdateModalVisible,
      handleSubmit: this.handleUpdate,
    };
    const techParamMethods = {
      handleModalVisible: this.handleTechParamModalVisible,
      handleSubmit: this.handleTechParam,
      dispatch,
    };
    const columns = getColumns({ key: 'dept', columnOps: this.getColumnOps() });

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>{this.renderOperator()}</div>
              {/* defaultExpandAllRows在Table首次初始化有数据时才会起作用，若不是会导致无法展开问题
            详见 https://github.com/ant-design/ant-design/issues/4145 */}
              {data && data.list && data.list.length ? (
                <WgStandardTable
                  rowKey="fItemID"
                  defaultExpandAllRows
                  selectedRows={selectedRows}
                  loading={loading || deptUnitConverterLoading}
                  data={data}
                  columns={columns}
                  onSelectRow={this.handleSelectRows}
                  onChange={this.handleStandardTableChange}
                  // 以下属性与列配置相关
                  configKey={this.columnConfigKey}
                  refShowConfig={showConfig => {
                    this.showConfig = showConfig;
                  }}
                />
              ) : (
                <StandardTable
                  rowKey="fItemID"
                  bordered
                  selectedRows={[]}
                  columns={columns}
                  loading={loading || deptUnitConverterLoading}
                />
              )}
            </div>
          </Card>
          <CreateForm
            {...parentMethods}
            modalVisible={modalVisible.add}
            treeData={treeData}
            typeData={typeData}
          />
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={modalVisible.update}
              values={currentFormValues}
              treeData={treeData}
              typeData={typeData}
            />
          ) : null}
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <UpdateFixForm
              modalVisible={modalVisible.updateFix}
              values={currentFormValues}
              handleModalVisible={this.handleUpdateFixModalVisible}
              handleSubmit={this.handleUpdateFix}
            />
          ) : null}
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <TechParamForm
              {...techParamMethods}
              modalVisible={modalVisible.techParam}
              values={currentFormValues}
            />
          ) : null}
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <UnitConverterForm
              loading={deptUnitConverterLoading}
              handleModalVisible={this.handleUnitConverterModalVisible}
              onChange={this.handleUnitConverterChange}
              onSubmit={this.unitConverterSubmit}
              modalVisible={modalVisible.unitConverter}
              unitConverters={unitConverters}
              data={deptUnitConverters}
              values={currentFormValues}
            />
          ) : null}
        </GridContent>
      </div>
    );
  }
}

export default TableList;
