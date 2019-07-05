import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import numeral from 'numeral';
import { Form, Table, Modal, Switch, Select, Tag, message, Button } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ viewTake, loading }) => ({
  viewTake,
  loading: loading.models.viewTake,
}))
@Form.create()
export class ViewTakeForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      formVals: props.values,
      qtyDecimal: 0,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      values: { fInterID, fQtyDecimal },
    } = this.props;
    const qtyDecimal = fQtyDecimal ? fQtyDecimal : 0;

    // 根据单位的小数位数配置相关数量的小数位
    const qtyDecimalPart = '00000000'.slice(0, qtyDecimal);
    this.setState({ qtyDecimal, qtyFormat: `0.${qtyDecimalPart}` });

    dispatch({
      type: 'viewTake/initModel',
      payload: { fInterID },
    });
  }

  render() {
    const {
      loading,
      modalVisible,
      handleModalVisible,
      values,
      viewTake: { records },
    } = this.props;
    const { formVals, qtyDecimal, qtyFormat } = this.state;

    const columns = [
      {
        title: '操作员',
        dataIndex: 'fOperatorName',
        key: 'fOperatorName',
      },
      {
        title: '时间',
        dataIndex: 'fCreateDate',
        render: (val, record) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '数量',
        dataIndex: 'fQty',
        render: (val, record) => numeral(val).format(qtyFormat),
      },
      {
        title: '取走工序',
        dataIndex: 'fDeptName',
      },
      {
        title: '原因',
        dataIndex: 'fReason',
      },
    ];
    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false, values)}
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
        title={
          <div>
            流程单-取走记录 <Tag color="blue">{formVals.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Table
          rowKey="guid"
          loading={loading}
          columns={columns}
          dataSource={records}
          pagination={false}
        />
      </Modal>
    );
  }
}
