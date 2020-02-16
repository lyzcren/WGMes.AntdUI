import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Button, Upload, Checkbox, Input, message, Select } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { loginModeMaps, logoUrl } from '@/utils/GlobalConst';
import { getToken } from '@/utils/token';

import styles from './BasicView.less';

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar, uploadProps, isUploading }) => (
  <Fragment>
    <div className={styles.avatar_title}>菜单栏Logo（建议510*110）</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false} {...uploadProps}>
      <div className={styles.button_view}>
        <Button loading={isUploading} disabled={isUploading}>
          {!isUploading && <Icon type="upload" />}
          更换Logo
        </Button>
      </div>
    </Upload>
  </Fragment>
);

class BasicView extends PureComponent {
  state = {
    checkGroupOptions: Object.keys(loginModeMaps).map(item => ({
      label: loginModeMaps[item],
      value: item,
    })),
    allowLoginModes: this.props.global.basicBusinessConfig.allowLoginModes,
    defaultLoginMode: this.props.global.basicBusinessConfig.defaultLoginMode,
    isUploading: false,
    uploadLogoTimestamp: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/fetchBasicBusinessConfig',
    }).then(config => {
      const { allowLoginModes, defaultLoginMode } = config;
      this.setState({ allowLoginModes, defaultLoginMode });
    });
  }

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
    const {
      global: { basicBusinessConfig },
    } = this.props;
    const { uploadLogoTimestamp } = this.state;
    // if (basicBusinessConfig) {
    //   if (basicBusinessConfig.avatar) {
    //     return basicBusinessConfig.avatar;
    //   }
    //   const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
    //   return url;
    // }
    return `${logoUrl}?timestamp=${uploadLogoTimestamp}`;
  }

  handleSubmit = event => {
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
          message.error(response.message);
        }
      });
    });
  };

  onFileChange = info => {
    // if (info.file.status === 'removed') {
    // }
    if (info.file.status === 'uploading') {
      console.log(info.file, info.fileList);
      this.setState({ isUploading: true });
    }
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      this.setState({ isUploading: false });
    }
    if (info.file.status === 'done') {
      this.setState({ uploadLogoTimestamp: new Date().valueOf() });
      message.success(`${info.file.name} 文件上传成功.`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { checkGroupOptions, allowLoginModes, defaultLoginMode, isUploading } = this.state;
    const uploadProps = {
      name: 'file',
      action: '/api/businessConfig/logo',
      headers: {
        enctype: 'multipart/form-data',
        wgToken: getToken(),
      },
      onChange: this.onFileChange,
    };

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="允许登录方式">
              {getFieldDecorator(`allowLoginModes`, {
                initialValue: allowLoginModes,
              })(<CheckboxGroup options={checkGroupOptions} onChange={this.onChange} />)}
            </FormItem>
            <FormItem label="默认登录方式">
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
            <Button type="primary" onClick={this.handleSubmit}>
              保存修改
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView
            avatar={this.getAvatarURL()}
            uploadProps={uploadProps}
            isUploading={isUploading}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ global, businessConfig }) => ({
  global,
  businessConfig,
}))(Form.create()(BasicView));
