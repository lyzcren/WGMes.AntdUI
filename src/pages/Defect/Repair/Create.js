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
import { ChooseForm } from './components/ChooseForm';
import styles from './Create.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ repairManage, repairCreate, loading, menu, basicData }) => ({
  repairManage,
  repairCreate,
  loading: loading.effects['repairCreate/init'] || loading.effects['repairCreate/submit'],
  loadingDetail: loading.effects['repairCreate/scan'],
  menu,
  basicData,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    addVisible: false,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Defect_Repair' },
    });
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    dispatch({
      type: 'repairCreate/init',
    });
    dispatch({
      type: 'basicData/getRouteData',
    });
  }

  handleDetailRowChange ({ fEntryID }, field, value) {
    const {
      dispatch,
      repairCreate: { details },
    } = this.props;
    const findItem = details.find(x => x.fEntryID === fEntryID);
    findItem[field] = value;

    dispatch({
      type: 'repairCreate/changeDetails',
      payload: { details },
    });
  }

  handleDeleteRow (record) {
    const {
      dispatch,
      repairCreate: { details },
    } = this.props;
    const newDetails = details.filter(x => x.fInterID !== record.fInterID);

    dispatch({
      type: 'repairCreate/changeDetails',
      payload: { details: newDetails },
    });
  }

  showAdd (flag) {
    const {
      form: { getFieldValue },
    } = this.props;
    const deptId = getFieldValue('fDeptID');
    if (!deptId) {
      message.info('请先选择岗位');
      return;
    }
    this.setState({
      addVisible: !!flag,
    });
  }

  handleScan = batchNo => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    const deptId = getFieldValue('fDeptID');
    dispatch({
      type: 'repairCreate/scan',
      payload: {
        deptId,
        batchNo,
      },
    }).then(result => {
      if (!result.success) {
        message.warning(result.message);
      }
    });
  };

  save (bCheck) {
    const {
      form,
      dispatch,
      handleChange,
      repairCreate: { details },
    } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (details.length <= 0) {
        message.warning(`未录入明细，无法保存.`);
        return;
      }

      const payload = {
        ...fieldsValue,
        details,
      };

      dispatch({
        type: 'repairCreate/submit',
        payload: { ...payload, check: bCheck },
      }).then(queryResult => {
        this.showResult(queryResult);
        // 成功后再次刷新列表
        if (handleChange) handleChange();
        this.close();
      });
    });
  }

  showResult (queryResult) {
    const { status, message, model } = queryResult;

    if (status === 'ok') {
      message.success(queryResult.message);
    } else if (status === 'warning') {
      message.warning(queryResult.message);
    } else {
      message.error(queryResult.message);
    }
  }

  close () {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/repair/create' },
    });
  }

  handleDeptChange = value => {
    const {
      dispatch,
      repairCreate: { details },
    } = this.props;
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
        type: 'repairCreate/fetchMoBill',
        payload: {
          deptId: value,
          billNo: ''
        },
      });
    }
  };

  clearDetails = () => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    dispatch({
      type: 'repairCreate/changeDetails',
      payload: { details: [] },
    });
    setTimeout(() => {
      const deptId = getFieldValue('fDeptID');
      if (deptId) {
        dispatch({
          type: 'repairCreate/fetchMoBill',
          payload: {
            deptId,
            billNo: ''
          },
        });
      }
    }, 100);
  };

  handleSelectRows = (rows, rowsUnSelect) => {
    const {
      dispatch,
      repairCreate: { details },
    } = this.props;
    let maxEntryID = details.map(x => x.fEntryID).reduce((acc, cur) => { return (cur > acc) ? cur : acc }, 0);
    rows.forEach(row => {
      if (!details.find(d => d.fInterID === row.fInterID)) {
        details.push({ ...row, fEntryID: ++maxEntryID, fRepairQty: row.fCurrentQty, fDefectInvID: row.fInterID });
      }
    });
    const newDetails = details.filter(d => !rowsUnSelect.find(r => r.fInterID === d.fInterID));
    dispatch({
      type: 'repairCreate/changeDetails',
      payload: { details: newDetails },
    });
  };

  handleSearchMo = value => {
    const { dispatch, form: { getFieldValue }, } = this.props;
    const deptId = getFieldValue('fDeptID');
    if (!deptId) {
      message.warning('请先选择岗位.');
      return;
    }
    dispatch({
      type: 'repairCreate/fetchMoBill',
      payload: {
        deptId,
        billNo: value
      },
    });
  };

  handleMoBillNoChange = value => {
    const { dispatch, form: { getFieldValue }, } = this.props;
    const deptId = getFieldValue('fDeptID');
    dispatch({
      type: 'repairCreate/moBillNoChange',
      payload: {
        deptId,
        missionId: value
      },
    });
  }

  renderActions = () => (
    <Fragment>
      <ButtonGroup>
        <Button type="primary" onClickCapture={() => this.save()}>
          保存
        </Button>
        <Button onClickCapture={() => this.save(true)}>审核</Button>
        {/* <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
      </ButtonGroup>
      <Button onClick={() => this.close()}>关闭</Button>
    </Fragment>
  );

  renderDescription = () => {
    const { repairCreate: { currentMo } } = this.props;
    return (
      <DescriptionList
        className={styles.headerList}
        size="small"
        col="3"
        style={{ flex: 'auto' }}
      >
        <Description term="任务单号">{currentMo.fMoBillNo}</Description>
        <Description term="订单号">{currentMo.fSoBillNo}</Description>
        <Description term="物料名称">{currentMo.fProductName}</Description>
        <Description term="物料编码">{currentMo.fProductNumber}</Description>
        <Description term="规格型号">{currentMo.fProductModel}</Description>
      </DescriptionList>
    );
  }

  getColumns = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '不良类型',
        dataIndex: 'fDefectName',
      },
      {
        title: '不良编码',
        dataIndex: 'fDefectNumber',
      },
      {
        title: '库存数量',
        dataIndex: 'fCurrentQty',
      },
      {
        title: '返修数量',
        dataIndex: 'fRepairQty',
        render: (val, record) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`fRepairQty_${record.fInterID}`, {
              rules: [{ required: true, message: '请输入投入数量' }],
              initialValue: record.fRepairQty,
            })(
              <InputNumber
                max={record.fCurrentQty}
                min={0}
                onChange={value => {
                  this.handleDetailRowChange(record, 'fRepairQty', value);
                }}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
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

    return columns;
  };

  renderBaseCard = () => {
    const {
      basicData: { authorizeProcessTree, routeData },
      repairCreate: { moBillNoList },
      form: { getFieldDecorator, getFieldValue },
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
                  // initialValue: authorizeProcessTree[0].fDeptID,
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
                    {moBillNoList.map(mo => (
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

  renderDetailsCard = () => {
    const {
      loadingDetail,
      repairCreate: { details },
    } = this.props;
    const sum = details.reduce((acc, cur) => acc.add(cur.fRepairQty), numeral());

    return (
      <Card title="明细信息" bordered={false}>
        <Table
          rowKey="fEntryID"
          bordered
          loading={loadingDetail}
          columns={this.getColumns()}
          dataSource={details}
          footer={() => `总数量：${sum ? sum.value() : 0}`}
          pagination={false}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={() => this.showAdd(true)}
          icon="plus"
        >
          {'新增'}
        </Button>
      </Card>
    );
  };

  renderCommentsCard = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
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
    );
  };

  renderChooseForm = () => {
    const {
      loading,
      repairCreate: { details, defectInv },
      form: { getFieldValue },
    } = this.props;
    return (
      <ChooseForm
        handleModalVisible={flag => this.showAdd(flag)}
        modalVisible={this.state.addVisible}
        dataSource={defectInv}
        selectedRowKeys={details.map(d => d.fInterID)}
        handleSelectRows={this.handleSelectRows}
        loading={loading}
      />
    );
  };

  render () {
    const {
      basicData: { billNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`单据：${billNo.Defect_Repair}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.renderActions()}
        content={this.renderDescription()}
        // extraContent={extra}
        wrapperClassName={styles.main}
        loading={loading}
      >
        {this.renderBaseCard()}
        {this.renderDetailsCard()}
        {this.renderCommentsCard()}
        {this.renderChooseForm()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Create;
