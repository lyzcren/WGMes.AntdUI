import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider, Badge } from 'antd';
import Authorized from '@/utils/Authorized';
import RadioButton from 'antd/lib/radio/radioButton';

const activeData = ['启用', '禁用',];
const statusMap = { BeforeProduce: 'default', Producing: 'processing', EndProduce: 'success', 'Reported': 'error' };
const badgeStatus = (val) => {
  for (var prop in statusMap) {
    if (prop === val) { return statusMap[prop]; }
  }
  return "";
};

class ColumnConfig {
  columns = [
    {
      title: '批号',
      dataIndex: 'fFullBatchNo',
      width: 220,
      sorter: true,
    },
    {
      title: '投入数量',
      dataIndex: 'fInputQty',
      width: 120,
      sorter: true,
    },
    {
      title: '总投入数量',
      dataIndex: 'fTotalInputQty',
      width: 120,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'fStatusNumber',
      width: 150,
      sorter: true,
      render: (val, record) => {
        return <Badge status={badgeStatus(val)} text={record.fStatusName}></Badge>;
      },
    },
    {
      title: '生产任务单号',
      dataIndex: 'fMoBillNo',
      width: 150,
      sorter: true,
      render: (val, record) => {
        return <a onClick={() => this._missionModalVisibleCallback(record)}>{val}</a>;
      },
    },
    {
      title: '订单号',
      dataIndex: 'fSoBillNo',
      width: 150,
    },
    {
      title: '产品名称',
      dataIndex: 'fProductName',
      width: 150,
    },
    {
      title: '产品全称',
      dataIndex: 'fProductFullName',
      width: 180,
    },
    {
      title: '产品编码',
      dataIndex: 'fProductNumber',
      sorter: true,
      width: 150,
    },
    {
      title: '规格型号',
      dataIndex: 'fModel',
      width: 220,
    },
    {
      title: '工艺路线',
      dataIndex: 'fRouteName',
      width: 150,
      render: (val, record) => {
        return <a onClick={() => this._routeModalVisibleCallback(record)}>{val}</a>;
      },
    },
    {
      title: '工艺路线编码',
      dataIndex: 'fRouteNumber',
      width: 150,
    },
    {
      title: '产品分类',
      dataIndex: 'fErpClsName',
      sorter: true,
      width: 150,
    },
    {
      title: '优先级',
      dataIndex: 'fPriority',
      sorter: true,
      width: 120,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Flow_Update">
            <a onClick={() => this._updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Flow_Delete">
            <Popconfirm title="是否要删除此行？" onConfirm={() => this._delete(record)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Flow_Active">
            <a onClick={() => this._handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
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

  // 删除方法
  DeleteCallback = (record) => { };
  _delete = (record) => {
    this.DeleteCallback(record);
  };

  // 查看任务单
  MissionModalVisibleCallback = (record) => { };
  _missionModalVisibleCallback = (record) => {
    this.MissionModalVisibleCallback(record);
  };

  // 查看工艺路线
  RouteModalVisibleCallback = (record) => { };
  _routeModalVisibleCallback = (record) => {
    this.RouteModalVisibleCallback(record);
  };

}

let columnConfig = new ColumnConfig();
export default columnConfig;