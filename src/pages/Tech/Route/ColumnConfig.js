import React, { Fragment } from 'react';
import { Switch, Divider, Dropdown, Menu, Icon, Modal } from 'antd';
import Authorized from '@/utils/Authorized';
import { hasAuthority } from '@/utils/authority';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';

const activeData = ['启用', '禁用'];

class ColumnConfig {
  columns = [
    {
      title: '名称',
      dataIndex: 'fName',
      width: 220,
      sorter: true,
      render: (val, record) => <a onClick={() => this.profileModalVisible(record)}>{val}</a>,
    },
    {
      title: '编码',
      dataIndex: 'fNumber',
      width: 220,
      sorter: true,
    },
    {
      title: '是否启用',
      dataIndex: 'fIsActive',
      width: 220,
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
      render: val => <Switch disabled checked={val} />,
    },
    // {
    //   title: '状态',
    //   dataIndex: 'fStatusName',
    //   width: 220,
    //   sorter: true,
    // },
    {
      title: '创建人',
      dataIndex: 'fCreatorName',
      width: 220,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'fCreateDate',
      width: 220,
      sorter: true,
      render: val => defaultDateTimeFormat(val),
    },
    {
      title: '修改人',
      dataIndex: 'fEditorName',
      width: 220,
      sorter: true,
    },
    {
      title: '修改时间',
      dataIndex: 'fEditDate',
      width: 220,
      sorter: true,
      render: val => defaultDateTimeFormat(val),
    },
    {
      title: '备注',
      dataIndex: 'fComments',
      width: 220,
    },
    {
      title: '操作',
      width: 260,
      // fixed: 'right',
      autoFixed: 'right',
      render: (text, record) => (
        <Fragment>
          <Authorized authority="Route_Update">
            <a onClick={() => this.updateModalVisible(record)}>修改</a>
            <Divider type="vertical" />
          </Authorized>
          <Authorized authority="Route_Update">
            <a onClick={() => this.paramModalVisible(record)}>工艺参数</a>
            <Divider type="vertical" />
          </Authorized>
          <Dropdown
            overlay={
              <Menu onClick={({ key }) => this.moreBtnClick(key, record)}>
                <Menu.Item key="active" disabled={!hasAuthority('Route_Active')}>
                  {record.fIsActive ? '禁用' : '启用'}
                </Menu.Item>
                <Menu.Item key="copy" disabled={!hasAuthority('Route_Create')}>
                  复制
                </Menu.Item>
                {/* <Menu.Item key="check" disabled={!hasAuthority('Route_Check')}>
                  {record.fStatusNumber === 'Created' ? '审批' : '反审批'}
                </Menu.Item> */}
                <Menu.Item key="delete" disabled={!hasAuthority('Route_Delete')}>
                  删除
                </Menu.Item>
              </Menu>
            }
          >
            <a>
              更多
              <Icon type="down" />
            </a>
          </Dropdown>
        </Fragment>
      ),
    },
  ];

  // 复制
  copyHandler = record => {};

  profileModalVisible = record => {};

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

  // 启用方法
  ActiveCallback = record => {};

  handleActive = record => {
    this.ActiveCallback(record);
  };

  CheckCallback = record => {};

  handleCheck = record => {
    this.CheckCallback(record);
  };

  ParamCallback = record => {};

  paramModalVisible = record => {
    this.ParamCallback(record);
  };

  moreBtnClick = (key, record) => {
    if (key === 'active') this.handleActive(record);
    if (key === 'copy') this.copyHandler(record);
    if (key === 'check') this.handleCheck(record);
    if (key === 'delete') {
      Modal.confirm({
        title: '删除工艺路线',
        content: '确定删除工艺路线吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => this.delete(record),
      });
    }
  };
}

const columnConfig = new ColumnConfig();
export default columnConfig;
