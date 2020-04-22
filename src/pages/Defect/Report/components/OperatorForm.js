import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu, Dropdown, Modal, message } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { hasAuthority } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import { exportExcel } from '@/utils/getExcel';

import styles from './OperatorForm.less';

@connect(({ reportManage, loading }) => ({
  reportManage,
  loading: loading.models.reportManage,
}))
class OperatorForm extends PureComponent {
  state = {};

  handleMenuClick = e => {
    const {
      dispatch,
      reportManage: { selectedRows },
    } = this.props;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        this.handleBatchDeleteClick();
        break;
      default:
        break;
    }
  };

  handleBatchDeleteClick = () => {
    const {
      reportManage: { selectedRows },
    } = this.props;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '删除记录',
      content: '确定批量删除记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchDelete(selectedRows),
    });
  };

  batchDelete = selectedRows => {
    const { dispatch, handleDelete } = this.props;
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    selectedRows.forEach(selectedRow => {
      if (handleDelete) handleDelete(selectedRow);
    });
  };

  handleAdd() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/report/create', handleChange: this.search },
    });
  }

  handleExport = e => {
    const {
      form,
      reportManage: { pagination },
    } = this.props;

    switch (e.key) {
      case 'currentPage':
        const fileName = `导出-第${pagination.current}页.xls`;
        exportExcel('/api/report/export', { ...pagination, exportPage: true }, fileName);
        break;
      case 'allPage':
        exportExcel('/api/report/export', { ...pagination, exportPage: false }, '导出.xls');
        break;
      default:
        break;
    }
  };

  renderOperator() {
    const {
      reportManage: { selectedRows },
    } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('Report_Delete')}>
          删除
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{ overflow: 'hidden' }}>
        <Authorized authority="Report_Create">
          <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
            新建
          </Button>
        </Authorized>
        <Authorized authority="Report_Export">
          <Dropdown
            overlay={
              <Menu onClick={this.handleExport} selectedKeys={[]}>
                <Menu.Item key="currentPage">当前页</Menu.Item>
                <Menu.Item key="allPage">所有页</Menu.Item>
              </Menu>
            }
          >
            <Button icon="download">
              导出 <Icon type="down" />
            </Button>
          </Dropdown>
        </Authorized>
        {selectedRows.length > 0 && (
          <span>
            <Authorized authority="Report_Delete">
              <Button onClick={this.handleBatchDeleteClick}>批量删除</Button>
            </Authorized>
            <Authorized authority={['Report_Delete']}>
              <Dropdown overlay={menu}>
                <Button>
                  更多操作 <Icon type="down" />
                </Button>
              </Dropdown>
            </Authorized>
          </span>
        )}
      </div>
    );
  }

  render() {
    return <div className={styles.tableListOperator}>{this.renderOperator()}</div>;
  }
}

export default OperatorForm;
