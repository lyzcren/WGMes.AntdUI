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
@connect(({ recordManage, loading, basicData }) => ({
  recordManage,
  loading: loading.models.recordManage,
  basicData,
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
      type: 'recordManage/fetch',
      payload: this.currentPagination,
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
    dispatch({
      type: 'basicData/getStatus',
      payload: { number: 'recordStatus' },
    });
    // 列配置相关方法
    ColumnConfig.missionModalVisibleCallback = record =>
      this.handleMissionModalVisible(true, record);
    ColumnConfig.profileVisible = record => this.profileVisible(record);
  }

  statusFilter = () => {
    const {
      basicData: {
        status: { recordStatus },
      },
    } = this.props;
    const badgeStatus = !recordStatus
      ? []
      : recordStatus.map(x => {
          return {
            text: <Badge color={x.fColor} text={x.fValue} />,
            value: x.fKeyName,
          };
        });
    return badgeStatus;
  };

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
      type: 'recordManage/fetch',
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
    if (fieldsValue.queryMoBillNo)
      queryFilters.push({ name: 'fMoBillNo', compare: '%*%', value: fieldsValue.queryMoBillNo });

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
        type: 'recordManage/fetch',
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
      type: 'recordManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      let fileName = '生产记录.xls';
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          fileName = '生产记录-第' + pagination.current + '页.xls';
          break;
        case 'allPage':
          pagination.exportPage = false;
          break;
        default:
          break;
      }
      exportExcel('/api/record/export', pagination, fileName);
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  profileVisible = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/record/profile', data: record },
    });
  };

  handleMissionModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/mission/profile', data: { fInterID: record.fMissionID } },
    });
  };

  handleModalVisible = (key, flag, record) => {
    const { modalVisible } = this.state;
    modalVisible[key] = !!flag;
    this.setState({
      modalVisible: { modalVisible },
      currentFormValues: record || {},
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      basicData,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="部门">
              {getFieldDecorator('queryDept', {
                rules: [{ required: false, message: '请选择部门' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={basicData.processDeptTree}
                  treeDefaultExpandAll
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
            <FormItem label="任务单号">
              {getFieldDecorator('queryMoBillNo')(<Input placeholder="请输入" />)}
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
    return renderSimpleForm;
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      dispatch,
      recordManage: { data, queryResult },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      currentFormValues,
      authorityModalVisible,
      authorizeUserModalVisible,
    } = this.state;

    const updateMethods = {
      dispatch,
      handleModalVisible: (value, record) => this.handleModalVisible('update', value, record),
      handleSuccess: this.search,
    };

    ColumnConfig.statusFilter = this.statusFilter();
    const columns = ColumnConfig.getColumns();
    const scrollX = columns
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
                <Authorized authority="Record_Export">
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
                rowKey="fInterID"
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
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
        </GridContent>
      </div>
    );
  }
}

export default TableList;
