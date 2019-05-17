import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Steps, Input, Modal, Radio, Switch, Select, message, Button } from 'antd';
import { Link } from 'umi';

const { Step } = Steps;

/* eslint react/no-multi-comp:0 */
@connect(({ viewRecord, loading }) => ({
  viewRecord,
  loading: loading.models.viewRecord,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class ViewRecordForm extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const { fInterID } = this.props;
    this.loadData(fInterID);
  }

  loadData(fInterID) {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'flowManage/record',
    //   payload: {
    //     fInterID,
    //   }
    // }).then(() => {
    //   const {
    //     flowManage: { records },
    //   } = this.props;
    //   console.log(records);
    // });
    dispatch({
      type: 'viewRecord/initModel',
      payload: { fInterID },
    });
  }

  recordProfile(record) {
    const { dispatch, handleModalVisible } = this.props;
    dispatch({
      type: 'menu/openMenu',
      payload: { path: '/prod/record/profile', data: record },
    });
    handleModalVisible(false);
  }

  render() {
    const {
      loading,
      modalVisible,
      handleModalVisible,
      viewRecord: { steps, currentStep },
    } = this.props;
    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );
    // console.log(steps);

    return (
      <Modal
        // destroyOnClose
        title="执行情况"
        visible={modalVisible}
        footer={footer}
        width={650}
        onCancel={() => handleModalVisible()}
      >
        <Card bordered={false} loading={loading}>
          <Steps direction="vertical" current={currentStep}>
            {steps.map(step => (
              <Step
                key={step.order}
                title={
                  step.recordId ? (
                    <Link
                      to="/"
                      onClick={() => {
                        this.recordProfile(step.depts[0]);
                      }}
                    >
                      {step.title}
                    </Link>
                  ) : (
                    <span>{step.title}</span>
                  )
                }
                description={step.description}
              />
            ))}
          </Steps>
        </Card>
      </Modal>
    );
  }
}
