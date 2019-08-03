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
  Radio,
  DatePicker,
  TreeSelect,
  Switch,
} from 'antd';
import ReportTable from '@/components/ReportTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { default as ColumnConfig } from './ColumnConfig';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => "'" + obj[key] + "'")
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ invManage, loading, basicData }) => ({
  invManage,
  loading: loading.models.invManage,
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
    groupByWorkShop: true,
    groupByDept: true,
  };

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
    groupByWorkShop: !!this.state.groupByWorkShop,
    groupByDept: !!this.state.groupByDept,
    groupByMo: !!this.state.groupByMo,
    groupByMission: !!this.state.groupByMission,
    groupByProduct: !!this.state.groupByProduct,
    groupByBatchNo: !!this.state.groupByBatchNo,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'invManage/fetch',
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
      groupByWorkShop: !!this.state.groupByWorkShop,
      groupByDept: !!this.state.groupByDept,
      groupByMo: !!this.state.groupByMo,
      groupByMission: !!this.state.groupByMission,
      groupByProduct: !!this.state.groupByProduct,
      groupByBatchNo: !!this.state.groupByBatchNo,
    };
    if (sorter.field) {
      this.currentPagination.sorter = {};
      this.currentPagination.sorter[sorter.field] = sorter.order.replace('end', '');
    }

    dispatch({
      type: 'invManage/fetch',
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
      groupByWorkShop: !!this.state.groupByWorkShop,
      groupByDept: !!this.state.groupByDept,
      groupByMo: !!this.state.groupByMo,
      groupByMission: !!this.state.groupByMission,
      groupByProduct: !!this.state.groupByProduct,
      groupByBatchNo: !!this.state.groupByBatchNo,
    };

    return this.currentPagination;
  };

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      dispatch({
        type: 'invManage/fetch',
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
      groupByWorkShop: !!this.state.groupByWorkShop,
      groupByDept: !!this.state.groupByDept,
      groupByMo: !!this.state.groupByMo,
      groupByMission: !!this.state.groupByMission,
      groupByProduct: !!this.state.groupByProduct,
      groupByBatchNo: !!this.state.groupByBatchNo,
    };

    dispatch({
      type: 'invManage/fetch',
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
    // this.setState({ fBeginDate: value[0], fEndDate: value[1] });
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
      invManage: { data },
      loading,
    } = this.props;

    const columns = ColumnConfig.getColumns(this.state);
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
              {/* <div className={styles.tableListOperator}>
              </div> */}
              <div className={styles.tableListGroup}>
                <Form layout="inline">
                  <FormItem>分组汇总：</FormItem>
                  <FormItem label="物料">
                    <Switch
                      defaultChecked={!!this.state.groupByProduct}
                      onChange={checked => this.changeGroupBy('groupByProduct', checked)}
                    />
                  </FormItem>
                  <FormItem label="车间">
                    <Switch
                      defaultChecked={!!this.state.groupByWorkShop}
                      onChange={checked => this.changeGroupBy('groupByWorkShop', checked)}
                    />
                  </FormItem>
                  <FormItem label="岗位">
                    <Switch
                      defaultChecked={!!this.state.groupByDept}
                      onChange={checked => this.changeGroupBy('groupByDept', checked)}
                    />
                  </FormItem>
                  <FormItem label="ERP 任务单">
                    <Switch
                      defaultChecked={!!this.state.groupByMo}
                      onChange={checked => this.changeGroupBy('groupByMo', checked)}
                    />
                  </FormItem>
                  <FormItem label="生产任务单">
                    <Switch
                      defaultChecked={!!this.state.groupByMission}
                      onChange={checked => this.changeGroupBy('groupByMission', checked)}
                    />
                  </FormItem>
                  <FormItem label="批号">
                    <Switch
                      defaultChecked={!!this.state.groupByBatchNo}
                      onChange={checked => this.changeGroupBy('groupByBatchNo', checked)}
                    />
                  </FormItem>
                </Form>
              </div>
              <ReportTable
                rowKey="rownumber"
                bordered
                loading={loading}
                data={data}
                columns={columns}
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
