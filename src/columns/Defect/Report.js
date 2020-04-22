import { defaultDateTimeFormat } from '@/utils/GlobalConst';
import { Badge } from 'antd';

export const columns = [
  {
    title: '单号',
    dataIndex: 'fBillNo',
    width: 160,
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'fStatusNumber',
    width: 160,
    render: (val, record) => <Badge color={record.fStatusColor} text={record.fStatusName} />,
  },
  {
    title: '岗位名称',
    dataIndex: 'fDeptName',
    width: 160,
    sorter: true,
  },
  {
    title: '岗位编码',
    dataIndex: 'fDeptNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '报废数量',
    dataIndex: 'fReportQty',
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
    title: '修改人',
    dataIndex: 'fEditorName',
    width: 160,
    sorter: true,
  },
  {
    title: '修改人编码',
    dataIndex: 'fEditorNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '修改日期',
    dataIndex: 'fEditDate',
    width: 160,
    sorter: true,
    render: (text, record) => defaultDateTimeFormat(text),
  },
  {
    title: '审核人',
    dataIndex: 'fCheckerName',
    width: 160,
    sorter: true,
  },
  {
    title: '审核人编码',
    dataIndex: 'fCheckerNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '审核日期',
    dataIndex: 'fCheckDate',
    width: 160,
    sorter: true,
    render: (text, record) => defaultDateTimeFormat(text),
  },
  // {
  // 	title: '是否作废',
  // 	dataIndex: 'fCancellation',
  // 	width: 160,
  // 	sorter: true,
  // },
  // {
  // 	title: '作废人',
  // 	dataIndex: 'fCancellationUserName',
  // 	width: 160,
  // 	sorter: true,
  // },
  // {
  // 	title: '作废人编码',
  // 	dataIndex: 'fCancellationUserNumber',
  // 	width: 160,
  // 	sorter: true,
  // },
  // {
  // 	title: '作废日期',
  // 	dataIndex: 'fCancellationDate',
  // 	width: 160,
  // 	sorter: true,
  // 	render: (text, record) => defaultDateTimeFormat(text),
  // },
  {
    title: '操作',
    // autoFixed: 'right',
    dataIndex: 'operators',
    width: 160,
  },
];
