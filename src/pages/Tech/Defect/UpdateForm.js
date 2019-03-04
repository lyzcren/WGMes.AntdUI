import React, { PureComponent } from 'react';
import moment from 'moment';
import {
    Form,
    Input,
    Modal,
    Switch,
    Tag,
    Select
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone, validatePassword, getPasswordStatus, passwordProgressMap } from '@/utils/validators';
import GlobalConst from '@/utils/GlobalConst'


const FormItem = Form.Item;
const Option = Select.Option;
const TypeData = GlobalConst.DefectTypeData;

@Form.create()
export class UpdateForm extends PureComponent {
    static defaultProps = {
        handleSubmit: () => { },
        handleModalVisible: () => { },
        values: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            formVals: props.values,
        };
    }

    okHandle = () => {
        const { form, handleSubmit } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            // form.resetFields();
            // 设置fItemId
            fieldsValue.fItemID = this.state.formVals.fItemID;
            handleSubmit(fieldsValue);
        });
    };

    render () {
        const { form, updateModalVisible, handleModalVisible, values } = this.props;
        const { formVals } = this.state;

        return (
            <Modal
                destroyOnClose
                title={<div>修改 <Tag color="blue">{formVals.fName}</Tag></div>}
                visible={updateModalVisible}
                onOk={this.okHandle}
                onCancel={() => handleModalVisible(false, values)}
                afterClose={() => handleModalVisible()}
            >
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
                    {form.getFieldDecorator('fName', {
                        initialValue: formVals.fName,
                        rules: [{ required: true, message: '请输入名称', min: 1 }],
                    })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="编码">
                    {form.getFieldDecorator('fNumber', {
                        rules: [{ required: true, message: '请输入编码', min: 1 }],
                        initialValue: formVals.fNumber,
                    })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
                    {form.getFieldDecorator('fTypeID', {
                        rules: [{ required: true, message: '请输入类型' }],
                        initialValue: TypeData.find((type, index) => type.value == formVals.fTypeID).text,
                    })(<Select style={{ width: 120 }}>
                        {TypeData.map(t => <Option key={t.value}>{t.text}</Option>)}
                    </Select>)}
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
