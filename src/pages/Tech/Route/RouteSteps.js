import React, { PureComponent, Fragment } from 'react';
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
  message,
  Popconfirm,
  Divider,
  TreeSelect,
  Alert,
  Steps,
  Icon,
  Typography,
} from 'antd';
import isEqual from 'lodash/isEqual';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { GlobalConst } from '@/utils/GlobalConst';

import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Step } = Steps;
const { Text } = Typography;

/* eslint react/no-multi-comp:0 */
@Form.create()
/* eslint react/no-multi-comp:0 */
class RouteStep extends PureComponent {
  MaxEntryID = 0;

  getRowByKey(fEntryID, newData) {
    const { steps, currentStep } = this.props;
    const { depts } = steps[currentStep];
    return (newData || depts).filter(item => item.fEntryID === fEntryID)[0];
  }

  remove(fEntryID) {
    const { steps, currentStep, onChange } = this.props;
    const newSteps = [...steps];
    newSteps[currentStep].depts = newSteps[currentStep].depts.filter(v => v.fEntryID !== fEntryID);

    if (onChange) onChange({ steps: newSteps, currentStep });
  }

  nextStep = () => {
    const { steps, currentStep, onChange } = this.props;
    const nextStep = currentStep + 1;
    if (steps.length <= nextStep || steps[nextStep].depts.length <= 0) {
      steps[nextStep] = {
        depts: [{ fEntryID: 1 }],
      };
    }

    if (onChange) onChange({ steps, currentStep: nextStep });
  };

  prevStep = () => {
    const { steps, currentStep, onChange } = this.props;

    if (onChange) onChange({ steps, currentStep: currentStep - 1 });
  };

  deleteStep = () => {
    const { steps, currentStep, onChange } = this.props;
    const newSteps = steps.filter((s, i) => i !== currentStep);

    if (onChange) onChange({ steps: newSteps, currentStep: currentStep - 1 });
  };

  handleDeptChange(deptId, deptName, fEntryID) {
    const { steps, currentStep, onChange } = this.props;
    const { depts } = steps[currentStep];
    // const newData = depts.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, depts);
    if (target) {
      target.fDeptID = deptId;
      target.fDeptName = deptName;
    }
    this.checkEmptyRow(steps, currentStep);

    if (onChange) onChange({ steps, currentStep });
  }

  checkEmptyRow = (steps, currentStep) => {
    const stepData = steps[currentStep];
    if (!stepData || !stepData.depts || stepData.depts.length <= 0) {
      steps[currentStep] = {
        depts: [
          {
            fEntryID: 1,
            fDeptID: undefined,
            fDeptName: '',
          },
        ],
      };
    }
    // 如果没有空行，自动添加空行
    else if (!stepData.depts.find(x => !x.fDeptID)) {
      const maxEntryID = stepData.depts
        .map(x => (x.fEntryID ? x.fEntryID : 1))
        .reduce((a, b) => (b > a ? b : a));
      stepData.depts.push({
        fEntryID: maxEntryID + 1,
        fDeptID: undefined,
        fDeptName: '',
      });
    }
  };

  handleFieldChange(fieldName, value, fEntryID) {
    const { steps, currentStep, onChange } = this.props;
    const { depts } = steps[currentStep];
    const target = this.getRowByKey(fEntryID, depts);
    if (target) {
      target[fieldName] = value;
    }

    if (onChange) onChange({ steps, currentStep });
  }

  handleAutoSignChange(fEntryID, autoSign) {
    const { steps, currentStep, onChange } = this.props;
    const { depts } = steps[currentStep];
    const target = this.getRowByKey(fEntryID, depts);
    if (depts.find(x => x.fDeptID != target.fDeptID && x.fAutoSign)) {
      message.warning('并行岗位只允许一个岗位自动签收');
    }
    depts.forEach(dept => {
      dept.fAutoSign = false;
    });
    if (target) {
      target.fAutoSign = autoSign;
    }

    if (onChange) onChange({ steps, currentStep });
  }

  changeCurrent = currentStep => {
    const { steps, onChange } = this.props;

    if (onChange) onChange({ steps, currentStep });
  };

  render() {
    const { loading, processDeptTree, steps, currentStep } = this.props;
    this.checkEmptyRow(steps, currentStep);
    const { depts } = steps[currentStep];

    const columns = [
      {
        title: '岗位',
        dataIndex: 'fDeptName',
        render: (text, record) => (
          <TreeSelect
            value={record.fDeptID}
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={processDeptTree}
            treeDefaultExpandAll
            onChange={(depts, label) => this.handleDeptChange(depts, label[0], record.fEntryID)}
          />
        ),
      },
      {
        title: '机台必选',
        dataIndex: 'fRequireMachine',
        width: 100,
        render: (text, record) => (
          <Switch
            checked={!!record.fRequireMachine}
            onChange={checked => {
              this.handleFieldChange('fRequireMachine', checked, record.fEntryID);
            }}
          />
        ),
      },
      {
        title: '调机员必选',
        dataIndex: 'fRequireDebugger',
        width: 120,
        render: (text, record) => (
          <Switch
            checked={!!record.fRequireDebugger}
            onChange={checked => {
              this.handleFieldChange('fRequireDebugger', checked, record.fEntryID);
            }}
          />
        ),
      },
      {
        title: '自动签收',
        dataIndex: 'fAutoSign',
        width: 100,
        render: (text, record) => (
          <Switch
            checked={!!record.fAutoSign}
            onChange={checked => {
              this.handleAutoSignChange(record.fEntryID, checked);
            }}
          />
        ),
      },
      {
        title: '操作',
        key: 'action',
        width: 100,
        render: (text, record) => (
          <span>
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.fEntryID)}>
              <a disabled={!record.fDeptID}>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return (
      <div>
        <Steps
          type="navigation"
          current={currentStep}
          onChange={this.changeCurrent}
          style={{
            marginBottom: 10,
            boxShadow: '0px -1px 0 0 #e8e8e8 inset',
          }}
        >
          {steps.map((step, index) => (
            <Step
              key={index}
              title={`第${index + 1}步`}
              description={
                <div key={`desc_${index}`}>
                  {step.depts.map(dept => (
                    <div key={`dept_${dept.fEntryID}`}>{dept.fDeptName}</div>
                  ))}
                </div>
              }
            />
          ))}
        </Steps>
        <Alert
          message={
            <Fragment>
              <a style={{ marginLeft: 60 }} onClick={this.prevStep}>
                <Icon type="step-backward" />
                上一步
              </a>
              <a style={{ marginLeft: 40 }} onClick={this.nextStep}>
                <Icon type="step-forward" />
                下一步
              </a>
              <a style={{ marginLeft: 40, color: 'red' }} onClick={this.deleteStep}>
                <Icon type="delete" />
                删除
              </a>
            </Fragment>
          }
          type="info"
          // showIcon
          style={{
            marginBottom: 10,
          }}
        />
        <Table
          key={`table_${currentStep}`}
          rowKey="fEntryID"
          bordered
          loading={loading}
          columns={columns}
          dataSource={depts}
          pagination={false}
        />
        <Text style={{ marginTop: '20px' }} type="warning">
          注：工艺路线中设置“机台必选”、“调机员必选”等参数，优先级高于岗位中的设置。当工艺路线与岗位中同一参数使用不同值时，系统将优先使用工艺路线中设置的值。
        </Text>
      </div>
    );
  }
}

export default RouteStep;
