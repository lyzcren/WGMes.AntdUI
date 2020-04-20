import DescriptionList from '@/components/DescriptionList';
import WgPageHeaderWrapper from '@/wg_components/WgPageHeaderWrapper';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Table,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import numeral from 'numeral';
import React, { Fragment, PureComponent } from 'react';

import styles from './DetailCard.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { Header, Footer, Sider, Content } = Layout;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

@Form.create()
class DetailCard extends PureComponent {
  getColumns = () => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '不良类型',
        dataIndex: 'fDefectName',
      },
      {
        title: '不良编码',
        dataIndex: 'fDefectNumber',
      },
      {
        title: '库存数量',
        dataIndex: 'fCurrentQty',
      },
      {
        title: '转移数量',
        dataIndex: 'fQty',
        render: (val, record) => (
          <FormItem style={{ marginBottom: 0 }}>
            {getFieldDecorator(`fQty_${record.fEntryID}`, {
              rules: [{ required: true, message: '请输入转移数量' }],
              initialValue: record.fQty,
            })(
              <InputNumber
                max={record.fCurrentQty}
                min={0}
                onChange={value => {
                  this.handleDetailRowChange(record, 'fQty', value);
                }}
              />
            )}
          </FormItem>
        ),
      },
      {
        title: '单位',
        dataIndex: 'fUnitName',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleDeleteRow(record)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return columns;
  };

  handleDetailRowChange({ fEntryID }, field, value) {
    const { dispatch, dataSource, onChange } = this.props;
    const findItem = dataSource.find(x => x.fEntryID === fEntryID);
    findItem[field] = value;

    if (onChange) onChange(dataSource);
  }

  handleDeleteRow(record) {
    const { dispatch, dataSource, onChange } = this.props;
    const newDetails = dataSource.filter(x => x.fEntryID !== record.fEntryID);

    if (onChange) onChange(newDetails);
  }

  handleAdd() {
    const { onAdd } = this.props;
    if (onAdd) onAdd();
  }

  render = () => {
    const { loading, dataSource } = this.props;
    const sum = dataSource.reduce((acc, cur) => acc.add(cur.fQty), numeral());

    return (
      <Card title="明细信息" bordered={false}>
        <Table
          rowKey="fEntryID"
          bordered
          loading={loading}
          columns={this.getColumns()}
          dataSource={dataSource}
          footer={() => `总数量：${sum ? sum.value() : 0}`}
          pagination={false}
        />
        <Button
          className={styles.addButton}
          type="dashed"
          onClick={() => this.handleAdd()}
          icon="plus"
        >
          {'新增'}
        </Button>
      </Card>
    );
  };
}

export default DetailCard;
