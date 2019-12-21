import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Input, Modal, Switch, Select, Tag, message, Table, Button, Card } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

import styles from './columnConfigForm.less';

let dragingIndex = -1;
const FormItem = Form.Item;
const { Option } = Select;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />)
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, connect => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow)
);

/* eslint react/no-multi-comp:0 */
@Form.create()
export class ColumnConfigForm extends PureComponent {
  static defaultProps = {
    handleModalVisible: () => {},
  };

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  handleColumnChange = (val, record) => {
    const { handleColumnChange } = this.props;
    setTimeout(() => {
      handleColumnChange({ ...record, isHidden: val });
    }, 0);
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { handleColumnMove, dataSource } = this.props;
    const dragRow = dataSource[dragIndex];
    const hoverRow = dataSource[hoverIndex];

    setTimeout(() => {
      handleColumnMove(dragRow.dataIndex, hoverRow.dataIndex);
    }, 0);
  };

  render() {
    const {
      form: { getFieldDecorator },
      loading,
      modalVisible,
      dataSource,
      handleModalVisible,
      handleSaveColumns,
    } = this.props;

    const columns = [
      {
        title: '列名',
        dataIndex: 'title',
      },
      {
        title: '显示',
        dataIndex: 'isHidden',
        width: '80px',
        render: (val, record) => {
          return getFieldDecorator('isHidden_' + record.dataIndex, {
            initialValue: !val,
            valuePropName: 'checked',
          })(<Switch onChange={(val, e) => this.handleColumnChange(!val, record)} />);
        },
      },
    ];

    const footer = (
      <div>
        <Button
          loading={false}
          onClick={() => handleModalVisible(false)}
          prefixCls="ant-btn"
          ghost={false}
          block={false}
        >
          关闭
        </Button>
      </div>
    );

    return (
      <Modal
        destroyOnClose
        keyboard={true}
        title={<div>列配置</div>}
        visible={modalVisible}
        footer={footer}
        onCancel={() => handleModalVisible(false)}
        afterClose={() => {
          handleModalVisible();
          handleSaveColumns();
        }}
      >
        <DndProvider backend={HTML5Backend}>
          <Table
            rowKey={'entryID'}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            loading={loading}
            scroll={{ y: 460 }}
            components={this.components}
            onRow={(record, index) => ({
              index,
              moveRow: this.moveRow,
            })}
            bordered
          />
        </DndProvider>
      </Modal>
    );
  }
}
