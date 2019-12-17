import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Steps, Input, Modal, Radio, Switch, Select, message, Button, Tag } from 'antd';
import { Link } from 'umi';

/* eslint react/no-multi-comp:0 */
@connect(({}) => ({}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ChooseDeptForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { loading, modalVisible, handleModalVisible, handleSubmit, deptList } = this.props;
    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Modal
        destroyOnClose
        title={'选择岗位'}
        visible={modalVisible}
        footer={footer}
        width={650}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
        <Card bordered={false} loading={loading}>
          {deptList.map(dept => (
            <Button key={dept.fDeptID} onClick={() => handleSubmit(dept)}>
              {dept.fDeptName}
            </Button>
          ))}
        </Card>
      </Modal>
    );
  }
}
