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
} from 'antd';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import DescriptionList from '@/components/DescriptionList';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

import FieldRegCard from './FieldRegCard';

import { columns as flowFields } from '@/columns/Prod/Flow';
import { DecimalModes, ConvertModes } from '@/utils/GlobalConst';

import { isArray } from 'util';
import styles from './Update.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Header, Footer, Sider, Content } = Layout;
const ButtonGroup = Button.Group;
const { TextArea } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ unitConverterUpdate, basicData, loading, menu }) => ({
  unitConverterUpdate,
  basicData,
  loading: loading.models.unitConverterUpdate,
  loadingInitModel: loading.effects['unitConverterUpdate/initModel'],
  menu,
}))
@Form.create()
class Update extends PureComponent {
  constructor(props) {
    super();
    const {
      location: { id, data, expressions },
    } = props;
    this.state = {
      id,
      data,
      expressions,
    };
  }

  // static getDerivedStateFromProps (nextProps, prevState) {
  //   if (prevState.id !== nextProps.location.id) {
  //     return {
  //       id: nextProps.location.id,
  //       data: nextProps.location.data,
  //     };
  //   }
  //   return null;
  // }

  componentDidMount() {
    const {
      dispatch,
      location: { id, data, expressions },
    } = this.props;
    this.setState({
      id,
      data,
      expressions,
    });
    dispatch({
      type: 'basicData/getUnits',
    });
    dispatch({
      type: 'basicData/getMatchType',
    });
    dispatch({
      type: 'basicData/getProcessDeptTree',
    });
    this._loadAsyncData(id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.id !== nextProps.location.id) {
      const {
        location: { id, data, expressions },
      } = nextProps;
      this.setState({
        id,
        data,
        expressions,
      });
      this._loadAsyncData(id);
    }
  }

  _loadAsyncData(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitConverterUpdate/initModel',
      payload: { id },
    }).then(() => {
      const { data } = this.props.unitConverterUpdate;
      if (!data || Object.keys(data).length <= 0) {
        message.error('记录不存在或已删除');
        this.close();
      }
      this.setState({ data, expressions: data.expressions });
    });
  }

  save() {
    const {
      form,
      dispatch,
      location: { id },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { expressions } = this.state;
      // 过滤不完整的字段匹配规则
      const filterRegFields = expressions.filter(reg => reg.fField && reg.fExpression);
      if (filterRegFields.length <= 0) {
        message.warn('字段匹配列表不能为空.');
        return;
      }
      dispatch({
        type: 'unitConverterUpdate/submit',
        payload: {
          fItemID: id,
          ...fieldsValue,
          expressions: filterRegFields,
        },
      }).then(() => {
        const {
          unitConverterUpdate: { queryResult },
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
        payload: { path: '/basic/unitConverter/update' },
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
    this.setState({ expressions: records });
  };

  render() {
    const {
      loading,
      loadingInitModel,
      form: { getFieldDecorator, getFieldValue },
      basicData: { Units, processDeptTree, matchTypes },
    } = this.props;
    const {
      id,
      expressions,
      data: {
        fName,
        fInUnitID,
        fOutUnitID,
        fConvertMode,
        fDecimal,
        fDecimalMode,
        fFormula,
        fDeptIDs,
        fComments,
      },
    } = this.state;

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
          title={`修改单位转换器`}
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
                    rules: [{ required: true, message: '请输入名称' }],
                    initialValue: fName,
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label="转入单位">
                  {getFieldDecorator('fInUnitID', {
                    rules: [{ required: true, message: '请选择转入单位' }],
                    initialValue: fInUnitID,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      autoClearSearchValue
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Units.map(x => (
                        <Option key={x.fItemID} value={x.fItemID}>
                          {`${x.fName} - ${x.fNumber}`}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label={'转出单位'}>
                  {getFieldDecorator(`fOutUnitID`, {
                    rules: [{ required: true, message: '请输入转出单位' }],
                    initialValue: fOutUnitID,
                  })(
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      autoClearSearchValue
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {Units.map(x => (
                        <Option key={x.fItemID} value={x.fItemID}>
                          {`${x.fName} - ${x.fNumber}`}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col xl={{ span: 6 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label={'适用岗位'}>
                  {getFieldDecorator('fDeptIDs', {
                    rules: [{ required: false, message: '请选择岗位' }],
                    initialValue: fDeptIDs,
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
            loading={loadingInitModel}
            fields={fields}
            matchTypes={matchTypes}
            data={expressions}
            onChange={this.regFieldChange}
          />
          <Card title="转换方式" style={{ marginBottom: 24 }} bordered={false}>
            <Row>
              <Col xl={{ span: 3 }} lg={{ span: 3 }} md={6} sm={24}>
                <FormItem label="换算方式">
                  {getFieldDecorator('fConvertMode', {
                    rules: [{ required: true, message: '请选择换算方式' }],
                    initialValue: fConvertMode,
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
                    initialValue: fDecimal,
                  })(<InputNumber />)}
                </FormItem>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={6} sm={24}>
                <FormItem label="计数保留法">
                  {getFieldDecorator('fDecimalMode', {
                    rules: [{ required: true, message: '请选择计数保留法' }],
                    initialValue: fDecimalMode,
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
                    initialValue: fFormula,
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
                    initialValue: fComments,
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

export default Update;
