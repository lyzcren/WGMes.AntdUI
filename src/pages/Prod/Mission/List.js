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
import { FlowForm } from './FlowForm';
import { BatchFlowForm } from './BatchFlowForm';
import { SyncForm } from './SyncForm';
import ColumnConfig from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';
import { GenFlowSuccess } from './GenFlowSuccess';
import { print } from '@/utils/wgUtils';
import WgStandardTable from '@/wg_components/WgStandardTable';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ missionManage, missionSync, loading, menu, basicData }) => ({
  missionManage,
  missionSync,
  loading: loading.models.missionManage,
  menu,
  basicData,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    // 列配置相关方法
    ColumnConfig.profileModalVisibleCallback = record =>
      this.handleProfileModalVisible(true, record);
    ColumnConfig.flowModalVisibleCallback = record =>
      this.handleModalVisible({ key: 'update', flag: true }, record);
    ColumnConfig.deleteCallback = record => this.handleDelete(record);

    this.state = {
      // 界面是否可见
      modalVisible: {
        update: false,
        batchFlow: false,
        genFlowSuccess: false,
        sync: false,
      },
      formValues: {},
      // 当前操作选中列的数据
      currentFormValues: {},
      // expandForm: 是否展开更多查询条件
      expandForm: false,
      selectedRows: [],
      queryFilters: [],
      checkSyncSecond: 1,
    };

    // 列表查询参数
    this.currentPagination = {
      current: 1,
      pageSize: 10,
    };
    this.columnConfigKey = 'mission';
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'missionManage/fetch',
      payload: this.currentPagination,
    });
    if (hasAuthority('Mission_Print')) {
      dispatch({
        type: 'missionManage/getPrintTemplates',
      });
    }

    // 检查同步状态
    this.Checkk3Syncing();
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
      type: 'missionManage/fetch',
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
    if (fieldsValue.fDate && fieldsValue.fDate[0] && fieldsValue.fDate[1]) {
      queryFilters.push({
        name: 'fDate',
        compare: '>=',
        value: fieldsValue.fDate[0].format('YYYY-MM-DD'),
      });
      queryFilters.push({
        name: 'fDate',
        compare: '<=',
        value: fieldsValue.fDate[1].format('YYYY-MM-DD'),
      });
    }
    if (fieldsValue.querySOBillNo)
      queryFilters.push({ name: 'fSOBillNo', compare: '%*%', value: fieldsValue.querySOBillNo });
    if (fieldsValue.queryMOBillNo)
      queryFilters.push({ name: 'fMOBillNo', compare: '%*%', value: fieldsValue.queryMOBillNo });
    if (
      fieldsValue.fPlanFinishDate &&
      fieldsValue.fPlanFinishDate[0] &&
      fieldsValue.fPlanFinishDate[1]
    ) {
      queryFilters.push({
        name: 'fPlanFinishDate',
        compare: '>=',
        value: fieldsValue.fPlanFinishDate[0].format('YYYY-MM-DD'),
      });
      queryFilters.push({
        name: 'fPlanFinishDate',
        compare: '<=',
        value: fieldsValue.fPlanFinishDate[1].format('YYYY-MM-DD'),
      });
    }
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
    if (fieldsValue.queryModel)
      queryFilters.push({ name: 'fModel', compare: '%*%', value: fieldsValue.queryModel });
    if (fieldsValue.queryWorkShopName)
      queryFilters.push({
        name: 'fWorkShopName',
        compare: '%*%',
        value: fieldsValue.queryWorkShopName,
      });
    if (fieldsValue.queryWorkShopNumber)
      queryFilters.push({
        name: 'fWorkShopNumber',
        compare: '%*%',
        value: fieldsValue.queryWorkShopNumber,
      });
    if (fieldsValue.queryMesSelf001)
      queryFilters.push({
        name: 'fMesSelf001',
        compare: '%*%',
        value: fieldsValue.queryMesSelf001,
      });
    if (fieldsValue.queryMesSelf002)
      queryFilters.push({
        name: 'fMesSelf002',
        compare: '%*%',
        value: fieldsValue.queryMesSelf002,
      });
    if (fieldsValue.queryMesSelf003)
      queryFilters.push({
        name: 'fMesSelf003',
        compare: '%*%',
        value: fieldsValue.queryMesSelf003,
      });

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
        type: 'missionManage/fetch',
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
      type: 'missionManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
  };

  handleSync = fieldsValue => {
    const {
      dispatch,
      form,
      missionSync: { isSyncing, totalCount, currentCount },
    } = this.props;
    if (isSyncing) {
      message.warning('同步中，请稍后再试.');
    }
    dispatch({
      type: 'missionSync/syncing',
    });
    dispatch({
      type: 'missionSync/sync',
      payload: {
        fBeginDate: fieldsValue.fBeginDate ? fieldsValue.fBeginDate.format('YYYY-MM-DD') : null,
        fEndDate: fieldsValue.fEndDate ? fieldsValue.fEndDate.format('YYYY-MM-DD') : null,
      },
    });

    setTimeout(() => {
      // 检查同步状态
      this.Checkk3Syncing();
    }, this.state.checkSyncSecond);
  };

  Checkk3Syncing = () => {
    const lastSyncing = this.props.missionSync.isSyncing;
    const { dispatch, form } = this.props;
    dispatch({
      type: 'missionSync/isSyncing',
    }).then(() => {
      const {
        missionSync: { isSyncing, totalCount, currentCount },
      } = this.props;
      if (isSyncing) {
        setTimeout(() => {
          this.Checkk3Syncing();
        }, this.state.checkSyncSecond);
      } else if (lastSyncing != isSyncing) {
        message.success(`已成功同步${totalCount}条记录`);
        // 成功后再次刷新列表
        this.search();
      }
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'missionManage/remove',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(() => {
      this.setState({
        selectedRows: [],
      });
      const {
        missionManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(`【${record.fMoBillNo}】` + `删除成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      let fileName = '任务单.xls';
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          fileName = `任务单-第${pagination.current}页.xls`;
          break;
        case 'allPage':
          pagination.exportPage = false;
          break;
        default:
          break;
      }
      exportExcel('/api/mission/export', pagination, fileName);
    });
  };

  handleBatchFlow = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) return;

    this.handleModalVisible({ key: 'batchFlow', flag: true }, selectedRows);
  };

  handleProfileModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/mission/profile', data: record },
    });
  };

  // 应用URL协议启动WEB报表客户端程序，根据参数 option 调用对应的功能
  webapp_start(templateId, interIds, type) {
    // var option = {
    //   baseurl: 'http://' + window.location.host,
    //   report: '/api/PrintTemplate/grf?id=' + templateId,
    //   data: '/api/mission/getPrintData?id=' + interIds,
    //   selfsql: false,
    //   type: type,
    // };
    // //创建启动WEB报表客户端的URL协议参数
    // window.location.href = 'grwebapp://' + JSON.stringify(option);
  }

  handlePrint = e => {
    const { dispatch, form } = this.props;
    const { selectedRows } = this.state;

    const templateId = e.key;
    // this.webapp_start(templateId, selectedRows.map(row => row.fInterID).join(','), 'preview');
    const interIds = selectedRows.map(row => row.fInterID).join(',');
    print('mission', templateId, interIds);
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

  handleModalVisible = ({ key, flag }, record) => {
    const { modalVisible } = this.state;
    modalVisible[key] = !!flag;
    this.setState({
      modalVisible: { ...modalVisible },
      currentFormValues: record || {},
    });
  };

  handleGenFlowSuccess = model => {
    const {
      missionManage: { queryResult: status, message },
    } = this.props;

    if (model.length > 0) {
      this.setState({ successFlows: model });
      this.handleModalVisible({ key: 'genFlowSuccess', flag: true });
    }

    this.search();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginRight: '30px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="任务单日期">
              {getFieldDecorator('fDate', {
                // initialValue: [moment().add(-1, 'months'), moment()],
              })(<RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="生产任务单号">
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
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginRight: '30px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="任务单日期">
              {getFieldDecorator('fDate', {})(
                <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="生产任务单号">
              {getFieldDecorator('queryMOBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('querySOBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="计划完工日期">
              {getFieldDecorator('fPlanFinishDate', {})(
                <RangePicker format="YYYY-MM-DD" placeholder={['开始时间', '结束时间']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车间">
              {getFieldDecorator('queryWorkShopName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车间编码">
              {getFieldDecorator('queryWorkShopNumber')(<Input placeholder="请输入" />)}
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
          <Col md={8} sm={24}>
            <FormItem label="规格型号">
              {getFieldDecorator('queryModel')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="底色编号">
              {getFieldDecorator('queryMesSelf001')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="父件型号">
              {getFieldDecorator('queryMesSelf002')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="内部订单号">
              {getFieldDecorator('queryMesSelf003')(<Input placeholder="请输入" />)}
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
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  renderOperator() {
    const { selectedRows } = this.state;
    const {
      missionManage: { queryResult, printTemplates },
      missionSync: { isSyncing, totalCount, currentCount },
    } = this.props;

    return (
      <div style={{ overflow: 'hidden' }}>
        <Authorized authority="Mission_Sync">
          <Button
            icon="plus"
            type="primary"
            onClick={() => this.handleModalVisible({ key: 'sync', flag: true })}
            loading={isSyncing}
          >
            从 ERP 同步
          </Button>
        </Authorized>
        {isSyncing && <Tag color="blue">{`${currentCount} / ${totalCount}`}</Tag>}
        <Authorized authority="Mission_Export">
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
        {selectedRows.length > 0 && printTemplates && printTemplates.length > 0 ? (
          <span>
            <Authorized authority="Mission_Print">
              <Dropdown
                overlay={
                  <Menu onClick={this.handlePrint} selectedKeys={[]}>
                    {printTemplates.map(val => (
                      <Menu.Item key={val.fInterID}>{val.fName}</Menu.Item>
                    ))}
                  </Menu>
                }
              >
                <Button icon="printer">
                  打印 <Icon type="down" />
                </Button>
              </Dropdown>
            </Authorized>
            <Authorized authority="Flow_Create">
              <Button icon="profile" onClick={this.handleBatchFlow}>
                开流程单
              </Button>
            </Authorized>
          </span>
        ) : null}
      </div>
    );
  }

  render() {
    const {
      missionManage: { data, queryResult, printTemplates },
      missionSync: { isSyncing, totalCount, currentCount },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      currentFormValues,
      authorityModalVisible,
      authorizeUserModalVisible,
      successFlows,
    } = this.state;

    return (
      <div style={{ margin: '-24px -24px 0' }}>
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
          {currentFormValues && Object.keys(currentFormValues).length ? (
            <FlowForm
              dispatch={this.props.dispatch}
              handleSuccess={this.handleGenFlowSuccess}
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'update', flag }, record)
              }
              modalVisible={modalVisible.update}
              values={currentFormValues}
            />
          ) : null}
          {successFlows && (
            <GenFlowSuccess
              dispatch={this.props.dispatch}
              modalVisible={modalVisible.genFlowSuccess}
              handleModalVisible={flag => this.handleModalVisible({ key: 'genFlowSuccess', flag })}
              records={successFlows}
            />
          )}
          <SyncForm
            dispatch
            handleSync={this.handleSync}
            handleModalVisible={flag => this.handleModalVisible({ key: 'sync', flag })}
            modalVisible={modalVisible.sync}
          />
          {selectedRows && selectedRows.length ? (
            <BatchFlowForm
              dispatch={this.props.dispatch}
              handleSuccess={this.handleGenFlowSuccess}
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'batchFlow', flag }, record)
              }
              modalVisible={modalVisible.batchFlow}
              records={selectedRows}
            />
          ) : null}
        </GridContent>
      </div>
    );
  }
}

export default TableList;
