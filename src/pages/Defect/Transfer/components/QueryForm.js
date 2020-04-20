import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Icon, Button, Menu, DatePicker, TreeSelect } from 'antd';

import styles from './QueryForm.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ basicData }) => ({
  basicData,
}))
@Form.create()
class QueryForm extends PureComponent {
  state = {
    expandForm: false,
  };

  componentDidMount() {
    const {
      dispatch,
      location: { fBillNo } = {},
      form: { setFieldsValue },
    } = this.props;
    if (fBillNo) {
      setFieldsValue({ fBillNo: fBillNo });
    }
    dispatch({
      type: 'basicData/getAuthorizeProcessTree',
    });
    dispatch({
      type: 'basicData/getStatus',
      payload: { number: 'defectTransferStatus' },
    });
    this.search();
  }

  handleSearch = e => {
    e.preventDefault();
    this.search();
  };

  handleFormReset = () => {
    const { form, handleSubmit } = this.props;
    form.resetFields();

    const pagination = {
      current: 1,
      queryFilters: [],
      detailFilters: [],
    };
    if (handleSubmit) {
      handleSubmit(pagination);
    }
  };

  queryDeptChange = value => {
    setTimeout(() => {
      this.search();
    }, 200);
  };

  search = () => {
    const { form, handleSubmit } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const pagination = this.getSearchParam(fieldsValue);
      if (handleSubmit) {
        handleSubmit(pagination);
      }
    });
  };

  getSearchParam = fieldsValue => {
    // 查询条件处理
    const queryFilters = [];
    const detailFilters = [];
    // 表头查询条件
    if (fieldsValue.fInDeptID)
      queryFilters.push({ name: 'fInDeptID', compare: '=', value: fieldsValue.fInDeptID });
    if (fieldsValue.fOutDeptID)
      queryFilters.push({ name: 'fOutDeptID', compare: '=', value: fieldsValue.fOutDeptID });
    if (fieldsValue.fBillNo)
      queryFilters.push({ name: 'fBillNo', compare: '%*%', value: fieldsValue.fBillNo });
    if (fieldsValue.fCreatorName)
      queryFilters.push({ name: 'fCreatorName', compare: '%*%', value: fieldsValue.fCreatorName });
    if (fieldsValue.fCreatorNumber)
      queryFilters.push({
        name: 'fCreatorNumber',
        compare: '%*%',
        value: fieldsValue.fCreatorNumber,
      });
    // if (fieldsValue.fCreateDate)
    //   queryFilters.push({ name: 'fCreateDate', compare: '%*%', value: fieldsValue.fCreateDate });
    if (fieldsValue.fEditorName)
      queryFilters.push({ name: 'fEditorName', compare: '%*%', value: fieldsValue.fEditorName });
    if (fieldsValue.fEditorNumber)
      queryFilters.push({
        name: 'fEditorNumber',
        compare: '%*%',
        value: fieldsValue.fEditorNumber,
      });
    // if (fieldsValue.fEditDate)
    //   queryFilters.push({ name: 'fEditDate', compare: '%*%', value: fieldsValue.fEditDate });
    if (fieldsValue.fSignerName)
      queryFilters.push({ name: 'fSignerName', compare: '%*%', value: fieldsValue.fSignerName });
    if (fieldsValue.fSignerNumber)
      queryFilters.push({
        name: 'fSignerNumber',
        compare: '%*%',
        value: fieldsValue.fSignerNumber,
      });
    // if (fieldsValue.fSignDate)
    //   queryFilters.push({ name: 'fSignDate', compare: '%*%', value: fieldsValue.fSignDate });

    // 明细列查询条件
    if (fieldsValue.fSoBillNo)
      detailFilters.push({ name: 'fSoBillNo', compare: '%*%', value: fieldsValue.fSoBillNo });
    if (fieldsValue.fMoBillNo)
      detailFilters.push({ name: 'fMoBillNo', compare: '%*%', value: fieldsValue.fMoBillNo });
    if (fieldsValue.fWorkShopName)
      detailFilters.push({
        name: 'fWorkShopName',
        compare: '%*%',
        value: fieldsValue.fWorkShopName,
      });
    if (fieldsValue.fWorkShopNumber)
      detailFilters.push({
        name: 'fWorkShopNumber',
        compare: '%*%',
        value: fieldsValue.fWorkShopNumber,
      });
    if (fieldsValue.fProductName)
      detailFilters.push({ name: 'fProductName', compare: '%*%', value: fieldsValue.fProductName });
    if (fieldsValue.fProductFullName)
      detailFilters.push({
        name: 'fProductFullName',
        compare: '%*%',
        value: fieldsValue.fProductFullName,
      });
    if (fieldsValue.fProductNumber)
      detailFilters.push({
        name: 'fProductNumber',
        compare: '%*%',
        value: fieldsValue.fProductNumber,
      });
    if (fieldsValue.fProductModel)
      detailFilters.push({
        name: 'fProductModel',
        compare: '%*%',
        value: fieldsValue.fProductModel,
      });
    if (fieldsValue.fDefectName)
      detailFilters.push({ name: 'fDefectName', compare: '%*%', value: fieldsValue.fDefectName });
    if (fieldsValue.fDefectNumber)
      detailFilters.push({
        name: 'fDefectNumber',
        compare: '%*%',
        value: fieldsValue.fDefectNumber,
      });

    const pagination = {
      current: 1,
      queryFilters,
      detailFilters,
    };

    return pagination;
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      basicData: {
        authorizeProcessTree,
        status: { defectTransferStatus },
      },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="转入岗位">
              {getFieldDecorator('fInDeptID', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={authorizeProcessTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.queryDeptChange}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="转出岗位">
              {getFieldDecorator('fOutDeptID', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={authorizeProcessTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.queryDeptChange}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('fBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
      basicData: { authorizeProcessTree },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" style={{ marginRight: '30px' }}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="转入岗位">
              {getFieldDecorator('fInDeptID', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={authorizeProcessTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.queryDeptChange}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="转出岗位">
              {getFieldDecorator('fOutDeptID', {
                rules: [{ required: false, message: '请选择岗位' }],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={authorizeProcessTree}
                  treeDefaultExpandAll
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  onChange={this.queryDeptChange}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="单号">
              {getFieldDecorator('fBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建人">
              {getFieldDecorator('fCreatorName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建人编码">
              {getFieldDecorator('fCreatorNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="修改人">
              {getFieldDecorator('fEditorName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="修改人编码">
              {getFieldDecorator('fEditorNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="签收人">
              {getFieldDecorator('fSignerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="签收人编码">
              {getFieldDecorator('fSignerNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="订单号">
              {getFieldDecorator('fSoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="任务单号">
              {getFieldDecorator('fMoBillNo')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车间">
              {getFieldDecorator('fWorkShopName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车间编码">
              {getFieldDecorator('fWorkShopNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('fProductName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品全称">
              {getFieldDecorator('fProductFullName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品编码">
              {getFieldDecorator('fProductNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="规格型号">
              {getFieldDecorator('fProductModel')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="不良类型">
              {getFieldDecorator('fDefectName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="不良编码">
              {getFieldDecorator('fDefectNumber')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const { expandForm } = this.state;
    return (
      <div className={styles.tableListForm}>
        {expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()}
      </div>
    );
  }
}

export default QueryForm;
