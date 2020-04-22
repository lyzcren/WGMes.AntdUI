import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Icon,
  List,
  Menu,
  Divider,
  Table,
  Popconfirm,
  Dropdown,
  Badge,
} from 'antd';
import { mergeColumns } from '@/utils/wgUtils';
import WgStandardTable from '@/wg_components/WgStandardTable';
import Authorized from '@/utils/Authorized';
import { columns } from '@/columns/Defect/Report';

import styles from './ListTableForm.less';

@connect(({ reportManage, loading, basicData }) => ({
  reportManage,
  loading: loading.models.reportManage,
  basicData,
}))
class ListTableForm extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getStatus',
      payload: { number: 'reportStatus' },
    });
  }

  expandedRowRender = record => {
    const columns = [
      {
        title: '不良类型',
        dataIndex: 'fDefectName',
        width: 100,
      },
      {
        title: '不良编码',
        dataIndex: 'fDefectNumber',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'fQty',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
        width: 100,
      },
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
        width: 160,
        sorter: true,
      },
      {
        title: '销售订单号',
        dataIndex: 'fSoBillNo',
        width: 160,
        sorter: true,
      },
      {
        title: '车间名称',
        dataIndex: 'fWorkShopName',
        width: 160,
        sorter: true,
      },
      {
        title: '车间编码',
        dataIndex: 'fWorkShopNumber',
        width: 160,
        sorter: true,
      },
      {
        title: '物料名称',
        dataIndex: 'fProductName',
        width: 160,
        sorter: true,
      },
      {
        title: '物料全称',
        dataIndex: 'fProductFullName',
        width: 160,
        sorter: true,
      },
      {
        title: '物料编码',
        dataIndex: 'fProductNumber',
        width: 160,
        sorter: true,
      },
      {
        title: '物料规格型号',
        dataIndex: 'fProductModel',
        width: 160,
        sorter: true,
      },
      {
        title: '物料类别',
        dataIndex: 'fErpClsName',
        width: 160,
        sorter: true,
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
        width: 100,
      },
    ];
    return (
      <Table rowKey="{fEntryID}" columns={columns} dataSource={record.details} pagination={false} />
    );
  };

  handleSelectRows = (rows = []) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/selectedRows',
      payload: rows,
    });
  };

  getColumns = () => {
    const {
      handleRowOperator = () => {},
      basicData: {
        status: { reportStatus = [] },
      },
    } = this.props;
    const columnOps = [
      {
        dataIndex: 'fBillNo',
        render: (val, record) => (
          <a onClick={() => handleRowOperator({ record, type: 'profile' })}>{val}</a>
        ),
      },
      {
        dataIndex: 'fStatusNumber',
        filters: reportStatus.map(x => ({
          text: <Badge color={x.fColor} text={x.fValue} />,
          value: x.fKeyName,
        })),
      },
      {
        dataIndex: 'operators',
        width: 240,
        render: (text, record) => this.renderRowOperation(record),
      },
    ];
    return mergeColumns({
      columns,
      columnOps,
    });
  };

  renderRowOperation = record => {
    const {
      handleRowOperator = () => {},
      reportManage: { printTemplates },
    } = this.props;
    return (
      <Fragment>
        <a onClick={() => handleRowOperator({ record, type: 'profile' })}>详情</a>
        <Authorized authority="Report_Check">
          <Divider type="vertical" />
          {record.fStatus === 0 ? (
            <a onClick={() => handleRowOperator({ record, type: 'check' })}>审核</a>
          ) : (
            <a onClick={() => handleRowOperator({ record, type: 'uncheck' })}>反审核</a>
          )}
        </Authorized>
        <Authorized authority="Report_Delete">
          <Divider type="vertical" />
          <Popconfirm
            title="是否要删除此行？"
            onConfirm={() => handleRowOperator({ record, type: 'delete' })}
          >
            <a>删除</a>
          </Popconfirm>
        </Authorized>
        {printTemplates.length > 0 ? (
          <Authorized authority="Report_Print">
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) =>
                    handleRowOperator({ record, type: 'print', extra: { key } })
                  }
                >
                  {printTemplates.map(val => (
                    <Menu.Item key={val.fInterID}>{val.fName}</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <a>
                <Divider type="vertical" />
                打印 <Icon type="down" />
              </a>
            </Dropdown>
          </Authorized>
        ) : null}
      </Fragment>
    );
  };

  render() {
    const { dispatch, reportManage, loading } = this.props;
    const { selectedRows } = reportManage;

    return (
      <WgStandardTable
        rowKey="fInterID"
        selectedRows={selectedRows}
        loading={loading}
        data={reportManage}
        columns={this.getColumns()}
        onSelectRow={this.handleSelectRows}
        fetchType="reportManage/fetch"
        expandedRowRender={this.expandedRowRender}
        // 以下属性与列配置相关
        configKey={'defect_report'}
      />
    );
  }
}

export default ListTableForm;
