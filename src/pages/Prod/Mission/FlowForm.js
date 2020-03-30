import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Tag, Select, InputNumber, message } from 'antd';
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
export class FlowForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  static getDerivedStateFromProps(nextProps, preState) {
    const { values } = nextProps;
    const maxQty = values.fAuxInHighLimitQty - values.fInputQty;
    const minQty = 1 / Math.pow(10, values.fQtyDecimal ? values.fQtyDecimal : 0);
    const fCurrentInputQty = maxQty > 0 ? maxQty : minQty;
    return { values: { ...values, fCurrentInputQty, minQty } };
  }

  constructor(props) {
    super(props);

    this.state = {
      values: {},
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
        basicData: { workshops },
      } = this.props;
      const { values } = this.state;
      const defaultWorkshop = workshops.find(x => x.fErpID === values.fWorkShop);
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
    const { form } = this.props;
    const { values } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // 设置fItemId
      fieldsValue.fInterID = values.fInterID;
      if (fieldsValue.fInputQty <= 0) {
        message.warning('投入数量必须大于0');
        return;
      }
      if (fieldsValue.fBatchQty <= 0) {
        message.warning('每批数量必须大于0');
        return;
      }
      this.handleGenFlow(fieldsValue);
    });
  };

  handleGenFlow = fields => {
    const { dispatch, handleModalVisible, handleSuccess } = this.props;
    dispatch({
      type: 'missionManage/genFlow',
      payload: fields,
    }).then(() => {
      const {
        missionManage: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('开流程单成功');
        handleModalVisible(false);
        // 成功后再次刷新列表
        if (handleSuccess) handleSuccess(queryResult.model);
      } else if (queryResult.status === 'warning') {
        message.warning(queryResult.message);
      } else {
        message.error(queryResult.message);
      }
    });
  };

  render() {
    const {
      form,
      modalVisible,
      handleModalVisible,
      basicData: { workshops, routeData },
      missionManage: { billNo },
    } = this.props;
    const { values, workshop, batchNoPrefix, batchNoSuffix } = this.state;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title={
          <div>
            开流程单 <Tag color="blue">{values.fMoBillNo}</Tag>
          </div>
        }
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="批号">
          {form.getFieldDecorator('fBatchNo', {
            initialValue:
              billNo && billNo.fCurrentNoWithoutFix
                ? batchNoPrefix + billNo.fCurrentNoWithoutFix + batchNoSuffix
                : '',
          })(<Input readOnly />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="单位">
          {values.fUnitName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="计划生产数量">
          {values.fPlanQty}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="已投入数量">
          {values.fInputQty}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="已完工数量">
          {values.fFinishQty}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="投入数量">
          {form.getFieldDecorator('fInputQty', {
            rules: [{ required: true, message: '请输入投入数量' }],
            initialValue: values.fCurrentInputQty,
            // })(<InputNumber placeholder="请输入" min={minQty} max={maxQty} />)} 取消最大数量限制
          })(<InputNumber placeholder="请输入" min={values.minQty} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="每批数量">
          {form.getFieldDecorator('fBatchQty', {
            rules: [{ required: true, message: '请输入每批数量' }],
            initialValue: values.fCurrentInputQty,
            // })(<InputNumber placeholder="请输入" min={minQty} max={maxQty} />)} 取消最大数量限制
          })(<InputNumber placeholder="请输入" min={values.minQty} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车间">
          {/* {form.getFieldDecorator('fWorkShop', {
            rules: [{ required: true, message: '请选择车间' }],
            initialValue: workshop ? workshop.fItemID : null,
          })(
            <Select
              disabled
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              onChange={this.onWorkshopChange}
            >
              {workshops &&
                workshops.map(x => (
                  <Option key={x.fNumber} value={x.fItemID}>
                    {x.fName}
                  </Option>
                ))}
            </Select>
          )} */}
          {values.fWorkShopName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工艺路线">
          {form.getFieldDecorator('fRouteID', {
            rules: [{ required: true, message: '请选择工艺路线' }],
            initialValue: values.fRouteID ? values.fRouteID : null,
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
      </Modal>
    );
  }
}
