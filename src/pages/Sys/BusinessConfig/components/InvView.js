import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Button, Checkbox, Input, message, Select, Typography } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './InvView.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Text } = Typography;

class InvView extends PureComponent {
  static defaultProps = {};

  state = {
    invType: '',
    invTypes: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessConfig/getInvTypes',
    }).then(invTypes => {
      this.setState({ invTypes });
    });
    dispatch({
      type: 'global/fetchInvBusinessConfig',
    }).then(config => {
      const { invType } = config;
      this.setState({ invType });
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
        type: 'businessConfig/updateInv',
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
    } = this.props;
    const { invTypes, invType } = this.state;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={'末岗位良品库存粒度'}>
              <div>
                {getFieldDecorator(`invType`, {
                  rules: [{ required: true, message: '请选择良品库存粒度' }],
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
                  注：设置良品库存最小粒度，系统在流程单完成后将良品库存以设置的粒度进行管理，此设置将同时影响生产任务汇报方式。
                </Text>
              </div>
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
  businessConfig: businessConfig,
}))(Form.create()(InvView));
