import { defaultDateTime, defaultDateTimeFormat } from '@/utils/GlobalConst';
import { Badge } from 'antd';

export const columns = [
  {
    title: '单号',
    dataIndex: 'fBillNo',
    width: 160,
    sorter: true,
  },
  {
    title: '日期',
    dataIndex: 'fDate',
    width: 160,
    sorter: true,
    render: (text, record) => defaultDateTime(text),
  },
  {
    title: '转出岗位',
    dataIndex: 'fOutDeptName',
    width: 160,
    sorter: true,
  },
  {
    title: '转出岗位编码',
    dataIndex: 'fOutDeptNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '转入岗位',
    dataIndex: 'fInDeptName',
    width: 160,
    sorter: true,
  },
  {
    title: '转入岗位编码',
    dataIndex: 'fInDeptNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '状态',
    dataIndex: 'fStatusNumber',
    width: 160,
    sorter: true,
    render: (val, record) => <Badge color={record.fStatusColor} text={record.fStatusName} />,
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
    width: 220,
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
    width: 220,
    sorter: true,
    render: (text, record) => defaultDateTimeFormat(text),
  },
  {
    title: '签收人',
    dataIndex: 'fSignerName',
    width: 160,
    sorter: true,
  },
  {
    title: '签收人编码',
    dataIndex: 'fSignerNumber',
    width: 160,
    sorter: true,
  },
  {
    title: '签收日期',
    dataIndex: 'fSignDate',
    width: 220,
    sorter: true,
    render: (text, record) => defaultDateTimeFormat(text),
  },
  {
    title: '备注',
    dataIndex: 'fComments',
    width: 160,
    sorter: true,
  },
  {
    title: '操作',
    // autoFixed: 'right',
    dataIndex: 'operators',
    width: 180,
  },
];
