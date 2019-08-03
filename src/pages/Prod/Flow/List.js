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
import { SignForm } from './SignForm';
import { ViewStepForm } from './ViewStepForm';
import { ViewRecordForm } from './ViewRecordForm';
import { ScanForm } from './ScanForm';
import { TakeForm } from './TakeForm';
import { ViewTakeForm } from './ViewTakeForm';
import { SplitForm } from './SplitForm';
import { RefundForm } from './RefundForm';
import { RejectForm } from './RejectForm';
import { ChangeRouteForm } from './ChangeRouteForm';
import ColumnConfig from './ColumnConfig';
import { exportExcel } from '@/utils/getExcel';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';
import { tsImportType } from '@babel/types';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => "'" + obj[key] + "'")
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ flowManage, loading, basicData, user }) => ({
  flowManage,
  loading: loading.models.flowManage,
  basicData,
  fIsOperator: user.currentUser.fIsOperator,
  fIsAdmin: user.currentUser.fIsAdmin,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 界面是否可见
    modalVisible: {
      add: false,
      sign: false,
      route: false,
      record: false,
      take: false,
      viewTake: false,
      refund: false,
      reject: false,
      changeRoute: false,
      split: false,
      scan: false,
    },
    formValues: {},
    // 当前操作选中列的数据
    currentFormValues: {},
    // expandForm: 是否展开更多查询条件
    expandForm: false,
    // 操作员查询条件
    operatorForm: !this.props.fIsAdmin && this.props.fIsOperator,
    selectedRows: [],
    queryFilters: [],
    queryDeptID: null,
    queryStatusNumber: null,
    queryRecordStatusNumber: null,
    queryBatchNo: this.props.fBatchNo,
  };

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.searchWhereInit();

    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
    dispatch({
      type: 'flowManage/getPrintTemplates',
    });
    dispatch({
      type: 'basicData/getStatus',
      payload: { number: 'recordStatus' },
    });
    dispatch({
      type: 'basicData/getStatus',
      payload: { number: 'flowStatus' },
    });
    // 列配置相关方法
    ColumnConfig.missionModalVisibleCallback = record =>
      this.handleMissionModalVisible(true, record);
    ColumnConfig.routeModalVisibleCallback = record =>
      this.handleModalVisible({ key: 'route', flag: true }, record);
  }

  componentDidUpdate(preProps) {
    const { fBatchNo } = this.props;
    if (preProps.fBatchNo !== fBatchNo) {
      this.searchWhereInit();
    }
  }

  searchWhereInit = () => {
    const { dispatch, fBatchNo } = this.props;
    // 查询条件处理
    const queryFilters = [];
    if (fBatchNo) {
      queryFilters.push({ name: 'fFullBatchNo', compare: '%*%', value: fBatchNo });
      this.setState({ queryBatchNo: this.props.fBatchNo });
    }
    this.currentPagination = { ...this.currentPagination, queryFilters };

    dispatch({
      type: 'flowManage/fetch',
      payload: this.currentPagination,
    });
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
      type: 'flowManage/fetch',
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
    if (fieldsValue.queryOperatorDept) {
      // 当前岗位可签收
      if (fieldsValue.queryRecordStatusNumber === 'ManufWait4Sign') {
        queryFilters.push({
          name: 'fNextDeptIDs',
          compare: '%*%',
          value: fieldsValue.queryOperatorDept,
        });
        queryFilters.push({ name: 'fRecordStatusNumber', compare: '<>', value: 'ManufProducing' });
      }
      // 当前岗位生产中
      else if (fieldsValue.queryRecordStatusNumber === 'ManufProducing') {
        queryFilters.push({
          name: 'fCurrentDeptID',
          compare: '=',
          value: fieldsValue.queryOperatorDept,
        });
        queryFilters.push({
          name: 'fRecordStatusNumber',
          compare: '=',
          value: fieldsValue.queryRecordStatusNumber,
        });
      }
      // 当前岗位已完成
      else if (fieldsValue.queryRecordStatusNumber === 'ManufEndProduce') {
        queryFilters.push({
          name: 'FEndProduceDeptIDs',
          compare: '%*%',
          value: fieldsValue.queryOperatorDept,
        });
      } else {
        // 只选择岗位，未选择状态，该岗位在工艺路线内即可
        queryFilters.push({
          name: 'fAllDeptIDs',
          compare: '%*%',
          value: fieldsValue.queryOperatorDept,
        });
      }
    }
    if (fieldsValue.queryDept) {
      // 只选择岗位，未选择状态，该岗位在工艺路线内即可
      queryFilters.push({ name: 'fAllDeptIDs', compare: '%*%', value: fieldsValue.queryDept });
    }
    // 无岗位时查询流程单状态
    if (fieldsValue.queryStatusNumber)
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
    if (fieldsValue.queryModel)
      queryFilters.push({ name: 'fProductModel', compare: '%*%', value: fieldsValue.queryModel });
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
        type: 'flowManage/fetch',
        payload: pagination,
      });
      this.setState({
        queryDeptID: fieldsValue.queryDept,
        queryStatusNumber: fieldsValue.queryStatusNumber,
        queryRecordStatusNumber: fieldsValue.queryRecordStatusNumber,
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

    const { pageSize, filters, sorter } = this.currentPagination;
    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters: [],
    };

    dispatch({
      type: 'flowManage/fetch',
      payload: this.currentPagination,
    });
    this.setState({ queryDeptID: null });
    this.handleSelectRows([]);
  };

  selectChange = () => {
    setTimeout(() => {
      this.search();
    }, 0);
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      let pagination = this.getSearchParam(fieldsValue);
      let fileName = '流程单.xls';
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          fileName = '流程单-第' + pagination.current + '页.xls';
          break;
        case 'allPage':
          pagination.exportPage = false;
          break;
        default:
          break;
      }
      exportExcel('/api/flow/export', pagination, fileName);
    });
  };

  statusFilter = () => {
    const {
      basicData: {
        status: { flowStatus },
      },
    } = this.props;
    const badgeStatus = !flowStatus
      ? []
      : flowStatus.map(x => {
          return {
            text: <Badge color={x.fColor} text={x.fValue} />,
            value: x.fKeyName,
          };
        });
    return badgeStatus;
  };

  //应用URL协议启动WEB报表客户端程序，根据参数 option 调用对应的功能
  webapp_start(templateId, interIds, type) {
    var option = {
      baseurl: 'http://' + window.location.host,
      report: '/api/PrintTemplate/grf?id=' + templateId,
      data: '/api/flow/getPrintData?id=' + interIds,
      selfsql: false,
      type: type,
    };

    //创建启动WEB报表客户端的URL协议参数
    window.location.href = 'grwebapp://' + JSON.stringify(option);
  }

  handlePrint = e => {
    const { dispatch, form } = this.props;
    const { selectedRows } = this.state;

    const templateId = e.key;
    this.webapp_start(templateId, selectedRows.map(row => row.fInterID).join(','), 'preview');
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

  moreMenuClick = (key, record) => {
    const { dispatch } = this.props;

    switch (key) {
      case 'take':
        this.handleModalVisible({ key: 'take', flag: true }, record);
        break;
      case 'viewTake':
        this.handleModalVisible({ key: 'viewTake', flag: true }, record);
        break;
      case 'split':
        this.handleModalVisible({ key: 'split', flag: true }, record);
        break;
      case 'refund':
        this.handleModalVisible({ key: 'refund', flag: true }, record);
        break;
      case 'reject':
        this.handleModalVisible({ key: 'reject', flag: true }, record);
        break;
      case 'changeRoute':
        this.handleModalVisible({ key: 'changeRoute', flag: true }, record);
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

  handleMissionModalVisible = (flag, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/mission/profile', data: { fInterID: record.fMissionID } },
    });
  };

  transferModalVisible = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/flow/transfer', data: record, successCallback: this.search },
    });
  };

  handleBatchSign = () => {
    const { selectedRows, queryDeptID } = this.state;
    if (selectedRows.length === 0) return;

    if (!queryDeptID) {
      message.warning('批量签收须先选择岗位.');
    }
    Modal.confirm({
      title: '批量签收',
      content: '确定批量签收吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => selectedRows.forEach(row => this.sign(row, queryDeptID)),
    });
  };

  handleScanTransfer = record => {
    const { operatorForm, queryDeptID } = this.state;
    const { fCurrentDeptID, fCurrentDeptName } = record;
    // 操作员查询界面，要求先选择岗位后才能扫描转序（管理员查询界面则不需要）
    if (!!operatorForm && !queryDeptID) {
      message.warning(`扫描转序需先选择岗位，请先选择岗位.`);
    } else if (!!operatorForm && queryDeptID !== fCurrentDeptID) {
      message.warning(`请选择【${fCurrentDeptName}】岗位再扫描转序.`);
    } else {
      this.transferModalVisible(record);
    }
  };

  handleSign = record => {
    const { dispatch } = this.props;
    const { queryDeptID } = this.state;
    if (queryDeptID) {
      this.sign(record, queryDeptID);
    } else {
      dispatch({
        type: 'flowManage/getDepts',
        payload: {
          fInterID: record.fInterID,
        },
      }).then(() => {
        const {
          flowManage: { nextDepts },
        } = this.props;
        if (!nextDepts || nextDepts.length <= 0) {
          message.warning('无可签收岗位.');
        } else if (nextDepts.length === 1) {
          this.sign(record, nextDepts[0].fDeptID, nextDepts[0].fDeptName);
        } else if (nextDepts.length >= 2) {
          this.handleModalVisible({ key: 'sign', flag: true }, record);
        }
      });
    }
  };

  sign = (record, fDeptID, fDeptName) => {
    const { dispatch } = this.props;
    const { fInterID } = record;
    dispatch({
      type: 'flowManage/sign',
      payload: {
        fInterID,
        fDeptID,
      },
    }).then(() => {
      const {
        flowManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        const msg =
          '【' +
          record.fFullBatchNo +
          '】' +
          '签收成功' +
          (fDeptName ? '，签收岗位【' + fDeptName + '】' : '');
        message.success(msg);
        this.handleModalVisible({ key: 'sign', flag: false });
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning('【' + record.fFullBatchNo + '】' + queryResult.message);
      } else {
        message.error('【' + record.fFullBatchNo + '】' + queryResult.message);
      }
    });
  };

  handleSign4Reject = record => {
    const { dispatch } = this.props;
    const { fCurrentRecordID } = record;
    dispatch({
      type: 'flowManage/sign4Reject',
      payload: {
        fRecordID: fCurrentRecordID,
      },
    }).then(() => {
      const {
        flowManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('【' + record.fFullBatchNo + '】' + '签收成功');
        this.handleModalVisible({ key: 'sign', flag: false });
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning('【' + record.fFullBatchNo + '】' + queryResult.message);
      } else {
        message.error('【' + record.fFullBatchNo + '】' + queryResult.message);
      }
    });
  };

  take = (fields, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowManage/take',
      payload: fields,
    }).then(() => {
      const {
        flowManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('【' + record.fFullBatchNo + '】' + '取走成功');
        this.handleModalVisible({ key: 'take', flag: false });
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning('【' + record.fFullBatchNo + '】' + queryResult.message);
      } else {
        message.error('【' + record.fFullBatchNo + '】' + queryResult.message);
      }
    });
  };

  handleBatchReport = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '汇报',
      content: '确定汇报吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.report(selectedRows),
    });
  };

  report = records => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowManage/report',
      payload: {
        fInterIdList: records.map(row => row.fInterID),
      },
    }).then(() => {
      const {
        flowManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(queryResult.message);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  viewRecord = record => {
    this.handleModalVisible({ key: 'record', flag: true }, record);
  };

  renderOperation = (val, record) => {
    const { queryDeptID } = this.state;
    // 指定岗位则判断签收岗位是否包含指定的岗位，否则则判断当前是否有岗位可签收
    const canSign =
      record.fNextDeptIDList &&
      record.fRecordStatusNumber !== 'ManufProducing' &&
      (!queryDeptID || record.fNextDeptIDList.includes(queryDeptID));
    const canTransfer =
      record.fRecordStatusNumber === 'ManufProducing' &&
      (!queryDeptID || record.fCurrentDeptID === queryDeptID);

    const menus = [];
    /* 生产中，可取走 */
    if (record.fStatusNumber === 'Producing') menus.push(<Menu.Item key="take">取走</Menu.Item>);
    if (record.fTotalTakeQty > 0) menus.push(<Menu.Item key="viewTake">取走记录</Menu.Item>);
    /* 已签收生产中，且非首岗位，可退回 */
    if (record.fRecordStatusNumber === 'ManufProducing' && record.fEndProduceDeptIDList.length > 0)
      menus.push(<Menu.Item key="refund">退回</Menu.Item>);
    /* 未签收，可拒收 */
    if (record.fStatusNumber === 'Producing' && record.fRecordStatusNumber === 'ManufEndProduce')
      menus.push(<Menu.Item key="reject">拒收</Menu.Item>);
    /* 生产中，可变更工艺路线 */
    if (record.fStatusNumber === 'Producing')
      menus.push(<Menu.Item key="changeRoute">变更工艺路线</Menu.Item>);
    /* 生产中，可分批 */
    if (record.fStatusNumber === 'Producing') menus.push(<Menu.Item key="split">分批</Menu.Item>);

    const operators = [];
    if (
      record.fStatusNumber === 'BeforeProduce' ||
      (record.fStatusNumber === 'Producing' && record.fRecordStatusNumber === 'ManufEndProduce') ||
      (record.fStatusNumber === 'Producing' && record.fRecordStatusNumber === 'ManufCancel') ||
      record.fRecordStatusNumber === 'ManufRefund'
    ) {
      operators.push(
        <Authorized key={'sign'} authority="Flow_Sign">
          <Divider type="vertical" />
          <a disabled={!canSign} onClick={() => this.handleSign(record)}>
            签收
          </a>
        </Authorized>
      );
    }
    if (record.fStatusNumber === 'Producing' && record.fRecordStatusNumber === 'ManufReject') {
      operators.push(
        <Authorized key={'sign4Reject'} authority="Flow_Sign">
          <Divider type="vertical" />
          <a disabled={!canSign} onClick={() => this.handleSign4Reject(record)}>
            签收(被拒)
          </a>
        </Authorized>
      );
    }
    if (record.fStatusNumber === 'Producing' && record.fRecordStatusNumber === 'ManufProducing') {
      operators.push(
        <Authorized key={'transfer'} authority="Flow_Transfer">
          <Divider type="vertical" />
          <a disabled={!canTransfer} onClick={() => this.transferModalVisible(record)}>
            转序
          </a>
        </Authorized>
      );
    }
    if (record.fStatusNumber === 'EndProduce') {
      operators.push(
        <Authorized key={'report'} authority="Flow_Report">
          <Divider type="vertical" />
          <a onClick={() => this.report([record])}>汇报</a>
        </Authorized>
      );
    }

    return (
      <Fragment>
        <Authorized authority="Record_Read">
          <a onClick={() => this.viewRecord(record)}>执行情况</a>
        </Authorized>
        {operators.map(x => x)}
        {menus.length > 0 && (
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => this.moreMenuClick(key, record)}>
                {menus.map(x => x)}
              </Menu>
            }
          >
            <a>
              <Divider type="vertical" />
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        )}
      </Fragment>
    );
  };

  // 为操作员定制的查询条件
  renderOperatorForm() {
    const {
      form: { getFieldDecorator },
      fIsOperator,
      fIsAdmin,
      basicData: {
        processDeptTree,
        status: { recordStatus },
      },
    } = this.props;
    const { operatorForm, queryBatchNo } = this.state;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator('queryOperatorDept', {
                rules: [{ required: true, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={processDeptTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.selectChange}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryRecordStatusNumber')(
                <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.selectChange}>
                  {recordStatus &&
                    recordStatus.map(x => (
                      <Option key={x.fKeyName} value={x.fKeyName}>
                        <Badge color={x.fColor} text={x.fValue} />
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="批号">
              {getFieldDecorator('queryBatchNo', {
                initialValue: queryBatchNo,
              })(<Input placeholder="请输入" />)}
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
              {/* {(fIsAdmin || !fIsOperator) && ( */}
              <a style={{ marginLeft: 8 }} onClick={this.toggleOperatorForm}>
                切换
              </a>
              {/* )} */}
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
      fIsOperator,
      fIsAdmin,
      basicData: {
        processDeptTree,
        status: { flowStatus },
      },
    } = this.props;
    const { operatorForm, queryBatchNo } = this.state;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="岗位">
              {getFieldDecorator('queryDept', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={processDeptTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.selectChange}
                  allowClear={true}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="流程单状态">
              {getFieldDecorator('queryStatusNumber')(
                <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.selectChange}>
                  {flowStatus &&
                    flowStatus.map(x => (
                      <Option key={x.fKeyName} value={x.fKeyName}>
                        <Badge color={x.fColor} text={x.fValue} />
                      </Option>
                    ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="批号">
              {getFieldDecorator('queryBatchNo', {
                initialValue: queryBatchNo,
              })(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          {/* <Col md={6} sm={24}>
            <FormItem label="任务单号">
              {getFieldDecorator('queryMoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col> */}
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              {/* {(fIsAdmin || !fIsOperator) && ( */}
              <a style={{ marginLeft: 8 }} onClick={this.toggleOperatorForm}>
                切换
              </a>
              {/* )} */}
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
      basicData: {
        processDeptTree,
        status: { flowStatus },
      },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginRight: '30px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="批号">
              {getFieldDecorator('queryBatchNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="生产任务单号">
              {getFieldDecorator('queryMoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('querySoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryStatusNumber')(
                <Select placeholder="请选择" style={{ width: '100%' }} onChange={this.selectChange}>
                  {flowStatus &&
                    flowStatus.map(x => (
                      <Option key={x.fKeyName} value={x.fKeyName}>
                        <Badge color={x.fColor} text={x.fValue} />
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
          <Col md={8} sm={24}>
            <FormItem label="规格型号">
              {getFieldDecorator('queryModel')(<Input placeholder="请输入" />)}
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
      dispatch,
      flowManage: { data, queryResult, printTemplates },
      loading,
    } = this.props;
    const {
      queryDeptID,
      queryStatusNumber,
      selectedRows,
      modalVisible,
      currentFormValues,
    } = this.state;

    const signMethods = {
      dispatch,
      handleModalVisible: (flag, record) => this.handleModalVisible({ key: 'sign', flag }, record),
      handleSubmit: this.sign,
    };
    const routeMethods = {
      dispatch,
      handleModalVisible: (flag, record) => this.handleModalVisible({ key: 'route', flag }, record),
    };
    // 指定操作列
    ColumnConfig.renderOperation = this.renderOperation;
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
                <Button
                  type="primary"
                  icon="scan"
                  onClick={() => {
                    this.handleModalVisible({ key: 'scan', flag: true });
                  }}
                >
                  扫描
                </Button>
                <Authorized authority="Flow_Export">
                  <Dropdown
                    overlay={
                      <Menu onClick={this.handleExport} selectedKeys={[]}>
                        <Menu.Item key="currentPage">当前页</Menu.Item>
                        <Menu.Item key="allPage">所有页</Menu.Item>
                      </Menu>
                    }
                  >
                    <Button icon="download">
                      导出
                      <Icon type="down" />
                    </Button>
                  </Dropdown>
                </Authorized>
                {selectedRows.length > 0 && printTemplates && printTemplates.length > 0 ? (
                  <Authorized authority="Flow_Print">
                    <Dropdown
                      overlay={
                        <Menu onClick={this.handlePrint} selectedKeys={[]}>
                          {printTemplates.map(val => {
                            return <Menu.Item key={val.fInterID}>{val.fName}</Menu.Item>;
                          })}
                        </Menu>
                      }
                    >
                      <Button icon="printer">
                        打印 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </Authorized>
                ) : null}
                {selectedRows.length > 0 && (
                  <span>
                    <Authorized authority="Flow_Sign">
                      <Button disabled={!queryDeptID} onClick={this.handleBatchSign}>
                        签收
                      </Button>
                    </Authorized>
                    {/* <Authorized authority="Flow_Combine">
                      <Button disabled={!queryDeptID} onClick={this.handleBatchCombine}>
                        合批
                      </Button>
                    </Authorized> */}
                    <Authorized authority="Flow_Report">
                      <Button
                        disabled={queryStatusNumber !== 'EndProduce'}
                        onClick={this.handleBatchReport}
                      >
                        汇报
                      </Button>
                    </Authorized>
                  </span>
                )}
              </div>
              <StandardTable
                rowKey="fInterID"
                bordered
                // size='small'
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
          {currentFormValues.sign && Object.keys(currentFormValues.sign).length ? (
            <SignForm
              {...signMethods}
              modalVisible={modalVisible.sign}
              values={currentFormValues.sign}
            />
          ) : null}
          {currentFormValues.route && Object.keys(currentFormValues.route).length ? (
            <ViewStepForm
              {...routeMethods}
              modalVisible={modalVisible.route}
              fInterID={currentFormValues.route.fRouteID}
              values={currentFormValues.route}
            />
          ) : null}
          {currentFormValues.record && Object.keys(currentFormValues.record).length ? (
            <ViewRecordForm
              dispatch
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'record', flag }, record)
              }
              modalVisible={modalVisible.record}
              values={currentFormValues.record}
            />
          ) : null}
          {currentFormValues.take && Object.keys(currentFormValues.take).length ? (
            <TakeForm
              dispatch
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'take', flag }, record)
              }
              handleSubmit={fields => this.take(fields, currentFormValues.take)}
              modalVisible={modalVisible.take}
              values={currentFormValues.take}
            />
          ) : null}
          {currentFormValues.viewTake && Object.keys(currentFormValues.viewTake).length ? (
            <ViewTakeForm
              dispatch={dispatch}
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'viewTake', flag }, record)
              }
              modalVisible={modalVisible.viewTake}
              values={currentFormValues.viewTake}
            />
          ) : null}
          {currentFormValues.split && Object.keys(currentFormValues.split).length ? (
            <SplitForm
              dispatch={dispatch}
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'split', flag }, record)
              }
              modalVisible={modalVisible.split}
              values={currentFormValues.split}
              handleSucess={() => {
                this.search();
              }}
            />
          ) : null}
          {currentFormValues.refund && Object.keys(currentFormValues.refund).length ? (
            <RefundForm
              dispatch={dispatch}
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'refund', flag }, record)
              }
              modalVisible={modalVisible.refund}
              values={currentFormValues.refund}
              handleSucess={() => {
                this.search();
              }}
            />
          ) : null}
          {currentFormValues.reject && Object.keys(currentFormValues.reject).length ? (
            <RejectForm
              dispatch={dispatch}
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'reject', flag }, record)
              }
              modalVisible={modalVisible.reject}
              values={currentFormValues.reject}
              handleSucess={() => {
                this.search();
              }}
            />
          ) : null}
          {currentFormValues.changeRoute && Object.keys(currentFormValues.changeRoute).length ? (
            <ChangeRouteForm
              dispatch={dispatch}
              handleModalVisible={(flag, record) =>
                this.handleModalVisible({ key: 'changeRoute', flag }, record)
              }
              modalVisible={modalVisible.changeRoute}
              values={currentFormValues.changeRoute}
              handleSucess={() => {
                this.search();
              }}
            />
          ) : null}
          <ScanForm
            dispatch
            disabled={!queryDeptID}
            queryDeptID={queryDeptID}
            handleSign={this.handleSign}
            handleScanTransfer={this.handleScanTransfer}
            handleModalVisible={flag => this.handleModalVisible({ key: 'scan', flag })}
            modalVisible={modalVisible.scan}
          />
        </GridContent>
      </div>
    );
  }
}

export default TableList;
