import React, { PureComponent } from 'react';
import {
    Form,
    Input,
    Modal,
    Progress, Popover,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone, validatePassword, getPasswordStatus, passwordProgressMap } from '@/utils/validators';
import { GlobalConst } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;

@Form.create()
export class UpdatePwdForm extends PureComponent {
    static defaultProps = {
        handleUpdatePwd: () => { },
        handleUpdatePwdModalVisible: () => { },
        values: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            formVals: {
                fItemID: props.values.fItemID,
                fNumber: props.values.fNumber,
                fName: props.values.fName,
                fPhone: props.values.fPhone,
                fSex: props.values.fSex,
                fPwd: props.values.fPwd,
            },
        };
    }

    okHandle = () => {
        const { form, handleUpdatePwd } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            // form.resetFields();
            // 设置fItemId
            fieldsValue.fItemID = this.state.formVals.fItemID;
            handleUpdatePwd(fieldsValue);
        });
    };
    checkConfirm = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('fPwd')) {
            callback(formatMessage({ id: 'validation.password.twice' }));
        } else {
            callback();
        }
    };
    checkPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value) {
            form.validateFields(['fConfirmPwd'], { force: true });
        }
        callback();
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
    renderPasswordProgress = (value) => {
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
        const { form, updatePwdModalVisible, handleUpdatePwdModalVisible, values } = this.props;
        const { formVals } = this.state;

        return (
            <Modal
                destroyOnClose
                title="修改密码"
                visible={updatePwdModalVisible}
                onOk={this.okHandle}
                onCancel={() => handleUpdatePwdModalVisible(false, values)}
                afterClose={() => handleUpdatePwdModalVisible()}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名" >
                    {form.getFieldDecorator('fNumber', {
                        initialValue: formVals.fNumber,
                        rules: [{ required: false, message: '请输入至少五个字符的用户名！', min: 5 }],
                    })(<Input placeholder="请输入" readOnly />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
                    {form.getFieldDecorator('fName', {
                        initialValue: formVals.fName,
                        rules: [{ required: false, message: '请输入姓名', min: 1 }],
                    })(<Input placeholder="请输入" readOnly />)}
                </FormItem>
                <FormItem key="fPwd" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密码">
                    <Popover
                        getPopupContainer={node => node.parentNode}
                        content={
                            <div style={{ padding: '4px 0' }}>
                                {this.passwordStatusMap[getPasswordStatus()]}
                                {this.renderPasswordProgress(form.getFieldValue('fPwd'))}
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
                                    validator: this.checkPassword,
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