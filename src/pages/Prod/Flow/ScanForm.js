import React, { PureComponent } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import { Form, Input, Modal, message, Button, Alert, Card, Select } from 'antd';
import DescriptionList from '@/components/DescriptionList';

import styles from './ScanForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;

/* eslint react/no-multi-comp:0 */
@connect(({ flowScan, loading, menu, user }) => ({
  flowScan,
  loading: loading.models.flowScan,
  menu,
  currentUser: user.currentUser,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ScanForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    const { queryDeptID } = props;
    this.state = {
      queryDeptID,
    };
  }

  componentDidMount() {}

  componentDidUpdate() {}

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.scanFlow();
    }
  }

  handleSignKeyPress(e) {
    if (e.key === 'Enter') {
      this.sign();
    }
  }

  scanFlow = () => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fFullBatchNo } = fieldsValue;
      dispatch({
        type: 'flowScan/get',
        payload: {
          fFullBatchNo,
        },
      }).then(this.afterScan);
    });
  };

  afterScan = () => {
    const {
      form,
      handleScanTransfer,
      flowScan: { data, showTransfer },
    } = this.props;
    const { fFullBatchNo } = data;
    if (showTransfer) {
      handleScanTransfer(data);
      form.resetFields();
      this.close();
    }
  };

  sign = () => {
    const {
      form,
      flowScan: { data, nextDepts },
    } = this.props;
    const signBatchNo = form.getFieldValue('signBatchNo');
    if (signBatchNo !== data.fFullBatchNo) {
      message.error('两次扫描条码不一致.');
    } else {
      this.comfirmSign();
    }
  };

  comfirmSign = () => {
    const {
      form,
      dispatch,
      handleSign,
      flowScan: { data, nextDepts },
    } = this.props;
    const fDeptID = form.getFieldValue('fDeptID');
    const dept = nextDepts.find(x => x.fDeptID == fDeptID);
    if (!dept) {
      message.error('岗位不存在.');
      return;
    }
    handleSign(data, fDeptID, dept.fName);
    form.resetFields();
    this.setState({ showSignField: false });
    dispatch({
      type: 'flowScan/initModel',
    });
  };

  close = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  afterClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowScan/initModel',
    });
  };

  render() {
    const {
      loading,
      currentUser,
      queryDeptID,
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      flowScan: { data, message: messageInfo, showSign, showTransfer, messageType, nextDepts },
    } = this.props;
    const {
      fFullBatchNo,
      fConvertUnitID,
      fCurrentPassQty,
      fConvertPassQty,
      fUnitName,
      fConvertUnitName,
      fQtyFormat,
      fConvertQtyFormat,
      fQtyDecimal,
    } = data;
    const filterDepts = currentUser.fIsAdmin
      ? nextDepts
      : nextDepts.filter(x => currentUser.deptList.find(y => x.fDeptID === y.fDeptID));

    const footer = (
      <div>
        {showSign && (
          <Button
            type="primary"
            loading={loading}
            onClick={() => this.comfirmSign()}
            prefixCls="ant-btn"
            ghost={false}
            block={false}
          >
            确认签收
          </Button>
        )}
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          取消
        </Button>
      </div>
    );

    return (
      <Modal
        loading={loading}
        destroyOnClose
        title="扫描"
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible()}
        wrapClassName={styles.modalWrap}
        afterClose={() => {
          this.afterClose();
        }}
      >
        {!showSign && (
          <FormItem label="">
            {getFieldDecorator('fFullBatchNo', {
              rules: [{ required: true, message: '请扫描条码/二维码', min: 1 }],
            })(
              <Input
                ref={node => {
                  this.inputFullBatchNo = node;
                }}
                placeholder="请扫描条码/二维码"
                autoFocus
                onKeyPress={e => this.handleKeyPress(e)}
              />
            )}
            {messageInfo && <Alert message={messageInfo} type={messageType} />}
          </FormItem>
        )}
        {showSign && (
          <FormItem label="">
            {getFieldDecorator('signBatchNo', {
              rules: [{ required: true, message: '再次扫描确认签收', min: 1 }],
            })(
              <Input
                ref={node => {
                  this.inputSignBatchNo = node;
                }}
                placeholder="再次扫描或点击下方按钮确认签收"
                autoFocus
                onKeyPress={e => this.handleSignKeyPress(e)}
              />
            )}
          </FormItem>
        )}
        {showSign && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="签收岗位">
            {getFieldDecorator('fDeptID', {
              rules: [{ required: true, message: '请输入岗位' }],
              initialValue:
                queryDeptID && filterDepts.find(x => x.fDeptID == queryDeptID)
                  ? queryDeptID
                  : filterDepts[0].fDeptID,
            })(
              <Select
                style={{ width: '100%' }}
                placeholder="请选择岗位"
                dropdownMatchSelectWidth
                defaultActiveFirstOption
                showSearch
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {filterDepts.map(x => (
                  <Option key={x.fDeptID} value={x.fDeptID}>
                    {x.fDeptName + ' - ' + x.fDeptNumber}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        )}
        {showSign && (
          <Card>
            <DescriptionList size="small" col="2" style={{ flex: 'auto' }}>
              <Description term="批号">{fFullBatchNo}</Description>
              <Description term="单位">
                {fConvertUnitID > 0 ? fConvertUnitName : fUnitName}
              </Description>
              <Description term="数量">
                {fConvertUnitID > 0
                  ? numeral(fConvertPassQty).format(fConvertQtyFormat)
                  : numeral(fCurrentPassQty).format(fQtyFormat)}
              </Description>
              {/* <Description term="单位">{fUnitName}</Description>
              <Description term="数量">{numeral(fCurrentPassQty).format(fQtyFormat)}</Description> */}
            </DescriptionList>
          </Card>
        )}
        {/* {
          matchConverter &&
          <Card>
            <DescriptionList
              size="small"
              col="2"
              style={{ flex: 'auto' }}>
              <Description term="签收后单位">{fConvertUnitName}</Description>
            </DescriptionList>
          </Card>
        } */}
      </Modal>
    );
  }
}
