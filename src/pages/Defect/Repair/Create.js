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
import DetailCard from './components/DetailCard';
import { AddBaseCard } from './components/BaseCard';
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
  loadingDetail: loading.effects['repairCreate/moBillNoChange'],
  menu,
  basicData,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    addVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairCreate/init',
    });
  }

  handleDetailChange(details) {
    const { dispatch } = this.props;

    dispatch({
      type: 'repairCreate/changeDetails',
      payload: { details },
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
        if (queryResult.status === 'ok') {
          const {
            model: { fInterID },
          } = queryResult;
          this.profile(fInterID);
        }
        // 成功后再次刷新列表
        if (handleChange) handleChange();
      });
    });
  }

  profile = id => {
    const { dispatch, handleChange } = this.props;

    dispatch({
      type: 'menu/openMenu',
      payload: {
        path: '/defect/repair/profile',
        location: { id },
        handleChange,
      },
    }).then(() => {
      this.close();
    });
  };

  showResult(queryResult) {
    const { status, model } = queryResult;

    if (status === 'ok') {
      message.success(queryResult.message);
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
      payload: { path: '/defect/repair/create' },
    });
  }

  handleSelectRows = (rows, rowsUnSelect) => {
    const {
      dispatch,
      repairCreate: { details },
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
      type: 'repairCreate/changeDetails',
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

  renderDescription = () => {
    const {
      repairCreate: { currentMo },
    } = this.props;
    return (
      <DescriptionList className={styles.headerList} size="small" col="3" style={{ flex: 'auto' }}>
        <Description term="任务单号">{currentMo.fMoBillNo}</Description>
        <Description term="订单号">{currentMo.fSoBillNo}</Description>
        <Description term="物料名称">{currentMo.fProductName}</Description>
        <Description term="物料编码">{currentMo.fProductNumber}</Description>
        <Description term="规格型号">{currentMo.fProductModel}</Description>
      </DescriptionList>
    );
  };

  renderBaseCard = () => {
    const { form } = this.props;

    return <AddBaseCard form={form} />;
  };

  renderDetailsCard = () => {
    const {
      loadingDetail,
      repairCreate: { details },
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
        selectedRowKeys={details.map(d => d.fDefectInvID)}
        handleSelectRows={this.handleSelectRows}
        loading={loading}
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
        title={`不良返修单：${billNo.Defect_Repair}`}
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
