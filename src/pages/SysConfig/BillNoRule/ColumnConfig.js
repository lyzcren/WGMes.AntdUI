import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';


class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      width: 200,
      sorter: true,
    },
    {
      title: '前缀',
      dataIndex: 'fPrefix',
      width: 80,
      sorter: true,
    },
    {
      title: '流水号长度',
      dataIndex: 'fNoLength',
      width: 100,
    },
    {
      title: '后缀',
      dataIndex: 'fSuffix',
      width: 80,
      sorter: true,
    },
    {
      title: '年',
      dataIndex: 'fAppendYear',
      width: 80,
      render (val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '4位年',
      dataIndex: 'fLongYear',
      width: 80,
      render (val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '月',
      dataIndex: 'fAppendMonth',
      width: 80,
      render (val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '日',
      dataIndex: 'fAppendDate',
      width: 80,
      render (val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '当前编码',
      dataIndex: 'fCurrentNo',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'fComments',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Authorized authority="BillNoRule_Update">
            <a onClick={() => this._updateModalVisible(record)}>修改</a>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  // 修改方法
  UpdateModalVisibleCallback = (record) => { };
  _updateModalVisible = (record) => {
    this.UpdateModalVisibleCallback(record);
  };

}

let columnConfig = new ColumnConfig();
export default columnConfig;