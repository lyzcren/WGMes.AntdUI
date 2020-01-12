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

import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import WgStandardTable from '@/wg_components/WgStandardTable';

import { UpdateForm } from './UpdateForm';
import { CreateForm } from './CreateForm';
import { AuthorityForm } from './AuthorityForm';
import { AuthorizeUserForm } from './AuthorizeUserForm';
import { pageMapper } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const activeData = ['启用', '禁用'];

/* eslint react/no-multi-comp:0 */
@connect(({ roleManage, loading }) => ({
  roleManage,
  loading: loading.models.roleManage,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    // 新增界面
    modalVisible: false,
    formValues: {},
    // 修改界面
    updateModalVisible: false,
    updateFormValues: {},
    // 权限界面
    authorityModalVisible: false,
    // 授权用户界面
    authorizeUserModalVisible: false,
    // 其他
    expandForm: false,
    renderCreateForm: true,
    selectedRows: [],
    queryFilters: [],
  };

  columnConfigKey = 'role';

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '角色',
      dataIndex: 'fName',
      width: 160,
      sorter: true,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      width: 160,
      sorter: true,
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
      width: 160,
      filters: [
        {
          text: activeData[0],
          value: 1,
        },
        {
          text: activeData[1],
          value: 0,
        },
      ],
      render(val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '默认界面',
      dataIndex: 'fIndexPage',
      width: 160,
      sorter: true,
      render: val => pageMapper[val],
    },
    {
      title: '操作',
      dataIndex: 'operators',
      width: 160,
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.batchDelete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => this.handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleAuthorityModalVisible(true, record)}>权限</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleAuthorizeUserModalVisible(true, record)}>用户</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/fetch',
      payload: this.currentPagination,
    });

    dispatch({
      type: 'roleManage/getAuthority',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, queryFilters } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      // newObj[key] = getValue(filtersArg[key]);
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
      type: 'roleManage/fetch',
      payload: this.currentPagination,
    });
  };

  handleSearch = e => {
    e.preventDefault();
    this.search();
  };

  search = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      // 查询条件处理
      const queryFilters = [];
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

      dispatch({
        type: 'roleManage/fetch',
        payload: this.currentPagination,
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
      type: 'roleManage/fetch',
      payload: this.currentPagination,
    });
    this.handleSelectRows([]);
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

  handleModalVisible = flag => {
    const { renderCreateForm } = this.state;
    this.setState({
      modalVisible: !!flag,
      renderCreateForm: renderCreateForm || !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleAuthorityModalVisible = (flag, record) => {
    const { dispatch } = this.props;

    if (flag) {
      // 获取当前角色已分配的权限
      dispatch({
        type: 'roleManage/getCurrentAuthority',
        payload: { id: record.fItemID },
      }).then(() => {
        this.setState({
          authorityModalVisible: !!flag,
          updateFormValues: record || {},
        });
      });
    } else {
      this.setState({
        authorityModalVisible: !!flag,
        updateFormValues: record || {},
      });
    }
  };

  handleAuthorizeUserModalVisible = (flag, record) => {
    const { dispatch } = this.props;

    if (flag) {
      // 获取当前角色已关联的用户列表
      dispatch({
        type: 'roleManage/getAuthorizeUser',
        payload: { fItemID: record.fItemID },
      }).then(() => {
        this.setState({
          authorizeUserModalVisible: !!flag,
          updateFormValues: record || {},
        });
      });
    } else {
      this.setState({
        authorizeUserModalVisible: !!flag,
        updateFormValues: record || {},
      });
    }
  };

  handleAdd = fields => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'roleManage/add',
      payload: {
        ...fields,
      },
    }).then(() => {
      const {
        roleManage: { queryResult },
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
      type: 'roleManage/update',
      payload: {
        ...fields,
      },
    }).then(() => {
      const {
        roleManage: { queryResult },
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

  handleActive = record => {
    const { dispatch } = this.props;
    dispatch({
      type: `roleManage/${!record.fIsActive ? 'active' : 'deactive'}`,
      payload: {
        ids: [record.fItemID],
      },
    }).then(() => {
      const {
        roleManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success(`${record.fIsActive ? '禁用' : '启用'}成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleAuthority = (roleId, checkedAuthority) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleManage/setAuthority',
      payload: {
        roleId,
        checkedAuthority,
      },
    }).then(() => {
      const {
        roleManage: { queryResult },
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

  handleBatchDeleteClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '删除角色',
      content: '确定批量删除角色吗？',
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
    dispatch({
      type: 'roleManage/remove',
      payload: {
        fItemID: selectedRows.map(row => row.fItemID),
      },
    }).then(() => {
      this.setState({
        selectedRows: [],
      });
      const {
        roleManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        if (queryResult.message) {
          queryResult.message.map(m => message.warning(m));
        }
        // 成功后再次刷新列表
        this.search();
      }
    });
  };

  handleBatchActiveClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '启用角色',
      content: '确定批量启用角色吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchActive(selectedRows, true),
    });
  };

  handleBatchDeactiveClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '禁用角色',
      content: '确定批量禁用角色吗？',
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
    dispatch({
      type: `roleManage/${fIsActive ? 'active' : 'deactive'}`,
      payload: {
        ids: selectedRows.map(row => row.fItemID),
      },
    }).then(() => {
      this.setState({
        selectedRows: [],
      });
      const {
        roleManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        if (queryResult.message) {
          queryResult.message.map(m =>
            notification.error({
              message: m,
            })
          );
        }
        // 成功后再次刷新列表
        this.search();
      }
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
            <FormItem label="角色名">
              {getFieldDecorator('queryName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryIsActive')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="1">启用</Option>
                  <Option value="0">禁用</Option>
                </Select>
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

  afterCreateFormClose = () => {
    this.setState({ renderCreateForm: false });
  };

  render() {
    const {
      roleManage: { data, queryResult },
      loading,
    } = this.props;
    const {
      selectedRows,
      modalVisible,
      updateModalVisible,
      updateFormValues,
      authorityModalVisible,
      authorizeUserModalVisible,
      renderCreateForm,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="active">批量启用</Menu.Item>
        <Menu.Item key="deactive">批量禁用</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    const authorityMethods = {
      handleModalVisible: this.handleAuthorityModalVisible,
      handleUpdate: this.handleAuthority,
    };
    const authorizeUserMethods = {
      handleModalVisible: this.handleAuthorizeUserModalVisible,
    };
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Authorized authority="Role_Create">
                  <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新建
                  </Button>
                </Authorized>
                {selectedRows.length > 0 && (
                  <span>
                    <Authorized authority="Role_Delete">
                      <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
                    </Authorized>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down" />
                      </Button>
                    </Dropdown>
                  </span>
                )}
              </div>
              <WgStandardTable
                rowKey="fItemID"
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={this.columns}
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
          {renderCreateForm && (
            <CreateForm
              {...parentMethods}
              modalVisible={modalVisible}
              afterClose={this.afterCreateFormClose}
              pageMapper={pageMapper}
            />
          )}
          {updateFormValues && Object.keys(updateFormValues).length ? (
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={updateFormValues}
              pageMapper={pageMapper}
            />
          ) : null}
          {updateFormValues && Object.keys(updateFormValues).length ? (
            <AuthorityForm
              {...authorityMethods}
              authorityModalVisible={authorityModalVisible}
              values={updateFormValues}
              authority={this.props.roleManage.authority}
              currentAuthority={this.props.roleManage.currentAuthority}
            />
          ) : null}
          {updateFormValues && Object.keys(updateFormValues).length ? (
            <AuthorizeUserForm
              {...authorizeUserMethods}
              authorizeUserModalVisible={authorizeUserModalVisible}
              values={updateFormValues}
              authorizeUser={this.props.roleManage.authorizeUser}
              queryResult={this.props.roleManage.queryResult}
              dispatch={this.props.dispatch}
              loading={loading}
            />
          ) : null}
        </GridContent>
      </div>
    );
  }
}

export default TableList;
