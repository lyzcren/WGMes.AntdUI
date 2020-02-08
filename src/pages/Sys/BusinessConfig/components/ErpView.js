import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Button, Checkbox, Input, message, Select } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { erpTypeMaps } from '@/utils/GlobalConst';

import styles from './ErpView.less';

const FormItem = Form.Item;
const { TextArea } = Input;

class ErpView extends PureComponent {
  static defaultProps = {
    erpTypes: Object.keys(erpTypeMaps).map(item => {
      return {
        label: erpTypeMaps[item],
        value: item,
      };
    }),
  };

  state = {
    erpType: 'k3',
    erpConnectionString: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchSyncBusinessConfig',
    }).then(config => {
      const { erpType, erpConnectionString, moSyncSql } = config;
      this.setState({ erpType, erpConnectionString, moSyncSql });
    });
  }

  handlerSubmit = event => {
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
    const { erpType, erpConnectionString, moSyncSql } = this.state;
    console.log(erpTypes);

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={'ERP类型'}>
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
            <FormItem label="ERP连接字符串">
              {getFieldDecorator('erpConnectionString', {
                rules: [{ required: true, message: '请输入ERP连接字符串' }],
                initialValue: erpConnectionString,
              })(<TextArea style={{ minHeight: 32 }} placeholder="请输入ERP连接字符串" />)}
            </FormItem>
            <FormItem label="生产任务单同步SQL">
              {getFieldDecorator('moSyncSql', {
                rules: [{ required: true, message: '请输入生产任务单同步SQL' }],
                initialValue: moSyncSql,
              })(<TextArea style={{ minHeight: 250 }} placeholder="请输入生产任务单同步SQL" />)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
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
  businessConfig: businessConfig,
}))(Form.create()(ErpView));
