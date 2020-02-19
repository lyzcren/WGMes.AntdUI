import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu, Divider, Table, Popconfirm, Dropdown } from 'antd';
import { getColumns } from '@/utils/wgUtils';
import WgStandardTable from '@/wg_components/WgStandardTable';
import Authorized from '@/utils/Authorized';
import { columns, columnConfigKey } from '@/columns/Prod/Report';

import styles from './ListTableForm.less';

@connect(({ reportManage, loading }) => ({
  reportManage,
  loading: loading.models.reportManage,
}))
class ListTableForm extends PureComponent {
  state = {};

  expandedRowRender = record => {
    const columns = [
      {
        title: '批号',
        dataIndex: 'fFullBatchNo',
      },
      {
        title: '产品',
        dataIndex: 'fProductName',
      },
      {
        title: '产品编码',
        dataIndex: 'fProductNumber',
      },
      {
        title: '规格型号',
        dataIndex: 'fProductModel',
      },
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '数量',
        dataIndex: 'fReportingQty',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];
    return (
      <Table rowKey="fInvID" columns={columns} dataSource={record.details} pagination={false} />
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
    const { handleRowOperator = () => {} } = this.props;
    const columnOps = [
      {
        dataIndex: 'fBillNo',
        render: (val, record) => (
          <a onClick={() => handleRowOperator({ record, type: 'profile' })}>{val}</a>
        ),
      },
      {
        dataIndex: 'operators',
        width: 240,
        render: (text, record) => this.renderRowOperation(record),
      },
    ];
    return getColumns({
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
        configKey={columnConfigKey}
      />
    );
  }
}

export default ListTableForm;
