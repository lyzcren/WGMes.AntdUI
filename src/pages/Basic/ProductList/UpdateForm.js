import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Form,
    Input,
    Modal,
    Switch,
    Tag,
    Select,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { validatorPhone, validatePassword, getPasswordStatus, passwordProgressMap } from '@/utils/validators';


const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
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

    componentDidMount = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'basicData/getRouteData',
        });
    };

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
        const { form, basicData, updateModalVisible, handleModalVisible, values } = this.props;
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
                    })(<Input placeholder="请输入" readOnly />)}
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工艺路线">
                    {form.getFieldDecorator('fRouteID', {
                        rules: [{ required: true, message: '请选择工艺路线' }],
                        initialValue: formVals.fRouteID > 0 ? formVals.fRouteID : null,
                    })(<Select style={{ width: 300 }}>
                        {basicData.routeData.map(t => <Option key={t.fInterID} value={t.fInterID}>{t.fName}</Option>)}
                    </Select>)}
                </FormItem>
            </Modal>
        );
    }
};
