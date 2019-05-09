import React, { PureComponent } from 'react';
import {
  Form,
  Input,
  Modal,
  Radio, Progress, Popover,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone, validatePassword, getPasswordStatus, passwordProgressMap } from '@/utils/validators';
import { GlobalConst } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;


export const CreateForm = Form.create()(props => {
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
  const renderPasswordProgress = (value) => {
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