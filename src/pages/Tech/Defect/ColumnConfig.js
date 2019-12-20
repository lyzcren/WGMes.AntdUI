import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider } from 'antd';
import { GlobalConst } from '@/utils/GlobalConst';
import Authorized from '@/utils/Authorized';

const activeData = ['启用', '禁用'];
const TypeData = GlobalConst.DefectTypeData;

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      width: 260,
      sorter: true,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      width: 160,
      sorter: true,
    },
    {
      title: '岗位',
      dataIndex: 'fDeptNames',
      width: 260,
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
      width: 160,
      filters: [
        {
          text: activeData[0],
          value: 1,
        },
        {
          text: activeData[1],
          value: 0,
        },
      ],
      render(val) {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '类型',
      dataIndex: 'fTypeID',
      width: 360,
      filters: TypeData,
      render(val) {
        const type = TypeData.find((type, index) => type.value == val);
        return type ? type.text : '';
      },
    },
    {
      title: '操作',
      dataIndex: 'operators',
      width: 260,
      fixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Defect_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Defect_Active">
            <a onClick={() => this.handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Defect_Delete">
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.delete(record)}>
              <a>删除</a>
            </Popconfirm>
          </Authorized>
        </Fragment>
      ),
    },
  ];

  // 修改方法
  UpdateModalVisibleCallback = record => {};
  updateModalVisible = record => {
    this.UpdateModalVisibleCallback(record);
  };

  // 删除方法
  DeleteCallback = record => {};
  delete = record => {
    this.DeleteCallback(record);
  };

  // 删除方法
  ActiveCallback = record => {};
  handleActive = record => {
    this.ActiveCallback(record);
  };
}

let columnConfig = new ColumnConfig();
export default columnConfig;
