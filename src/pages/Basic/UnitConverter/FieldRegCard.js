import React, { PureComponent } from 'react';
import {
  Card, Table, Button, Input, Select,
  message,
  Popconfirm,
  Divider,
} from 'antd';
import isEqual from 'lodash/isEqual';
import WgStandardTable from '@/wg_components/WgStandardTable';


const { Option } = Select;

class FieldRegCard extends PureComponent {
  constructor(props) {
    super(props);
    const { data } = props;
    this.state = {
      data,
      loading: false,
    };
    this.index = 0;
    this.cacheOriginData = {};
  }

  raiseChangeEvent (data) {
    const { onChange } = this.props;
    if (onChange) onChange(data);
  }

  handleAdd = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    // const newItem = {
    //   guid: `NEW_TEMP_ID_${this.index}`,
    //   fField: '',
    //   fFieldName: '',
    //   fRegex: '',
    // };
    // newData.push(newItem);
    this.index += 1;
    this.setState({ data: newData });
    this.raiseChangeEvent(newData);
  };

  handleUpdate = record => {
    this.setState({
      loading: true,
    });
    const { data } = this.state;
    let findItem = data.find(x => x.guid === record.guid);
    findItem = { ...findItem, ...record };
    this.setState({ data, loading: false });
    this.raiseChangeEvent(data);
  };

  getRowByKey (guid, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.guid === guid)[0];
  }

  toggleEditable = (e, guid) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[guid] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newItem = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      guid: `NEW_TEMP_ID_${this.index}`,
      fFieldName: '',
      fField: '',
      fRegex: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };

  remove (guid) {
    this.setState({
      loading: true,
    });
    const { data } = this.state;
    const newData = data.filter(x => x.guid != guid);
    this.setState({ data: newData, loading: false });
    this.raiseChangeEvent(newData);
  }

  handleKeyPress (e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange (guid, record) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (target) {
      target.fFieldName = record.title;
      target.fField = record.dataIndex;
      this.setState({ data: newData });
    }
  }

  handleOtherFieldChange (guid, fieldName, value) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (target) {
      target[fieldName] = value;
      this.setState({ data: newData });
    }
  }

  saveRow (e, guid) {
    e.persist();
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(guid) || {};
    if (!target.fFieldName) {
      message.error('请选择字段');
      e.target.focus();
      return;
    }
    if (!target.fRegex) {
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
    this.toggleEditable(e, guid);
  }

  cancel (e, guid) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(guid, newData);
    if (this.cacheOriginData[guid]) {
      Object.assign(target, this.cacheOriginData[guid]);
      delete this.cacheOriginData[guid];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }


  render () {
    const { data, loading } = this.state;
    const { fields } = this.props;
    const columns = [
      {
        title: '列名',
        dataIndex: 'fFieldName',
        key: 'fFieldName',
        width: 120,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Select
                autoFocus
                value={record.fField}
                placeholder="请选择列名"
                onChange={(value) => {
                  const item = fields.find(x => x.dataIndex === value);
                  this.handleFieldChange(record.guid, item);
                }}
                onKeyPress={e => this.handleKeyPress(e, record.guid)}
                style={{ width: '100%' }}
              >
                {fields
                  .map(x => (
                    <Option key={x.dataIndex} value={x.dataIndex}>
                      {x.title}
                    </Option>
                  ))}
              </Select>
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '匹配正则表达式',
        dataIndex: 'fRegex',
        key: 'fRegex',
        width: 250,
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => { this.handleOtherFieldChange(record.guid, 'fRegex', e.target.value) }}
                onKeyPress={e => this.handleKeyPress(e, record.guid)}
                placeholder="请填写正则表达式"
              />
            );
          } else {
            return text;
          }
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
                onChange={e => { this.handleOtherFieldChange(record.guid, 'fRegComments', e.target.value) }}
                onKeyPress={e => this.handleKeyPress(e, record.guid)}
                placeholder="请填写备注"
              />
            );
          } else {
            return text;
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        render: (text, record) => {
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.guid)}>添加</a>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.guid)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.guid)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.guid)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.guid)}>
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
          rowKey="guid"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          // 以下属性与列配置相关
          configKey={'UnitConverter_FieldRegex'}
          showAlert={false}
          selectabel={false}          
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newItem}
          icon={'plus'}
        >
          {'新增'}
        </Button>
      </Card>
    );
  }
}

export default FieldRegCard;