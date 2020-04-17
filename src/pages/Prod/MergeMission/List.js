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
@connect(({ mergeMissionManage, loading, menu }) => ({
  mergeMissionManage,
  loading: loading.models.mergeMissionManage,
  menu,
}))
@Form.create()
class MergeMissionList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (hasAuthority('MergeMission_Print')) {
      dispatch({
        type: 'mergeMissionManage/getPrintTemplates',
      });
    }
    this.search();
  }

  search = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'mergeMissionManage/fetch',
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
      mergeMissionManage: { selectedRows },
    } = this.props;

    const templateId = key;
    print('mergeMission', templateId, record.fInterID);
  };

  handleSelectRows = (rows = []) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mergeMissionManage/selectedRows',
      payload: rows,
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mergeMissionManage/remove',
      payload: {
        id: record.fInterID,
      },
    }).then(queryResult => {
      this.handleSelectRows();
      if (queryResult.status === 'ok') {
        message.success(`【${record.fMoBillNo}】` + `删除成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(`【${record.fMoBillNo}】${queryResult.message}`);
      } else {
        message.error(`【${record.fMoBillNo}】${queryResult.message}`);
      }
    });
  };

  handleCheck = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'mergeMissionManage/check',
      payload: {
        id: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fMoBillNo}】` + `审核成功`);
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
      type: 'mergeMissionManage/uncheck',
      payload: {
        id: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fMoBillNo}】` + `反审核成功`);
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
        path: '/prod/mergeMission/profile',
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
        path: '/prod/mergeMission/update',
        location: { id: record.fInterID },
        handleChange: this.search,
      },
    });
  }

  render() {
    const { dispatch, mergeMissionManage, loading } = this.props;
    const { selectedRows } = mergeMissionManage;

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

export default MergeMissionList;
