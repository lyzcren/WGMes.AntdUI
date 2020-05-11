import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Button, Checkbox, Input, message, Select, Row, Col } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { erpTypeMaps } from '@/utils/GlobalConst';

import styles from './ErpView.less';

const FormItem = Form.Item;
const { TextArea, Password } = Input;

class ErpView extends PureComponent {
  static defaultProps = {
    erpTypes: Object.keys(erpTypeMaps).map(item => ({
      label: erpTypeMaps[item],
      value: item,
    })),
  };

  state = {
    erpType: 'k3',
    erpDbHost: '',
    erpDbUser: '',
    erpDbPwd: '',
    erpDbCatalog: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchSyncBusinessConfig',
    }).then(config => {
      const { erpType, erpDbHost, erpDbUser, erpDbPwd, erpDbCatalog, moSyncSql } = config;
      this.setState({ erpType, erpDbHost, erpDbUser, erpDbPwd, erpDbCatalog, moSyncSql });
    });
  }

  getDatabases = () => {
    const { form, dispatch } = this.props;

    const host = form.getFieldValue('erpDbHost');
    const userName = form.getFieldValue('erpDbUser');
    const password = form.getFieldValue('erpDbPwd');
    if (!host) {
      message.warning('请先填写ERP数据库服务器IP');
      return;
    }
    if (!userName) {
      message.warning('请先填写ERP数据库用户名');
      return;
    }
    if (!password) {
      message.warning('请先填写ERP数据库密码');
      return;
    }
    dispatch({
      type: 'businessConfig/getDbNames',
      payload: {
        host,
        userName,
        password
      },
    }).then(response => {
      this.setState({ dbNames: response });
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'businessConfig/updateSync',
        payload: fieldsValue,
      }).then(response => {
        if (!response || response.status === 'ok') {
          message.success('修改成功');
        } else if (response.status === 'warning') {
          message.warning(response.message);
        } else if (response.status === 'err') {
          message.error(response.message);
        }
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      erpTypes,
    } = this.props;
    const { erpType, erpDbHost, erpDbUser, erpDbPwd, erpDbCatalog, moSyncSql,
      dbNames } = this.state;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="ERP类型">
              {getFieldDecorator(`erpType`, {
                rules: [{ required: true, message: '请选择ERP类型' }],
                initialValue: erpType,
              })(
                <Select>
                  {erpTypes.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {item.label}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem label="ERP数据库服务器IP">
              {getFieldDecorator('erpDbHost', {
                rules: [{ required: true, message: '请输入ERP数据库服务器IP' }],
                initialValue: erpDbHost,
              })(<Input style={{ maxWidth: '224px' }} placeholder="请输入ERP数据库服务器IP" />)}
            </FormItem>
            <FormItem label="ERP数据库用户名">
              {getFieldDecorator('erpDbUser', {
                rules: [{ required: true, message: '请输入ERP数据库用户名' }],
                initialValue: erpDbUser,
              })(<Input style={{ maxWidth: '224px' }} placeholder="请输入ERP数据库用户名" />)}
            </FormItem>
            <FormItem label="ERP数据库密码">
              {getFieldDecorator('erpDbPwd', {
                rules: [{ required: true, message: '请输入ERP数据库密码' }],
                initialValue: erpDbPwd,
              })(<Password style={{ maxWidth: '224px' }} placeholder="请输入ERP数据库密码" />)}
            </FormItem>
            <FormItem label="ERP数据库名称">
              <Row>
                <Col md={10} sm={24}>
                  {dbNames ?
                    getFieldDecorator('erpDbCatalog', {
                      rules: [{ required: true, message: '请输入ERP数据库名称' }],
                      initialValue: erpDbCatalog,
                    })(
                      <Select style={{ maxWidth: '224px' }} placeholder="请输入ERP数据库名称">
                        {dbNames.map(item => (
                          <Select.Option key={item} value={item}>
                            {item}
                          </Select.Option>
                        ))}
                      </Select>)
                    :
                    getFieldDecorator('erpDbCatalog', {
                      rules: [{ required: true, message: '请输入ERP数据库名称' }],
                      initialValue: erpDbCatalog,
                    })(<Input style={{ maxWidth: '224px' }} placeholder="请输入ERP数据库名称" />)
                  }
                </Col>
                <Col md={10} sm={24}>
                  <Button onClick={this.getDatabases}>载入数据库</Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem label="生产任务单同步SQL">
              {getFieldDecorator('moSyncSql', {
                rules: [{ required: true, message: '请输入生产任务单同步SQL' }],
                initialValue: moSyncSql,
              })(<TextArea style={{ minHeight: 250 }} placeholder="请输入生产任务单同步SQL" />)}
            </FormItem>
            <Button type="primary" onClick={this.handleSubmit}>
              保存修改
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default connect(({ global, businessConfig }) => ({
  global,
  businessConfig,
}))(Form.create()(ErpView));
