import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu, Divider, Table, Popconfirm, Dropdown } from 'antd';
import { mergeColumns } from '@/utils/wgUtils';
import WgStandardTable from '@/wg_components/WgStandardTable';
import Authorized from '@/utils/Authorized';
import { columns } from '@/columns/Defect/Repair';

import styles from './ListTableForm.less';

@connect(({ repairManage, loading }) => ({
  repairManage,
  loading: loading.models.repairManage,
}))
class ListTableForm extends PureComponent {
  state = {};

  expandedRowRender = record => {
    const columns = [
      {
        title: '不良类型',
        dataIndex: 'fDefectName',
        width: 100
      },
      {
        title: '不良编码',
        dataIndex: 'fDefectNumber',
        width: 100
      },
      {
        title: '数量',
        dataIndex: 'fQty',
        width: 100
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
        width: 100
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
        width: 100
      },
    ];
    return (
      <Table rowKey="{fEntryID}" columns={columns} dataSource={record.details} pagination={false} />
    );
  };

  handleSelectRows = (rows = []) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairManage/selectedRows',
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
    return mergeColumns({
      columns,
      columnOps,
    });
  };

  renderRowOperation = record => {
    const {
      handleRowOperator = () => {},
      repairManage: { printTemplates },
    } = this.props;
    return (
      <Fragment>
        <a onClick={() => handleRowOperator({ record, type: 'profile' })}>详情</a>
        <Authorized authority="Repair_Check">
          <Divider type="vertical" />
          {record.fStatus === 0 ? (
            <a onClick={() => handleRowOperator({ record, type: 'check' })}>审核</a>
          ) : (
            <a onClick={() => handleRowOperator({ record, type: 'uncheck' })}>反审核</a>
          )}
        </Authorized>
        <Authorized authority="Repair_Delete">
          <Divider type="vertical" />
          <Popconfirm
            title="是否要删除此行？"
            onConfirm={() => handleRowOperator({ record, type: 'delete' })}
          >
            <a>删除</a>
          </Popconfirm>
        </Authorized>
        {printTemplates.length > 0 ? (
          <Authorized authority="Repair_Print">
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
    const { dispatch, repairManage, loading } = this.props;
    const { selectedRows } = repairManage;

    return (
      <WgStandardTable
        rowKey="fInterID"
        selectedRows={selectedRows}
        loading={loading}
        data={repairManage}
        columns={this.getColumns()}
        onSelectRow={this.handleSelectRows}
        fetchType="repairManage/fetch"
        expandedRowRender={this.expandedRowRender}
        // 以下属性与列配置相关
        configKey={'defect_repair'}
      />
    );
  }
}

export default ListTableForm;
