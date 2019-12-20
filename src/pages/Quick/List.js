import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
// import Link from 'umi/link';
import { Checkbox, Alert, message, Col, Row, Icon } from 'antd';
import Login from '@/components/Login';
import screenfull from 'screenfull';
import { getToken } from '@/utils/token';
import {
  getDeptId,
  setDeptId,
  getMachineId,
  setMachineId,
  getWorkTimeId,
  setWorkTimeId,
  getOperator,
  setOperator,
} from '@/utils/quickOpsBinding';

import { ChooseDeptForm } from './ChooseDeptForm';
import { ChooseMachineForm } from './ChooseMachineForm';
import { ChooseWorktimeForm } from './ChooseWorktimeForm';
import { ChooseOperatorForm } from './ChooseOperatorForm';
import { ScanSignForm } from './ScanSignForm';
import { ScanTransferForm } from './ScanTransferForm';

import styles from './List.less';
import ButtonGroup from 'antd/lib/button/button-group';

@connect(({ user, loading, quickOps }) => ({
  user,
  quickOps,
}))
class QuickOpsPage extends Component {
  state = {
    // 界面是否可见
    modalVisible: {
      chooseDept: false,
      chooseMachine: false,
      chooseWorktime: false,
      chooseOperator: false,
      scanSign: false,
      scanTransfer: false,
    },
    deptList: [],
    machineList: [],
    worktimeList: [],
    operatorList: [],
    dept: { fDeptID: 0, fDeptName: '<请选择>' },
    machine: { fItemID: 0, fName: '<请选择>' },
    worktime: { fWorkTimeID: 0, fWorkTimeName: '<请选择>' },
    operator: { fEmpID: 0, fEmpName: '<请选择>' },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const token = getToken();
    if (!token) {
      dispatch({
        type: 'user/logout',
      });
      return;
    }
    dispatch({
      type: 'user/fetchCurrent',
    }).then(() => {
      const {
        user: { currentUser },
      } = this.props;
      const { deptList, fBindEmpID, fBindEmpName, fBindEmpNumber } = currentUser;
      const deptId = getDeptId();
      if (deptList.length >= 1) {
        this.setState({ deptList });
        const dept = deptList.find(x => x.fDeptID == deptId);
        if (deptId && dept) {
          this.handleDeptChanged(dept);
        } else {
          this.handleDeptChanged(deptList[0]);
        }
      }
      const operator = getOperator();
      if (operator) {
        this.setState({ operator });
      } else if (currentUser.fBindEmpID) {
        this.setState({ operator: { fEmpID: fBindEmpID, fEmpName: fBindEmpName } });
      }
    });
    // setTimeout(() => {
    //   if (!screenfull.isFullscreen) screenfull.request();
    // }, 100);
  }

  handleModalVisible = ({ key, flag }) => {
    const { modalVisible } = this.state;
    modalVisible[key] = !!flag;
    this.setState({
      modalVisible: { ...modalVisible },
    });
  };

  handleDeptChanged = newDept => {
    const { dispatch } = this.props;
    const { fDeptID } = newDept;
    this.setState({ dept: newDept });
    setDeptId(newDept.fDeptID);

    dispatch({
      type: 'quickOps/getMachine',
      payload: { fDeptID },
    }).then(() => {
      const { machineList } = this.props.quickOps;
      this.setState({ machineList });
      const machineId = getMachineId();
      const machine = machineList.find(x => x.fItemID == machineId);
      if (machineId && machine) {
        this.setState({ machine });
      }
    });
    dispatch({
      type: 'quickOps/getWorkTimes',
      payload: { fDeptID },
    }).then(() => {
      const { worktimeList } = this.props.quickOps;
      this.setState({ worktimeList });
      const worktimeId = getWorkTimeId();
      const worktime = worktimeList.find(x => x.fWorkTimeID == worktimeId);
      if (worktimeId && worktime) {
        this.setState({ worktime });
      }
    });
  };

  chooseDept = () => {
    this.handleModalVisible({ key: 'chooseDept', flag: true });
  };

  changeDept = dept => {
    this.handleModalVisible({ key: 'chooseDept', flag: false });
    const { fDeptID } = dept;
    this.handleDeptChanged(dept);
    if (dept.fDeptID != this.state.fDeptID) {
      this.setState({ machine: { fItemID: 0, fName: '<请选择>' } });
      this.setState({ worktime: { fWorkTimeID: 0, fWorkTimeName: '<请选择>' } });
    }
  };

  chooseMachine = () => {
    const { machineList, dept } = this.state;
    if (machineList && machineList.length > 0) {
      this.handleModalVisible({ key: 'chooseMachine', flag: true });
    } else if (dept.fDeptID > 0) {
      message.warning('暂无机台');
    } else {
      message.warning('请先选择岗位');
    }
  };

  changeMachine = machine => {
    this.handleModalVisible({ key: 'chooseMachine', flag: false });
    this.setState({ machine });
    setMachineId(machine.fItemID);
  };

  chooseWorktime = () => {
    const { worktimeList, dept } = this.state;
    if (worktimeList && worktimeList.length > 0) {
      this.handleModalVisible({ key: 'chooseWorktime', flag: true });
    } else if (dept.fDeptID > 0) {
      message.warning('当前岗位暂无班次');
    } else {
      message.warning('请先选择岗位');
    }
  };

  changeWorktime = worktime => {
    this.handleModalVisible({ key: 'chooseWorktime', flag: false });
    this.setState({ worktime });
    setWorkTimeId(worktime.fWorkTimeID);
  };

  chooseOperator = () => {
    this.handleModalVisible({ key: 'chooseOperator', flag: true });
  };

  changeOperator = operator => {
    this.handleModalVisible({ key: 'chooseOperator', flag: false });
    this.setState({ operator });
    setOperator(operator);
  };

  scanSign = () => {
    this.handleModalVisible({ key: 'scanSign', flag: true });
  };

  scanTransfer = () => {
    this.handleModalVisible({ key: 'scanTransfer', flag: true });
  };

  render() {
    const { login } = this.props;
    const { currentUser } = this.props.user;
    const {
      deptList,
      machineList,
      worktimeList,
      operatorList,
      dept,
      machine,
      worktime,
      operator,
      modalVisible,
    } = this.state;

    return (
      <div className={styles.main}>
        <Col span={13}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <div className={styles.headWrapper} />
          </Row>
          <Row gutter={8}>
            <Col span={3}>
              <div style={{ height: '80px' }} />
            </Col>
            <Col span={6}>
              <QuickButton title={'签收'} onClick={this.scanSign} />
            </Col>
            <Col span={6}>
              <QuickButton title={'转序'} onClick={this.scanTransfer} />
            </Col>
            <Col span={6}>
              <QuickButton title={'打印'} />
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={3}>
              <div style={{ height: '80px' }} />
            </Col>
            <Col span={6}>
              <QuickButton title={'拒签'} />
            </Col>
            <Col span={6}>
              <QuickButton title={'退回'} />
            </Col>
            <Col span={6}>
              <QuickButton title={'取走'} />
            </Col>
          </Row>
        </Col>
        <Col span={3} />
        <Col span={6}>
          <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
            <div className={styles.right_header} />
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient} onClick={this.chooseDept}>
              <span>
                <Icon type="double-right" /> 岗位： <b>{dept.fDeptName}</b>
              </span>
            </h2>
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient} onClick={this.chooseMachine}>
              <span>
                <Icon type="double-right" /> 机台： <b>{machine.fName}</b>
              </span>
            </h2>
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient} onClick={this.chooseWorktime}>
              <span>
                <Icon type="double-right" /> 班次： <b>{worktime.fWorkTimeName}</b>
              </span>
            </h2>
          </Row>
          <Row gutter={8}>
            <h2 className={styles.text_gradient} onClick={this.chooseOperator}>
              <span>
                <Icon type="double-right" /> 操作员： <b>{operator.fEmpName}</b>
              </span>
            </h2>
          </Row>
        </Col>

        {deptList && deptList.length && (
          <ChooseDeptForm
            dispatch
            handleModalVisible={flag => this.handleModalVisible({ key: 'chooseDept', flag })}
            handleSubmit={this.changeDept}
            modalVisible={modalVisible.chooseDept}
            deptList={deptList}
          />
        )}
        {machineList && machineList.length && (
          <ChooseMachineForm
            dispatch
            handleModalVisible={flag => this.handleModalVisible({ key: 'chooseMachine', flag })}
            handleSubmit={this.changeMachine}
            modalVisible={modalVisible.chooseMachine}
            machineList={machineList}
          />
        )}
        {worktimeList && worktimeList.length && (
          <ChooseWorktimeForm
            dispatch
            handleModalVisible={flag => this.handleModalVisible({ key: 'chooseWorktime', flag })}
            handleSubmit={this.changeWorktime}
            modalVisible={modalVisible.chooseWorktime}
            worktimeList={worktimeList}
          />
        )}
        <ChooseOperatorForm
          dispatch
          handleModalVisible={flag => this.handleModalVisible({ key: 'chooseOperator', flag })}
          handleSubmit={this.changeOperator}
          modalVisible={modalVisible.chooseOperator}
          operatorList={operatorList}
        />
        <ScanSignForm
          dispatch
          handleModalVisible={flag => this.handleModalVisible({ key: 'scanSign', flag })}
          modalVisible={modalVisible.scanSign}
          dept={dept}
        />
        <ScanTransferForm
          dispatch
          handleModalVisible={flag => this.handleModalVisible({ key: 'scanTransfer', flag })}
          modalVisible={modalVisible.scanTransfer}
          dept={dept}
          operator={operator}
          worktime={worktime}
          machine={machine}
        />
      </div>
    );
  }
}

class QuickButton extends Component {
  render() {
    const { onClick } = this.props;
    return (
      <a className={styles.quick_button} onClick={onClick}>
        <span>{this.props.title}</span>
      </a>
    );
  }
}

export default QuickOpsPage;
