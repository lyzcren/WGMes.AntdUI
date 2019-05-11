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
  TreeSelect,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { UpdateForm } from './UpdateForm';
import { ViewStepForm } from './ViewStepForm';
import { default as ColumnConfig } from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';
import { GlobalConst, badgeStatusList } from '@/utils/GlobalConst';

import styles from './List.less';
import { tsImportType } from '@babel/types';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => "'" + obj[key] + "'")
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ flowManage, loading, basicData }) => ({
  flowManage,
  loading: loading.models.flowManage,
  basicData,
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
    // 操作员查询条件
    operatorForm: true,
    selectedRows: [],
    queryFilters: [],
    queryDeptID: null,
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
      type: 'flowManage/fetch',
      payload: params,
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
    // 列配置相关方法
    ColumnConfig.UpdateModalVisibleCallback = record => this.handleUpdateModalVisible(true, record);
    ColumnConfig.DeleteCallback = record => this.handleDelete(record);
    ColumnConfig.MissionModalVisibleCallback = record =>
      this.handleMissionModalVisible(true, record);
    ColumnConfig.RouteModalVisibleCallback = record => this.handleRouteModalVisible(true, record);
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
      type: 'flowManage/fetch',
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
    // 当前工序可签收
    if (fieldsValue.queryDept && fieldsValue.queryStatusNumber === 'ManufWait4Sign')
      queryFilters.push({ name: 'fNextDeptIDs', compare: '%*%', value: fieldsValue.queryDept });
    // 当前工序生产中
    else if (fieldsValue.queryDept && fieldsValue.queryStatusNumber === 'ManufProducing')
      queryFilters.push({ name: 'fCurrentDeptID', compare: '=', value: fieldsValue.queryDept });
    // 当前工序已完成
    else if (fieldsValue.queryDept && fieldsValue.queryStatusNumber === 'ManufEndProduce')
      queryFilters.push({ name: 'fFullBatchNo', compare: '%*%', value: fieldsValue.queryDept });
    // 只选择部门，未选择状态，该部门在工艺路线内即可
    else if (fieldsValue.queryDept)
      queryFilters.push({ name: 'fAllDeptIDs', compare: '%*%', value: fieldsValue.queryDept });
    // 无工序时查询流程单状态
    else if (fieldsValue.queryStatusNumber)
      queryFilters.push({
        name: 'fStatusNumber',
        compare: '=',
        value: fieldsValue.queryStatusNumber,
      });
    if (fieldsValue.queryBatchNo)
      queryFilters.push({ name: 'fFullBatchNo', compare: '%*%', value: fieldsValue.queryBatchNo });
    if (fieldsValue.queryMoBillNo)
      queryFilters.push({ name: 'fMoBillNo', compare: '%*%', value: fieldsValue.queryMoBillNo });
    if (fieldsValue.querySoBillNo)
      queryFilters.push({ name: 'fSoBillNo', compare: '%*%', value: fieldsValue.querySoBillNo });
    if (fieldsValue.queryRouteName)
      queryFilters.push({ name: 'fRouteName', compare: '%*%', value: fieldsValue.queryRouteName });
    if (fieldsValue.queryRouteNumber)
      queryFilters.push({
        name: 'fRouteNumber',
        compare: '%*%',
        value: fieldsValue.queryRouteNumber,
      });
    if (fieldsValue.queryProductName)
      queryFilters.push({
        name: 'fProductName',
        compare: '%*%',
        value: fieldsValue.queryProductName,
      });
    if (fieldsValue.queryProductFullName)
      queryFilters.push({
        name: 'fProductFullName',
        compare: '%*%',
        value: fieldsValue.queryProductFullName,
      });
    if (fieldsValue.queryProductNumber)
      queryFilters.push({
        name: 'fProductNumber',
        compare: '%*%',
        value: fieldsValue.queryProductNumber,
      });

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
    const params = { pagination: this.currentPagination };

    return params;
  };

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const params = this.getSearchParam(fieldsValue);
      dispatch({
        type: 'flowManage/fetch',
        payload: params,
      });
      this.setState({ queryDeptID: fieldsValue.queryDept });
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
    const params = { pagination: this.currentPagination };

    dispatch({
      type: 'flowManage/fetch',
      payload: params,
    });
    this.setState({ queryDeptID: null });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

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
      exportExcel('/api/flow/export', params, fileName);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  toggleOperatorForm = () => {
    const { operatorForm } = this.state;
    this.setState({
      operatorForm: !operatorForm,
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

  transferModalVisible = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/flow/transfer', data: record },
    });
  };

  handleSign = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowManage/sign',
      payload: {
        fInterID: record.fInterID,
        fDeptID: this.state.queryDeptID,
      },
      callback: () => {
        const {
          flowManage: { queryResult },
        } = this.props;
        if (queryResult.status === 'ok') {
          message.success('【' + record.fFullBatchNo + '】' + '签收成功');
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

  renderOperation = (val, record) => {
    const { queryDeptID } = this.state;
    if (queryDeptID) {
      return (
        <Fragment>
          <Authorized authority="Flow_Sign">
            <a
              disabled={!record.fNextDeptIDList || !record.fNextDeptIDList.includes(queryDeptID)}
              onClick={() => this.handleSign(record)}
            >
              签收
            </a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Flow_Transfer">
            <a onClick={() => this.transferModalVisible(record)}>转序</a>
            <Divider type="vertical" />
          </Authorized>
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
                <Menu.Item key="edit">编辑</Menu.Item>
                <Menu.Item key="delete">删除</Menu.Item>
              </Menu>
            }
          >
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      );
    } else {
      return (
        <Fragment>
          <Authorized authority="Flow_Transfer">
            <a onClick={() => this.transferModalVisible(record)}>转序</a>
            <Divider type="vertical" />
          </Authorized>
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => editAndDelete(key, props.current)}>
                <Menu.Item key="edit">编辑</Menu.Item>
                <Menu.Item key="delete">删除</Menu.Item>
              </Menu>
            }
          >
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      );
    }
  };

  // 为操作员定制的查询条件
  renderOperatorForm() {
    const {
      form: { getFieldDecorator },
      basicData,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem id="queryDept" label="部门">
              {getFieldDecorator('queryDept', {
                rules: [{ required: true, message: '请选择部门' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={basicData.processDeptTree}
                  treeDefaultExpandAll
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryStatusNumber')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {badgeStatusList(GlobalConst.ManufStatusArray).map(x => (
                    <Option key={x.value} value={x.value}>
                      {x.text}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem id="queryBatchNo" label="批号">
              {getFieldDecorator('queryBatchNo')(<Input placeholder="请输入" />)}
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleOperatorForm}>
                切换
              </a>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem id="queryBatchNo" label="批号">
              {getFieldDecorator('queryBatchNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem id="queryMoBillNo" label="任务单号">
              {getFieldDecorator('queryMoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryStatusNumber')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {badgeStatusList(GlobalConst.FlowStatusArray).map(x => (
                    <Option key={x.value} value={x.value}>
                      {x.text}
                    </Option>
                  ))}
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleOperatorForm}>
                切换
              </a>
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
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem id="queryBatchNo" label="批号">
              {getFieldDecorator('queryBatchNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem id="queryMoBillNo" label="生产任务单号">
              {getFieldDecorator('queryMoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem id="querySoBillNo" label="订单号">
              {getFieldDecorator('querySoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryStatusNumber')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {badgeStatusList(GlobalConst.FlowStatusArray).map(x => (
                    <Option key={x.value} value={x.value}>
                      {x.text}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工艺路线">
              {getFieldDecorator('queryRouteName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="工艺路线编码">
              {getFieldDecorator('queryRouteNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('queryProductName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品全称">
              {getFieldDecorator('queryProductFullName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品编码">
              {getFieldDecorator('queryProductNumber')(<Input placeholder="请输入" />)}
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
    const { expandForm, operatorForm } = this.state;
    return expandForm
      ? this.renderAdvancedForm()
      : operatorForm
      ? this.renderOperatorForm()
      : this.renderSimpleForm();
  }

  render() {
    const {
      flowManage: { data, queryResult },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, currentFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('Flow_Delete')}>
          删除
        </Menu.Item>
      </Menu>
    );

    const updateMethods = {
      dispatch: this.props.dispatch,
      handleModalVisible: this.handleUpdateModalVisible,
      handleSuccess: this.search,
    };
    const routeMethods = {
      dispatch: this.props.dispatch,
      handleModalVisible: this.handleRouteModalVisible,
    };
    // 指定操作列
    ColumnConfig.renderOperation = this.renderOperation;

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
                <Authorized authority="Flow_Export">
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
                    <Authorized authority="Flow_Delete">
                      <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
                    </Authorized>
                    <Authorized authority={['Flow_Delete', 'Flow_Active']}>
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
