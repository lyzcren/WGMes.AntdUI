import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Button, Switch, Input, message, Select, Typography } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './ProdView.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Text } = Typography;

class ProdView extends PureComponent {
  static defaultProps = {};

  state = {
    canMoreThanPlan: false,
    invType: '',
    reportUserName: 'Administrator',
    invTypes: [],
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessConfig/getInvTypes',
    }).then(invTypes => {
      this.setState({ invTypes });
    });
    dispatch({
      type: 'global/fetchProdBusinessConfig',
    }).then(config => {
      const { canMoreThanPlan, invType, reportUserName } = config;
      this.setState({ canMoreThanPlan: canMoreThanPlan.toUpperCase() === 'TRUE', invType, reportUserName });
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
        type: 'businessConfig/updateProd',
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

  render () {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { invTypes, canMoreThanPlan, invType, reportUserName } = this.state;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="投产数量可超出计划数量">
              {getFieldDecorator(`canMoreThanPlan`, {
                initialValue: canMoreThanPlan,
                valuePropName: 'checked',
              })(<Switch />)}
            </FormItem>
            <FormItem label="汇报明细汇总方式">
              <div>
                {getFieldDecorator(`invType`, {
                  rules: [{ required: true, message: '请选择汇报明细汇总方式' }],
                  initialValue: invType,
                })(
                  <Select style={{ maxWidth: '224px' }}>
                    {invTypes.map(item => (
                      <Select.Option key={item.fKey} value={item.fKeyName}>
                        {item.fValue}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                <br />
                <Text style={{ marginBottom: '20px' }} type="warning">
                  注：设置汇报明细汇总方式，在生产任务汇报时，汇报明细将按设置的方式进行汇总汇报。设置后系统良品库存将已设置的汇报方式（任务单、流程单）进行管理。
                </Text>
              </div>
            </FormItem>
            <FormItem label="汇报时使用的ERP用户名">
              {getFieldDecorator('reportUserName', {
                rules: [{ required: true, message: '请输入汇报时使用的ERP用户名' }],
                initialValue: reportUserName,
              })(<Input style={{ maxWidth: '224px' }} placeholder="请输入汇报时使用的ERP用户名" />)}
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
}))(Form.create()(ProdView));
