import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
import { Checkbox, Alert, message } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, IdCard, Mobile, Captcha, Submit } = Login;

@connect(({ user, loading, menu }) => ({
  user,
  submitting: loading.effects['user/login'],
  menu,
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: false,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'user/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'user/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { user, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {user.status === 'error' &&
              user.type === 'account' &&
              !submitting &&
              // this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
              this.renderMessage(user.message)}
            <UserName
              name="userName"
              autoFocus
              placeholder={`${formatMessage({ id: 'app.login.userName' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />
            <Password
              name="password"
              placeholder={`${formatMessage({ id: 'app.login.password' })}`}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={() =>
                this.loginForm.validateFields(['password', 'userName'], this.handleSubmit)
              }
            />
          </Tab>
          <Tab key="idcard" tab={formatMessage({ id: 'app.login.tab-login-idcard' })}>
            {user.status === 'error' &&
              user.type === 'idcard' &&
              !submitting &&
              this.renderMessage('卡号错误')}
            <IdCard
              name="idcard"
              autoFocus
              placeholder={formatMessage({ id: 'form.idcard-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.idcard-number.required' }),
                },
              ]}
              onPressEnter={() => this.loginForm.validateFields(['idcard'], this.handleSubmit)}
            />
          </Tab>
          {type !== 'idcard' && (
            <div>
              <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                <FormattedMessage id="app.login.remember-me" />
              </Checkbox>
              {/* <a style={{ float: 'right' }} href="">
                <FormattedMessage id="app.login.forgot-password" />
              </a> */}
            </div>
          )}
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          {/* <div className={styles.other}>
            <FormattedMessage id="app.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div> */}
        </Login>
      </div>
    );
  }
}

export default LoginPage;
