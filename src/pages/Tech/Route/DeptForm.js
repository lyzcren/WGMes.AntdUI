import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  Switch,
  Tag,
  Select,
  message, Popconfirm, Divider, TreeSelect,
} from 'antd';
import isEqual from 'lodash/isEqual';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { GlobalConst } from '@/utils/GlobalConst'

import styles from './List.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TypeData = GlobalConst.DefectTypeData;

/* eslint react/no-multi-comp:0 */
@connect(({ routeProfile, basicData }) => ({
  routeProfile,
  basicData,
}))
@Form.create()
export class DeptForm extends PureComponent {
  // static defaultProps = {
  //   handleSubmit: () => { },
  //   handleModalVisible: () => { },
  //   depts: [],
  //   currentStep: 0,
  // };

  MaxEntryID = 0;
  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.MaxEntryID = props.depts.length;

    this.state = {
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      depts: props.depts,
      currentStep: props.currentStep
    };
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
  }

  componentDidUpdate (preProps) {
    const { route: { fInterID }, depts, currentStep } = this.props;
    if (fInterID !== preProps.route.fInterID || currentStep !== preProps.currentStep) {
      this.setState({ fInterID, depts, currentStep });
      this.MaxEntryID = Math.max(...(depts.map(d => d.fEntryID)));
    }
  }


  getRowByKey (fEntryID, newData) {
    const { depts } = this.state;
    return (newData || depts).filter(item => item.fEntryID === fEntryID)[0];
  }

  toggleEditable = (e, fEntryID) => {
    e.preventDefault();
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[fEntryID] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ depts: newData });
    }
  };

  newItem = () => {
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    newData.push({
      fEntryID: ++this.MaxEntryID,
      fDeptID: 0,
      fDeptName: '',
      editable: true,
      isNew: true,
    });
    this.setState({ depts: newData });
  };

  remove (fEntryID) {
    const { depts } = this.state;
    const newData = depts.filter(v => v.fEntryID !== fEntryID);
    this.setState({ depts: newData });

    const { dispatch, } = this.props;
    dispatch({
      type: 'routeProfile/changeStep',
      payload: { depts: newData, }
    });
  }

  handleKeyPress (e, fEntryID) {
    if (e.key === 'Enter') {
      this.saveRow(e, fEntryID);
    }
  }

  handleDeptChange (deptId, deptName, fEntryID) {
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      target.fDeptID = deptId;
      target.fDeptName = deptName;
      this.setState({ depts: newData });
    }
  }

  handleFieldChange (e, fieldName, fEntryID) {
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      target[fieldName] = e.target.depts;
      this.setState({ depts: newData });
    }
  }

  saveRow (e, fEntryID) {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      const { depts } = this.state;
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(fEntryID) || {};
      if (!target.fDeptID) {
        message.error('请选择部门');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      } else if (depts.filter(d => !d.isNew && !d.editable && d.fDeptID === target.fDeptID).length > 0) {
        console.log(depts.filter(d => !d.isNew && !d.editable && d.fDeptID === target.fDeptID));
        message.error('部门重复');
        this.setState({
          loading: false,
        });
        return;
      }
      depts.forEach(v => {
        if (v.fEntryID === fEntryID) { delete v.isNew; delete v.editable; }
      });
      this.setState({ depts });

      const { dispatch, } = this.props;
      dispatch({
        type: 'routeProfile/changeStep',
        payload: { depts, }
      });

      this.setState({
        loading: false,
      });
    }, 200);
  }

  cancel (e, fEntryID) {
    this.clickedCancel = true;
    e.preventDefault();
    const { depts } = this.state;
    const newData = depts.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (this.cacheOriginData[fEntryID]) {
      Object.assign(target, this.cacheOriginData[fEntryID]);
      delete this.cacheOriginData[fEntryID];
    }
    target.editable = false;
    this.setState({ depts: newData });
    this.clickedCancel = false;
  }


  render () {
    const { form, modalVisible, handleModalVisible, basicData, } = this.props;
    const profileLoading = this.props.loading;
    const { loading, depts, } = this.state;
    const columns = [
      {
        title: '部门',
        dataIndex: 'fDeptName',
        key: 'fDeptName',
        render: (text, record) => {
          if (record.editable) {
            return (
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={basicData.processDeptTree}
                // defaultValue={record.fDeptName}
                treeDefaultExpandAll
                onChange={(depts, label) => this.handleDeptChange(depts, label[0], record.fEntryID)}
              />
            );
          }
          return (<div style={{ width: '100%' }}>{text}</div>);
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.fEntryID)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.fEntryID)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.fEntryID)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.fEntryID)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.fEntryID)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.fEntryID)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <div>
        <Table
          rowKey="fEntryID"
          loading={loading || profileLoading}
          columns={columns}
          dataSource={depts}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
          style={{ width: '65%', minWidth: '320px', }}
        />
        <Button
          style={{ width: '65%', minWidth: '320px', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newItem}
          icon="plus"
        >
          新增工序
        </Button>
      </div>
    );
  }
};

export default DeptForm;