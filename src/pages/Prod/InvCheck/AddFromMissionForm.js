import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Modal,
  Switch,
  Tag,
  Table,
  message,
  InputNumber,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

import styles from './List.less';
import { ok } from 'assert';
import { qualifiedTypeIdentifier } from '@babel/types';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ invCheckFromMissionManage, loading }) => ({
  invCheckFromMissionManage,
  loading: loading.models.invCheckFromMissionManage,
}))
@Form.create()
export class AddFromMissionForm extends PureComponent {
  static defaultProps = {
    handleAdd: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      formVals: {},
    };
  }

  showModal = () => {
    this.setState({ visible: true });
  };
  hideModal = () => {
    this.setState({ visible: false });
  };

  columns = [
    {
      title: '任务单号',
      dataIndex: 'fMoBillNo',
    },
    {
      title: '订单号',
      dataIndex: 'fSoBillNo',
    },
    {
      title: '产品名称',
      dataIndex: 'fProductName',
    },
    {
      title: '产品全称',
      dataIndex: 'fProductFullName',
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
      title: '添加',
      dataIndex: 'Authorized',
      render: (text, record) => (
        <Button type="primary" shape="circle" icon="plus" onClick={() => this.handleAdd(record)} />
      ),
    },
  ];

  handleSearchMission = fieldsValue => {
    const { dispatch } = this.props;
    const queryFilters = [];
    if (fieldsValue.queryMoBillNo)
      queryFilters.push({ name: 'fMoBillNo', compare: '%*%', value: fieldsValue.queryMoBillNo });
    const pagination = {
      pageSize: 10,
      current: 1,
      queryFilters,
    };
    dispatch({
      type: 'invCheckFromMissionManage/fetch',
      payload: pagination,
    });
  };

  handleSearch = e => {
    const { form } = this.props;
    e.preventDefault();
    form.validateFields(['queryMoBillNo'], (err, fieldsValues) => {
      this.handleSearchMission(fieldsValues);
    });
  };

  handleAdd = record => {
    const { dispatch, form } = this.props;
    this.setState({ formVals: record });
    this.showModal();
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    form.validateFields(['queryMoBillNo'], (err, fieldsValues) => {
      this.handleSearchMission(fieldsValues);
    });
  };

  handleAddWithQty = () => {
    const { form, handleAdd } = this.props;
    const { formVals } = this.state;
    form.validateFields(['fQty'], (err, fieldsValues) => {
      if (err) return;

      this.hideModal();
      message.success(`任务单：${formVals.fMoBillNo}，数量：${fieldsValues.fQty}`);
      handleAdd({ ...formVals, fQty: fieldsValues.fQty });
    });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      modalVisible,
      closeMethod,
      invCheckFromMissionManage: {
        data: { list, pagination },
      },
    } = this.props;
    const { formVals } = this.state;

    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => closeMethod()}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <div>
        <Modal
          destroyOnClose
          keyboard={true}
          title={<div>在制品盘点-从任务单添加</div>}
          visible={modalVisible}
          width="960px"
          footer={footer}
          onCancel={() => closeMethod()}
          afterClose={() => closeMethod()}
        >
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={10} sm={2}>
                <FormItem label="任务单号">
                  {getFieldDecorator('queryMoBillNo')(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col md={6} sm={8}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                    重置
                  </Button>
                </span>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="fMoBillNo"
            bordered
            loading={loading}
            columns={this.columns}
            dataSource={list}
            pagination={false}
          />
        </Modal>
        <Modal
          destroyOnClose
          title={
            <div>
              添加数量<Tag color="blue">{formVals.fMoBillNo}</Tag>
            </div>
          }
          visible={this.state.visible}
          onOk={this.handleAddWithQty}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
        >
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={'盘点数'}>
            {getFieldDecorator('fQty', {
              rules: [{ required: true, message: '请输入数量' }],
            })(
              <InputNumber
                style={{ width: '100%' }}
                autoFocus
                max={formVals.fAuxInHighLimitQty - formVals.fFinishQty}
                min={Math.pow(0.1, formVals.fQtyDecimal)}
                step={Math.pow(0.1, formVals.fQtyDecimal)}
                precision={formVals.fQtyDecimal}
              />
            )}
          </FormItem>
        </Modal>
      </div>
    );
  }
}
