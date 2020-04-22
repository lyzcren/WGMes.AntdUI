import DescriptionList from '@/components/DescriptionList';
import moment from 'moment';
import numeral from 'numeral';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Table,
  TreeSelect,
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import React, { Fragment, PureComponent } from 'react';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

class BaseCard extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Defect_Report' },
    });
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    dispatch({
      type: 'basicData/getRouteData',
    });
  }

  componentDidUpdate(preProps) {
    const preModel = preProps.model;
    const { model } = this.props;
    if (preModel.fDeptID !== model.fDeptID) {
      this.loadDefectInv(model.fDeptID);
    }
  }

  loadDefectInv = deptId => {
    const { dispatch, type } = this.props;
    const modelName = type == 'create' ? 'reportCreate' : 'reportUpdate';
    dispatch({
      type: modelName + '/loadDefectInv',
      payload: { deptId },
    });
  };

  handleDeptChange = value => {
    const {
      model: { details },
      type,
    } = this.props;

    this.loadDefectInv(value);
    if (details.length > 0) {
      Modal.confirm({
        title: '更换岗位',
        content: '更换岗位将清空明细信息，是否继续？',
        okText: '确认',
        cancelText: '取消',
        onOk: this.clearDetails,
      });
    }
    // else if (value) {
    //   setTimeout(() => {
    //     this.showAdd(true);
    //   }, 100);
    // }
  };

  clearDetails = () => {
    const {
      dispatch,
      form: { getFieldValue },
      type,
    } = this.props;
    const modelName = type == 'create' ? 'reportCreate' : 'reportUpdate';
    dispatch({
      type: modelName + '/changeDetails',
      payload: { details: [] },
    });
  };

  showAdd = flag => {
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd(flag);
    } else {
      message.error('onAdd方法不存在');
    }
  };

  render = () => {
    const {
      basicData: { authorizeProcessTree, routeData },
      model,
      form: { getFieldDecorator, getFieldValue },
      type,
    } = this.props;

    return (
      <Card title="基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <FormItem label="岗位">
                {getFieldDecorator('fDeptID', {
                  rules: [{ required: true, message: '请输入岗位' }],
                  initialValue: type == 'update' ? model.fDeptID : null,
                })(
                  <TreeSelect
                    treeData={authorizeProcessTree}
                    treeDefaultExpandAll
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    onChange={this.handleDeptChange}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <FormItem key="fDate" label="日期">
                {getFieldDecorator('fDate', {
                  rules: [{ required: false, message: '请选择' }],
                  initialValue: type == 'update' ? moment(model.fDate) : moment(new Date()),
                })(<DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };
}

@connect(({ basicData, reportCreate }) => ({ basicData, model: reportCreate, type: 'create' }))
export class AddBaseCard extends BaseCard {
  static defaultProps = {};
}

@connect(({ basicData, reportUpdate }) => ({ basicData, model: reportUpdate, type: 'update' }))
export class UpdateBaseCard extends BaseCard {
  static defaultProps = {};
}
