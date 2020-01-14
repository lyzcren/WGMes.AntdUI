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
class ViewRouteSteps extends PureComponent {
  MaxEntryID = 0;

  getRowByKey(fEntryID, newData) {
    const { steps, currentStep } = this.props;
    const { depts } = steps[currentStep];
    return (newData || depts).filter(item => item.fEntryID === fEntryID)[0];
  }

  nextStep = () => {
    const { steps, currentStep, onChange } = this.props;
    const nextStep = steps.length > currentStep + 1 ? currentStep + 1 : currentStep;

    if (onChange) onChange({ steps, currentStep: nextStep });
  };

  prevStep = () => {
    const { steps, currentStep, onChange } = this.props;

    if (onChange) onChange({ steps, currentStep: currentStep - 1 });
  };

  changeCurrent = currentStep => {
    const { steps, onChange } = this.props;

    if (onChange) onChange({ steps, currentStep });
  };

  render() {
    const { loading, steps, currentStep } = this.props;
    const depts = steps[currentStep] ? steps[currentStep].depts : [];

    const columns = [
      {
        title: '岗位',
        dataIndex: 'fDeptName',
      },
      {
        title: '机台必选',
        dataIndex: 'fRequireMachine',
        width: 100,
        render: (text, record) => <Switch checked={!!record.fRequireMachine} disabled />,
      },
      {
        title: '调机员必选',
        dataIndex: 'fRequireDebugger',
        width: 120,
        render: (text, record) => <Switch checked={!!record.fRequireDebugger} disabled />,
      },
      {
        title: '自动签收',
        dataIndex: 'fAutoSign',
        width: 100,
        render: (text, record) => <Switch checked={!!record.fAutoSign} disabled />,
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

export default ViewRouteSteps;
