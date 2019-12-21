import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, Tag, Table, message } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

const FormItem = Form.Item;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ routeParam, loading, basicData }) => ({
  routeParam,
  loading: loading.models.routeParam,
  basicData,
}))
@Form.create()
class ParamForm extends PureComponent {
  static defaultProps = {
    handleSubmit: () => {},
    handleModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      formVals: props.values,
    };
    const { dispatch } = props;
    dispatch({
      type: 'routeParam/fetchParams',
      payload: { fInterID: props.values.fInterID },
    }).then(() => {
      const {
        routeParam: { data },
      } = this.props;
      this.setState({ data });
    });
  }

  okHandle = () => {
    const { dispatch, form, handleModalVisible, handleSubmit } = this.props;
    const {
      data,
      formVals: { fInterID },
    } = this.state;
    dispatch({
      type: 'routeParam/saveParams',
      payload: { fInterID, data },
    }).then(() => {
      const {
        routeParam: { queryResult },
      } = this.props;
      if (queryResult.status === 'ok') {
        message.success('修改成功');
        handleModalVisible();
      } else {
        message.warning(queryResult.message);
      }
    });
  };

  getRowByKey(fEntryID, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.fEntryID === fEntryID)[0];
  }

  handleFieldChange(e, fieldName, fEntryID) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
    }
  }

  render() {
    const { form, modalVisible, handleModalVisible, values } = this.props;
    const { loading, data, formVals } = this.state;
    const columns = [
      {
        title: '岗位',
        dataIndex: 'fDeptName',
        key: 'fDeptName',
        width: '40%',
      },
      {
        title: '工艺参数',
        dataIndex: 'fParamName',
        key: 'fParamName',
        width: '30%',
      },
      {
        title: '默认值',
        dataIndex: 'fDefaultValue',
        key: 'fDefaultValue',
        width: '30%',
        render: (text, record) => (
          <Input
            value={text}
            onChange={e => this.handleFieldChange(e, 'fDefaultValue', record.fEntryID)}
            onKeyPress={e => this.handleKeyPress(e, record.fEntryID)}
            placeholder="参数值"
          />
        ),
      },
    ];

    return (
      <Modal
        destroyOnClose
        title={
          <div>
            {' '}
            修改 <Tag color="blue"> {formVals.fName}</Tag> 工艺参数
          </div>
        }
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <Table
          rowKey="fEntryID"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
        />
      </Modal>
    );
  }
}

export default ParamForm;
