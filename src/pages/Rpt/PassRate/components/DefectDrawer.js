import { Divider, Drawer, Form, Input, InputNumber, Col, Row } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;

@Form.create()
class DefectDrawer extends PureComponent {
  open = () => {
    const { handleVisible } = this.props;
    if (handleVisible) {
      handleVisible(true);
    }
  };

  onClose = () => {
    const { handleVisible } = this.props;
    if (handleVisible) {
      handleVisible(false);
    }
  };

  renderItem = d => {
    return (
      <Row key={`defectID_${d.fInterID}_${d.fEntryID}`}>
        <Col>
          {d.fDefectName}：{d.fQty}
        </Col>
      </Row>
    );
  };

  render() {
    const { loading, visible, defectData } = this.props;

    return (
      <Drawer
        title="不良明细"
        placement="right"
        closable={false}
        onClose={this.onClose}
        visible={visible}
        loading={loading}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <Form layout="vertical" hideRequiredMark>
          {defectData.map(d => this.renderItem(d))}
        </Form>
      </Drawer>
    );
  }
}

export default DefectDrawer;
