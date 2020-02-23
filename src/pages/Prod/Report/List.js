import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { hasAuthority } from '@/utils/authority';
import { print } from '@/utils/wgUtils';
import { Card, Form, message, Select } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ListTableForm from './components/ListTableForm';
import OperatorForm from './components/OperatorForm';
import QueryForm from './components/QueryForm';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ reportManage, loading, menu }) => ({
  reportManage,
  loading: loading.models.reportManage,
  menu,
}))
@Form.create()
class TableList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (hasAuthority('Report_Print')) {
      dispatch({
        type: 'reportManage/getPrintTemplates',
      });
    }
    this.search();
  }

  search = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'reportManage/fetch',
      payload: pagination,
    });
    this.handleSelectRows([]);
  };

  handleRowOperator = ({ record, type, extra }) => {
    switch (type) {
      case 'profile':
        this.handleProfile(record);
        break;
      case 'delete':
        this.handleDelete(record);
        break;
      case 'update':
        this.handleUpdate(record);
        break;
      case 'check':
        this.handleCheck(record);
        break;
      case 'uncheck':
        this.handleUnCheck(record);
        break;
      case 'print':
        {
          const { key } = extra;
          this.handlePrint(record, key);
        }
        break;
      default:
        break;
    }
  };

  handlePrint = (key, record) => {
    const {
      dispatch,
      form,
      reportManage: { selectedRows },
    } = this.props;

    const templateId = key;
    print('report', templateId, record.fInterID);
  };

  handleSelectRows = (rows = []) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/selectedRows',
      payload: rows,
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/remove',
      payload: {
        id: record.fInterID,
      },
    }).then(queryResult => {
      this.handleSelectRows();
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `删除成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(`【${record.fBillNo}】${queryResult.message}`);
      } else {
        message.error(`【${record.fBillNo}】${queryResult.message}`);
      }
    });
  };

  handleCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/check',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `审核成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleUnCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reportManage/uncheck',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `反审核成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleProfile(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/profile', id: record.fInterID, handleChange: this.search },
    });
  }

  handleUpdate(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/report/update', id: record.fInterID, handleChange: this.search },
    });
  }

  render() {
    const { dispatch, reportManage, loading } = this.props;
    const { selectedRows } = reportManage;

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <QueryForm handleSubmit={this.search} />
              <OperatorForm />
              <ListTableForm handleRowOperator={this.handleRowOperator} />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default TableList;
