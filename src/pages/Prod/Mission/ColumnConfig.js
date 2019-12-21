import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import moment from 'moment';
import Authorized from '@/utils/Authorized';

class ColumnConfig {
  columns = [
    {
      title: '生产任务单号',
      dataIndex: 'fMoBillNo',
      width: 180,
      render: (val, record) => (
        <a onClick={() => this.profileModalVisibleCallback(record)}>{val}</a>
      ),
    },
    {
      title: '日期',
      dataIndex: 'fDate',
      sorter: true,
      width: 120,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '计划完工日期',
      dataIndex: 'fPlanFinishDate',
      sorter: true,
      width: 140,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '订单号',
      dataIndex: 'fSoBillNo',
      width: 180,
    },
    {
      title: '任务单数量',
      dataIndex: 'fMoQty',
      width: 180,
    },
    {
      title: '完工上限',
      dataIndex: 'fAuxInHighLimitQty',
      width: 100,
    },
    {
      title: '完工下限',
      dataIndex: 'fAuxInLowLimitQty',
      width: 100,
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
      title: '父件型号',
      dataIndex: 'fMesSelf002',
      sorter: true,
      width: 120,
    },
    {
      title: '底色编号',
      dataIndex: 'fMesSelf001',
      sorter: true,
      width: 120,
    },
    {
      title: '内部订单号',
      dataIndex: 'fMesSelf003',
      sorter: true,
      width: 140,
    },
    {
      title: '工艺路线',
      dataIndex: 'fRoutingName',
      width: 150,
    },
    {
      title: '工艺路线编码',
      dataIndex: 'fRoutingNumber',
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
      title: '计划生产数量',
      dataIndex: 'fPlanQty',
      width: 150,
    },
    {
      title: '投料数量',
      dataIndex: 'fHeadSelfJ0199',
      width: 150,
    },
    {
      title: '投入数量',
      dataIndex: 'fInputQty',
      width: 150,
    },
    {
      title: '完工数量',
      dataIndex: 'fFinishQty',
      width: 150,
    },
    {
      title: '合格数量',
      dataIndex: 'fPassQty',
      width: 150,
    },
    {
      title: '报废数量',
      dataIndex: 'fScrapQty',
      width: 150,
    },
    {
      title: '单位',
      dataIndex: 'FUnitName',
      width: 150,
    },
    {
      title: '副单位',
      dataIndex: 'fUnit2Name',
      width: 150,
    },
    {
      title: '副单位换算率',
      dataIndex: 'fUnitRate2',
      width: 180,
    },
    {
      title: '父件型号',
      dataIndex: 'fParentModel',
      sorter: true,
      width: 180,
    },
    {
      title: '车间',
      dataIndex: 'fWorkShopName',
      sorter: true,
      width: 120,
    },
    {
      title: '车间编号',
      dataIndex: 'fWorkShopNumber',
      sorter: true,
      width: 150,
    },
    {
      title: '制单日期',
      dataIndex: 'fCreateDate',
      sorter: true,
      width: 120,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '审核日期',
      dataIndex: 'fCheckDate',
      sorter: true,
      width: 120,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '同步日期',
      dataIndex: 'fErpSyncDate',
      sorter: true,
      width: 120,
      render: val => moment(val).format('YYYY-MM-DD'),
    },
    {
      title: '备注',
      dataIndex: 'fComments',
      sorter: true,
      width: 180,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 250,
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Mission_Read">
            <a onClick={() => this.profileModalVisibleCallback(record)}>详情</a>
          </Authorized>
          {
            // record.fAuxInHighLimitQty - record.fInputQty > 0 &&
            <Authorized authority="Flow_Create">
              <Divider type="vertical" />
              <a onClick={() => this.flowModalVisibleCallback(record)}>开流程单</a>
            </Authorized>
          }
          <Authorized authority="Mission_Delete">
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteCallback(record)}>
              <a>删除</a>
            </Popconfirm>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  // 详情方法
  profileModalVisibleCallback = record => {};

  // 流程单方法
  flowModalVisibleCallback = record => {};

  deleteCallback = record => {};
}

const columnConfig = new ColumnConfig();
export default columnConfig;
