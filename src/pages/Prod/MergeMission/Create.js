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
import { hasAuthority } from '@/utils/authority';
import { AddMission } from './components/AddMission';
import { CreateResult } from './components/CreateResult';

import styles from './Create.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ mergeMissionManage, mergeMissionCreate, loading, menu, basicData }) => ({
  mergeMissionManage,
  mergeMissionCreate,
  loading: loading.models.mergeMissionCreate,
  loadingDetail: loading.effects['mergeMissionCreate/scan'],
  menu,
  basicData,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    scanVisible: false,
    addVisible: true,
    resultVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getBillNo',
      payload: { fNumber: 'Prod_MergeMission' },
    });
    dispatch({
      type: 'mergeMissionCreate/init',
    });
  }

  handleDetailRowChange({ fEntryID }, field, value) {
    const {
      dispatch,
      mergeMissionCreate: { details },
    } = this.props;
    const findItem = details.find(x => x.fEntryID === fEntryID);
    findItem[field] = value;

    dispatch({
      type: 'mergeMissionCreate/changeDetails',
      payload: { details },
    });
  }

  handleDeleteRow(record) {
    const {
      dispatch,
      mergeMissionCreate: { details },
    } = this.props;
    const newDetails = details.filter(x => x.fEntryID !== record.fEntryID);

    dispatch({
      type: 'mergeMissionCreate/changeDetails',
      payload: { details: newDetails },
    });
  }

  showScan(flag) {
    this.setState({
      scanVisible: !!flag,
    });
  }

  showAdd(flag) {
    this.setState({
      addVisible: !!flag,
    });
  }

  handleScan = batchNo => {
    const {
      dispatch,
      form: { getFieldValue },
    } = this.props;
    dispatch({
      type: 'mergeMissionCreate/scan',
      payload: {
        batchNo,
      },
    }).then(result => {
      if (!result.success) {
        message.warning(result.message);
      }
    });
  };

  save(bCheck) {
    const {
      form,
      dispatch,
      handleChange,
      mergeMissionCreate: { details },
    } = this.props;
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) return;
      if (details.length <= 0) {
        message.warning(`未录入明细，无法保存.`);
        return;
      }
      let isValidate = true;
      for (var i = 0; i < details.length; i++) {
        var detail = details[i];
        if (detail.notFound) {
          message.warning(`第${i + 1}行【${detail.fMoBillNo}】未找到任务单.`);
          isValidate = false;
        }
      }
      if (!isValidate) {
        return;
      }

      const payload = {
        ...fieldsValue,
        details,
      };

      dispatch({
        type: 'mergeMissionCreate/submit',
        payload: { ...payload, check: bCheck },
      }).then(queryResult => {
        this.showResult(true, queryResult);
      });
    });
  }

  showResult(flag, queryResult) {
    this.setState({ resultVisible: !!flag, queryResult });
  }

  handleAddMission = billNo => {
    const { dispatch } = this.props;
    const billNos = billNo
      .split(/[\s\n]/)
      .map(x => x.trim())
      .filter(x => x.length > 0);
    dispatch({
      type: 'mergeMissionCreate/loadBillNos',
      payload: { billNos },
    });
  };

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/prod/mergeMission/create' },
    });
  }

  renderActions = () => (
    <Fragment>
      <ButtonGroup>
        <Button icon="add_manually" onClickCapture={() => this.showAdd(true)}>
          多行添加
        </Button>
        {/* <Button icon="scan" onClickCapture={() => this.showScan(true)}>
          扫码添加
        </Button> */}
        <Button type="primary" onClickCapture={() => this.save()}>
          保存
        </Button>
        {/* {hasAuthority('MergeMission_Check') &&
          <Button onClickCapture={() => this.save(true)}>审核</Button>
        } */}
        {/* <Dropdown overlay={menu} placement="bottomRight">
            <Button>
              <Icon type="ellipsis" />
            </Button>
          </Dropdown> */}
      </ButtonGroup>
      <Button onClick={() => this.close()}>关闭</Button>
    </Fragment>
  );

  getColumns = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
        render: (text, record) => (
          <span style={{ color: record.notFound ? 'red' : '' }}>{text}</span>
        ),
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
        dataIndex: 'fModel',
      },
      {
        title: '计划数量',
        dataIndex: 'fPlanQty',
      },
      {
        title: '计划上限',
        dataIndex: 'fAuxInHighLimitQty',
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

  renderDetailsCard = () => {
    const {
      loadingDetail,
      mergeMissionCreate: { details },
    } = this.props;
    const sum = details.reduce((acc, cur) => acc.add(cur.fPlanQty ? cur.fPlanQty : 0), numeral());

    return (
      <Card title="明细信息" bordered={false}>
        <Table
          rowKey="fEntryID"
          bordered
          loading={loadingDetail}
          columns={this.getColumns()}
          dataSource={details}
          footer={() => `总计划数量：${sum ? sum.value() : 0}`}
          pagination={false}
        />
      </Card>
    );
  };

  renderDescription = () => {
    const {
      mergeMissionCreate: { details },
    } = this.props;
    const currentInfo = details[0] || {};
    return (
      <DescriptionList className={styles.headerList} size="small" col="3" style={{ flex: 'auto' }}>
        <Description term="物料名称">{currentInfo.fProductName}</Description>
        <Description term="物料编码">{currentInfo.fProductNumber}</Description>
        <Description term="规格型号">{currentInfo.fModel}</Description>
      </DescriptionList>
    );
  };

  renderAddMission = () => {
    const { dispatch } = this.props;
    const { addVisible } = this.state;
    return (
      <AddMission
        dispatch={dispatch}
        modalVisible={addVisible}
        handleModalVisible={flag => this.showAdd(flag)}
        okHandle={this.handleAddMission}
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
        title={`合并任务单：${billNo.Prod_MergeMission}`}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        action={this.renderActions()}
        content={this.renderDescription()}
        // extraContent={extra}
        wrapperClassName={styles.main}
        loading={loading}
      >
        {this.renderDetailsCard()}
        {this.renderAddMission()}
        {this.renderCreateResult()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Create;
