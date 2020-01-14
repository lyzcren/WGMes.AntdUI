import React, { PureComponent } from 'react';
import { Card, Table, Button, Input, Select, message, Popconfirm, Divider } from 'antd';
import isEqual from 'lodash/isEqual';
import WgStandardTable from '@/wg_components/WgStandardTable';

const { Option } = Select;

class FieldRegCard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
    this.index = 0;
    this.cacheOriginData = {};
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEqual(nextProps.data, prevState.data) || !isEqual(nextProps.fields, prevState.fields)) {
      return {
        data: nextProps.data || [],
        fields: nextProps.fields,
      };
    }
    return null;
  }

  raiseChangeEvent(data) {
    const { onChange } = this.props;
    if (onChange) onChange(data);
  }

  handleAdd = () => {
    const { data } = this.props;
    const newData = data.map(item => ({ ...item }));
    this.index += 1;
    this.raiseChangeEvent(newData);
  };

  handleUpdate = record => {
    this.setState({
      loading: true,
    });
    const { data } = this.props;
    let findItem = data.find(x => x.fEntryID === record.fEntryID);
    findItem = { ...findItem, ...record };
    this.setState({ loading: false });
    this.raiseChangeEvent(data);
  };

  getRowByKey(fEntryID, newData) {
    const { data } = this.props;
    return (newData || data).filter(item => item.fEntryID === fEntryID)[0];
  }

  toggleEditable = (e, fEntryID) => {
    e.preventDefault();
    const { data } = this.props;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[fEntryID] = { ...target };
      }
      target.editable = !target.editable;
      this.raiseChangeEvent(newData);
    }
  };

  newItem = () => {
    const { data } = this.props;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      fEntryID: this.index,
      fField: '',
      fExpression: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.raiseChangeEvent(newData);
  };

  remove(fEntryID) {
    this.setState({
      loading: true,
    });
    const { data } = this.props;
    const newData = data.filter(x => x.fEntryID != fEntryID);
    this.setState({ loading: false });
    this.raiseChangeEvent(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(fEntryID, record) {
    const { data } = this.props;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      target.fField = record.dataIndex;
      this.raiseChangeEvent(newData);
    }
  }

  handleOtherFieldChange(fEntryID, fieldName, value) {
    const { data } = this.props;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (target) {
      target[fieldName] = value;
      this.raiseChangeEvent(newData);
    }
  }

  saveRow(e, fEntryID) {
    e.persist();
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(fEntryID) || {};
    if (!target.fField) {
      message.error('请选择字段');
      e.target.focus();
      return;
    }
    if (!target.fExpression) {
      message.error('请填写正则表达式');
      e.target.focus();
      return;
    }
    if (target.isNew) {
      this.handleAdd(target);
    } else {
      this.handleUpdate(target);
    }
    delete target.isNew;
    this.toggleEditable(e, fEntryID);
  }

  cancel(e, fEntryID) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.props;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(fEntryID, newData);
    if (this.cacheOriginData[fEntryID]) {
      Object.assign(target, this.cacheOriginData[fEntryID]);
      delete this.cacheOriginData[fEntryID];
    }
    target.editable = false;
    this.raiseChangeEvent(newData);
    this.clickedCancel = false;
  }

  render() {
    const { loading } = this.state;
    const { data, fields, matchTypes } = this.props;
    const columns = [
      {
        title: '列名',
        dataIndex: 'fFieldName',
        key: 'fFieldName',
        width: 250,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                autoFocus
                value={record.fField}
                placeholder="请选择列名"
                onChange={value => {
                  const item = fields.find(x => x.dataIndex === value);
                  this.handleFieldChange(record.fEntryID, item);
                }}
                onKeyPress={e => this.handleKeyPress(e, record.fEntryID)}
                style={{ width: '100%' }}
              >
                {fields.map(x => (
                  <Option key={x.dataIndex} value={x.dataIndex}>
                    {x.title}
                  </Option>
                ))}
              </Select>
            );
          }
          const findItem = fields.find(x => x.dataIndex === record.fField);
          return findItem ? findItem.title : '';
        },
      },
      {
        title: '匹配方式',
        dataIndex: 'fMatchType',
        key: 'fMatchType',
        width: 120,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                autoFocus
                value={record.fMatchType}
                placeholder="请选择匹配方式"
                onChange={value => {
                  this.handleOtherFieldChange(record.fEntryID, 'fMatchType', value);
                }}
                onKeyPress={e => this.handleKeyPress(e, record.fEntryID)}
                style={{ width: '100%' }}
              >
                {matchTypes.map(x => (
                  <Option key={x.fKey} value={x.fKey}>
                    {x.fValue}
                  </Option>
                ))}
              </Select>
            );
          }
          const findItem = matchTypes.find(x => x.fKey === record.fMatchType);
          return findItem ? findItem.fValue : '';
        },
      },
      {
        title: '匹配内容/正则表达式',
        dataIndex: 'fExpression',
        key: 'fExpression',
        width: 250,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => {
                  this.handleOtherFieldChange(record.fEntryID, 'fExpression', e.target.value);
                }}
                onKeyPress={e => this.handleKeyPress(e, record.fEntryID)}
                placeholder="请填写匹配内容/正则表达式"
              />
            );
          }
          return text;
        },
      },
      {
        title: '备注',
        dataIndex: 'fRegComments',
        key: 'fRegComments',
        width: 120,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => {
                  this.handleOtherFieldChange(record.fEntryID, 'fRegComments', e.target.value);
                }}
                onKeyPress={e => this.handleKeyPress(e, record.fEntryID)}
                placeholder="请填写备注"
              />
            );
          }
          return text;
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (text, record) => {
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.fEntryID)}>添加</a>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.fEntryID)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.fEntryID)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.fEntryID)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.fEntryID)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
        },
      },
    ];

    return (
      <Card title="字段匹配" style={{ marginBottom: 24 }} bordered={false}>
        <WgStandardTable
          rowKey="fEntryID"
          loading={loading || this.props.loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          // 以下属性与列配置相关
          configKey="UnitConverter_FieldRegex"
          showAlert={false}
          selectabel={false}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newItem}
          icon="plus"
        >
          {'新增'}
        </Button>
      </Card>
    );
  }
}

export default FieldRegCard;
