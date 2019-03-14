import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import Authorized from '@/utils/Authorized';


class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      width: 150,
      sorter: true,
    },
    {
      title: '全称',
      dataIndex: 'fFullName',
      width: 300,
      sorter: true,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      width: 200,
      sorter: true,
    },
    {
      title: '规格',
      dataIndex: 'fModel',
      width: 300,
      sorter: true,
    },
    {
      title: '物料属性',
      dataIndex: 'fErpClsName',
      width: 150,
      sorter: true,
    },
    {
      title: '单位',
      dataIndex: 'fUnitName',
      width: 100,
    },
    {
      title: '副单位',
      dataIndex: 'fUnitName2',
      width: 100,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Product_Create">
            <a onClick={() => this._importModalVisible(record)}>导入</a>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  // 导入方法
  ImportModalVisibleCallback = (record) => { };
  _importModalVisible = (record) => {
    this.ImportModalVisibleCallback(record);
  };

}

const columnConfig = new ColumnConfig();
export default columnConfig;