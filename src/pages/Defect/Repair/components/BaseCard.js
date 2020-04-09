import DescriptionList from '@/components/DescriptionList';
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
} from 'antd';
import { connect } from 'dva';
import numeral from 'numeral';
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
      payload: { fNumber: 'Defect_Repair' },
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
      this.reloadMo(model.fDeptID);
    }
    if (preModel.fMissionID !== model.fMissionID) {
      this.handleMoBillNoChange(model.fMissionID);
    }
  }

  handleDeptChange = value => {
    const {
      dispatch,
      model: { details },
      type,
    } = this.props;
    const modelName = type == 'create' ? 'repairCreate' : 'repairUpdate';
    if (details.length > 0) {
      Modal.confirm({
        title: '更换岗位',
        content: '更换岗位将清空明细信息，是否继续？',
        okText: '确认',
        cancelText: '取消',
        onOk: this.clearDetails,
      });
    } else if (value) {
      dispatch({
        type: modelName + '/fetchMoBill',
        payload: {
          deptId: value,
          billNo: '',
        },
      });
    }
  };

  clearDetails = () => {
    const {
      dispatch,
      form: { getFieldValue },
      type,
    } = this.props;
    const modelName = type == 'create' ? 'repairCreate' : 'repairUpdate';
    dispatch({
      type: modelName + '/changeDetails',
      payload: { details: [] },
    });
    setTimeout(() => {
      const deptId = getFieldValue('fDeptID');
      if (deptId) {
        this.reloadMo(deptId);
      }
    }, 100);
  };

  reloadMo = deptId => {
    const {
      dispatch,
      form: { getFieldValue },
      type,
    } = this.props;
    const modelName = type == 'create' ? 'repairCreate' : 'repairUpdate';
    dispatch({
      type: modelName + '/fetchMoBill',
      payload: {
        deptId,
        billNo: '',
      },
    });
  };

  handleSearchMo = value => {
    const {
      dispatch,
      form: { getFieldValue },
      type,
    } = this.props;
    const deptId = getFieldValue('fDeptID');
    const modelName = type == 'create' ? 'repairCreate' : 'repairUpdate';
    if (!deptId) {
      message.warning('请先选择岗位.');
      return;
    }
    dispatch({
      type: modelName + '/fetchMoBill',
      payload: {
        deptId,
        billNo: value,
      },
    });
  };

  handleMoBillNoChange = value => {
    const {
      dispatch,
      form: { getFieldValue },
      type,
    } = this.props;
    const modelName = type == 'create' ? 'repairCreate' : 'repairUpdate';
    const deptId = getFieldValue('fDeptID');
    dispatch({
      type: modelName + '/moBillNoChange',
      payload: {
        deptId,
        missionId: value,
      },
    });
  };

  render = () => {
    const {
      basicData: { authorizeProcessTree, routeData },
      model,
      form: { getFieldDecorator, getFieldValue },
      type,
    } = this.props;
    const deptId = getFieldValue('fDeptID');

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
              <FormItem label="任务单号">
                {getFieldDecorator('fMissionID', {
                  rules: [{ required: true, message: '请选择任务单' }],
                  initialValue: type == 'update' ? model.fMissionID : null,
                })(
                  <Select
                    showSearch
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearchMo}
                    onChange={this.handleMoBillNoChange}
                    disabled={!deptId}
                  >
                    {model.moBillNoList.map(mo => (
                      <Option key={mo.fMissionID} value={mo.fMissionID}>
                        {mo.fMoBillNo}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <FormItem label="返修工艺路线">
                {getFieldDecorator('fRouteID', {
                  rules: [{ required: true, message: '请选择工艺路线' }],
                  initialValue: type == 'update' ? model.fRouteID : null,
                })(
                  <Select>
                    {routeData.map(t => (
                      <Option key={t.fInterID} value={t.fInterID}>
                        {t.fName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };
}

@connect(({ basicData, repairCreate }) => ({ basicData, model: repairCreate, type: 'create' }))
export class AddBaseCard extends BaseCard {
  static defaultProps = {};
}

@connect(({ basicData, repairUpdate }) => ({ basicData, model: repairUpdate, type: 'update' }))
export class UpdateBaseCard extends BaseCard {
  static defaultProps = {};
}
