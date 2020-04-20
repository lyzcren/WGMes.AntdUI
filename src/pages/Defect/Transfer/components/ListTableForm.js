import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu, Divider, Table, Popconfirm, Dropdown } from 'antd';
import { mergeColumns } from '@/utils/wgUtils';
import WgStandardTable from '@/wg_components/WgStandardTable';
import Authorized from '@/utils/Authorized';
import { columns } from '@/columns/Defect/Transfer';

import styles from './ListTableForm.less';

@connect(({ transferManage, loading }) => ({
  transferManage,
  loading: loading.models.transferManage,
}))
class ListTableForm extends PureComponent {
  state = {};

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
        title: '数量',
        dataIndex: 'fReportingQty',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];
    console.log(record.details);
    return (
      <Table rowKey={'fEntryID'} columns={columns} dataSource={record.details} pagination={false} />
    );
  };

  handleSelectRows = (rows = []) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transferManage/selectedRows',
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
      transferManage: { printTemplates },
    } = this.props;
    return (
      <Fragment>
        <a onClick={() => handleRowOperator({ record, type: 'profile' })}>详情</a>
        <Authorized authority="DefectTransfer_Sign">
          <Divider type="vertical" />
          {record.fStatus === 0 ? (
            <a onClick={() => handleRowOperator({ record, type: 'sign' })}>签收</a>
          ) : (
            <a onClick={() => handleRowOperator({ record, type: 'antiSign' })}>退回</a>
          )}
        </Authorized>
        <Authorized authority="DefectTransfer_Delete">
          <Divider type="vertical" />
          <Popconfirm
            title="是否要删除此行？"
            onConfirm={() => handleRowOperator({ record, type: 'delete' })}
          >
            <a>删除</a>
          </Popconfirm>
        </Authorized>
        {printTemplates.length > 0 ? (
          <Authorized authority="DefectTransfer_Print">
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
    const { dispatch, transferManage, loading } = this.props;
    const { selectedRows } = transferManage;

    return (
      <WgStandardTable
        rowKey="fInterID"
        selectedRows={selectedRows}
        loading={loading}
        data={transferManage}
        columns={this.getColumns()}
        onSelectRow={this.handleSelectRows}
        fetchType="transferManage/fetch"
        expandedRowRender={this.expandedRowRender}
        // 以下属性与列配置相关
        configKey={'defect_transfer'}
      />
    );
  }
}

export default ListTableForm;
