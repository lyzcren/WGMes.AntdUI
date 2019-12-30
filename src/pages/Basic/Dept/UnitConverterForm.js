import React, { PureComponent } from 'react';
import { Form, Modal, Switch, Table, Button, Select } from 'antd';
import WgDragableView from '@/wg_components/WgDragableView';
import { connect } from 'dva';

const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@Form.create()
class UnitConverterForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  currentIndex = 1;

  handleColumnChange = (val, record) => {
    const { handleColumnChange } = this.props;
    setTimeout(() => {
      handleColumnChange({ ...record, isHidden: val });
    }, 0);
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { onChange, data } = this.props;
    const dragRow = data[dragIndex];
    const hoverRow = data[hoverIndex];
    const newData = [...data];
    newData.splice(dragIndex, 1);
    newData.splice(hoverIndex, 0, dragRow);

    setTimeout(() => {
      if (onChange) onChange(newData);
    }, 0);
  };

  handleItemChange = (value, record) => {
    const { onChange, data } = this.props;
    const newData = [...data];
    const findItem = newData.find(x => x.guid === record.guid);
    if (findItem) {
      findItem.fItemID = value;
    }

    if (onChange) onChange(newData);
  };

  newItem = () => {
    const { onChange, data } = this.props;
    const newData = [...data, { guid: this.currentIndex }];
    this.currentIndex = this.currentIndex + 1;

    if (onChange) onChange(newData);
  };

  remove = guid => {
    const { onChange, data } = this.props;
    const newData = [...data].filter(x => x.guid != guid);

    if (onChange) onChange(newData);
  };

  okHandle = () => {
    const { onSubmit } = this.props;
    if (onSubmit) onSubmit();
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      modalVisible,
      values,
      data,
      handleModalVisible,
      unitConverters,
    } = this.props;

    const columns = [
      {
        title: '单位转换器',
        dataIndex: 'fItemID',
        render: (val, record) => {
          return (
            <Select
              style={{ width: 300 }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              defaultValue={val}
              onChange={value => this.handleItemChange(value, record)}
            >
              {unitConverters &&
                unitConverters.map(unitConverter => (
                  <Option key={unitConverter.fItemID} value={unitConverter.fItemID}>
                    {unitConverter.fName}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operators',
        render: (text, record) => {
          return (
            <span>
              <a onClick={e => this.remove(record.guid)}>删除</a>
            </span>
          );
        },
      },
    ];

    return (
      <Modal
        destroyOnClose
        keyboard
        title={<div>单位转换</div>}
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible(false, values)}
        afterClose={() => {
          handleModalVisible();
        }}
      >
        <WgDragableView>
          <Table
            rowKey="guid"
            columns={columns}
            dataSource={data}
            pagination={false}
            loading={loading}
            scroll={{ y: 460 }}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
            })}
            bordered
          />
        </WgDragableView>
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newItem}
          icon={'plus'}
        >
          {'新增'}
        </Button>
      </Modal>
    );
  }
}

export default UnitConverterForm;
