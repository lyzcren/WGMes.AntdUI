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
  Dropdown,
  Menu,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { exportExcel } from '@/utils/getExcel';
import { default as ColumnConfig } from './ColumnConfig';
import WgStandardTable from '@/wg_components/WgStandardTable';
import DefectDrawer from './components/DefectDrawer';
import { mergeColumns } from '@/utils/wgUtils';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => `'${obj[key]}'`)
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ passRateManage, loading, basicData }) => ({
  passRateManage,
  loading: loading.models.passRateManage,
  defectDrawerLoading: loading.effects['passRateManage/fetchDetails'],
  basicData,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 界面是否可见
    defectDrawerVisible: false,
    formValues: {},
    // 当前操作选中列的数据
    currentFormValues: {},
    // expandForm: 是否展开更多查询条件
    expandForm: false,
    queryFilters: [],
  };

  columnConfigKey = 'reportPassRate';

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
    groupByDate: !!this.state.groupByDate,
    groupByWeek: !!this.state.groupByWeek,
    groupByMonth: !!this.state.groupByMonth,
    groupByMachine: !!this.state.groupByMachine,
    groupByMission: !!this.state.groupByMission,
    groupByOperator: !!this.state.groupByOperator,
    groupByProduct: !!this.state.groupByProduct,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
    this.search();
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
      groupByDate: !!this.state.groupByDate,
      groupByWeek: !!this.state.groupByWeek,
      groupByMonth: !!this.state.groupByMonth,
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
      type: 'passRateManage/fetch',
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
      queryFilters.push({ name: 'fTransferDateTime', compare: '>=', value: fieldsValue.fDate[0] });
      queryFilters.push({ name: 'fTransferDateTime', compare: '<=', value: fieldsValue.fDate[1] });
    }
    // 岗位
    if (fieldsValue.queryDept) {
      queryFilters.push({ name: 'fDeptID', compare: '=', value: fieldsValue.queryDept });
    }

    this.setState({
      formValues: values,
      queryFilters,
    });

    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters,
      groupByDate: !!this.state.groupByDate,
      groupByWeek: !!this.state.groupByWeek,
      groupByMonth: !!this.state.groupByMonth,
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
        type: 'passRateManage/fetch',
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
      groupByDate: !!this.state.groupByDate,
      groupByWeek: !!this.state.groupByWeek,
      groupByMonth: !!this.state.groupByMonth,
      groupByMachine: !!this.state.groupByMachine,
      groupByMission: !!this.state.groupByMission,
      groupByOperator: !!this.state.groupByOperator,
      groupByProduct: !!this.state.groupByProduct,
    };

    this.search();

    // dispatch({
    //   type: 'passRateManage/fetch',
    //   payload: this.currentPagination,
    // });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  showResult(queryResult, successCallback) {
    const { status, model } = queryResult;

    if (status === 'ok') {
      if (successCallback) successCallback(model);
      else {
        message.success(queryResult.message);
      }
    } else if (status === 'warning') {
      message.warning(queryResult.message);
    } else {
      message.error(queryResult.message);
    }
  }

  changeGroupBy(group, checked) {
    const { state } = this;
    state[group] = checked;
    this.setState({ ...state });
  }

  changeGroupByDate(e) {
    const {
      target: { value },
    } = e;
    if (value === 'groupByDate') {
      this.setState({ groupByDate: true, groupByWeek: false, groupByMonth: false });
    } else if (value === 'groupByWeek') {
      this.setState({ groupByDate: false, groupByWeek: true, groupByMonth: false });
    } else if (value === 'groupByMonth') {
      this.setState({ groupByDate: false, groupByWeek: false, groupByMonth: true });
    } else {
      this.setState({ groupByDate: false, groupByWeek: false, groupByMonth: false });
    }
    setTimeout(() => {
      this.search();
    }, 20);
  }

  handleChangeDate = value => {
    this.setState({ fBeginDate: value[0], fEndDate: value[1] });
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
                  allowClear
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
              <Authorized authority="PassRate_Read">
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

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      let fileName = '岗位良率报表.xls';
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          fileName = `岗位良率报表-第${pagination.current}页.xls`;
          break;
        case 'allPage':
          pagination.exportPage = false;
          break;
        default:
          break;
      }
      exportExcel('/api/passRate/export', pagination, fileName);
    });
  };

  handleDefectDrawerVisible = (flag, record) => {
    const { dispatch } = this.props;
    this.setState({ defectDrawerVisible: !!flag });
    if (record) {
      dispatch({
        type: 'passRateManage/fetchDetails',
        payload: {
          ...this.currentPagination,
          ...record,
        },
      });
    }
  };

  renderDefectDrawer = () => {
    const {
      defectDrawerLoading,
      passRateManage: { head, details },
    } = this.props;
    const { defectDrawerVisible } = this.state;
    return (
      <DefectDrawer
        visible={defectDrawerVisible}
        handleVisible={flag => {
          this.handleDefectDrawerVisible(flag);
        }}
        loading={defectDrawerLoading}
        currentRecord={head}
        defectData={details}
      />
    );
  };

  renderGroup = () => {
    return (
      <div className={styles.tableListGroup}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Form layout="inline">
              <FormItem label="时间分组">
                <Radio.Group
                  defaultValue=""
                  buttonStyle="solid"
                  onChange={e => this.changeGroupByDate(e)}
                >
                  <Radio.Button value="">无</Radio.Button>
                  <Radio.Button value="groupByDate">日期</Radio.Button>
                  <Radio.Button value="groupByWeek">周</Radio.Button>
                  <Radio.Button value="groupByMonth">月</Radio.Button>
                </Radio.Group>
              </FormItem>
            </Form>
          </Col>
          <Col md={16} sm={24}>
            <Form layout="inline">
              <FormItem>分组汇总：</FormItem>
              <FormItem label="任务单">
                <Switch
                  defaultChecked={!!this.state.groupByMission}
                  onChange={checked => this.changeGroupBy('groupByMission', checked)}
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
          </Col>
        </Row>
      </div>
    );
  };

  renderTable = () => {
    const {
      passRateManage: { data },
      loading,
    } = this.props;
    const columns = ColumnConfig.getColumns(this.state);
    columns.push({
      dataIndex: 'operators',
      title: '操作',
      width: 120,
      autoFixed: 'right',
      render: (text, record) => {
        return (
          <Fragment>
            <a onClick={() => this.handleDefectDrawerVisible(true, record)}>不良明细</a>
          </Fragment>
        );
      },
    });
    const retColumns = mergeColumns({
      columns,
      columnOps: [
        {
          dataIndex: 'fDefectQty',
          render: (text, record) => {
            return <a onClick={() => this.handleDefectDrawerVisible(true, record)}>{text}</a>;
          },
        },
      ],
    });

    return (
      <WgStandardTable
        rowKey="rownumber"
        loading={loading}
        data={data}
        columns={retColumns}
        onChange={this.handleStandardTableChange}
        // 以下属性与列配置相关
        configKey={this.columnConfigKey}
        refShowConfig={showConfig => {
          this.showConfig = showConfig;
        }}
        showAlert={false}
        selectabel={false}
      />
    );
  };

  render() {
    return (
      <div style={{ margin: '-24px 0 0 -24px' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              {/* <div className={styles.tableListOperator}>
              </div> */}
              {/* 分组汇总 */}
              {this.renderGroup()}
              <div className={styles.tableListGroup} />
              {this.renderTable()}
            </div>
          </Card>
        </GridContent>
        {/* 不良明细 */}
        {this.renderDefectDrawer()}
      </div>
    );
  }
}

export default TableList;
