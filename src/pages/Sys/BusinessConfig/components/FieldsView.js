import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Icon, List, Menu, Input, Row, Col, Checkbox, message } from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import styles from './FieldsView.less';

const FormItem = Form.Item;

class FieldsView extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'businessConfig/getFields',
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    const {
      form,
      dispatch,
      businessConfig: { fields },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      fields.forEach(field => {
        if (fieldsValue[field.fField]) {
          field.fName = fieldsValue[field.fField];
          field.fIsShow = fieldsValue[field.fField + '_isShow'];
        }
      });

      dispatch({
        type: 'businessConfig/updateFields',
        payload: fields,
      }).then(response => {
        if (!response || response.status === 'ok') {
          message.success('修改成功');
        } else if (response.status === 'warning') {
          message.warning(response.message);
        } else if (response.status === 'err') {
          message.error(response.message);
        }
      });
    });
  };

  renderField = field => {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card key={'card_' + field.fField} title={field.fField}>
        <Row>
          <FormItem label="显示名称">
            {getFieldDecorator(field.fField, {
              rules: [{ required: true, message: '请输入字段名称' }],
              initialValue: field.fName,
            })(<Input placeholder="请输入字段名称" />)}
          </FormItem>
          <FormItem label="是否显示">
            {getFieldDecorator(field.fField + '_isShow', {
              valuePropName: 'checked',
              initialValue: field.fIsShow,
            })(<Checkbox />)}
          </FormItem>
        </Row>
      </Card>
    );
  };

  render() {
    const {
      businessConfig: { fields },
    } = this.props;

    return (
      <div className={styles.baseView}>
        <Form layout="inline">
          {fields.map(field => {
            return this.renderField(field);
          })}
          <Button type="primary" className={styles.button_submit} onClick={this.handleSubmit}>
            保存修改
          </Button>
        </Form>
      </div>
    );
  }
}

export default connect(({ global, businessConfig }) => ({
  global,
  businessConfig,
}))(Form.create()(FieldsView));
