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
  Steps,
  Radio, Popover, Switch, Progress, notification, Popconfirm,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import StandardTable from '@/components/StandardTable';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { validatorPhone, validatePassword, getPasswordStatus } from '@/utils/validators';

import styles from './List.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
// const sexMap = ['default', 'processing', 'success',];
const sex = ['保密', '男', '女',];
const activeData = ['启用', '禁用',];
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="validation.password.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="validation.password.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="validation.password.strength.short" />
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const renderPasswordProgress = (value) => {
  // const value = form.getFieldValue('fPwd');
  const passwordStatus = getPasswordStatus(value);
  return value && value.length ? (
    <div className={styles[`progress-${passwordStatus}`]}>
      <Progress
        status={passwordProgressMap[passwordStatus]}
        className={styles.progress}
        strokeWidth={6}
        percent={value.length * 10 > 100 ? 100 : value.length * 10}
        showInfo={false}
      />
    </div>
  ) : null;
};


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const checkConfirm = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('fPwd')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };
  const checkPassword = (rule, value, callback) => {
    if (value) {
      form.validateFields(['fConfirmPwd'], { force: true });
    }
    callback();
  };
  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('fNumber', {
          rules: [{ required: true, message: '请输入至少五个字符的用户名！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('fName', {
          rules: [{ required: true, message: '请输入姓名', min: 1 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
        {form.getFieldDecorator('fPhone', {
          rules: [
            { required: false, message: '请输入手机号码！' },
            { validator: validatorPhone }
          ]
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem key="fSex" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator('fSex', {
        })(
          <RadioGroup>
            <Radio value="1">男</Radio>
            <Radio value="2">女</Radio>
          </RadioGroup>
        )}
      </FormItem>
      <FormItem key="fPwd" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
        <Popover
          getPopupContainer={node => node.parentNode}
          content={
            <div style={{ padding: '4px 0' }}>
              {passwordStatusMap[getPasswordStatus()]}
              {renderPasswordProgress(form.getFieldValue('fPwd'))}
              <div style={{ marginTop: 10 }}>
                <FormattedMessage id="validation.password.strength.msg" />
              </div>
            </div>
          }
          overlayStyle={{ width: 240 }}
          placement="right"
        >
          {form.getFieldDecorator('fPwd', {
            rules: [
              {
                required: true,
                validator: checkPassword,
              },
              {
                validator: validatePassword,
              },
            ],
          })(
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({ id: 'form.password.placeholder' })}
            />
          )}
        </Popover>
      </FormItem>
      <FormItem key="fConfirmPwd" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
        {form.getFieldDecorator('fConfirmPwd', {
          rules: [
            {
              required: true,
              message: formatMessage({ id: 'validation.confirm-password.required' }),
            },
            {
              validator: checkConfirm,
            },
          ],
        })(
          <Input
            size="large"
            type="password"
            placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
          />
        )}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => { },
    handleUpdateModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        fItemID: props.values.fItemID,
        fNumber: props.values.fNumber,
        fName: props.values.fName,
        fPhone: props.values.fPhone,
        fSex: props.values.fSex,
      },
    };
  }

  okHandle = () => {
    const { form, handleUpdate } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = this.state.formVals.fItemID;
      handleUpdate(fieldsValue);
    });
  };

  render() {
    const { form, updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        title="修改用户"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {form.getFieldDecorator('fNumber', {
            initialValue: formVals.fNumber,
            rules: [{ required: true, message: '请输入至少五个字符的用户名！', min: 5 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {form.getFieldDecorator('fName', {
            initialValue: formVals.fName,
            rules: [{ required: true, message: '请输入姓名', min: 1 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {form.getFieldDecorator('fPhone', {
            initialValue: formVals.fPhone,
            rules: [
              { required: false, message: '请输入手机号码！' },
              { validator: validatorPhone }
            ]
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem key="fSex" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
          {form.getFieldDecorator('fSex', {
            initialValue: formVals.fSex.toString(),
          })(
            <RadioGroup>
              <Radio value="1">男</Radio>
              <Radio value="2">女</Radio>
            </RadioGroup>
          )}
        </FormItem>
      </Modal>
    );
  }
}

@Form.create()
class UpdatePwdForm extends PureComponent {
  static defaultProps = {
    handleUpdatePwd: () => { },
    handleUpdatePwdModalVisible: () => { },
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: {
        fItemID: props.values.fItemID,
        fNumber: props.values.fNumber,
        fName: props.values.fName,
        fPhone: props.values.fPhone,
        fSex: props.values.fSex,
        fPwd: props.values.fPwd,
      },
    };
  }

  okHandle = () => {
    const { form, handleUpdatePwd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fItemID = this.state.formVals.fItemID;
      handleUpdatePwd(fieldsValue);
    });
  };
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('fPwd')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };
  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value) {
      form.validateFields(['fConfirmPwd'], { force: true });
    }
    callback();
  };

  render() {
    const { form, updatePwdModalVisible, handleUpdatePwdModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        title="修改密码"
        visible={updatePwdModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleUpdatePwdModalVisible(false, values)}
        afterClose={() => handleUpdatePwdModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名" >
          {form.getFieldDecorator('fNumber', {
            initialValue: formVals.fNumber,
            rules: [{ required: false, message: '请输入至少五个字符的用户名！', min: 5 }],
          })(<Input placeholder="请输入" readOnly />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {form.getFieldDecorator('fName', {
            initialValue: formVals.fName,
            rules: [{ required: false, message: '请输入姓名', min: 1 }],
          })(<Input placeholder="请输入" readOnly />)}
        </FormItem>
        <FormItem key="fPwd" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          <Popover
            getPopupContainer={node => node.parentNode}
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[getPasswordStatus()]}
                {renderPasswordProgress(form.getFieldValue('fPwd'))}
                <div style={{ marginTop: 10 }}>
                  <FormattedMessage id="validation.password.strength.msg" />
                </div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement="right"
          >
            {form.getFieldDecorator('fPwd', {
              rules: [
                {
                  required: true,
                  validator: this.checkPassword,
                },
                {
                  validator: validatePassword,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.password.placeholder' })}
              />
            )}
          </Popover>
        </FormItem>
        <FormItem key="fConfirmPwd" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="确认密码">
          {form.getFieldDecorator('fConfirmPwd', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'validation.confirm-password.required' }),
              },
              {
                validator: this.checkConfirm,
              },
            ],
          })(
            <Input
              size="large"
              type="password"
              placeholder={formatMessage({ id: 'form.confirm-password.placeholder' })}
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}

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
    expandForm: false,
    selectedRows: [],
    formValues: {},
    updateFormValues: {},
    updatePwdFormValues: {},
  };

  // 列表查询参数
  pagination = {
    currentPage: 1,
    pageSize: 10,
  };
  filtersArg = [];
  sorter = {};

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
      render(val) {
        return sex[val];
      },
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
      filters: [
        {
          text: activeData[0],
          value: 0,
        },
        {
          text: activeData[1],
          value: 1,
        },
      ],
      render(val) {
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
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.batchDelete(record)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'userManage/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    var params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    console.log(params);
    this.pagination = pagination;
    this.filtersArg = filtersArg;
    this.sorter = sorter;

    dispatch({
      type: 'userManage/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'userManage/fetch',
      payload: {},
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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

      this.setState({
        formValues: values,
      });

      // dispatch({
      //   type: 'userManage/fetch',
      //   payload: values,
      // });
      // 查询时返回第一页
      this.pagination.current = 1;
      this.handleStandardTableChange(this.pagination, this.filtersArg, this.sorter);
    });
  }

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
      if (userManage.status === 'ok') {
        message.success('添加成功');
        this.handleModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else {
        message.warning(userManage.message);
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
      if (userManage.status === 'ok') {
        message.success('修改成功');
        this.handleUpdateModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else if (userManage.status === 'warning') {
        message.warning(userManage.message);
      }
      else {
        message.error(userManage.message);
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
      if (userManage.status === 'ok') {
        message.success('修改成功');
        this.handleUpdatePwdModalVisible();
        // 成功后再次刷新列表
        this.search();
      } else if (userManage.status === 'warning') {
        message.warning(userManage.message);
      }
      else {
        message.error(userManage.message);
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
        if (userManage.status === 'ok') {
          if (userManage.message) {
            userManage.message.map(m => notification.error({
              message: m,
            }));
          }
          // 成功后再次刷新列表
          this.search();
        }
      },
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
            <FormItem label="姓名">
              {getFieldDecorator('fName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('fIsActive')(
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

  renderAdvancedForm() {
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

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      userManage: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, updateFormValues, updatePwdModalVisible, updatePwdFormValues, } = this.state;
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
    return (
      <GridContent>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
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
      </GridContent>
    );
  }
}

export default TableList;
