import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu, Dropdown, Modal, message } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { hasAuthority } from '@/utils/authority';
import Authorized from '@/utils/Authorized';
import { exportExcel } from '@/utils/getExcel';
import { print } from '@/utils/wgUtils';

import styles from './OperatorForm.less';

@connect(({ transferManage, loading }) => ({
  transferManage,
  loading: loading.models.transferManage,
}))
class OperatorForm extends PureComponent {
  state = {};

  handleMenuClick = e => {
    const {
      dispatch,
      transferManage: { selectedRows },
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

  handleBatchSignClick = () => {
    const {
      transferManage: { selectedRows },
    } = this.props;

    if (selectedRows.length === 0) return;
    Modal.confirm({
      title: '批量签收',
      content: '确定批量签收吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.batchSign(selectedRows),
    });
  };

  batchSign = selectedRows => {
    const { dispatch, handleSign } = this.props;
    if (typeof selectedRows === 'object' && !Array.isArray(selectedRows)) {
      selectedRows = [selectedRows];
    }
    selectedRows.forEach(selectedRow => {
      handleSign(selectedRow);
    });
  };

  handleBatchDeleteClick = () => {
    const {
      transferManage: { selectedRows },
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
      handleDelete(selectedRow);
    });
  };

  handleAdd() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/transfer/create', handleChange: this.search },
    });
  }

  handleExport = e => {
    const {
      form,
      transferManage: { pagination },
    } = this.props;

    switch (e.key) {
      case 'currentPage':
        const fileName = `导出-第${pagination.current}页.xls`;
        exportExcel('/api/transfer/export', { ...pagination, exportPage: true }, fileName);
        break;
      case 'allPage':
        exportExcel('/api/transfer/export', { ...pagination, exportPage: false }, '导出.xls');
        break;
      default:
        break;
    }
  };

  handlePrint = e => {
    const {
      form,
      handlePrint,
      transferManage: { selectedRows },
    } = this.props;

    const templateId = e.key;
    // this.webapp_start(templateId, selectedRows.map(row => row.fInterID).join(','), 'preview');
    const interIds = selectedRows[0].fInterID;
    print('DefectTransfer', templateId, interIds);
  };

  renderOperator() {
    const {
      transferManage: { selectedRows, printTemplates },
    } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove" disabled={!hasAuthority('DefectTransfer_Delete')}>
          删除
        </Menu.Item>
      </Menu>
    );

    return (
      <div style={{ overflow: 'hidden' }}>
        <Authorized authority="DefectTransfer_Create">
          <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
            新建
          </Button>
        </Authorized>
        {selectedRows.length > 0 && printTemplates && printTemplates.length > 0 ? (
          <Authorized authority="DefectTransfer_Print">
            <Dropdown
              overlay={
                <Menu onClick={this.handlePrint} selectedKeys={[]}>
                  {printTemplates.map(val => (
                    <Menu.Item key={val.fInterID}>{val.fName}</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button icon="printer">
                打印 <Icon type="down" />
              </Button>
            </Dropdown>
          </Authorized>
        ) : null}
        {/* <Authorized authority="DefectTransfer_Export">
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
        </Authorized> */}
        {selectedRows.length > 0 && (
          <span>
            <Authorized authority="DefectTransfer_Delete">
              <Button onClick={this.handleBatchSignClick}>批量签收</Button>
            </Authorized>
            <Authorized authority={['DefectTransfer_Delete']}>
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
