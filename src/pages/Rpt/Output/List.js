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
  Modal,
  message,
  Table,
  DatePicker,
  TreeSelect,
  Switch,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { exportExcel } from '@/utils/getExcel';
import { default as ColumnConfig } from './ColumnConfig';
import { WgStandardTable } from '@/wg_components/WgStandardTable';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => "'" + obj[key] + "'")
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ outputManage, loading, basicData }) => ({
  outputManage,
  loading: loading.models.outputManage,
  basicData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 界面是否可见
    modalVisible: {},
    formValues: {},
    // 当前操作选中列的数据
    currentFormValues: {},
    // expandForm: 是否展开更多查询条件
    expandForm: false,
    queryFilters: [],
    groupByDept: true,
  };

  columnConfigKey = 'reportOutput';

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
    groupByDept: !!this.state.groupByDept,
    groupByDate: !!this.state.groupByDate,
    groupByMachine: !!this.state.groupByMachine,
    groupByMission: !!this.state.groupByMission,
    groupByOperator: !!this.state.groupByOperator,
    groupByProduct: !!this.state.groupByProduct,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'outputManage/fetch',
      payload: this.currentPagination,
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
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
      groupByDept: !!this.state.groupByDept,
      groupByDate: !!this.state.groupByDate,
      groupByMachine: !!this.state.groupByMachine,
      groupByMission: !!this.state.groupByMission,
      groupByOperator: !!this.state.groupByOperator,
      groupByProduct: !!this.state.groupByProduct,
    };
    if (sorter.field) {
      this.currentPagination.sorter = {};
      this.currentPagination.sorter[sorter.field] = sorter.order.replace('end', '');
    }

    dispatch({
      type: 'outputManage/fetch',
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
    if (fieldsValue.fDate) {
      queryFilters.push({
        name: 'fTransferDateTime',
        compare: '>=',
        value: fieldsValue.fDate[0].format('YYYY-MM-DD HH:mm'),
      });
      queryFilters.push({
        name: 'fTransferDateTime',
        compare: '<=',
        value: fieldsValue.fDate[1].format('YYYY-MM-DD HH:mm'),
      });
    }
    // 岗位
    if (fieldsValue.queryDept) {
      queryFilters.push({ name: 'fDeptID', compare: '=', value: fieldsValue.queryDept });
    }

    this.setState({
      formValues: values,
      queryFilters: queryFilters,
    });

    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters,
      groupByDept: !!this.state.groupByDept,
      groupByDate: !!this.state.groupByDate,
      groupByMachine: !!this.state.groupByMachine,
      groupByMission: !!this.state.groupByMission,
      groupByOperator: !!this.state.groupByOperator,
      groupByProduct: !!this.state.groupByProduct,
    };

    return this.currentPagination;
  };

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      dispatch({
        type: 'outputManage/fetch',
        payload: pagination,
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
      groupByDept: !!this.state.groupByDept,
      groupByDate: !!this.state.groupByDate,
      groupByMachine: !!this.state.groupByMachine,
      groupByMission: !!this.state.groupByMission,
      groupByOperator: !!this.state.groupByOperator,
      groupByProduct: !!this.state.groupByProduct,
    };

    dispatch({
      type: 'outputManage/fetch',
      payload: this.currentPagination,
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
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

  changeGroupBy(group, checked) {
    const state = this.state;
    state[group] = checked;
    this.setState({ ...state });
  }

  handleChangeDate = value => {
    this.setState({ fBeginDate: value[0], fEndDate: value[1] });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let pagination = this.getSearchParam(fieldsValue);
      let fileName = '产量报表.xls';
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          fileName = '产量报表-第' + pagination.current + '页.xls';
          break;
        case 'allPage':
          pagination.exportPage = false;
          break;
        default:
          break;
      }
      exportExcel('/api/output/export', pagination, fileName);
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      basicData: { processDeptTree },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('fDate', {
                rules: [{ required: true, message: '请选择时间' }],
                initialValue: [moment().add(-1, 'months'), moment()],
              })(
                <RangePicker
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开工时间', '完工时间']}
                  onOk={this.handleChangeDate}
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator('queryDept', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={processDeptTree}
                  treeDefaultExpandAll
                  allowClear={true}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
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
              <Authorized authority="Output_Read">
                <Dropdown
                  overlay={
                    <Menu onClick={this.handleExport} selectedKeys={[]}>
                      <Menu.Item key="currentPage">当前页</Menu.Item>
                      <Menu.Item key="allPage">所有页</Menu.Item>
                    </Menu>
                  }
                >
                  <Button icon="download" style={{ marginLeft: 8 }}>
                    导出
                    <Icon type="down" />
                  </Button>
                </Dropdown>
              </Authorized>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm} hidden>
                展开 <Icon type="down" />
              </a>
              <Button
                icon="menu"
                onClick={() => {
                  if (this.showConfig) this.showConfig();
                }}
              >
                列配置
              </Button>
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
      outputManage: { data },
      loading,
    } = this.props;

    const columns = ColumnConfig.getColumns(this.state);

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              {/* <div className={styles.tableListOperator}>
              </div> */}
              <div className={styles.tableListGroup}>
                <Form layout="inline">
                  <FormItem>分组汇总：</FormItem>
                  <FormItem label="岗位">
                    <Switch
                      defaultChecked={!!this.state.groupByDept}
                      onChange={checked => this.changeGroupBy('groupByDept', checked)}
                    />
                  </FormItem>
                  <FormItem label="任务单">
                    <Switch
                      defaultChecked={!!this.state.groupByMission}
                      onChange={checked => this.changeGroupBy('groupByMission', checked)}
                    />
                  </FormItem>
                  <FormItem label="日期">
                    <Switch
                      defaultChecked={!!this.state.groupByDate}
                      onChange={checked => this.changeGroupBy('groupByDate', checked)}
                    />
                  </FormItem>
                  <FormItem label="机台">
                    <Switch
                      defaultChecked={!!this.state.groupByMachine}
                      onChange={checked => this.changeGroupBy('groupByMachine', checked)}
                    />
                  </FormItem>
                  <FormItem label="操作员">
                    <Switch
                      defaultChecked={!!this.state.groupByOperator}
                      onChange={checked => this.changeGroupBy('groupByOperator', checked)}
                    />
                  </FormItem>
                  <FormItem label="物料">
                    <Switch
                      defaultChecked={!!this.state.groupByProduct}
                      onChange={checked => this.changeGroupBy('groupByProduct', checked)}
                    />
                  </FormItem>
                </Form>
              </div>
              <WgStandardTable
                rowKey="rownumber"
                loading={loading}
                data={data}
                columns={columns}
                onChange={this.handleStandardTableChange}
                // 以下属性与列配置相关
                configKey={this.columnConfigKey}
                refShowConfig={showConfig => {
                  this.showConfig = showConfig;
                }}
                showAlert={false}
                selectabel={false}
              />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default TableList;
