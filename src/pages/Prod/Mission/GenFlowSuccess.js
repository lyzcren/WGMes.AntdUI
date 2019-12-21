import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Button, Row, Col, Icon, Steps, Card, Modal, Dropdown, Menu, Tag } from 'antd';
import Result from '@/components/Result';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';
import print from '@/utils/wgUtils';

import styles from './List.less';

const { Step } = Steps;
const { Description } = DescriptionList;

/* eslint react/no-multi-comp:0 */
@connect(({ printTemplate, loading, basicData, menu }) => ({
  printTemplate,
  loading: loading.models.flowManage,
  basicData,
  menu,
}))
@Form.create()
export class GenFlowSuccess extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (hasAuthority('Flow_Print')) {
      dispatch({
        type: 'printTemplate/getPrintTemplates',
        payload: { number: 'prodFlow' },
      });
    }
  }

  //应用URL协议启动WEB报表客户端程序，根据参数 option 调用对应的功能
  webapp_start(templateId, interIds, type) {
    var option = {
      baseurl: 'http://' + window.location.host,
      report: '/api/PrintTemplate/grf?id=' + templateId,
      data: '/api/flow/getPrintData?id=' + interIds,
      selfsql: false,
      type: type,
    };

    //创建启动WEB报表客户端的URL协议参数
    window.location.href = 'grwebapp://' + JSON.stringify(option);
  }

  handlePrint = e => {
    const { dispatch, form, records } = this.props;

    const templateId = e.key;
    // this.webapp_start(templateId, records.map(row => row.fInterID).join(','), 'preview');
    var interIds = records.map(row => row.fInterID).join(',');
    const { printUrl } = this.props.basicData;
    print('flow', printUrl, templateId, interIds);
  };

  handleViewFlow(fBatchNo) {
    const { dispatch, handleModalVisible } = this.props;

    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/flow', fBatchNo },
    });
    handleModalVisible(false);
  }

  render() {
    const { form, modalVisible, handleModalVisible, records, printTemplate } = this.props;
    console.log(records);
    const batchNo = records
      .map(x => x.fBatchNo)
      .reduce((acc, cur) => {
        if (acc.indexOf(cur) < 0) {
          return acc + ',' + cur;
        } else {
          return acc;
        }
      });
    const totalBatchCount = records.length;
    const totalInputQty = records
      .map(x => x.fInputQty)
      .reduce((acc, cur) => {
        return acc * 1 + cur * 1;
      });
    const formVals = {
      fBatchNo: batchNo,
      fMoBillNo: records[0].fMoBillNo,
      fTotalBatchCount: totalBatchCount,
      fTotalInputQty: totalInputQty,
    };

    const description = (
      <DescriptionList className={styles.headerList} col="1">
        <Description term="流程单批号">{formVals.fBatchNo}</Description>
        <Description term="任务单号">{formVals.fMoBillNo}</Description>
        <Description term="总批数">{formVals.fTotalBatchCount}</Description>
        <Description term="总投入数">{formVals.fTotalInputQty}</Description>
      </DescriptionList>
    );
    const actions = (
      <Fragment>
        <Button type="primary" onClick={() => handleModalVisible(false)}>
          返回列表
        </Button>
        <Button
          onClick={() => {
            this.handleViewFlow(batchNo);
          }}
        >
          查看流程单
        </Button>
        <Authorized authority="Flow_Print">
          <Dropdown
            overlay={
              <Menu onClick={this.handlePrint} selectedKeys={[]}>
                {printTemplate.prodFlow &&
                  printTemplate.prodFlow.map(val => {
                    return <Menu.Item key={val.fInterID}>{val.fName}</Menu.Item>;
                  })}
              </Menu>
            }
          >
            <Button icon="printer">
              打印 <Icon type="down" />
            </Button>
          </Dropdown>
        </Authorized>
      </Fragment>
    );

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        footer={null}
        title={<div>开流程单成功</div>}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
        <Card bordered={false}>
          <Result
            type="success"
            title={'开流程单成功'}
            description={description}
            actions={actions}
            style={{ marginBottom: 25 }}
          />
        </Card>
      </Modal>
    );
  }
}
