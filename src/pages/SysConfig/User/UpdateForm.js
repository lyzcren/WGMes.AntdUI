import React, { PureComponent } from 'react';
import moment from 'moment';
import {
    Form,
    Input,
    Modal,
    Radio, Progress, notification,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone, validatePassword, getPasswordStatus, passwordProgressMap } from '@/utils/validators';


const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@Form.create()
export class UpdateForm extends PureComponent {
    static defaultProps = {
        handleUpdate: () => { },
        handleUpdateModalVisible: () => { },
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
            },
        };
    }

    okHandle = () => {
        const { form, handleUpdate } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            // form.resetFields();
            // 设置fItemId
            fieldsValue.fItemID = this.state.formVals.fItemID;
            handleUpdate(fieldsValue);
        });
    };

    render() {
        const { form, updateModalVisible, handleUpdateModalVisible, values } = this.props;
        const { formVals } = this.state;

        return (
            <Modal
                destroyOnClose
                title="修改用户"
                visible={updateModalVisible}
                onOk={this.okHandle}
                onCancel={() => handleUpdateModalVisible(false, values)}
                afterClose={() => handleUpdateModalVisible()}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
                    {form.getFieldDecorator('fNumber', {
                        initialValue: formVals.fNumber,
                        rules: [{ required: true, message: '请输入至少五个字符的用户名！', min: 5 }],
                    })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
                    {form.getFieldDecorator('fName', {
                        initialValue: formVals.fName,
                        rules: [{ required: true, message: '请输入姓名', min: 1 }],
                    })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手机号码">
                    {form.getFieldDecorator('fPhone', {
                        initialValue: formVals.fPhone,
                        rules: [
                            { required: false, message: '请输入手机号码！' },
                            { validator: validatorPhone }
                        ]
                    })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem key="fSex" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
                    {form.getFieldDecorator('fSex', {
                        initialValue: formVals.fSex.toString(),
                    })(
                        <RadioGroup>
                            <Radio value="1">男</Radio>
                            <Radio value="2">女</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
            </Modal>
        );
    }
};
