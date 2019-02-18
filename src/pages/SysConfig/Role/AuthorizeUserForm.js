import React, { PureComponent } from 'react';
import moment from 'moment';
import {
    Row,
    Col,
    Form,
    Input,
    Select,
    Button,
    Modal,
    Switch,
    Tag,
    Table,
    message,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';
import { ok } from 'assert';


const FormItem = Form.Item;
const { Option } = Select;
const sex = ['保密', '男', '女',];

@Form.create()
export class AuthorizeUserForm extends PureComponent {
    static defaultProps = {
        handleUpdate: () => { },
        handleModalVisible: () => { },
        // handleSearchAuthorizedUser: () => { },
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
            selectedRows: [],
        };
    }

    columns = [
        {
            title: '用户名',
            dataIndex: 'fNumber',
        },
        {
            title: '姓名',
            dataIndex: 'fName',
        },
        {
            title: '性别',
            dataIndex: 'fSex',
            render (val) {
                return sex[val];
            },
        },
        {
            title: '状态',
            dataIndex: 'fIsAuthorized',
            render (val) {
                return val ? <Tag color="blue">已授权</Tag> : <Tag>未授权</Tag>;
            },
        },
        {
            title: '授权',
            dataIndex: 'Authorized',
            render: (text, record) => (
                record.fIsAuthorized ? <Button type="danger" shape="circle" icon="minus" onClick={() => { this.handleUnAuthorize(record) }} />
                    : <Button type="primary" shape="circle" icon="plus" onClick={() => this.handleAuthorize(record)} />
            )
        },
    ];

    handleSearchAuthorizedUser = (fieldsValue) => {
        const { dispatch } = this.props;
        // 获取当前角色已关联的用户列表
        dispatch({
            type: 'roleManage/getAuthorizeUser',
            payload: {
                fItemID: fieldsValue.fItemID, fIsActive: fieldsValue.fIsActive, userName: fieldsValue.userName,
            },
        });
    };

    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    handleSearch = (e) => {
        const { form } = this.props;
        e.preventDefault();
        form.validateFields((err, fieldsValue) => {
            // 设置fItemId
            fieldsValue.fItemID = this.state.formVals.fItemID;
            this.handleSearchAuthorizedUser(fieldsValue);
        });
    };

    handleAuthorize = (record) => {
        const { dispatch, form, queryResult } = this.props;
        dispatch({
            type: 'roleManage/authorizeUser',
            payload: {
                fUserID: record.fItemID, fRoleID: this.state.formVals.fItemID
            },
        }).then(() => {
            if (queryResult.status && queryResult.status == 'ok') {
                form.validateFields((err, fieldsValue) => {
                    // 设置fItemId
                    fieldsValue.fItemID = this.state.formVals.fItemID;
                    this.handleSearchAuthorizedUser(fieldsValue);
                });
            } else {
                message.warning(queryResult.message);
            }
        });
    };

    handleUnAuthorize = (record) => {
        const { dispatch, form, queryResult } = this.props;
        dispatch({
            type: 'roleManage/unAuthorizeUser',
            payload: {
                fUserID: record.fItemID, fRoleID: this.state.formVals.fItemID
            },
        }).then(() => {
            if (queryResult.status && queryResult.status == 'ok') {
                form.validateFields((err, fieldsValue) => {
                    // 设置fItemId
                    fieldsValue.fItemID = this.state.formVals.fItemID;
                    this.handleSearchAuthorizedUser(fieldsValue);
                });
            } else {
                message.warning(queryResult.message);
            }
        });
    };

    handleFormReset = () => {
        const { form, dispatch, handleUpdate } = this.props;
        form.resetFields();
        form.validateFields((err, fieldsValue) => {
            // 设置fItemId
            fieldsValue.fItemID = this.state.formVals.fItemID;
            this.handleSearchAuthorizedUser(fieldsValue);
        });
    };


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
        const { loading, form, authorizeUserModalVisible, handleModalVisible, values, authorizeUser } = this.props;
        const { formVals, selectedRows } = this.state;

        return (
            <Modal
                destroyOnClose
                title={<div>绑定 <Tag color="blue">{formVals.fName}</Tag>用户</div>}
                visible={authorizeUserModalVisible}
                width="760px"
                okButtonProps={{ disabled: true }}
                // onOk={this.okHandle}
                onCancel={() => handleModalVisible(false, values)}
                afterClose={() => handleModalVisible()}
            >
                <Form onSubmit={this.handleSearch} layout="inline">
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={10} sm={2}>
                            <FormItem id="userName" label="姓名">
                                {form.getFieldDecorator('userName')(<Input placeholder="请输入" />)}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={0}>
                            <FormItem label="状态">
                                {form.getFieldDecorator('fIsActive')(
                                    <Select placeholder="请选择" style={{ width: '124px' }}>
                                        <Option value="true">已授权</Option>
                                        <Option value="false">未授权</Option>
                                    </Select>)}
                            </FormItem>
                        </Col>
                        <Col md={6} sm={8}>
                            <span className={styles.submitButtons}>
                                <Button type="primary" htmlType="submit">
                                    查询</Button>
                                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                    重置</Button>
                            </span>
                        </Col>
                    </Row>
                </Form>
                <StandardTable
                    rowKey="fNumber"
                    selectedRows={selectedRows}
                    loading={loading}
                    dataSource={authorizeUser}
                    // data={data}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                />
            </Modal>
        );
    }
};
