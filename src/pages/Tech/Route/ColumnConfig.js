import React, { PureComponent, Fragment } from 'react';
import { Switch, Popconfirm, Divider, Dropdown, Menu, Icon, } from 'antd';
import moment from 'moment';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';

const activeData = ['启用', '禁用',];

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      sorter: true,
      render: (val, record) => {
        return <a onClick={() => this._profileModalVisible(record)}>{val}</a>;
      },
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      sorter: true,
    },
    {
      title: '启用',
      dataIndex: 'fIsActive',
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
      render: (val) => {
        return <Switch disabled checked={val} />;
      },
    },
    {
      title: '状态',
      dataIndex: 'fStatusName',
      sorter: true,
    },
    {
      title: '创建人',
      dataIndex: 'fCreatorName',
      sorter: true,
    },
    {
      title: '创建日期',
      dataIndex: 'fCreateDate',
      sorter: true,
      render: (val) => {
        return moment(val).format('YYYY-MM-DD');
      },
    },
    {
      title: '备注',
      dataIndex: 'fComments',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          {/* <Authorized authority="Route_Update">
            <a onClick={() => this._profileModalVisible(record)}>详情</a>
            <Divider type="vertical" />
          </Authorized> */}
          <Authorized authority="Route_Update">
            <a onClick={() => this._updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          {/* <Authorized authority="Route_Delete">
            <Popconfirm title="是否要删除此行？" onConfirm={() => this._delete(record)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
          </Authorized> */}
          {/* <Authorized authority="Route_Active">
            <a onClick={() => this._handleActive(record)}>{record.fIsActive ? '禁用' : '启用'}</a>
          </Authorized> */}
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => this._moreBtnClick(key, record)}>
                <Menu.Item key="active" disabled={!hasAuthority('Route_Active')}>{record.fIsActive ? '禁用' : '启用'}</Menu.Item>
                <Menu.Item key="check" disabled={!hasAuthority('Route_Check')}>{record.fStatusNumber === "Created" ? '审批' : '反审批'}</Menu.Item>
                <Menu.Item key="delete" disabled={!hasAuthority('Route_Delete')}>删除</Menu.Item>
              </Menu>
            }
          >
            <a>
              更多<Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  // 路线方法
  ProfileModalVisibleCallback = (record) => { };
  _profileModalVisible = (record) => {
    this.ProfileModalVisibleCallback(record);
  };

  // 修改方法
  UpdateModalVisibleCallback = (record) => { };
  _updateModalVisible = (record) => {
    this.UpdateModalVisibleCallback(record);
  };

  // 删除方法
  DeleteCallback = (record) => { };
  _delete = (record) => {
    this.DeleteCallback(record);
  };

  // 启用方法
  ActiveCallback = (record) => { };
  _handleActive = (record) => {
    this.ActiveCallback(record);
  };

  CheckCallback = (record) => { };
  _handleCheck = (record) => {
    this.CheckCallback(record);
  };

  _moreBtnClick = (key, record) => {
    if (key === 'active') this._handleActive(record);
    if (key === 'check') this._handleCheck(record);
    else if (key === 'delete') {
      Modal.confirm({
        title: '删除工艺路线',
        content: '确定删除工艺路线吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this._delete(record),
      });
    }
  };

}

let columnConfig = new ColumnConfig();
export default columnConfig;