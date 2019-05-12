import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Select, Tag, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ flowManage, loading, basicData }) => ({
  flowManage,
  loading: loading.models.flowSign,
  basicData,
}))
@Form.create()
export class SignForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    const {
      dispatch,
      values: { fInterID },
    } = props;

    this.state = {
      formVals: props.values,
    };
  }

  okHandle = () => {
    const {
      form,
      handleSubmit,
      values: { fInterID },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      fieldsValue.fInterID = fInterID;
      this.handleSubmit(fieldsValue);
    });
  };

  render() {
    const {
      form,
      modalVisible,
      handleModalVisible,
      values,
      flowManage: { nextDepts },
    } = this.props;
    const { formVals } = this.state;
    console.log(depts);

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            流程单-签收 <Tag color="blue">{formVals.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
          {form.getFieldDecorator('fDeptID', {
            rules: [{ required: true, message: '请输入名称', min: 1 }],
            initialValue: formVals.fName,
          })(
            <Select
              placeholder="请选择部门"
              autoFocus
              showSearch
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {nextDepts.map(x => (
                <Option key={x.fDeptID} value={x.fDeptID}>
                  {x.fDeptName + ' - ' + x.fDeptNumber}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}
