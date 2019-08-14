import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Select, Tag, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ flowManage, loading, basicData, user }) => ({
  flowManage,
  loading: loading.models.flowSign,
  basicData,
  currentUser: user.currentUser,
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
    const { form, handleSubmit, values } = this.props;
    const { fInterID } = values;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // form.resetFields();
      // fieldsValue.fInterID = fInterID;
      handleSubmit(values, fieldsValue.fDeptID);
    });
  };

  render() {
    const {
      currentUser,
      form,
      modalVisible,
      handleModalVisible,
      values,
      flowManage: { nextDepts },
    } = this.props;
    const { formVals } = this.state;
    const filterDepts = currentUser.fIsAdmin
      ? nextDepts
      : nextDepts.filter(x => currentUser.deptList.find(y => x.fDeptID === y.fDeptID));

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
            rules: [{ required: true, message: '请输入岗位' }],
            initialValue: formVals.fDeptID,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选择岗位"
              autoFocus
              dropdownMatchSelectWidth
              defaultOpen
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
      </Modal>
    );
  }
}
