import React, { PureComponent, Fragment } from 'react';
import numeral from 'numeral';
import { Switch, Popconfirm, Divider, Badge } from 'antd';
import Authorized from '@/utils/Authorized';
import RadioButton from 'antd/lib/radio/radioButton';
import { GlobalConst, badgeStatusList } from '@/utils/GlobalConst';

class ColumnConfig {
  columns = [
    {
      title: '批号',
      dataIndex: 'fFullBatchNo',
      width: 220,
      sorter: true,
    },
    {
      title: '良品数量',
      dataIndex: 'fCurrentPassQty',
      width: 120,
      sorter: true,
    },
    {
      title: '投入数量',
      dataIndex: 'fInputQty',
      width: 120,
      sorter: true,
    },
    {
      title: '良品率',
      dataIndex: 'fCurrentPassRate',
      width: 120,
      render: (val, record) => {
        return record.fCurrentPassQty
          ? numeral((record.fCurrentPassQty * 100.0) / record.fInputQty).format('0.00') + '%'
          : '';
      },
    },
    {
      title: '状态',
      dataIndex: 'fStatusNumber',
      width: 150,
      render: (val, record) => {
        const find = badgeStatusList(GlobalConst.FlowStatusArray).find(x => x.value == val);
        if (find) {
          return find.text;
        }
        return '';
      },
      filters: badgeStatusList(GlobalConst.FlowStatusArray),
    },
    {
      title: '当前工序',
      dataIndex: 'fCurrentDeptName',
      width: 150,
    },
    {
      title: '任务单号',
      dataIndex: 'fMoBillNo',
      width: 200,
      sorter: true,
      render: (val, record) => {
        return <a onClick={() => this._missionModalVisibleCallback(record)}>{val}</a>;
      },
    },
    {
      title: '总投入数量',
      dataIndex: 'fTotalInputQty',
      width: 120,
      sorter: true,
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
      width: 350,
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
      title: '车间',
      dataIndex: 'fWorkShopName',
      sorter: true,
      width: 120,
    },
    {
      title: '车间编码',
      dataIndex: 'fWorkShopNumber',
      sorter: true,
      width: 120,
    },
    {
      title: '汇报单',
      dataIndex: 'fMoRptBillNo',
      sorter: true,
      width: 120,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (text, record) => this.renderOperation(text, record),
    },
  ];

  renderOperation = (text, record) => {
    return (
      <Fragment>
        {/* <Authorized authority="Flow_Update">
          <a onClick={() => this.updateModalVisible(record)}>修改</a>
          <Divider type="vertical" />
        </Authorized>
        <Authorized authority="Flow_Delete">
          <Popconfirm title="是否要删除此行？" onConfirm={() => this.delete(record)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
        </Authorized>
        <Authorized authority="Flow_Active">
          <a onClick={() => this.handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
        </Authorized> */}
      </Fragment>
    );
  };

  // 查看任务单
  MissionModalVisibleCallback = record => {};
  _missionModalVisibleCallback = record => {
    this.MissionModalVisibleCallback(record);
  };

  // 查看工艺路线
  RouteModalVisibleCallback = record => {};
  _routeModalVisibleCallback = record => {
    this.RouteModalVisibleCallback(record);
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
