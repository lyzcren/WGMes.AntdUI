import React, { PureComponent } from 'react';
import { connect } from 'dva';
import numeral from 'numeral';
import { Form, Input, Modal, message, Button, Alert, Card, Select } from 'antd';
import DescriptionList from '@/components/DescriptionList';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Description } = DescriptionList;

/* eslint react/no-multi-comp:0 */
@connect(({ loading, menu, basicData }) => ({
  loading: loading.models.flowScan,
  menu,
  basicData,
}))
/* eslint react/no-multi-comp:0 */
@Form.create()
export class DeptSelector extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { form, dispatch } = this.props;
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
  }

  close = () => {
    const { handleModalVisible } = this.props;
    handleModalVisible(false);
  };

  afterClose = () => {
    const { afterClose } = this.props;
    if (afterClose) afterClose();
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      modalVisible,
      handleModalVisible,
      basicData: { authorizeProcessTree },
      selected = () => {},
    } = this.props;
    const { children: workShops } = authorizeProcessTree[0] || {};

    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          取消
        </Button>
      </div>
    );

    return (
      <Modal
        loading={loading}
        destroyOnClose
        title="选择岗位"
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible()}
        wrapClassName={styles.modalWrap}
        afterClose={() => {
          this.afterClose();
        }}
      >
        {workShops &&
          workShops.map(workShop => (
            <Card key={workShop.fItemID} title={workShop.fName}>
              {workShop.children.map(dept => (
                <Card.Grid
                  key={dept.fItemID}
                  className={styles.gridStyle}
                  onClick={() => {
                    selected(dept);
                  }}
                >
                  {dept.fName}
                </Card.Grid>
              ))}
            </Card>
          ))}
      </Modal>
    );
  }
}
