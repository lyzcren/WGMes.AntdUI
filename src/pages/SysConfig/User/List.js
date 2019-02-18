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
  Radio, Popover, Switch, Progress, notification, Popconfirm,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import Authorized from '@/utils/Authorized';
import { UpdateForm } from './UpdateForm';
import { UpdatePwdForm } from './UpdatePwdForm';
import { CreateForm } from './CreateForm';
import { AuthorizeRoleForm } from './AuthorizeRoleForm';

import styles from './List.less';


const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const sexMap = ['default', 'processing', 'success',];
const sex = ['保密', '男', '女',];
const activeData = ['启用', '禁用',];

/* eslint react/no-multi-comp:0 */
@connect(({ userManage, loading }) => ({
  userManage,
  loading: loading.models.userManage,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    updatePwdModalVisible: false,
    updateRoleModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    queryFilters: [],
    updateFormValues: {},
    updatePwdFormValues: {},
    updateRoleFormValues: {},
  };

  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
  };

  columns = [
    {
      title: '用户名',
      dataIndex: 'fNumber',
      sorter: true,
    },
    {
      title: '姓名',
      dataIndex: 'fName',
      sorter: true,
    },
    {
      title: '移动电话',
      dataIndex: 'fPhone',
    },
    {
      title: '性别',
      dataIndex: 'fSex',
      filters: [
        {
          text: sex[0],
          value: 0,
        },
        {
          text: sex[1],
          value: 1,
        },
        {
          text: sex[2],
          value: 2,
        },
      ],
      render (val) {
        return sex[val];
      },
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
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
      render (val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleUpdatePwdModalVisible(true, record)}>修改密码</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleRoleModalVisible(true, record)}>角色</a>
          <Divider type="vertical" />
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => this.handleRowMenuClick(key, record)}>
                <Menu.Item key="active">{record.fIsActive ? '禁用' : '启用'}</Menu.Item>
                <Menu.Item key="delete">删除</Menu.Item>
              </Menu>
            }
          >
            <a>
              更多 <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  componentDidMount () {
    const { dispatch } = this.props;
    var params = { pagination: this.currentPagination };
    dispatch({
      type: 'userManage/fetch',
      payload: params,
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

    var params = { pagination: this.currentPagination };
    // console.log(params);

    dispatch({
      type: 'userManage/fetch',
      payload: params,
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
      if (fieldsValue.queryName) queryFilters.push({ name: "fName", compare: "%*%", value: fieldsValue.queryName });
      if (fieldsValue.queryIsActive) queryFilters.push({ name: "fIsActive", compare: "=", value: fieldsValue.queryIsActive });

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
      // console.log(this.currentPagination);
      var params = { pagination: this.currentPagination };

      dispatch({
        type: 'userManage/fetch',
        payload: params,
      });
    });
  }

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
    var params = { pagination: this.currentPagination };

    // console.log(params);
    dispatch({
      type: 'userManage/fetch',
      payload: params,
    });
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

  handleRowMenuClick = (key, record) => {
    const { dispatch } = this.props;

    switch (key) {
      case 'delete':
        Modal.confirm({
          title: '删除用户',
          content: '确定删除用户吗？',
          okText: '确认',
          cancelText: '取消',
          onOk: () => this.batchDelete(record),
        });
        break;
      case 'active':
        this.handleActive(record);
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
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      updateFormValues: record || {},
    });
  };

  handleUpdatePwdModalVisible = (flag, record) => {
    this.setState({
      updatePwdModalVisible: !!flag,
      updatePwdFormValues: record || {},
    });
  };

  handleRoleModalVisible = (flag, record) => {
    const { dispatch } = this.props;

    if (!!flag) {
      // 获取当前角色已关联的角色列表
      dispatch({
        type: 'userManage/getAuthorizeRole',
        payload: { fItemID: record.fItemID },
      }).then(() => {
        this.setState({
          updateRoleModalVisible: !!flag,
          updateRoleFormValues: record || {},
        });
      });
    } else {
      this.setState({
        updateRoleModalVisible: !!flag,
        updateRoleFormValues: record || {},
      });
    }
  };

  handleAdd = fields => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'userManage/add',
      payload: {
        fNumber: fields.fNumber,
        fName: fields.fName,
        fPhone: fields.fPhone,
        fSex: fields.fSex,
        fPwd: fields.fPwd,
      }
    }).then(() => {
      const { userManage } = this.props;
      if (userManage.result.status === 'ok') {
        message.success('添加成功');
        this.handleModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else {
        message.warning(userManage.result.message);
      }
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/update',
      payload: {
        fItemID: fields.fItemID,
        fNumber: fields.fNumber,
        fName: fields.fName,
        fPhone: fields.fPhone,
        fSex: fields.fSex,
      },
    }).then(() => {
      const { userManage } = this.props;
      if (userManage.result.status === 'ok') {
        message.success('修改成功');
        this.handleUpdateModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else if (userManage.result.status === 'warning') {
        message.warning(userManage.result.message);
      }
    });
  };

  handleUpdatePwd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/update',
      payload: {
        fItemID: fields.fItemID,
        fPwd: fields.fPwd,
      },
    }).then(() => {
      const { userManage } = this.props;
      if (userManage.result.status === 'ok') {
        message.success('修改成功');
        this.handleUpdatePwdModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else if (userManage.result.status === 'warning') {
        message.warning(userManage.result.message);
      }
    });
  };

  handleBatchDeleteClick = () => {
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '删除用户',
      content: '确定批量删除用户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchDelete(selectedRows),
    });
  };

  batchDelete = (selectedRows) => {
    const { dispatch } = this.props;
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    dispatch({
      type: 'userManage/remove',
      payload: {
        fItemID: selectedRows.map(row => row.fItemID),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        const { userManage } = this.props;
        if (userManage.result.status === 'ok') {
          if (userManage.result.message) {
            userManage.result.message.map(m => notification.error({
              message: m,
            }));
          }
          // 成功后再次刷新列表
          this.search();
        }
      },
    });
  };

  handleActive = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/update',
      payload: {
        fItemID: record.fItemID,
        fIsActive: !record.fIsActive,
      },
    }).then(() => {
      const { userManage } = this.props;
      if (userManage.result.status === 'ok') {
        message.success((record.fIsActive ? '禁用' : '启用') + '成功');
        // 成功后再次刷新列表
        this.search();
      } else if (userManage.result.status === 'warning') {
        message.warning(userManage.result.message);
      }
    });
  };

  renderSimpleForm () {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem id="queryName" label="姓名">
              {getFieldDecorator('queryName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('queryIsActive')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">禁用</Option>
                  <Option value="1">启用</Option>
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm () {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
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

  renderForm () {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render () {
    const {
      userManage: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, updateFormValues, updatePwdModalVisible, updatePwdFormValues,
      updateRoleModalVisible, updateRoleFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
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
    const updatePwdMethods = {
      handleUpdatePwdModalVisible: this.handleUpdatePwdModalVisible,
      handleUpdatePwd: this.handleUpdatePwd,
    };
    const updateRoleMethods = {
      handleModalVisible: this.handleRoleModalVisible,
    };
    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Authorized authority="User_Create">
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
              </Button>
              </Authorized>
              {selectedRows.length > 0 && (
                <span>
                  <Authorized authority="User_Delete">
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
            <StandardTable
              rowKey="fItemID"
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {updateFormValues && Object.keys(updateFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={updateFormValues}
          />
        ) : null}
        {updatePwdFormValues && Object.keys(updatePwdFormValues).length ? (
          <UpdatePwdForm
            {...updatePwdMethods}
            updatePwdModalVisible={updatePwdModalVisible}
            values={updatePwdFormValues}
          />
        ) : null}
        {updateRoleFormValues && Object.keys(updateRoleFormValues).length ? (
          <AuthorizeRoleForm
            {...updateRoleMethods}
            modalVisible={updateRoleModalVisible}
            authorizeRole={this.props.userManage.authorizeRole}
            values={updateRoleFormValues}
            queryResult={this.props.userManage.result}
            dispatch={this.props.dispatch}
          />
        ) : null}
      </GridContent>
    );
  }
}

export default TableList;
