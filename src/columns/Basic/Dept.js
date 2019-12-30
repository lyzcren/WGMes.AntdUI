import { defaultDateTimeFormat } from '@/utils/GlobalConst';

export const columns = [
  {
    title: '名称',
    dataIndex: 'fName',
    width: 160,
    sorter: true,
  },
  {
    title: '编码',
    dataIndex: 'fNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '英文名称',
    dataIndex: 'fEnName',
    width: 160,
    sorter: true,
  },
  {
    title: '类型',
    dataIndex: 'fTypeName',
    width: 160,
    sorter: true,
  },
  {
    title: '班次',
    dataIndex: 'workTimeList',
    width: 160,
  },
  {
    title: '启用',
    dataIndex: 'fIsActive',
    width: 160,
  },
  {
    title: '创建人',
    dataIndex: 'fCreatorName',
    width: 160,
    sorter: true,
  },
  {
    title: '创建人编码',
    dataIndex: 'fCreatorNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '创建日期',
    dataIndex: 'fCreateDate',
    width: 160,
    sorter: true,
    render: (text, record) => defaultDateTimeFormat(text),
  },
  {
    title: '操作',
    fixed: 'right',
    dataIndex: 'operators',
    width: 180,
  },
];
