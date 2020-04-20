import DescriptionList from '@/components/DescriptionList';
import { hasAuthority } from '@/utils/authority';
import { defaultDateTime, defaultDateTimeFormat } from '@/utils/GlobalConst';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import { Button, Card, Form, Input, Layout, Select, Table, message } from 'antd';
import { connect } from 'dva';
import numeral from 'numeral';
import React, { Fragment, PureComponent } from 'react';
import styles from './Profile.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ transferProfile, loading, menu, basicData }) => ({
  transferProfile,
  loading: loading.models.transferProfile,
  menu,
  basicData,
}))
@Form.create()
class Profile extends PureComponent {
  state = {};

  componentDidMount() {
    const {
      dispatch,
      location: { id },
    } = this.props;
    dispatch({
      type: 'transferProfile/init',
      payload: { id },
    });
  }

  update() {
    const {
      dispatch,
      location: { id },
      handleChange,
    } = this.props;

    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/defect/transfer/update', location: { id }, handleChange },
    }).then(() => {
      this.close();
    });
  }

  sign() {
    const {
      dispatch,
      location: { id },
      handleChange,
    } = this.props;

    dispatch({
      type: 'transferProfile/sign',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'transferProfile/init',
        payload: { id },
      });
      // 成功后再次刷新列表
      if (handleChange) handleChange();
    });
  }

  antiSign() {
    const {
      dispatch,
      location: { id },
      handleChange,
    } = this.props;

    dispatch({
      type: 'transferProfile/antiSign',
      payload: { id },
    }).then(queryResult => {
      this.showResult(queryResult);
      dispatch({
        type: 'transferProfile/init',
        payload: { id },
      });
      // 成功后再次刷新列表
      if (handleChange) handleChange();
    });
  }

  showResult(queryResult) {
    const { status, message, model } = queryResult;

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
      payload: { path: '/defect/transfer/profile' },
    });
  }

  renderActions = () => {
    const {
      transferProfile: { fStatusNumber },
    } = this.props;
    return (
      <Fragment>
        <ButtonGroup>
          {fStatusNumber === 'Created' && hasAuthority('DefectTransfer_Update') ? (
            <Button type="primary" onClickCapture={() => this.update()}>
              修改
            </Button>
          ) : null}
          {fStatusNumber === 'Created' && hasAuthority('DefectTransfer_Sign') ? (
            <Button onClickCapture={() => this.sign()}>签收</Button>
          ) : null}
          {fStatusNumber === 'Signed' && hasAuthority('DefectTransfer_Sign') ? (
            <Button type="danger" onClickCapture={() => this.antiSign()}>
              退回
            </Button>
          ) : null}
        </ButtonGroup>
        <Button onClick={() => this.close()}>关闭</Button>
      </Fragment>
    );
  };

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
        title: '转移数量',
        dataIndex: 'fQty',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '备注',
        dataIndex: 'fRowComments',
      },
    ];

    return columns;
  };

  renderBaseCard = () => {
    const {
      transferProfile: {
        fOutDeptName,
        fOutDeptNumber,
        fInDeptName,
        fInDeptNumber,
        fDate,
        fStatusName,
      },
    } = this.props;
    return (
      <Card title="基本信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col="4">
          <Description term="转出岗位">{fOutDeptName}</Description>
          <Description term="转出岗位编码">{fOutDeptNumber}</Description>
          <Description term="转入岗位">{fInDeptName}</Description>
          <Description term="转入岗位编码">{fInDeptNumber}</Description>
          <Description term="日期">{defaultDateTime(fDate)}</Description>
          <Description term="状态">{fStatusName}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderDetailsCard = () => {
    const {
      loading,
      transferProfile: { details },
    } = this.props;
    const sum = details.reduce((acc, cur) => acc.add(cur.fQty), numeral());

    return (
      <Card title="明细信息" bordered={false}>
        <Table
          rowKey="fEntryID"
          bordered
          loading={loading}
          columns={this.getColumns()}
          dataSource={details}
          footer={() => `总数量：${sum ? sum.value() : 0}`}
          pagination={false}
        />
      </Card>
    );
  };

  renderCommentsCard = () => {
    const {
      transferProfile: { fComments },
    } = this.props;
    return (
      <Card title="备注信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small">
          <Description term="备注">{fComments}</Description>
        </DescriptionList>
      </Card>
    );
  };

  renderOtherCard = () => {
    const {
      transferProfile: {
        fCreatorName,
        fCreatorNumber,
        fCreateDate,
        fEditorName,
        fEditorNumber,
        fEditDate,
        fSignerName,
        fSignerNumber,
        fSignDate,
      },
    } = this.props;
    return (
      <Card title="其他信息" bordered={false}>
        <DescriptionList className={styles.headerList} size="small" col={4}>
          <Description term="创建人">{fCreatorName}</Description>
          <Description term="创建人编码">{fCreatorNumber}</Description>
          <Description term="创建日期">{defaultDateTimeFormat(fCreateDate)}</Description>
        </DescriptionList>
        <DescriptionList className={styles.headerList} size="small" col={4}>
          <Description term="修改人">{fEditorName}</Description>
          <Description term="修改人编码">{fEditorNumber}</Description>
          <Description term="修改日期">{defaultDateTimeFormat(fEditDate)}</Description>
        </DescriptionList>
        <DescriptionList className={styles.headerList} size="small" col={4}>
          <Description term="签收人">{fSignerName}</Description>
          <Description term="签收人编码">{fSignerNumber}</Description>
          <Description term="签收日期">{defaultDateTimeFormat(fSignDate)}</Description>
        </DescriptionList>
      </Card>
    );
  };

  render() {
    const {
      transferProfile: { fBillNo },
      loading,
    } = this.props;

    return (
      <WgPageHeaderWrapper
        title={`不良转移单：${fBillNo}`}
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
      </WgPageHeaderWrapper>
    );
  }
}

export default Profile;
