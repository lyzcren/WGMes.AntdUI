import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Steps, Input, Radio, Select, message, Tag, Checkbox, Modal, Switch } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

/* eslint react/no-multi-comp:0 */
@connect(({ flowChangeRoute, loading, basicData, user }) => ({
  flowChangeRoute,
  loading: loading.models.flowChangeRoute,
  basicData,
  fBindEmpID: user.currentUser.fBindEmpID,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ChangeRouteForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    const { dispatch } = props;

    this.state = {
      records: [],
      routeSteps: [],
    };
    dispatch({
      type: 'basicData/getRouteData',
    });
  }

  componentDidMount() {
    const {
      values: { fInterID },
    } = this.props;
    this.loadData(fInterID);
  }

  componentDidUpdate(preProps) {}

  loadData(fInterID) {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowChangeRoute/initModel',
      payload: { fInterID },
    }).then(() => {
      const {
        flowChangeRoute: { records },
      } = this.props;
      this.setState({
        records,
      });
    });
  }

  handleRouteChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowChangeRoute/routeChanged',
      payload: { fInterID: value },
    }).then(() => {
      const {
        flowChangeRoute: { routeSteps },
      } = this.props;
      this.setState({
        routeSteps,
      });
    });
  };

  okHandle = () => {
    const { form, dispatch, handleSucess, handleModalVisible, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const { fInterID } = values;

      dispatch({
        type: 'flowChangeRoute/changeRoute',
        payload: {
          fInterID,
          fRecordID: values.fCurrentRecordID,
          ...fieldsValue,
        },
      }).then(queryResult => {
        if (queryResult.status === 'ok') {
          message.success('变更工艺路线成功.');
          if (handleSucess) handleSucess();
          handleModalVisible(false, values);
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
      form: { getFieldDecorator },
      loading,
      modalVisible,
      handleModalVisible,
      basicData: { routeData },
      values,
      fBindEmpID,
    } = this.props;
    const { records, routeSteps } = this.state;

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            流程单-变更工艺路线 <Tag color="blue">{values.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        width={650}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="当前岗位">
          {values.fCurrentDeptName}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工艺路线">
          {getFieldDecorator('fRouteID', {
            rules: [{ required: true, message: '请选择工艺路线' }],
          })(
            <Select
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              onChange={this.handleRouteChange}
            >
              {routeData.map(t => (
                <Option key={t.fInterID} value={t.fInterID}>
                  {t.fName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="原岗位">
          {records.map(x => (
            <Tag key={x.fEntryID} color={x.fStatusNumber === 'ManufEndProduce' ? 'green' : ''}>
              {x.fDeptName}
            </Tag>
          ))}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="变更岗位">
          {getFieldDecorator('fRouteEntryIDs', {
            rules: [{ required: true, message: '请选择岗位' }],
            initialValue: routeSteps.map(x => x.fEntryID),
          })(
            <CheckboxGroup>
              {routeSteps.map(x => (
                <Checkbox key={x.fEntryID} value={x.fEntryID}>
                  {x.fDeptName}
                </Checkbox>
              ))}
            </CheckboxGroup>
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="取消当前岗位">
          {getFieldDecorator('fCancelCurrentDept', {
            valuePropName: 'checked',
            initialValue: false,
          })(<Switch />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label={'原因'}>
          {getFieldDecorator('fReason', {})(
            <TextArea style={{ minHeight: 32 }} placeholder="请输入原因" rows={3} />
          )}
        </FormItem>
      </Modal>
    );
  }
}
