import DescriptionList from '@/components/DescriptionList';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';
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
import DetailCard from './components/DetailCard';
import { UpdateBaseCard } from './components/BaseCard';
import { ChooseForm } from './components/ChooseForm';
import { UpdateResult } from './components/ResultModel';

import styles from './Update.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ reportManage, reportUpdate, loading, menu, basicData }) => ({
  reportManage,
  reportUpdate,
  loading: loading.effects['reportUpdate/init'] || loading.effects['reportUpdate/submit'],
  loadingDetail: loading.effects['reportUpdate/moBillNoChange'],
  menu,
  basicData,
}))
@Form.create()
class Update extends PureComponent {
  state = {
    addVisible: false,
    resultVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    this.loadData();
  }

  loadData = () => {
    const {
      dispatch,
      location: { id },
    } = this.props;
    dispatch({
      type: 'reportUpdate/init',
      payload: { id },
    });
  };

  handleDetailChange(records) {
    const { dispatch } = this.props;

    dispatch({
      type: 'reportUpdate/changeDetails',
      payload: { details: records },
    });
  }

  showAdd(flag) {
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

  save(bCheck) {
    const {
      form,
      location: { id },
      dispatch,
      handleChange,
      reportUpdate: { details },
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
        type: 'reportUpdate/submit',
        payload: { ...payload, id, check: bCheck },
      }).then(queryResult => {
        this.showResult(true, queryResult);
      });
    });
  }

  showResult(flag, queryResult) {
    this.setState({ resultVisible: !!flag, queryResult });
  }

  openProfile = () => {
    const {
      location: { id },
      dispatch,
      handleChange,
    } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/report/profile', location: { id }, handleChange: this.search },
    });
  };

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/report/update' },
    });
  }

  handleSelectRows = (rows, rowsUnSelect) => {
    const {
      dispatch,
      reportUpdate: { details },
    } = this.props;
    let maxEntryID = details
      .map(x => x.fEntryID)
      .reduce((acc, cur) => {
        return cur > acc ? cur : acc;
      }, 0);
    rows.forEach(row => {
      if (!details.find(d => d.fDefectInvID === row.fInterID)) {
        details.push({
          ...row,
          fEntryID: ++maxEntryID,
          fQty: row.fCurrentQty,
          fDefectInvID: row.fInterID,
        });
      }
    });
    const newDetails = details.filter(d => !rowsUnSelect.find(r => r.fInterID === d.fInterID));
    dispatch({
      type: 'reportUpdate/changeDetails',
      payload: { details: newDetails },
    });
  };

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

  renderBaseCard = () => {
    const { form } = this.props;
    return <UpdateBaseCard form={form} />;
  };

  renderDetailsCard = () => {
    const {
      loadingDetail,
      reportUpdate: { details },
    } = this.props;

    return (
      <DetailCard
        loading={loadingDetail}
        dataSource={details}
        onChange={records => this.handleDetailChange(records)}
        onAdd={() => this.showAdd(true)}
      />
    );
  };

  renderCommentsCard = () => {
    const {
      form: { getFieldDecorator },
      reportUpdate: { fComments },
    } = this.props;
    return (
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
    );
  };

  renderOtherCard = () => {
    const {
      reportUpdate: {
        fCreatorName,
        fCreatorNumber,
        fCreateDate,
        fCheckerName,
        fCheckerNumber,
        fCheckDate,
      },
    } = this.props;
    return (
      <Card title="其他信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col={4}>
          <Description term="创建人">{fCreatorName}</Description>
          <Description term="创建人编码">{fCreatorNumber}</Description>
          <Description term="创建日期">{defaultDateTimeFormat(fCreateDate)}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderChooseForm = () => {
    const {
      loading,
      reportUpdate: { details, defectInv },
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

  renderResult = () => {
    const { dispatch } = this.props;
    const { queryResult = {}, resultVisible } = this.state;

    return (
      <UpdateResult
        dispatch={dispatch}
        modalVisible={resultVisible}
        queryResult={queryResult}
        handleModalVisible={flag => this.showResult(flag)}
      />
    );
  };

  render() {
    const {
      reportUpdate: { fBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`不良汇报单：${fBillNo}`}
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
        {this.renderOtherCard()}
        {this.renderChooseForm()}
        {this.renderResult()}
      </WgPageHeaderWrapper>
    );
  }
}

export default Update;
