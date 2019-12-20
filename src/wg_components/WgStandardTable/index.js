import StandardTable from '@/components/StandardTable';
import { connect } from 'dva';
import { resizeComponents } from '@/utils/resizeComponents';
import { ColumnConfigForm } from './ColumnConfigForm';

import { styles } from './index.less';

/* eslint react/no-multi-comp:0 */
@connect(({ columnManage, loading }) => ({
  columnManage,
  columnsConfigLoading: loading.models.columnManage,
}))
export class WgStandardTable extends StandardTable {
  timeclock = 0;

  handleResize = index => (e, { size }) => {
    const { dispatch, columns, configKey } = this.props;
    this.timeclock++;
    const nextColumns = [...columns];
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width,
    };
    dispatch({
      type: 'columnManage/changeColumn',
      payload: { key: configKey, column: nextColumns[index] },
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

  componentDidMount() {
    const { dispatch, columns, configKey } = this.props;
    dispatch({
      type: 'columnManage/init',
      payload: { key: configKey, columns: [...columns] },
    });
  }

  handleColumnChange = column => {
    const { dispatch, configKey } = this.props;
    dispatch({
      type: 'columnManage/changeColumn',
      payload: { key: configKey, column: [...column] },
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
      });
    }
    const sortedColumns = newColumns.sort((x, y) => x.entryID - y.entryID);
    return sortedColumns;
  }

  render() {
    const {
      columns,
      configModalVisible,
      columnsConfigLoading,
      configKey,
      handleConfigModalVisible,
      columnManage: { configs },
      ...rest
    } = this.props;

    const sortedColumns = this.calColumns(configs[configKey]);
    const scrollX = sortedColumns
      .filter(x => !x.isHidden)
      .map(c => {
        return c.width;
      })
      .reduce(function(sum, width, index) {
        return sum + width;
      });
    sortedColumns.forEach((column, index) => {
      column.onHeaderCell = col => ({
        width: col.width,
        onResize: this.handleResize(index),
      });
    });

    return (
      <div>
        <StandardTable
          bordered
          rowKey={'entryID'}
          // size='small'
          // tableLayout='fixed'
          scroll={{ x: scrollX }}
          columns={sortedColumns.filter(x => !x.isHidden)}
          components={resizeComponents}
          {...rest}
        />
        <ColumnConfigForm
          modalVisible={configModalVisible}
          dataSource={sortedColumns.filter(x => !x.fixed)}
          loading={columnsConfigLoading}
          handleModalVisible={handleConfigModalVisible}
          handleColumnChange={this.handleColumnChange}
          handleColumnMove={this.handleColumnMove}
          handleSaveColumns={this.handleSaveColumns}
        />
      </div>
    );
  }
}
