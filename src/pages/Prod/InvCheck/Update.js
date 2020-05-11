import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  DatePicker,
  Table,
  Input,
  InputNumber,
  message,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import { AddFromMissionForm } from './AddFromMissionForm';

import styles from './List.less';

const FormItem = Form.Item;
// const { Option } = Select;
const { TextArea } = Input;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ invCheckManage, invCheckUpdate, loading, menu, basicData }) => ({
  invCheckManage,
  invCheckUpdate,
  loading: loading.models.invCheckUpdate,
  menu,
  basicData,
}))
@Form.create()
class Update extends PureComponent {
  state = {
    modalVisible: {
      addFromMission: false,
      scan: false,
    },
    fInterID: null,
    fBillNo: '',
    fDate: Date.now(),
    fTotalDeltaQty: 0,
    fDeptID: null,
    fComments: '',
    details: [],
  };

  componentDidMount() {
    const { record } = this.props;
    this.setState({ ...record });
    this.loadData();
  }

  componentDidUpdate(preProps) {
    const preRecord = preProps.record;
    const { record } = this.props;
    if (preRecord.fInterID !== record.fInterID) {
      this.setState({ ...record });
    }
  }

  loadData() {}

  handleModalVisible = ({ key, flag }) => {
    const { modalVisible } = this.state;
    modalVisible[key] = !!flag;
    this.setState({
      modalVisible: { ...modalVisible },
    });
  };

  scan = () => {};

  addFromMission = () => {
    const { form } = this.props;
    form.validateFields(['fDeptID'], (err, fieldsValue) => {
      if (err) return;

      this.handleModalVisible({ key: 'addFromMission', flag: true });
    });
  };

  handleAddFromMission = record => {
    const { details } = this.state;
    let entryId = 1;
    details.map(x => {
      if (x.fEntryID >= entryId) {
        entryId = x.fEntryID + 1;
      }
    });
    const newItem = {
      ...record,
      fMissionID: record.fInterID,
      fRecordID: 0,
      fInvQty: 0,
      fDeltaQty: record.fQty,
      fRowComments: null,
      fEntryID: entryId,
      fIsNew: true,
      fProductModel: record.fModel,
    };
    details.push(newItem);
    this.setState(details);
  };

  handleDeptChange(val) {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'invCheckUpdate/getInvByDept',
      payload: { id: val },
    }).then(() => {
      const {
        invCheckUpdate: { details },
      } = this.props;
      if (details) {
        let entryId = 1;
        const currentDetail = details.map(x => {
          const fQty = form.getFieldValue(`fQty_${x.fInterID}`);
          const fRowComments = form.getFieldValue(`fRowComments_${x.fInterID}`);
          return {
            ...x,
            fRecordID: x.fInterID,
            fQty: fQty !== undefined ? fQty : '',
            fInvQty: x.fInputQty,
            fDeltaQty: fQty !== undefined ? fQty - x.fInputQty : '',
            fRowComments,
            fEntryID: entryId++,
          };
        });

        this.setState({ details: currentDetail });
      } else {
        message.warning('当前岗位无在制品库存.');
      }
    });
  }

  handleDetailRowChange({ fEntryID }, field, value) {
    const { details } = this.state;
    const findItem = details.find(x => x.fEntryID === fEntryID);
    findItem[field] = value;
    if (field === 'fQty') {
      findItem.fDeltaQty = findItem.fQty - findItem.fInvQty;
    }
    this.setState({ details });
  }

  handleDeleteRow(record) {
    const { fRecordID } = record;
    const { details } = this.state;
    this.setState({ details: details.filter(x => x.fRecordID !== fRecordID) });
  }

  reloadDetails = () => {
    const { fDeptID } = this.state;
    this.handleDeptChange(fDeptID);
  };

  deleteNonQtyDetails = () => {
    const { details } = this.state;
    this.setState({ details: details.filter(x => x.fQty !== '') });
  };

  save(bCheck) {
    const { form, dispatch, handleSuccess } = this.props;
    const { fInterID, fBillNo, details } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      const payload = {
        fInterID,
        fDate: fieldsValue.fDate,
        fComments: fieldsValue.fComments,
        details,
      };

      dispatch({
        type: 'invCheckUpdate/update',
        payload,
      }).then(() => {
        const {
          invCheckUpdate: { queryResult },
        } = this.props;

        this.showResult(queryResult, model => {
          message.success(`修改盘点单成功，单号：${fBillNo}`);
          if (bCheck) {
            dispatch({
              type: 'invCheckManage/check',
              payload: { fInterID },
            }).then(() => {
              const checkResult = this.props.invCheckManage.queryResult;
              this.showResult(checkResult, () => {
                message.success(`【${fBillNo}】` + `审核成功`);
              });
            });
          }
          this.close();
          // 成功后再次刷新列表
          if (handleSuccess) handleSuccess();
        });
      });
    });
  }

  showResult(queryResult, successCallback) {
    const { status, model } = queryResult;

    if (status === 'ok') {
      if (successCallback) successCallback(model);
      else {
        message.success(queryResult.message);
      }
    } else if (status === 'warning') {
      message.warning(queryResult.message);
    } else {
      message.error(queryResult.message);
    }
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/invCheck/update' },
    });
  }

  render() {
    const {
      loading,
      form: { getFieldDecorator },
    } = this.props;

    const { modalVisible, fBillNo, fDeptName, fDate, fComments, details } = this.state;

    const menu = (
      <Menu>
        <Menu.Item key="reloadDetails" onClick={this.reloadDetails}>
          重载明细
        </Menu.Item>
        <Menu.Item key="deleteNonQtyDetails" onClick={this.deleteNonQtyDetails}>
          删除未盘点明细
        </Menu.Item>
      </Menu>
    );
    const action = (
      <Fragment>
        <ButtonGroup>
          {/* <Button type="primary" onClickCapture={() => this.scan()}>
            扫描
        </Button> */}
          <Button onClickCapture={() => this.addFromMission()}>从任务单添加</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button type="primary" onClickCapture={() => this.save()}>
            保存
          </Button>
          <Button onClickCapture={() => this.save(true)}>审核</Button>
          <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        </ButtonGroup>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );

    const columns = [
      {
        title: '批次',
        dataIndex: 'fFullBatchNo',
        render: (val, record) => (
          <span style={{ color: record.fIsNew ? 'red' : '' }}>{val || '-'}</span>
        ),
      },
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
        render: (val, record) => <span style={{ color: record.fIsNew ? 'red' : '' }}>{val}</span>,
      },
      {
        title: '产品',
        dataIndex: 'fProductName',
      },
      {
        title: '产品编码',
        dataIndex: 'fProductNumber',
      },
      {
        title: '规格型号',
        dataIndex: 'fProductModel',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '盘点数量',
        dataIndex: 'fQty',
        render: (val, record) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`fQty_${record.fRecordID}`, {
              rules: [{ required: true, message: '请输入' }],
              initialValue: record.fQty,
            })(
              <InputNumber
                min={0}
                onChange={value => this.handleDetailRowChange(record, 'fQty', value)}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: '数量',
        dataIndex: 'fInvQty',
      },
      {
        title: '盈亏',
        dataIndex: 'fDeltaQty',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
        render: (val, record) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`fRowComments_${record.fRecordID}`, {
              initialValue: record.fRowComments,
            })(
              <Input
                onChange={e => {
                  const { value } = e.target;
                  this.handleDetailRowChange(record, 'fRowComments', value);
                }}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleDeleteRow(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <WgPageHeaderWrapper
        title={`在制品盘点单：${fBillNo}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={action}
        // content={description}
        // extraContent={extra}
        wrapperClassName={styles.advancedForm}
        loading={loading}
      >
        <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label="单号">
                  {getFieldDecorator('fBillNo', {
                    initialValue: fBillNo,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label="岗位">
                  {getFieldDecorator('fDeptName', {
                    initialValue: fDeptName,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem label="日期">
                  {getFieldDecorator('fDate', {
                    rules: [{ required: false, message: '请选择' }],
                    initialValue: moment(fDate),
                  })(<DatePicker format="YYYY-MM-DD" />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="明细信息" style={{ marginBottom: 24 }} bordered={false}>
          <Table
            rowKey="fEntryID"
            loading={loading}
            columns={columns}
            dataSource={details}
            pagination={false}
          />
        </Card>
        <Card title="备注信息" bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                {getFieldDecorator('fComments', {
                  initialValue: fComments,
                })(<TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />)}
              </Col>
            </Row>
          </Form>
        </Card>

        <AddFromMissionForm
          modalVisible={modalVisible.addFromMission}
          closeMethod={() => this.handleModalVisible({ key: 'addFromMission', flag: false })}
          handleAdd={this.handleAddFromMission}
        />
      </WgPageHeaderWrapper>
    );
  }
}

export default Update;
