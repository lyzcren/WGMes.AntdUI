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
import styles from './Update.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ repairManage, repairUpdate, loading, menu, basicData }) => ({
  repairManage,
  repairUpdate,
  loading: loading.effects['repairUpdate/init'] || loading.effects['repairUpdate/submit'],
  loadingDetail: loading.effects['repairUpdate/moBillNoChange'],
  menu,
  basicData,
}))
@Form.create()
class Update extends PureComponent {
  state = {
    addVisible: false,
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
      type: 'repairUpdate/init',
      payload: { id },
    });
  };

  handleDetailChange(records) {
    const { dispatch } = this.props;

    dispatch({
      type: 'repairUpdate/changeDetails',
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
      repairUpdate: { details },
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
        type: 'repairUpdate/submit',
        payload: { ...payload, id, check: bCheck },
      }).then(queryResult => {
        const { status } = queryResult;
        if (status === 'ok') {
          message.success(queryResult.message);
          if (!bCheck) {
            this.loadData(id);
          } else {
            this.openProfile();
            this.close();
          }
        } else if (status === 'warning') {
          message.warning(queryResult.message);
        } else {
          message.error(queryResult.message);
        }
        // 成功后再次刷新列表
        if (handleChange) handleChange();
      });
    });
  }

  openProfile = () => {
    const {
      location: { id },
      dispatch,
      handleChange,
    } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/repair/profile', location: { id }, handleChange: this.search },
    });
  };

  close() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/closeMenu',
      payload: { path: '/defect/repair/update' },
    });
  }

  handleSelectRows = (rows, rowsUnSelect) => {
    const {
      dispatch,
      repairUpdate: { details },
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
      type: 'repairUpdate/changeDetails',
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
      repairUpdate: { details },
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
      repairUpdate: { fComments },
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
      repairUpdate: {
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
      repairUpdate: { details, defectInv },
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
      repairUpdate: { fBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`单据：${fBillNo}`}
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
      </WgPageHeaderWrapper>
    );
  }
}

export default Update;
