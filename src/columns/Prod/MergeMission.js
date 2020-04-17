import { defaultDateTimeFormat } from '@/utils/GlobalConst';

export const columns = [
  {
    title: '单号',
    dataIndex: 'fMoBillNo',
    width: 160,
    sorter: true,
  },
  {
    title: '产品名称',
    dataIndex: 'fProductName',
    width: 160,
    sorter: true,
  },
  {
    title: '产品全称',
    dataIndex: 'fProductFullName',
    width: 160,
    sorter: true,
  },
  {
    title: '产品编码',
    dataIndex: 'fProductNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '规格型号',
    dataIndex: 'fModel',
    width: 160,
    sorter: true,
  },
  {
    title: '数量',
    dataIndex: 'fQty',
    width: 160,
    sorter: true,
  },
  {
    title: '创建人',
    dataIndex: 'fCreatorName',
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
    autoFixed: 'right',
    dataIndex: 'operators',
    width: 180,
  },
];
