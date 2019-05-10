import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Form,
    Input,
    Modal,
    Switch,
    Tag,
    TreeSelect,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone, validatePassword, getPasswordStatus, passwordProgressMap } from '@/utils/validators';


const FormItem = Form.Item;

@connect(({ basicData }) => ({
    basicData,
}))
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

    componentDidMount () {
        const { dispatch } = this.props;
        dispatch({
            type: 'basicData/getProcessDeptTree',
        });
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
        const { form, updateModalVisible, handleModalVisible, values, basicData } = this.props;
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
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="部门">
                    {form.getFieldDecorator('fDeptID', {
                        rules: [{ required: true, message: '请选择部门' }],
                        initialValue: formVals.fDeptID,
                    })(<TreeSelect
                        style={{ width: 300 }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={basicData.processDeptTree}
                        treeDefaultExpandAll
                    />)}
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
