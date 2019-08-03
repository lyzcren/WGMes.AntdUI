import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Layout,
  Row,
  Col,
  Card,
  Form,
  Button,
  TreeSelect,
  DatePicker,
  Table,
  Input,
  InputNumber,
  message,
  Menu,
  Dropdown,
  Icon,
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import WgPageHeaderWrapper from '@/components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

import styles from './List.less';

const FormItem = Form.Item;
// const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ defectCheckManage, defectCheckCreate, loading, menu, basicData }) => ({
  defectCheckManage,
  defectCheckCreate,
  loading: loading.models.defectCheckCreate,
  menu,
  basicData,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    fBillNo: '',
    fDate: Date.now(),
    fTotalDeltaQty: 0,
    fDeptID: null,
    fComments: '',
    details: [],
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(preProps) {}

  loadData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'DefectCheck' },
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
  }

  handleDeptChange(val) {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'defectCheckCreate/getInvByDept',
      payload: { id: val },
    }).then(() => {
      const {
        defectCheckCreate: { details },
      } = this.props;
      if (details) {
        let entryId = 1;
        const currentDetail = details.map(x => {
          const fQty = form.getFieldValue('fQty_' + x.fInterID);
          const fRowComments = form.getFieldValue('fRowComments' + x.fInterID);
          return {
            fDefectInvID: x.fInterID,
            fProductName: x.fProductName,
            fProductNumber: x.fProductNumber,
            fProductModel: x.fProductModel,
            fDefectName: x.fDefectName,
            fMoBillNo: x.fMoBillNo,
            fUnitName: x.fUnitName,
            fQty: fQty !== undefined ? fQty : '',
            fInvQty: x.fQty,
            fDeltaQty: fQty !== undefined ? fQty - x.fQty : '',
            fRowComments: fRowComments,
            fEntryID: entryId++,
          };
        });

        this.setState({ details: currentDetail });
      } else {
        message.warning('当前岗位无不良品库存.');
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
    const { fDefectInvID } = record;
    const { details } = this.state;
    this.setState({ details: details.filter(x => x.fDefectInvID !== fDefectInvID) });
  }

  reloadDetails = () => {
    const { form } = this.props;
    form.validateFields(['fDeptID'], (err, fieldsValue) => {
      if (err) return;

      this.handleDeptChange(fieldsValue.fDeptID);
    });
  };

  deleteNonQtyDetails = () => {
    const { details } = this.state;
    this.setState({ details: details.filter(x => x.fQty !== '') });
  };

  save(bCheck) {
    const { form, dispatch, handleSuccess } = this.props;
    const { details } = this.state;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;

      const payload = {
        fDeptID: fieldsValue.fDeptID,
        fBillNo: fieldsValue.fBillNo,
        fDate: fieldsValue.fDate,
        fComments: fieldsValue.fComments,
        details,
      };

      dispatch({
        type: 'defectCheckCreate/add',
        payload,
      }).then(() => {
        const {
          defectCheckCreate: { queryResult },
        } = this.props;
        const { model } = queryResult;

        this.showResult(queryResult, model => {
          message.success('新建盘点单成功，单号：' + model.fBillNo);
          if (!!bCheck) {
            dispatch({
              type: 'defectCheckManage/check',
              payload: { fInterID: model.fInterID },
            }).then(() => {
              const checkResult = this.props.defectCheckManage.queryResult;
              this.showResult(checkResult, () => {
                message.success('【' + model.fBillNo + '】' + '审核成功');
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
    const { status, message, model } = queryResult;

    if (status === 'ok') {
      if (successCallback) successCallback(model);
      else {
        message.success(message);
      }
    } else if (status === 'warning') {
      message.warning(message);
    } else {
      message.error(message);
    }
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/defectCheck/create' },
    });
  }

  render() {
    const {
      basicData: { billNo, processDeptTree },
      loading,
      form: { getFieldDecorator },
    } = this.props;

    const { fDeptID, fDate, fComments, details } = this.state;

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
        title: '不良',
        dataIndex: 'fDefectName',
      },
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
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
            {getFieldDecorator('fQty_' + record.fDefectInvID, {
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
            {getFieldDecorator('fRowComments_' + record.fDefectInvID, {
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
        title={'不良盘点单：' + billNo.DefectCheck}
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
                <FormItem key="fBillNo" label="单号">
                  {getFieldDecorator('fBillNo', {
                    initialValue: billNo.DefectCheck,
                  })(<Input readOnly />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fDeptID" label="岗位">
                  {getFieldDecorator('fDeptID', {
                    rules: [{ required: true, message: '请选择岗位' }],
                  })(
                    <TreeSelect
                      placeholder="请选择"
                      style={{ width: 300 }}
                      treeDefaultExpandAll
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={processDeptTree}
                      onChange={val => {
                        this.handleDeptChange(val);
                      }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <FormItem key="fDate" label="日期">
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
          <Table rowKey="fEntryID" loading={loading} columns={columns} dataSource={details} />
        </Card>
        <Card title="备注信息" bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                {getFieldDecorator('fComments', {})(
                  <TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />
                )}
              </Col>
            </Row>
          </Form>
        </Card>
      </WgPageHeaderWrapper>
    );
  }
}

export default Create;
