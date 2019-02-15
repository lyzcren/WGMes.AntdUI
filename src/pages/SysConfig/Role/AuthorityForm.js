import React, { PureComponent } from 'react';
import moment from 'moment';
import {
    Tree,
    Input,
    Modal,
    Form,
    Tag,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';


const FormItem = Form.Item;
const { TreeNode } = Tree;


@Form.create()
export class AuthorityForm extends PureComponent {
    static defaultProps = {
        handleUpdate: () => { },
        handleModalVisible: () => { },
        values: {},
    };

    constructor(props) {
        super(props);

        this.state = {
            formVals: {
                fItemID: props.values.fItemID,
                fName: props.values.fName,
            },
            treeData:
                [{
                    title: '0-0',
                    key: '0-0',
                    children: [{
                        title: '0-0-0',
                        key: '0-0-0',
                        children: [
                            { title: '0-0-0-0', key: '0-0-0-0' },
                            { title: '0-0-0-1', key: '0-0-0-1' },
                            { title: '0-0-0-2', key: '0-0-0-2' },
                        ],
                    }, {
                        title: '0-0-1',
                        key: '0-0-1',
                        children: [
                            { title: '0-0-1-0', key: '0-0-1-0' },
                            { title: '0-0-1-1', key: '0-0-1-1' },
                            { title: '0-0-1-2', key: '0-0-1-2' },
                        ],
                    }, {
                        title: '0-0-2',
                        key: '0-0-2',
                    }],
                }, {
                    title: '0-1',
                    key: '0-1',
                    children: [
                        { title: '0-1-0-0', key: '0-1-0-0' },
                        { title: '0-1-0-1', key: '0-1-0-1' },
                        { title: '0-1-0-2', key: '0-1-0-2' },
                    ],
                }, {
                    title: '0-2',
                    key: '0-2',
                }],
            expandedKeys: ['0-0-0', '0-0-1'],
            autoExpandParent: true,
            checkedKeys: ['0-0-0', '0-0-1-0'],
            selectedKeys: [],
        };
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

    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    })

    render () {
        const { form, authorityModalVisible, handleModalVisible, values } = this.props;
        const { formVals } = this.state;

        return (
            <Modal
                destroyOnClose
                title={<div>维护 <Tag color="blue">{formVals.fName}</Tag>权限</div>}
                visible={authorityModalVisible}
                onOk={this.okHandle}
                onCancel={() => handleModalVisible(false, values)}
                afterClose={() => handleModalVisible()}
            >
                <Tree
                    checkable
                    sele
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                >
                    {this.renderTreeNodes(this.state.treeData)}
                </Tree>
            </Modal>
        );
    }
};
