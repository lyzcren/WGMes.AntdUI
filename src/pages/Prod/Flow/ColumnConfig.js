import React, { PureComponent, Fragment } from 'react';
import numeral from 'numeral';
import QRCode from 'qrcode.react';
import { Switch, Popconfirm, Divider, Badge, Tooltip } from 'antd';
import Authorized from '@/utils/Authorized';
import RadioButton from 'antd/lib/radio/radioButton';
import WgIcon from '@/wg_components/WgIcon';
import { columns } from '@/columns/Prod/Flow';

class ColumnConfig {
  // 查看任务单
  missionModalVisibleCallback = record => { };

  // 查看工艺路线
  routeModalVisibleCallback = record => { };

  statusFilter = [];

  getColumns = ({ columnOps }) => {
    const defaultColumnOps = [
      {
        dataIndex: 'fFullBatchNo',
        render: (val, record) => (
          <div style={{ display: 'flex' }}>
            {val && (
              <Tooltip
                placement="topLeft"
                title={<QRCode value={val} size={200} fgColor="#000000" />}
              >
                <WgIcon style={{ marginRight: '6px' }} type="barcode" size={19} color="#666666" />
              </Tooltip>
            )}
            <div>{val}</div>
          </div>
        ),
      },
      {
        dataIndex: 'fCurrentPassRate',
        render: (val, record) =>
          record.fCurrentPassQty
            ? `${numeral((record.fCurrentPassQty * 100.0) / record.fInputQty).format('0.00')}%`
            : '',
      },
      {
        dataIndex: 'fStatusNumber',
        render: (val, record) => {
          if (record.fCancellation) {
            return <Badge color="#696969" text="已作废" />;
          }
          return <Badge color={record.fStatusColor} text={record.fStatusName} />;
        },
        filters: this.statusFilter,
      },
      {
        dataIndex: 'fMoBillNo',
        render: (val, record) => (
          <a onClick={() => this.missionModalVisibleCallback(record)}>{val}</a>
        ),
      },
      {
        dataIndex: 'fRouteName',
        render: (val, record) => <a onClick={() => this.routeModalVisibleCallback(record)}>{val}</a>,
      },
      {
        dataIndex: 'operators',
        render: (text, record) => this.renderOperation(text, record),
      },
    ];
    const newColumns = (columns || []).map(column => {
      let retColumn = column;
      const defaultColumnOp = defaultColumnOps
        .filter(x => x.dataIndex)
        .find(x => x.dataIndex === column.dataIndex);
      if (defaultColumnOp) {
        retColumn = { ...retColumn, ...defaultColumnOp };
      }
      if (columnOps) {
        const columnOp = columnOps.find(x => x.dataIndex === column.dataIndex) || [];
        retColumn = { ...retColumn, ...columnOp };
      }

      return retColumn;
    });

    return newColumns;
  }

  renderOperation = (text, record) => <Fragment />;
}

const columnConfig = new ColumnConfig();
export default columnConfig;
