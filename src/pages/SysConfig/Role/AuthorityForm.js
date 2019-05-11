import React, { PureComponent } from 'react';
import moment from 'moment';
import { Tree, Input, Modal, Form, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { func } from 'prop-types';

const FormItem = Form.Item;
const { TreeNode } = Tree;

/* eslint react/no-multi-comp:0 */
@Form.create()
export class AuthorityForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    const { authority } = props;
    const treeData = [];
    const expandedKeys = [];
    const mapChildren = auth => {
      if (auth.children) {
        return auth.children.map(function(child) {
          return {
            title: child.name,
            key: child.number,
            children: mapChildren(child),
          };
        });
      }
    };
    authority.forEach(element => {
      const treeNodeData = {
        title: element.name,
        key: element.number,
        children: mapChildren(element),
      };
      expandedKeys.push(treeNodeData.key);
      treeData.push(treeNodeData);
    });

    this.state = {
      formVals: {
        fItemID: props.values.fItemID,
        fName: props.values.fName,
      },
      treeData: treeData,
      expandedKeys: expandedKeys,
      autoExpandParent: true,
      checkedKeys: props.currentAuthority,
      selectedKeys: [],
    };
  }

  okHandle = () => {
    const { form, handleUpdate } = this.props;
    handleUpdate(this.state.formVals.fItemID, this.state.checkedKeys);
  };

  onExpand = expandedKeys => {
    // console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    // console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    // console.log('onSelect', info);
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  render() {
    const { form, authorityModalVisible, handleModalVisible, values } = this.props;
    const { formVals } = this.state;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            ??? <Tag color="blue">{formVals.fName}</Tag>???
          </div>
        }
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
}
