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
export class AuthorizeRoleForm extends PureComponent {
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
            title: '角色',
            dataIndex: 'fName',
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
            type: 'userManage/getAuthorizeRole',
            payload: {
                fItemID: fieldsValue.fItemID, fIsAuthorized: fieldsValue.fIsAuthorized, roleName: fieldsValue.roleName,
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
        const { dispatch, form, } = this.props;
        dispatch({
            type: 'userManage/authorizeRole',
            payload: {
                fUserID: this.state.formVals.fItemID, fRoleID: record.fItemID
            },
        }).then(() => {
            const { queryResult } = this.props;
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
        const { dispatch, form, } = this.props;
        dispatch({
            type: 'userManage/unAuthorizeRole',
            payload: {
                fUserID: this.state.formVals.fItemID, fRoleID: record.fItemID
            },
        }).then(() => {
            const { queryResult } = this.props;
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
        const { loading, form, modalVisible, handleModalVisible, values, authorizeRole } = this.props;
        const { formVals, selectedRows } = this.state;

        return (
            <Modal
                destroyOnClose
                title={<div>授权 <Tag color="blue">{formVals.fName}</Tag>角色</div>}
                visible={modalVisible}
                width="760px"
                okButtonProps={{ disabled: true }}
                // onOk={this.okHandle}
                onCancel={() => handleModalVisible(false, values)}
                afterClose={() => handleModalVisible()}
            >
                <Form onSubmit={this.handleSearch} layout="inline">
                    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                        <Col md={10} sm={2}>
                            <FormItem id="roleName" label="角色">
                                {form.getFieldDecorator('roleName')(<Input placeholder="请输入" />)}
                            </FormItem>
                        </Col>
                        <Col md={8} sm={0}>
                            <FormItem label="状态">
                                {form.getFieldDecorator('fIsAuthorized')(
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
                <Table
                    rowKey="fName"
                    selectedRows={selectedRows}
                    loading={loading}
                    dataSource={authorizeRole}
                    // data={data}
                    columns={this.columns}
                    onSelectRow={this.handleSelectRows}
                />
            </Modal>
        );
    }
};
