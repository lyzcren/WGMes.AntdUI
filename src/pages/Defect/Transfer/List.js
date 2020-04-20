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
@connect(({ transferManage, loading, menu }) => ({
  transferManage,
  loading: loading.models.transferManage,
  menu,
}))
@Form.create()
class TransferList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }
  static defaultProps = {};

  componentDidMount() {
    const { dispatch } = this.props;
    if (hasAuthority('DefectTransfer_Print')) {
      dispatch({
        type: 'transferManage/getPrintTemplates',
      });
    }
  }

  search = pagination => {
    const { dispatch } = this.props;

    dispatch({
      type: 'transferManage/fetch',
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
      case 'sign':
        this.handleSign(record);
        break;
      case 'antiSign':
        this.handleAntiSign(record);
        break;
      case 'print':
        {
          const { key } = extra;
          this.handlePrint(key, record);
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
      transferManage: { selectedRows },
    } = this.props;

    const templateId = key;
    print('DefectTransfer', templateId, record.fInterID);
  };

  handleSelectRows = (rows = []) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transferManage/selectedRows',
      payload: rows,
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transferManage/remove',
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

  handleSign = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transferManage/sign',
      payload: {
        id: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `签收成功`);
        // 成功后再次刷新列表
        this.search();
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  handleAntiSign = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'transferManage/antiSign',
      payload: {
        id: record.fInterID,
      },
    }).then(queryResult => {
      if (queryResult.status === 'ok') {
        message.success(`【${record.fBillNo}】` + `退回成功`);
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
        path: '/defect/transfer/profile',
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
        path: '/defect/transfer/update',
        location: { id: record.fInterID },
        handleChange: this.search,
      },
    });
  }

  render() {
    const { dispatch, transferManage, loading, location } = this.props;
    const { selectedRows } = transferManage;

    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <GridContent>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <QueryForm handleSubmit={this.search} location={location} />
              <OperatorForm handleSign={this.handleSign} handlePrint={this.handlePrint} />
              <ListTableForm handleRowOperator={this.handleRowOperator} />
            </div>
          </Card>
        </GridContent>
      </div>
    );
  }
}

export default TransferList;
