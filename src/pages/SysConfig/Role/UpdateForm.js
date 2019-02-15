import React, { PureComponent } from 'react';
import moment from 'moment';
import {
    Form,
    Input,
    Modal,
    Switch
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone, validatePassword, getPasswordStatus, passwordProgressMap } from '@/utils/validators';


const FormItem = Form.Item;

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
                fName: props.values.fName,
                fIsActive: props.values.fIsActive,
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

    render () {
        const { form, updateModalVisible, handleUpdateModalVisible, values } = this.props;
        const { formVals } = this.state;

        return (
            <Modal
                destroyOnClose
                title="修改角色"
                visible={updateModalVisible}
                onOk={this.okHandle}
                onCancel={() => handleUpdateModalVisible(false, values)}
                afterClose={() => handleUpdateModalVisible()}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色名">
                    {form.getFieldDecorator('fName', {
                        initialValue: formVals.fName,
                        rules: [{ required: true, message: '请输入角色名', min: 1 }],
                    })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="启用">
                    {form.getFieldDecorator('fIsActive', {
                        rules: [{ required: false }],
                        valuePropName: 'checked',
                        initialValue: formVals.fIsActive,
                    })(<Switch />)}
                </FormItem>
            </Modal>
        );
    }
};
