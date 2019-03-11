import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Steps,
} from 'antd';

const Step = Steps.Step;


/* eslint react/no-multi-comp:0 */
@Form.create()
export class RouteSteps extends PureComponent {
  state = {
  };


  render () {
    const {
      steps, currentStep,
      loading,
    } = this.props;

    return (
      <Card bordered={false} loading={loading}>
        <Steps direction="vertical" current={currentStep}>
          {steps.map(step => <Step key={step.fGroupID} title={step.fName}
            description={
              <div key={"desc_" + step.fGroupID}>
                {step.depts.map(dept => <div key={"dept_" + dept.fEntryID}>{dept.fDeptName}</div>)}
              </div>}
          />
          )}
        </Steps>
      </Card>);
  }
};
