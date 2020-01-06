import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import numeral from 'numeral';
import QRCode from 'qrcode.react';
import { connect } from 'dva';
import {
  Layout,
  Table,
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  InputNumber,
  DatePicker,
  Modal,
  Radio,
  message,
  TreeSelect,
  Switch,
} from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

import FieldRegCard from './FieldRegCard';

import { columns as flowFields } from '@/columns/Prod/Flow';
import { DecimalModes, ConvertModes } from '@/utils/GlobalConst';

import { isArray } from 'util';
import styles from './Create.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const ButtonGroup = Button.Group;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ unitConverterCreate, basicData, loading, menu, user }) => ({
  unitConverterCreate,
  basicData,
  loading: loading.models.unitConverterCreate,
  menu,
  fBindEmpID: user.currentUser.fBindEmpID,
}))
@Form.create()
class Create extends PureComponent {
  state = {
    regFields: [],
  };

  constructor(props) {
    super();

    const { dispatch } = props;
    dispatch({
      type: 'basicData/getUnits',
    });
    dispatch({
      type: 'basicData/getMatchType',
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
  }

  save() {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { regFields } = this.state;
      // 过滤不完整的字段匹配规则
      const filterRegFields = regFields.filter(reg => reg.fField && reg.fExpression);
      if (filterRegFields.length <= 0) {
        message.warn('字段匹配列表不能为空.');
        return;
      }
      dispatch({
        type: 'unitConverterCreate/add',
        payload: {
          ...fieldsValue,
          expressions: filterRegFields,
        },
      }).then(() => {
        const {
          unitConverterCreate: { queryResult },
          location: { successCallback },
        } = this.props;
        if (queryResult.status === 'ok') {
          message.success('保存成功');
          if (successCallback) successCallback();
          this.close();
        } else {
          message.warning(queryResult.message);
        }
      });
    });
  }

  close = () => {
    const {
      dispatch,
      location: { tabMode },
    } = this.props;
    if (tabMode) {
      dispatch({
        type: 'menu/closeMenu',
        payload: { path: '/basic/unitConverter/create' },
      });
    } else {
      router.goBack();
    }
  };

  confirmClose() {
    Modal.confirm({
      title: '取消当前操作',
      content: '关闭且不保存当前操作？',
      okText: '确认',
      cancelText: '取消',
      onOk: this.close,
    });
  }

  regFieldChange = records => {
    // records.forEach(record => {
    //   const regex = new RegExp(record.fExpression);
    // });
    this.setState({ regFields: records });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      basicData: { Units, processDeptTree, matchTypes },
    } = this.props;
    const { regFields } = this.state;

    const fields = flowFields.filter(
      x =>
        x.dataIndex.indexOf('Qty') < 0 &&
        x.dataIndex.indexOf('Dept') < 0 &&
        x.dataIndex.indexOf('Rate') < 0 &&
        x.dataIndex.indexOf('Status') < 0 &&
        x.dataIndex !== 'operators'
    );

    const action = (
      <Fragment>
        <ButtonGroup>
          <Button type="primary" loading={loading} onClickCapture={() => this.save()}>
            保存
          </Button>
        </ButtonGroup>
        <Button onClick={() => this.confirmClose()}>{'取消'}</Button>
      </Fragment>
    );

    return (
      <div style={{ backgroundColor: 'rgb(240, 242, 245)' }}>
        <WgPageHeaderWrapper
          title={`新增单位转换`}
          logo={
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
          }
          action={action}
          wrapperClassName={styles.advancedForm}
          loading={loading}
        >
          <Card title="基本信息" style={{ marginBottom: 24 }} bordered={false}>
            <Row>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label={'名称'}>
                  {getFieldDecorator(`fName`, {
                    rules: [
                      { required: true, message: '请输入名称' },
                      // 正则匹配（提示错误，阻止表单提交）
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label="单位">
                  {getFieldDecorator(`fInUnitName`, {
                    rules: [
                      { required: true, message: '请输入单位' },
                      // 正则匹配（提示错误，阻止表单提交）
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label="单位是否区分大小写">
                  {getFieldDecorator(`fInUnitCaseSensitive`, {
                    rules: [
                      { required: true, message: '请输入单位' },
                      // 正则匹配（提示错误，阻止表单提交）
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                    valuePropName: 'checked',
                    initialValue: true,
                  })(<Switch />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label={'副单位'}>
                  {getFieldDecorator(`fOutUnitName`, {
                    rules: [
                      { required: true, message: '请输入副单位' },
                      // 正则匹配（提示错误，阻止表单提交）
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label={'适用岗位'}>
                  {getFieldDecorator('fDeptIDs', {
                    rules: [{ required: false, message: '请选择岗位' }],
                  })(
                    <TreeSelect
                      style={{ width: '100%' }}
                      multiple={true}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={processDeptTree}
                      treeDefaultExpandAll={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <FieldRegCard
            fields={fields}
            matchTypes={matchTypes}
            data={regFields}
            onChange={this.regFieldChange}
          />
          <Card title="转换方式" style={{ marginBottom: 24 }} bordered={false}>
            <Row>
              <Col xl={{ span: 3 }} lg={{ span: 3 }} md={6} sm={24}>
                <FormItem label="换算方式">
                  {getFieldDecorator('fConvertMode', {
                    rules: [{ required: true, message: '请选择换算方式' }],
                    initialValue: 'multi',
                  })(
                    <Radio.Group onChange={e => console.log(e.target.value)}>
                      {ConvertModes.map(x => (
                        <Radio.Button key={x.fKey} value={x.fKey}>
                          {x.fName}
                        </Radio.Button>
                      ))}
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col xl={{ span: 3 }} lg={{ span: 3 }} md={6} sm={24}>
                <FormItem label="保留小数位">
                  {getFieldDecorator('fDecimal', {
                    rules: [{ required: true, message: '请填写保留小数位' }],
                  })(<InputNumber />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label="计数保留法">
                  {getFieldDecorator('fDecimalMode', {
                    rules: [{ required: true, message: '请选择计数保留法' }],
                    initialValue: 'round',
                  })(
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      autoClearSearchValue
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {DecimalModes.map(x => (
                        <Option key={x.fKey} value={x.fKey}>
                          {`${x.fName}`}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label="转换率计算公式">
                  {getFieldDecorator('fFormula', {
                    rules: [{ required: true, message: '请填写转换率计算公式' }],
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title="备注">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  {getFieldDecorator('fComments', {
                    initialValue: '',
                  })(<TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />)}
                </Col>
              </Row>
            </Form>
          </Card>
          <Card>
            <Col className={styles.bottomOps}>
              <Button type="primary" loading={loading} onClickCapture={() => this.save()}>
                {'保存'}{' '}
              </Button>
              <Button onClick={() => this.confirmClose()}>{'取消'}</Button>
            </Col>
          </Card>
        </WgPageHeaderWrapper>
      </div>
    );
  }
}

export default Create;
