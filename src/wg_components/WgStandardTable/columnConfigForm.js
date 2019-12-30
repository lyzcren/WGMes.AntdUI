import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Select, Tag, message, Table, Button, Card } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import WgDragableView from '@/wg_components/WgDragableView';

import styles from './columnConfigForm.less';

/* eslint react/no-multi-comp:0 */
@Form.create()
class ColumnConfigForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  handleColumnChange = (val, record) => {
    const { handleColumnChange } = this.props;
    setTimeout(() => {
      handleColumnChange({ ...record, isHidden: val });
    }, 0);
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { handleColumnMove, dataSource } = this.props;
    const dragRow = dataSource[dragIndex];
    const hoverRow = dataSource[hoverIndex];

    setTimeout(() => {
      handleColumnMove(dragRow.dataIndex, hoverRow.dataIndex);
    }, 0);
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      modalVisible,
      dataSource,
      handleModalVisible,
      handleSaveColumns,
    } = this.props;

    const columns = [
      {
        title: '列名',
        dataIndex: 'title',
      },
      {
        title: '显示',
        dataIndex: 'isHidden',
        width: '80px',
        render: (val, record) =>
          getFieldDecorator(`isHidden_${record.dataIndex}`, {
            initialValue: !val,
            valuePropName: 'checked',
          })(<Switch onChange={(val, e) => this.handleColumnChange(!val, record)} />),
      },
    ];

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
        keyboard
        title={<div>列配置</div>}
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => {
          handleModalVisible();
          handleSaveColumns();
        }}
      >
        <WgDragableView>
          <Table
            rowKey="entryID"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            scroll={{ y: 460 }}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
            })}
            bordered
          />
        </WgDragableView>
      </Modal>
    );
  }
}

export default ColumnConfigForm;
