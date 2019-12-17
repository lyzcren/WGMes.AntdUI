import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Tag, Select, InputNumber, Table, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const Option = Select.Option;

/* eslint react/no-multi-comp:0 */
@connect(({ missionManage, loading, basicData }) => ({
  missionManage,
  loading: loading.models.missionManage,
  basicData,
}))
@Form.create()
export class BatchFlowForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
    records: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      workshop: null,
      batchNoPrefix: '',
      batchNoSuffix: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'missionManage/getBillNo',
    }).then(() => {
      const {
        missionManage: { billNo },
      } = this.props;
      this.setState({ batchNoPrefix: billNo.fPrefix, batchNoSuffix: billNo.fSuffix });
    });
    dispatch({
      type: 'basicData/getRouteData',
    });
    dispatch({
      type: 'basicData/getWorkShops',
    }).then(() => {
      const {
        records,
        basicData: { workshops },
      } = this.props;
      const defaultWorkshop = workshops.find(x => x.fErpID === records.fWorkShop);
      if (defaultWorkshop) this.changeWorkshop(defaultWorkshop);
    });
  }

  changeWorkshop = workshop => {
    const {
      missionManage: { billNo },
    } = this.props;
    let batchNoPrefix = this.state.batchNoPrefix;
    let batchNoSuffix = this.state.batchNoSuffix;
    batchNoPrefix = workshop.fPrefix ? workshop.fPrefix : billNo.fPrefix;
    batchNoSuffix = workshop.fSuffix ? workshop.fSuffix : billNo.fSuffix;
    this.setState({ workshop, batchNoPrefix, batchNoSuffix });
  };

  onWorkshopChange = workshopId => {
    const {
      basicData: { workshops },
    } = this.props;
    const workshop = workshops.find(x => x.fItemID === workshopId);
    if (workshop) this.changeWorkshop(workshop);
  };

  okHandle = () => {
    const { form, records } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      this.handleGenFlow(fieldsValue);
    });
  };

  handleGenFlow = fields => {
    const { dispatch, records, handleModalVisible, handleSuccess } = this.props;
    let count = 0;
    let models = [];
    records.forEach(record => {
      dispatch({
        type: 'missionManage/genFlow',
        payload: {
          ...fields,
          fInterID: record.fInterID,
          fBatchNo: record.fBatchNo,
          fInputQty: record.fCurrentInputQty,
          fWorkShop: record.fWorkShop,
        },
      }).then(() => {
        const {
          missionManage: { successFlows, queryResult },
        } = this.props;
        count++;
        models = models.concat(queryResult.model ? queryResult.model : []);
        if (count >= records.length && models.length > 0) {
          handleModalVisible(false);
          // 成功后再次刷新列表
          if (handleSuccess) handleSuccess(models);
        } else if (queryResult.status === 'ok') {
          message.success('开流程单成功');
        } else if (queryResult.status === 'warning') {
          message.warning(queryResult.message);
        } else {
          message.error(queryResult.message);
        }
      });
    });
  };

  render() {
    const {
      form,
      modalVisible,
      handleModalVisible,
      records,
      basicData: { workshops, routeData },
      missionManage: { billNo },
      loading,
    } = this.props;
    const { workshop, batchNoPrefix, batchNoSuffix } = this.state;
    const minQty = 1 / Math.pow(10, records[0].fQtyDecimal ? records[0].fQtyDecimal : 0);
    records.forEach(
      record => (record.fCurrentInputQty = record.fAuxInHighLimitQty - record.fInputQty)
    );

    const columns = [
      {
        title: '流程单单号',
        dataIndex: 'fMoBillNo',
      },
      {
        title: '投入数量',
        dataIndex: 'fCurrentInputQty',
      },
    ];

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={<div>批量开流程单</div>}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, records)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="每批数量">
          {form.getFieldDecorator('fBatchQty', {
            rules: [{ required: true, message: '请输入每批数量' }],
          })(<InputNumber placeholder="请输入" min={minQty} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工艺路线">
          {form.getFieldDecorator('fRouteID', {
            rules: [{ required: true, message: '请选择工艺路线' }],
            initialValue: records[0].fRouteID ? records[0].fRouteID : null,
          })(
            <Select style={{ width: 300 }} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}>
              {routeData.map(t => (
                <Option key={t.fInterID} value={t.fInterID}>
                  {t.fName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <Table rowKey="fInterID" loading={loading} columns={columns} dataSource={records} />
      </Modal>
    );
  }
}
