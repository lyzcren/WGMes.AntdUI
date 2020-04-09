import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Table, Button, Row, Col } from 'antd';
import WgStandardTable from '@/wg_components/WgStandardTable';

import styles from './ChooseForm.less';

const FormItem = Form.Item;

@Form.create()
export class ChooseForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  componentDidUpdate(preProps) {}

  handleSelectRows = rowKeys => {
    const { handleSelectRows, dataSource } = this.props;
    const rows = dataSource.filter(d => rowKeys.find(r => r === d.fInterID));
    const rowsUnSelect = dataSource.filter(d => !rowKeys.find(r => r === d.fInterID));
    if (handleSelectRows) {
      handleSelectRows(rows, rowsUnSelect);
    }
  };

  close = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  getColumns = () => {
    const columns = [
      {
        title: '不良类型',
        dataIndex: 'fDefectName',
      },
      {
        title: '不良编码',
        dataIndex: 'fDefectNumber',
      },
      {
        title: '数量',
        dataIndex: 'fCurrentQty',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
    ];

    return columns;
  };

  renderTable = () => {
    const { dataSource, loading, selectedRowKeys } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <Table
        bordered
        size={'middle'}
        rowKey="fInterID"
        loading={loading}
        dataSource={dataSource}
        columns={this.getColumns()}
        rowSelection={rowSelection}
      />
    );
  };

  render() {
    const { loading, modalVisible, handleModalVisible } = this.props;

    const footer = (
      <div>
        <Button
          loading={loading}
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
        loading={loading}
        title="选择不良明细"
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible()}
        wrapClassName={styles.modalWrap}
        width="860px"
      >
        {this.renderTable()}
      </Modal>
    );
  }
}
