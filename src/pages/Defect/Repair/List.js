import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { hasAuthority } from '@/utils/authority';
import { print } from '@/utils/wgUtils';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Radio,
  Popover,
  Switch,
  Progress,
  notification,
  Popconfirm,
} from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';
import ListTableForm from './components/ListTableForm';
import OperatorForm from './components/OperatorForm';
import QueryForm from './components/QueryForm';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ repairManage, loading, menu }) => ({
  repairManage,
  loading: loading.models.repairManage,
  menu,
}))
@Form.create()
class RepairList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (hasAuthority('Repair_Print')) {
      dispatch({
        type: 'repairManage/getPrintTemplates',
      });
    }
    this.search();
  }

  search = (pagination = {}) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'repairManage/fetch',
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
      repairManage: { selectedRows },
    } = this.props;

    const templateId = key;
    print('repair', templateId, record.fInterID);
  };

  handleSelectRows = (rows = []) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairManage/selectedRows',
      payload: rows,
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairManage/remove',
      payload: {
        fInterID: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `删除成功`);
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairManage/check',
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
      type: 'repairManage/uncheck',
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
      payload: {
        path: '/defect/repair/profile',
        location: { id: record.fInterID },
        handleChange: this.search,
      },
    });
  }

  handleUpdate(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: {
        path: '/defect/repair/update',
        location: { id: record.fInterID },
        handleChange: this.search,
      },
    });
  }

  render() {
    const { dispatch, repairManage, loading } = this.props;
    const { selectedRows } = repairManage;

    return (
      <div style={{ margin: '-24px 0 0 -24px' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <QueryForm handleSubmit={this.search} />
              <OperatorForm handleDelete={this.handleDelete} handleRefresh={this.search} />
              <ListTableForm handleRowOperator={this.handleRowOperator} />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default RepairList;
