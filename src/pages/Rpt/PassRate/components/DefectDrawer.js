import { Divider, Drawer, Table } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import numeral from 'numeral';


class DefectDrawer extends PureComponent {
  open = () => {
    const { handleVisible } = this.props;
    if (handleVisible) {
      handleVisible(true);
    }
  };

  onClose = () => {
    const { handleVisible } = this.props;
    if (handleVisible) {
      handleVisible(false);
    }
  };

  render () {
    const { loading, visible, defectData, currentRecord } = this.props;
    const columns = [
      {
        title: '不良',
        dataIndex: 'fDefectName',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'fQty',
        width: 100,
      },
      {
        title: '不良比例',
        dataIndex: 'fRate',
        width: 100,
        render: (value, record) => `${numeral(record.fQty * 100 / currentRecord.fInputQty).format('0.00')}%`,
      },
    ];

    return (
      <Drawer
        title="不良明细"
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={visible}
        loading={loading}
        getContainer={false}
        style={{ position: 'absolute' }}
        width={320}
      >
        <Table
          rowKey={'fDefectID'}
          bordered
          columns={columns}
          dataSource={defectData.filter(d => d.fQty > 0)}
          pagination={false}
        />
      </Drawer>
    );
  }
}

export default DefectDrawer;
