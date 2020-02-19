import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import { connect } from 'dva';
import { resizeComponents } from '@/utils/resizeComponents';
import ColumnConfigForm from './columnConfigForm';

import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

/* eslint react/no-multi-comp:0 */
@connect(({ columnManage, loading }) => ({
  columnManage,
  columnsConfigLoading: loading.models.columnManage,
}))
class WgStandardTable extends PureComponent {
  timeclock = 0;

  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      needTotalList,
      modalVisible: {
        columnConfig: false,
      },
    };

    // 使用ref对外暴露当前组件方法，方便交互
    if (this.props.refShowConfig) {
      this.props.refShowConfig(this.showConfig);
    }
  }

  componentDidMount() {
    const { dispatch, columns, configKey } = this.props;
    dispatch({
      type: 'columnManage/init',
      payload: { key: configKey, columns },
    });
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows && nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { dispatch, fetchType, onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    } else if (fetchType) {
      dispatch({
        type: fetchType,
        payload: {
          ...pagination,
          filters,
          sorter,
        },
      });
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  handleModalVisible = ({ key, flag }, record) => {
    const { modalVisible } = this.state;
    modalVisible[key] = !!flag;
    this.setState({
      modalVisible: { ...modalVisible },
    });
  };

  showConfig = () => {
    this.handleModalVisible({ key: 'columnConfig', flag: true });
  };

  handleResize = column => (e, { size }) => {
    const { dispatch, configKey } = this.props;
    this.timeclock++;
    column = {
      ...column,
      width: size.width,
    };
    dispatch({
      type: 'columnManage/changeColumn',
      payload: { key: configKey, column },
    });
    // 因拖拽是持续事件，故采用延时判断，延时3秒后无操作则保存列配置
    setTimeout(() => {
      this.timeclock--;
      if (this.timeclock <= 0) {
        this.handleSaveColumns();
      }
    }, 3000);
  };

  handleSaveColumns = () => {
    const { dispatch, configKey } = this.props;
    dispatch({
      type: 'columnManage/saveColumns',
      payload: { key: configKey },
    });
  };

  handleColumnChange = column => {
    const { dispatch, configKey } = this.props;
    dispatch({
      type: 'columnManage/changeColumn',
      payload: { key: configKey, column },
    });
  };

  handleColumnMove = (dragName, hoverName) => {
    const { dispatch, configKey } = this.props;
    dispatch({
      type: 'columnManage/moveColumn',
      payload: { key: configKey, dragName, hoverName },
    });
  };

  handleSaveColumns = () => {
    const { dispatch, configKey } = this.props;
    dispatch({
      type: 'columnManage/saveColumns',
      payload: { key: configKey },
    });
  };

  calColumns(columnsConfig) {
    const { columns } = this.props;
    const newColumns = [...columns];
    if (columnsConfig) {
      newColumns.forEach((column, index) => {
        const config = columnsConfig.find(x => x.dataIndex === column.dataIndex);
        if (config) {
          column.entryID = config.entryID;
          column.isHidden = config.isHidden;
          column.width = config.width ? config.width : column.width;
          // 不以设置 colSpan 为 0 的方式隐藏列，这会导致 Resizable 组件调整列宽时选错列，而通过过滤 isHidden 列实现隐藏列
          // 设置 colSpan 为 0 时不渲染，即实现隐藏功能 ywlin:2019.12.19
          // column.colSpan = config.isHidden ? 0 : 1;
        }
        column.onHeaderCell = col => ({
          width: col.width,
          onResize: this.handleResize(column),
        });
      });
    }
    const sortedColumns = newColumns.sort((x, y) => x.entryID - y.entryID);
    return sortedColumns;
  }

  render() {
    const {
      data = {},
      rowKey,
      columns,
      columnsConfigLoading,
      configKey,
      handleConfigModalVisible,
      columnManage: { configs },
      showAlert,
      selectabel,
      ...rest
    } = this.props;
    const { selectedRowKeys, needTotalList, modalVisible } = this.state;
    const { list = [], pagination } = data;

    const sortedColumns = this.calColumns(configs[configKey]);
    // 当使用 Fixed 列时，为了避免最后一行边距不够导致列宽无法调整的问题，增加长度
    const scrollxFixWidth = 80;
    const scrollX =
      sortedColumns
        .filter(x => !x.isHidden)
        .map(c => c.width)
        .reduce((sum, width, index) => sum + width) + scrollxFixWidth;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => `共 ${total} 条`,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        {showAlert !== false && (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                  <div style={{ float: 'right', marginRight: 24 }}>
                    <a onClick={this.showConfig} style={{ marginLeft: 24 }}>
                      列配置
                    </a>
                  </div>
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
        )}
        <Table
          className={styles.mainTable}
          rowKey={rowKey || 'key'}
          bordered
          scroll={{ x: scrollX }}
          columns={sortedColumns.filter(x => !x.isHidden)}
          components={resizeComponents}
          rowSelection={selectabel === false ? undefined : rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
        <ColumnConfigForm
          modalVisible={modalVisible.columnConfig}
          dataSource={sortedColumns.filter(x => !x.fixed)}
          loading={columnsConfigLoading}
          handleModalVisible={flag => this.handleModalVisible({ key: 'columnConfig', flag })}
          handleColumnChange={this.handleColumnChange}
          handleColumnMove={this.handleColumnMove}
          handleSaveColumns={this.handleSaveColumns}
        />
      </div>
    );
  }
}

export default WgStandardTable;
