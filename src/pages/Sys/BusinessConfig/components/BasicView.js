import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Button, Upload, Checkbox, Input, message, Select } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { loginModeMaps } from '@/utils/GlobalConst';

import styles from './BasicView.less';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>Logo</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <Icon type={'upload'} />
          更换Logo
        </Button>
      </div>
    </Upload>
  </Fragment>
);

class BasicView extends PureComponent {
  state = {
    checkGroupOptions: Object.keys(loginModeMaps).map(item => {
      return {
        label: loginModeMaps[item],
        value: item,
      };
    }),
    allowLoginModes: Object.keys(loginModeMaps),
    defaultLoginMode: 'number',
  };

  onChange = allowLoginModes => {
    const { defaultLoginMode } = this.state;
    this.setState({
      allowLoginModes,
      defaultLoginMode: allowLoginModes.includes(defaultLoginMode)
        ? defaultLoginMode
        : allowLoginModes
        ? allowLoginModes[0]
        : '',
    });
  };

  getAvatarURL() {
    const { businessConfig } = this.props;
    if (businessConfig) {
      if (businessConfig.avatar) {
        return businessConfig.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
  }

  handlerSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'businessConfig/updateBasic',
        payload: fieldsValue,
      }).then(response => {
        if (!response || response.status === 'ok') {
          message.success('修改成功');
        } else if (response.status === 'warning') {
          message.warning(response.message);
        } else if (response.status === 'err') {
          message.warning(response.message);
        }
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      businessConfig,
    } = this.props;
    const { checkGroupOptions } = this.state;
    const allowLoginModes = businessConfig.allowLoginModes
      ? businessConfig.allowLoginModes
      : this.state.allowLoginModes;
    const defaultLoginMode = businessConfig.defaultLoginMode
      ? businessConfig.defaultLoginMode
      : this.state.defaultLoginMode;

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label={'允许登录方式'}>
              {getFieldDecorator(`allowLoginModes`, {
                initialValue: allowLoginModes,
              })(<CheckboxGroup options={checkGroupOptions} onChange={this.onChange} />)}
            </FormItem>
            <FormItem label={'默认登录方式'}>
              {getFieldDecorator(`defaultLoginMode`, {
                rules: [{ required: true, message: '请选择默认登录方式' }],
                initialValue: defaultLoginMode,
              })(
                <Select>
                  {checkGroupOptions
                    .filter(item => allowLoginModes.includes(item.value))
                    .map(item => (
                      <Select.Option key={item.value} value={item.value}>
                        {item.label}
                      </Select.Option>
                    ))}
                </Select>
              )}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              保存修改
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default connect(({ businessConfig }) => ({
  businessConfig: businessConfig,
}))(Form.create()(BasicView));
