import { Card, Col, Form, Row, Select } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ flowTransfer, basicData, loading }) => ({
  flowTransfer,
  basicData,
  loading: loading.models.flowTransfer,
}))
@Form.create()
class ParamsCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  handleParamChange(fParamID, fValues) {
    const { dispatch } = this.props;
    dispatch({
      type: 'flowTransfer/changeParam',
      payload: { fParamID, fValues },
    });
  }

  renderItem = d => {
    const {
      form: { getFieldDecorator },
      flowTransfer: {
        data: { paramList },
      },
    } = this.props;

    if (d.fTypeNumber === 'TagSelect') {
      return this.renderTagSelect(d);
    } else {
      return this.renderSelect(d);
    }
  };

  renderTagSelect = d => {
    const {
      form: { getFieldDecorator },
      flowTransfer: {
        data: { paramList },
      },
    } = this.props;

    return (
      <FormItem key={`paramsID${d.fParamID}`} label={d.fParamName}>
        {getFieldDecorator(`paramsID${d.fParamID}`, {
          rules: [{ required: d.fIsRequired, message: `${d.fParamName}必填` }],
          initialValue: d.fDefaultValue,
        })(
          <Select
            mode={'tags'}
            placeholder="请输入"
            onChange={val => {
              this.handleParamChange(d.fParamID, val);
            }}
          >
            {d.values.map(x => (
              <Option key={x} value={x}>
                {x}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
    );
  };

  renderSelect = d => {
    const {
      form: { getFieldDecorator },
      flowTransfer: {
        data: { paramList },
      },
    } = this.props;

    return (
      <FormItem key={`paramsID${d.fParamID}`} label={d.fParamName}>
        {getFieldDecorator(`paramsID${d.fParamID}`, {
          rules: [{ required: d.fIsRequired, message: `${d.fParamName}必填` }],
          initialValue: d.fDefaultValue,
        })(
          <Select
            showSearch
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="请选择"
            onChange={val => {
              this.handleParamChange(d.fParamID, [val]);
            }}
          >
            {d.values.map(x => (
              <Option key={x} value={x}>
                {x}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>
    );
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
      basicData: { defectData },
      flowTransfer: {
        data: { paramList },
      },
    } = this.props;

    return (
      <Card title="工艺参数" style={{ marginBottom: 24 }} bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            {paramList.map((d, i) => (
              <Col
                key={`paramsCol${i}`}
                xl={i % 3 === 0 ? {} : { span: 6, offset: 2 }}
                lg={i % 3 === 0 ? 6 : { span: 8 }}
                md={12}
                sm={24}
              >
                {this.renderItem(d)}
              </Col>
            ))}
          </Row>
        </Form>
      </Card>
    );
  }
}

export default ParamsCard;
