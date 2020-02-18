import { defaultDateTimeFormat } from '@/utils/GlobalConst';

export const columns = [
  {
    title: '单号',
    dataIndex: 'fBillNo',
    width: 150,
    sorter: true,
  },
  {
    title: '岗位',
    dataIndex: 'fDeptName',
    width: 150,
    sorter: true,
  },
  {
    title: '岗位编码',
    dataIndex: 'fDeptNumber',
    width: 150,
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'fStatusName',
    width: 80,
    sorter: true,
  },
  {
    title: 'ERP汇报单号',
    dataIndex: 'fMoRptBillNo',
    width: 150,
    sorter: true,
  },
  {
    title: '创建人',
    dataIndex: 'fCreatorName',
    width: 120,
    sorter: true,
  },
  {
    title: '创建时间',
    dataIndex: 'fCreateDate',
    width: 150,
    sorter: true,
    render: val => defaultDateTimeFormat(val),
  },
  {
    title: '审核人',
    dataIndex: 'fCheckerName',
    width: 120,
    sorter: true,
  },
  {
    title: '审核时间',
    dataIndex: 'fCheckDate',
    width: 150,
    sorter: true,
    render: val => defaultDateTimeFormat(val),
  },
  {
    title: '备注',
    dataIndex: 'fComments',
    width: 150,
  },
  {
    title: '操作',
    dataIndex: 'operators',
    width: 240,
  },
];
