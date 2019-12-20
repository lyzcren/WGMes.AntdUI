export interface IProps {
  dispatch,
  columnConfig: any[],
}

export interface IState {
  columns: any[],
}

export interface IColumnConfig {
  getColumns (): any[];
}
