import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Select, Input, Modal, Radio, Progress, Popover } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {
  validatePhone,
  validatePassword,
  getPasswordStatus,
  passwordProgressMap,
} from '@/utils/validators';
import { GlobalConst } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

/* eslint react/no-multi-comp:0 */
@connect(({ basicData, loading }) => ({
  basicData,
  loading: loading.models.userManage,
}))
export class CreateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};

    const { dispatch } = props;
    dispatch({
      type: 'basicData/getOperator',
    });
  }

  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  checkConfirm = (rule, value, callback) => {
    const {
      form: { getFieldValue },
    } = this.props;
    if (value && value !== getFieldValue('fPwd')) {
      callback(formatMessage({ id: 'validation.password.twice' }));
    } else {
      callback();
    }
  };
  checkPassword = e => {
    const { form } = this.props;

    const confirmPwd = form.getFieldValue('fConfirmPwd');
    if (confirmPwd) {
      setTimeout(() => {
        form.validateFields(['fConfirmPwd'], { force: true });
      }, 100);
    }
  };
  passwordStatusMap = {
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
  renderPasswordProgress = value => {
    // const value = form.getFieldValue('fPwd');
    const passwordStatus = getPasswordStatus(value);
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={GlobalConst.passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      modalVisible,
      basicData: { operators },
      handleAdd,
      handleModalVisible,
    } = this.props;
    return (
      <Modal
        destroyOnClose
        title="新建用户"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
          {getFieldDecorator('fNumber', {
            rules: [
              { required: true, message: '请输入用户名！' },
              // 正则匹配（提示错误，阻止表单提交）
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
          {getFieldDecorator('fName', {
            rules: [
              { required: true, message: '请输入姓名' },
              // 正则匹配（提示错误，阻止表单提交）
              {
                pattern: /^[^\s]*$/,
                message: '禁止输入空格',
              },
            ],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
          {getFieldDecorator('fPhone', {
            rules: [{ required: false, message: '请输入手机号码！' }, { validator: validatePhone }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="操作员">
          {getFieldDecorator('fBindEmpID', {
            rules: [{ required: false, message: '请选择操作员' }],
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择操作员"
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {operators.map(x => (
                <Option key={x.fItemID} value={x.fItemID}>
                  {x.fName + ' - ' + x.fNumber}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工卡卡号">
          {getFieldDecorator('fIdCardNumber', {
            rules: [{ required: false, message: '请扫描工卡！' }],
          })(<Input placeholder="请扫描工卡" />)}
        </FormItem>
        <FormItem key="fSex" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
          {getFieldDecorator('fSex', {})(
            <RadioGroup>
              <RadioButton value={1}>男</RadioButton>
              <RadioButton value={2}>女</RadioButton>
            </RadioGroup>
          )}
        </FormItem>
        <FormItem key="fPwd" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
          <Popover
            getPopupContainer={node => node.parentNode}
            content={
              <div style={{ padding: '4px 0' }}>
                {this.passwordStatusMap[getPasswordStatus()]}
                {this.renderPasswordProgress(getFieldValue('fPwd'))}
                <div style={{ marginTop: 10 }}>
                  <FormattedMessage id="validation.password.strength.msg" />
                </div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement="right"
          >
            {getFieldDecorator('fPwd', {
              rules: [
                {
                  required: true,
                  validator: validatePassword,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'form.password.placeholder' })}
                onChange={this.checkPassword}
              />
            )}
          </Popover>
        </FormItem>
        <FormItem
          key="fConfirmPwd"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="确认密码"
        >
          {getFieldDecorator('fConfirmPwd', {
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
