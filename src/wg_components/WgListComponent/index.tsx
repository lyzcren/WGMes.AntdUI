import { PureComponent } from "react";

import { IProps, IState } from './interface';


export class WgListComponent extends PureComponent<IProps, IState> {
  public columnConfig: any;
  public columnConfigKey: string;


  public componentDidMount (): void {
    const { dispatch } = this.props;
    dispatch({
      type: 'columnManage/init',
      payload: { key: this.columnConfigKey, columns: this.columnConfig.getColumns() }
    });
  }


  public handleColumnChange = (column: any[]): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'columnManage/changeColumn',
      payload: { key: this.columnConfigKey, column }
    });
  }

  public handleColumnMove = (dragName: string, hoverName: string): void => {
    const { dispatch } = this.props;
    dispatch({
      type: 'columnManage/moveColumn',
      payload: { key: this.columnConfigKey, dragName, hoverName }
    });
  }

  public handleSaveColumns = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'columnManage/saveColumns',
      payload: { key: this.columnConfigKey }
    });
  }

  public calColumns (columnsConfig: any[]): any[] {
    const { columns } = this.state;
    columns.forEach((column, index) => {
      const config = columnsConfig.find(x => x.dataIndex === column.dataIndex);
      if (config) {
        column.key = config.key;
        column.isHidden = config.isHidden;
        column.width = config.width;
        // 不以设置 colSpan 为 0 的方式隐藏列，这会导致 Resizable 组件调整列宽时选错列，而通过过滤 isHidden 列实现隐藏列
        // 设置 colSpan 为 0 时不渲染，即实现隐藏功能 ywlin:2019.12.19
        // column.colSpan = config.isHidden ? 0 : 1;
      }
    });
    const sortedColumns = columns.sort((x, y) => x.key - y.key);
    return sortedColumns;
  }
}