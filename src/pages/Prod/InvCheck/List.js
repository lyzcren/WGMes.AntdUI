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
  Table,
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
import { default as ColumnConfig } from './ColumnConfig';
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
@connect(({ invCheckManage, loading, menu, basicData }) => ({
  invCheckManage,
  loading: loading.models.invCheckManage,
  menu,
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
      type: 'invCheckManage/fetch',
      payload: this.currentPagination,
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
    dispatch({
      type: 'basicData/getStatus',
      payload: { number: 'invCheckStatus' },
    });
    dispatch({
      type: 'invCheckManage/getPrintTemplates',
    });
    // 指定操作列
    ColumnConfig.renderOperation = this.renderOperation;
    // 列配置相关方法
    ColumnConfig.profileCallback = record => this.handleProfile(record);
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
      type: 'invCheckManage/fetch',
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
    if (fieldsValue.queryDeptID)
      queryFilters.push({ name: 'fDeptID', compare: '=', value: fieldsValue.queryDeptID });
    if (fieldsValue.queryBillNo)
      queryFilters.push({ name: 'fBillNo', compare: '%*%', value: fieldsValue.queryBillNo });
    if (fieldsValue.queryStatusNumber)
      queryFilters.push({
        name: 'fStatusNumber',
        compare: '=',
        value: fieldsValue.queryStatusNumber,
      });

    this.setState({
      formValues: values,
      queryFilters: queryFilters,
    });

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
        type: 'invCheckManage/fetch',
        payload: pagination,
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

    this.currentPagination = {
      ...this.currentPagination,
      current: 1,
      queryFilters: [],
    };

    dispatch({
      type: 'invCheckManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
  };

  handleExport = e => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      switch (e.key) {
        case 'currentPage':
          pagination.exportPage = true;
          const fileName = '在制品盘点-第' + pagination.current + '页.xls';
          exportExcel('/api/invCheck/export', pagination, fileName);
          break;
        case 'allPage':
          pagination.exportPage = false;
          exportExcel('/api/invCheck/export', pagination, '在制品盘点.xls');
          break;
        default:
          break;
      }
    });
  };

  //应用URL协议启动WEB报表客户端程序，根据参数 option 调用对应的功能
  webapp_start(templateId, interId, type) {
    var option = {
      baseurl: 'http://' + window.location.host,
      report: '/api/PrintTemplate/grf?id=' + templateId,
      data: '/api/invCheck/getPrintData?id=' + interId,
      selfsql: false,
      type: type,
    };

    //创建启动WEB报表客户端的URL协议参数
    window.location.href = 'grwebapp://' + JSON.stringify(option);
  }

  handlePrint = (key, record) => {
    const { dispatch, form } = this.props;
    const { selectedRows } = this.state;

    const templateId = key;
    this.webapp_start(templateId, record.fInterID, 'preview');
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

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invCheckManage/remove',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(() => {
      const {
        invCheckManage: { queryResult },
      } = this.props;
      this.setState({
        selectedRows: [],
      });
      if (queryResult.status === 'ok') {
        message.success('【' + record.fBillNo + '】' + '删除成功');
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invCheckManage/check',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(() => {
      const {
        invCheckManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('【' + record.fBillNo + '】' + '审核成功');
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleUnCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'invCheckManage/uncheck',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(() => {
      const {
        invCheckManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('【' + record.fBillNo + '】' + '反审核成功');
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

  renderOperation = (val, record) => {
    const {
      invCheckManage: { printTemplates },
    } = this.props;
    return (
      <Fragment>
        <Authorized authority="InvCheck_Update">
          <a disabled={record.fStatus != 0} onClick={() => this.handleUpdate(record)}>
            修改
          </a>
        </Authorized>
        <Authorized authority="InvCheck_Check">
          <Divider type="vertical" />
          {record.fStatus === 0 ? (
            <a onClick={() => this.handleCheck(record)}>审核</a>
          ) : (
            <a onClick={() => this.handleUnCheck(record)}>反审核</a>
          )}
        </Authorized>
        <Authorized authority="InvCheck_Delete">
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDelete(record)}>
            <a>删除</a>
          </Popconfirm>
        </Authorized>
        {printTemplates.length > 0 ? (
          <Authorized authority="InvCheck_Print">
            <Dropdown
              overlay={
                <Menu onClick={({ key }) => this.handlePrint(key, record)}>
                  {printTemplates.map(val => {
                    return <Menu.Item key={val.fInterID}>{val.fName}</Menu.Item>;
                  })}
                </Menu>
              }
            >
              <a>
                <Divider type="vertical" />
                打印 <Icon type="down" />
              </a>
            </Dropdown>
          </Authorized>
        ) : null}
      </Fragment>
    );
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      basicData: {
        processDeptTree,
        status: { invCheckStatus },
      },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="部门">
              {getFieldDecorator('queryDeptID', {
                rules: [{ required: false, message: '请选择部门' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={processDeptTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('queryBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryStatusNumber')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {invCheckStatus &&
                    invCheckStatus.map(x => (
                      <Option key={x.fKeyName} value={x.fKeyName}>
                        <Badge color={x.fColor} text={x.fValue} />
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

  handleAdd() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/invCheck/create', handleSuccess: this.search },
    });
  }

  handleProfile(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/invCheck/profile', record, handleSuccess: this.search },
    });
  }

  handleUpdate(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/invCheck/update', record, handleSuccess: this.search },
    });
  }

  expandedRowRender = record => {
    const columns = [
      {
        title: '产品',
        dataIndex: 'fProductName',
      },
      {
        title: '产品编码',
        dataIndex: 'fProductNumber',
      },
      {
        title: '规格型号',
        dataIndex: 'fProductModel',
      },
      {
        title: '批次',
        dataIndex: 'fFullBatchNo',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '盘点数量',
        dataIndex: 'fQty',
      },
      {
        title: '数量',
        dataIndex: 'fInvQty',
      },
      {
        title: '盈亏',
        dataIndex: 'fDeltaQty',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];
    return (
      <Table rowKey="fRecordID" columns={columns} dataSource={record.details} pagination={false} />
    );
  };

  render() {
    const {
      dispatch,
      invCheckManage: { data, queryResult },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, currentFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('InvCheck_Delete')}>
          删除
        </Menu.Item>
      </Menu>
    );

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
                <Authorized authority="InvCheck_Create">
                  <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                    新建
                  </Button>
                </Authorized>
                <Authorized authority="InvCheck_Export">
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
                    <Authorized authority="InvCheck_Delete">
                      <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
                    </Authorized>
                    <Authorized authority={['InvCheck_Delete']}>
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
                bordered
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={ColumnConfig.columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                expandedRowRender={this.expandedRowRender}
                // scroll={{ x: scrollX }}
              />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default TableList;
