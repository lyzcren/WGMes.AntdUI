import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Tag, message, Select } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ defectInvManage, loading, basicData }) => ({
  defectInvManage,
  loading: loading.models.defectInvManage,
  basicData,
}))
@Form.create()
/* eslint react/no-multi-comp:0 */
export class RepairForm extends PureComponent {
  static defaultProps = {
    handleSuccess: () => {},
    handleModalVisible: () => {},
    selectedRows: [],
  };

  constructor(props) {
    super(props);
    const { dispatch } = props;

    this.state = {
      records: props.selectedRows,
      formVals: {
        fMoBillNo: props.selectedRows[0].fMoBillNo,
        fWorkShopName: props.selectedRows[0].fWorkShopName,
        fWorkShopNumber: props.selectedRows[0].fWorkShopNumber,
        fSoBillNo: props.selectedRows[0].fSoBillNo,
        fProductName: props.selectedRows[0].fProductName,
        fProductNumber: props.selectedRows[0].fProductNumber,
        fModel: props.selectedRows[0].fModel,
      },
      workshop: null,
    };
    dispatch({
      type: 'basicData/getRouteData',
    });
    dispatch({
      type: 'basicData/getWorkShops',
      // }).then(() => {
      //   const {
      //     basicData: { workshops },
      //   } = this.props;
      //   const { formVals } = this.state;
      //   const workshop = workshops.find(x => x.fErpID === formVals.fWorkshop);
      //   this.setState({ workshop });
    });
  }

  componentDidMount = () => {};

  okHandle = () => {
    const { form } = this.props;
    const { records } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const list = records.map(item => {
        return { fInterID: item.fInterID, fQty: item.fCurrentQty };
      });
      const submitData = { list, ...fieldsValue };
      this.handleSubmit(submitData);
    });
  };

  handleSubmit = submitData => {
    const { dispatch, handleModalVisible, handleSuccess } = this.props;
    dispatch({
      type: 'defectInvManage/repair',
      payload: submitData,
    }).then(() => {
      const {
        defectInvManage: {
          queryResult: { status, message, model },
        },
      } = this.props;
      if (status === 'ok') {
        message.success('返修成功，返修流程单：' + model.map(x => x.fFullBatchNo).join(', '));
        handleModalVisible(false);
        // 成功后再次刷新列表
        if (handleSuccess) handleSuccess();
      } else if (status === 'warning') {
        message.warning(message);
      } else {
        message.error(message);
      }
    });
  };

  render() {
    const {
      form,
      modalVisible,
      handleModalVisible,
      selectedRows,
      basicData: { workshops, routeData },
    } = this.props;
    const { formVals, workshop } = this.state;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            不良返修-任务单： <Tag color="blue">{formVals.fMoBillNo}</Tag>
          </div>
        }
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, selectedRows)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="物料名称">
          {formVals.fProductName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="物料编码">
          {formVals.fProductNumber}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="规格型号">
          {formVals.fModel}
        </FormItem>
        {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="车间">
          {form.getFieldDecorator('fWorkshop', {
            rules: [{ required: true, message: '请选择车间' }],
            initialValue: workshop ? workshop.fItemID : null,
          })(
            <Select
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
          )}
        </FormItem> */}
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="规格型号">
          {formVals.fWorkShopName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工艺路线">
          {form.getFieldDecorator('fRouteID', {
            rules: [{ required: true, message: '请选择工艺路线' }],
            initialValue: formVals.fRouteID > 0 ? formVals.fRouteID : null,
          })(
            <Select style={{ width: 300 }}>
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
