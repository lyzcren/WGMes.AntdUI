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
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { FlowForm } from './FlowForm';
import ColumnConfig from './ColumnConfig';
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
@connect(({ missionManage, loading, menu }) => ({
  missionManage,
  loading: loading.models.missionManage,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 界面是否可见
    modalVisible: {
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
    const params = { pagination: this.currentPagination };
    dispatch({
      type: 'missionManage/fetch',
      payload: params,
    });
    // 列配置相关方法
    ColumnConfig.ProfileModalVisibleCallback = record =>
      this.handleProfileModalVisible(true, record);
    ColumnConfig.FlowModalVisibleCallback = record => this.handleFlowModalVisible(true, record);
    ColumnConfig.DeleteCallback = record => this.handleDelete(record);
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
      type: 'missionManage/fetch',
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
    if (fieldsValue.querySOBillNo)
      queryFilters.push({ name: 'fSOBillNo', compare: '%*%', value: fieldsValue.querySOBillNo });
    if (fieldsValue.queryMOBillNo)
      queryFilters.push({ name: 'fMOBillNo', compare: '%*%', value: fieldsValue.queryMOBillNo });

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
        type: 'missionManage/fetch',
        payload: params,
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
    const params = { pagination: this.currentPagination };

    dispatch({
      type: 'missionManage/fetch',
      payload: params,
    });
    this.handleSelectRows([]);
  };

  handleSync = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'missionManage/sync',
    }).then(() => {
      const {
        missionManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('同步生产任务成功');
        // 成功后再次刷新列表
        this.search();
      } else {
        message.warning(queryResult.message);
      }
    });
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
      exportExcel('/api/mission/export', params, fileName);
    });
  };

  handleProfileModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/mission/profile', data: record },
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

  handleFlowModalVisible = (flag, record) => {
    const { modalVisible } = this.state;
    this.setState({
      modalVisible: { ...modalVisible, update: !!flag },
      currentFormValues: record || {},
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
            <FormItem id="querySOBillNo" label="订单号">
              {getFieldDecorator('querySOBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem id="queryMOBillNo" label="生产任务单号">
              {getFieldDecorator('queryMOBillNo')(<Input placeholder="请输入" />)}
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
      missionManage: { data, queryResult },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      currentFormValues,
      authorityModalVisible,
      authorizeUserModalVisible,
    } = this.state;

    const flowMethods = {
      handleModalVisible: this.handleFlowModalVisible,
      dispatch: this.props.dispatch,
      handleSuccess: this.search,
    };
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
                <Authorized authority="Mission_Sync">
                  <Button icon="plus" type="primary" onClick={() => this.handleSync()}>
                    从 K3 同步
                  </Button>
                </Authorized>
                <Authorized authority="Mission_Export">
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
                columns={ColumnConfig.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scroll={{ x: scrollX }}
              />
            </div>
          </Card>
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <FlowForm
              {...flowMethods}
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
