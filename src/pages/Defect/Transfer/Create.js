import DescriptionList from '@/components/DescriptionList';
import moment from 'moment';
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
import numeral from 'numeral';
import React, { Fragment, PureComponent } from 'react';
import { hasAuthority } from '@/utils/authority';
import DetailCard from './components/DetailCard';
import { ChooseForm } from './components/ChooseForm';
import { CreateResult } from './components/ResultModel';

import styles from './Create.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ transferManage, transferCreate, loading, menu, basicData }) => ({
  transferManage,
  transferCreate,
  loading: loading.models.transferCreate,
  menu,
  basicData,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    addVisible: false,
    resultVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Defect_Transfer' },
    });
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    dispatch({
      type: 'transferCreate/init',
    });
  }

  showAdd(flag) {
    const {
      form: { getFieldValue },
    } = this.props;
    const deptId = getFieldValue('fOutDeptID');
    if (!deptId) {
      message.info('请先选择转出岗位');
      return;
    }
    this.setState({
      addVisible: !!flag,
    });
  }

  save(bCheck) {
    const {
      form,
      dispatch,
      handleChange,
      transferCreate: { details },
    } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (details.length <= 0) {
        this.showResult(true, { message: `未录入明细，无法保存.` });
        // message.warning(`未录入明细，无法保存.`);
        return;
      }
      if (fieldsValue.fInDeptID == fieldsValue.fOutDeptID) {
        this.showResult(true, { message: `转入岗位不能与转出岗位相同.` });
        // message.warning(`转入岗位不能与转出岗位相同.`);
        return;
      }

      const payload = {
        ...fieldsValue,
        details,
      };

      dispatch({
        type: 'transferCreate/submit',
        payload: { ...payload, check: bCheck },
      }).then(queryResult => {
        this.showResult(true, queryResult);
      });
    });
  }

  showResult(flag, queryResult) {
    this.setState({ resultVisible: !!flag, queryResult });
  }

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/transfer/create' },
    });
  }

  handleDeptChange = value => {
    const {
      transferCreate: { details },
    } = this.props;
    if (details.length > 0) {
      Modal.confirm({
        title: '变更岗位',
        content: '变更岗位将清空明细信息，是否继续？',
        okText: '确认',
        cancelText: '取消',
        onOk: this.clearDetails,
      });
    } else if (value) {
      this.loadInv(value);
    }
  };

  loadInv = deptId => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    dispatch({
      type: 'transferCreate/loadInv',
      payload: { deptId },
    });
  };

  clearDetails = () => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    dispatch({
      type: 'transferCreate/changeDetails',
      payload: { details: [] },
    });
    setTimeout(() => {
      const deptId = getFieldValue('fOutDeptID');
      if (deptId) {
        this.loadInv(deptId);
      }
    }, 100);
  };

  handleDetailChange(details) {
    const { dispatch } = this.props;

    dispatch({
      type: 'transferCreate/changeDetails',
      payload: { details },
    });
  }

  handleSelectRows = (rows, rowsUnSelect) => {
    const {
      dispatch,
      transferCreate: { details },
    } = this.props;
    rows.forEach(row => {
      if (!details.find(d => d.fInterID === row.fInterID)) {
        details.push({ ...row });
      }
    });
    const newDetails = details.filter(d => !rowsUnSelect.find(r => r.fInterID === d.fInterID));
    dispatch({
      type: 'transferCreate/changeDetails',
      payload: { details: newDetails },
    });
  };

  renderActions = () => (
    <Fragment>
      <ButtonGroup>
        <Button icon="add_manually" onClickCapture={() => this.showAdd(true)}>
          手动添加
        </Button>
        <Button type="primary" onClickCapture={() => this.save()}>
          保存
        </Button>
        {hasAuthority('MergeMission_Check') && (
          <Button onClickCapture={() => this.save(true)}>审核</Button>
        )}
        {/* <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
      </ButtonGroup>
      <Button onClick={() => this.close()}>关闭</Button>
    </Fragment>
  );

  renderBaseCard = () => {
    const {
      basicData: { authorizeProcessTree },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;

    return (
      <Card title="基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col lg={8} md={8} sm={24}>
              <FormItem label="转出岗位">
                {getFieldDecorator('fOutDeptID', {
                  rules: [{ required: true, message: '请输入岗位' }],
                  // initialValue: authorizeProcessTree[0].fOutDeptID,
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
            <Col lg={8} md={8} sm={24}>
              <FormItem label="转入岗位">
                {getFieldDecorator('fInDeptID', {
                  rules: [{ required: true, message: '请输入岗位' }],
                  // initialValue: authorizeProcessTree[0].fOutDeptID,
                })(
                  <TreeSelect
                    treeData={authorizeProcessTree}
                    treeDefaultExpandAll
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col lg={8} md={8} sm={24}>
              <FormItem key="fDate" label="日期">
                {getFieldDecorator('fDate', {
                  rules: [{ required: false, message: '请选择' }],
                  initialValue: moment(new Date()),
                })(<DatePicker format="YYYY-MM-DD" />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  };

  renderDetailsCard = () => {
    const {
      loading,
      transferCreate: { details },
    } = this.props;

    return (
      <DetailCard
        loading={loading}
        dataSource={details}
        onChange={records => this.handleDetailChange(records)}
        onAdd={() => this.showAdd(true)}
      />
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
      transferCreate: { details, defectInv },
      form: { getFieldValue },
    } = this.props;
    return (
      <ChooseForm
        handleModalVisible={flag => this.showAdd(flag)}
        modalVisible={this.state.addVisible}
        dataSource={defectInv}
        selectedRowKeys={details.map(d => d.fDefectInvID)}
        handleSelectRows={this.handleSelectRows}
        loading={loading}
      />
    );
  };

  renderCreateResult = () => {
    const { dispatch } = this.props;
    const { queryResult = {}, resultVisible } = this.state;

    return (
      <CreateResult
        dispatch={dispatch}
        modalVisible={resultVisible}
        queryResult={queryResult}
        handleModalVisible={flag => this.showResult(flag)}
      />
    );
  };

  render() {
    const {
      basicData: { billNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`不良转移单：${billNo.Defect_Transfer}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.renderActions()}
        // content={description}
        // extraContent={extra}
        wrapperClassName={styles.main}
        loading={loading}
      >
        {this.renderBaseCard()}
        {this.renderDetailsCard()}
        {this.renderCommentsCard()}
        {this.renderChooseForm()}
        {this.renderCreateResult()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Create;
