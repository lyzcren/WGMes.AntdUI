import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
import { Checkbox, Alert, message, Col, Row, Icon } from 'antd';
import Login from '@/components/Login';
import screenfull from 'screenfull';

import styles from './List.less';
import ButtonGroup from 'antd/lib/button/button-group';

const { Tab, UserName, Password, IdCard, Mobile, Captcha, Submit } = Login;

@connect(({ user, loading, menu }) => ({
  user,
  menu,
}))
class QuickOpsPage extends Component {
  state = {
    type: 'account',
    autoLogin: false,
  };

  componentDidMount() {
    setTimeout(() => {
      if (!screenfull.isFullscreen) screenfull.request();
    }, 100);
  }

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
            type: 'login/getCaptcha',
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
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      }).then(() => {});
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
    const { login } = this.props;
    const { type, autoLogin } = this.state;

    return (
      <div className={styles.main}>
        <Col span={13}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <div className={styles.headWrapper} />
          </Row>
          <Row gutter={8}>
            <Col span={3}>
              <div style={{ height: '80px' }} />
            </Col>
            <Col span={6}>
              <QuickButton title={'签收'} />
            </Col>
            <Col span={6}>
              <QuickButton title={'转序'} />
            </Col>
            <Col span={6}>
              <QuickButton title={'打印'} />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={3}>
              <div style={{ height: '80px' }} />
            </Col>
            <Col span={6}>
              <QuickButton title={'拒签'} />
            </Col>
            <Col span={6}>
              <QuickButton title={'退回'} />
            </Col>
            <Col span={6}>
              <QuickButton title={'取走'} />
            </Col>
          </Row>
        </Col>
        <Col span={3} />
        <Col span={6}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <div className={styles.right_header} />
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient}>
              <span>
                <Icon type="double-right" /> 岗位： <b>贴膜</b>
              </span>
            </h2>
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient}>
              <span>
                <Icon type="double-right" /> 机台： <b>贴膜1号机</b>
              </span>
            </h2>
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient}>
              <span>
                <Icon type="double-right" /> 班次： <b>早班</b>
              </span>
            </h2>
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient}>
              <span>
                <Icon type="double-right" /> 操作员： <b>张三三</b>
              </span>
            </h2>
          </Row>
        </Col>
      </div>
    );
  }
}

class QuickButton extends Component {
  render() {
    return (
      <a className={styles.quick_button} href="#" target="_blank">
        <span>{this.props.title}</span>
      </a>
    );
  }
}

export default QuickOpsPage;
