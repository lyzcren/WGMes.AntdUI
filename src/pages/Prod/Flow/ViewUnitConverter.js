import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Radio, Switch, Select, message, Button, Tag } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { DecimalModes, ConvertModes } from '@/utils/GlobalConst';

const { Description } = DescriptionList;

export class ViewUnitConverterForm extends PureComponent {
  render() {
    const { modalVisible, handleModalVisible, dataSource } = this.props;
    const {
      fName,
      fInUnitName,
      fOutUnitName,
      fDecimal,
      fDecimalMode,
      fConvertMode,
      fFormula,
      fConvertRate,
    } = dataSource;
    const decimalModel = DecimalModes.find(x => x.fKey == fDecimalMode);
    const convertMode = ConvertModes.find(x => x.fKey == fConvertMode);

    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false, dataSource)}
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
            单位转换 <Tag color="blue">{fName}</Tag>
          </div>
        }
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => handleModalVisible()}
      >
        <DescriptionList size="small" col="2" style={{ flex: 'auto' }}>
          <Description term="转入单位">{fInUnitName}</Description>
          <Description term="转出单位">{fOutUnitName}</Description>
          <Description term="保留小数位">{fDecimal}</Description>
          <Description term="计数保留法">{decimalModel ? decimalModel.fName : ''}</Description>
          <Description term="换算方式">{convertMode ? convertMode.fName : ''}</Description>
          <Description term="换算率">{fConvertRate}</Description>
        </DescriptionList>
      </Modal>
    );
  }
}
