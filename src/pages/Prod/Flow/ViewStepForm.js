import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Switch, Select, message, Button, Tag } from 'antd';
import RouteSteps from '@/wg_components/WgRouteSteps/RouteSteps';

/* eslint react/no-multi-comp:0 */
@connect(({ viewStep, loading }) => ({
  viewStep,
  loading: loading.models.viewStep,
}))
@Form.create()
export class ViewStepForm extends PureComponent {
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
    dispatch({
      type: 'viewStep/initModel',
      payload: { fInterID },
    });
  }

  render() {
    const {
      form,
      loading,
      values,
      modalVisible,
      handleModalVisible,
      viewStep: { steps, currentStep },
    } = this.props;
    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false, values)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Modal
        // destroyOnClose
        title={
          <div>
            流程单-工艺路线 <Tag color="blue">{values.fFullBatchNo}</Tag>
          </div>
        }
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => handleModalVisible()}
      >
        <RouteSteps loading={loading} steps={steps} currentStep={currentStep} />
      </Modal>
    );
  }
}
