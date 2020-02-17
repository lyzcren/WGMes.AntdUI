import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, message, Table, Button, Row, Col } from 'antd';
import WgStandardTable from '@/wg_components/WgStandardTable';

import styles from './ChooseForm.less';

const FormItem = Form.Item;

/* eslint react/no-multi-comp:0 */
@connect(({ reportChooseForm }) => ({
  reportChooseForm,
}))
@Form.create()
export class ChooseForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }
  // 列表查询参数
  currentPagination = {
    current: 1,
    pageSize: 10,
  };

  componentDidMount() {}

  componentDidUpdate(preProps) {
    const { dispatch, modalVisible, deptId } = this.props;
    // console.log(preProps.modalVisible, modalVisible, deptId);
    if (!preProps.modalVisible && modalVisible) {
      dispatch({
        type: 'reportChooseForm/fetch',
        payload: { deptId },
      });
    }
  }

  handleSelectRows = rowKeys => {
    const {
      handleSelectRows,
      reportChooseForm: { data },
    } = this.props;
    const rows = data.filter(d => rowKeys.find(r => r === d.fInterID));
    const rowsUnSelect = data.filter(d => !rowKeys.find(r => r === d.fInterID));
    if (handleSelectRows) {
      handleSelectRows(rows, rowsUnSelect);
    }
  };

  handleSearch = e => {
    e.preventDefault();
    const {
      dispatch,
      form: { getFieldsValue },
      deptId,
    } = this.props;
    const fieldsValue = getFieldsValue();

    dispatch({
      type: 'reportChooseForm/fetch',
      payload: { ...fieldsValue, deptId },
    });
  };

  close = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  getColumns = () => {
    const columns = [
      {
        title: '任务单号',
        dataIndex: 'fMoBillNo',
      },
      {
        title: '批号',
        dataIndex: 'fFullBatchNo',
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
        dataIndex: 'fProductModel',
      },
      {
        title: '可汇报数量',
        dataIndex: 'fUnReportQty',
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
    ];

    return columns;
  };

  renderHead = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.form}>
        <Row>
          <Col md={10}>
            <FormItem label="任务单号">
              {getFieldDecorator('billNo')(<Input placeholder="请输入任务单号、批号" />)}
            </FormItem>
          </Col>
          <Col md={10}>
            <FormItem label="产品">
              {getFieldDecorator('product')(<Input placeholder="请输入产品名称、编码、规格型号" />)}
            </FormItem>
          </Col>
          <Col md={4}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  renderTable = () => {
    const {
      reportChooseForm: { data },
      loading,
      selectedRowKeys,
    } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleSelectRows,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };
    return (
      <Table
        bordered
        rowKey="fInterID"
        loading={loading}
        dataSource={data}
        columns={this.getColumns()}
        // 以下属性与列配置相关
        configKey={this.columnConfigKey}
        // refShowConfig={showConfig => {
        //   this.showConfig = showConfig;
        // }}
        scroll={{ x: 'calc(700px + 50%)' }}
        pagination={false}
        rowSelection={rowSelection}
        onSelectRow={this.handleSelectRows}
      />
    );
  };

  render() {
    const { loading, modalVisible, handleModalVisible } = this.props;

    const footer = (
      <div>
        <Button
          loading={loading}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Modal
        destroyOnClose
        loading={loading}
        title="选择汇报明细"
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible()}
        wrapClassName={styles.modalWrap}
        width="860px"
      >
        {this.renderHead()}
        {this.renderTable()}
      </Modal>
    );
  }
}
