import { Tag } from 'antd';
import { defaultDateTimeFormat } from '@/utils/GlobalConst';

export const columns = [
  {
    title: '批号',
    dataIndex: 'fFullBatchNo',
    width: 220,
    sorter: true,
  },
  {
    title: '良品数量',
    dataIndex: 'fCurrentPassQty',
    width: 120,
    sorter: true,
  },
  {
    title: '投入数量',
    dataIndex: 'fInputQty',
    width: 120,
    sorter: true,
  },
  {
    title: '良品率',
    dataIndex: 'fCurrentPassRate',
    width: 120,
  },
  {
    title: '当前岗位',
    dataIndex: 'fRecordDeptName',
    width: 150,
    render: (val, record) => {
      if (record.fIsReproduce) {
        return `${val}（重做）`;
      } 
        return val;
      
    },
  },
  {
    title: '当前岗位状态',
    dataIndex: 'fRecordStatusNumber',
    width: 150,
  },
  {
    title: '下道岗位',
    dataIndex: 'fNextRecords',
    width: 150,
    render: (val, record) => record.fNextRecords.map(rcd => rcd.fDeptName).join(', '),
  },
  {
    title: '流程单状态',
    dataIndex: 'fStatusNumber',
    width: 150,
  },
  {
    title: '在制岗位',
    dataIndex: 'fCurrentDeptName',
    width: 150,
  },
  {
    title: '任务单号',
    dataIndex: 'fMoBillNo',
    width: 200,
    sorter: true,
  },
  {
    title: '总投入数量',
    dataIndex: 'fTotalInputQty',
    width: 130,
    sorter: true,
  },
  {
    title: '订单号',
    dataIndex: 'fSoBillNo',
    width: 150,
  },
  {
    title: '产品名称',
    dataIndex: 'fProductName',
    width: 150,
  },
  {
    title: '产品全称',
    dataIndex: 'fProductFullName',
    width: 350,
  },
  {
    title: '产品编码',
    dataIndex: 'fProductNumber',
    sorter: true,
    width: 150,
  },
  {
    title: '规格型号',
    dataIndex: 'fProductModel',
    width: 220,
  },
  {
    title: '工艺路线',
    dataIndex: 'fRouteName',
    width: 150,
  },
  {
    title: '工艺路线编码',
    dataIndex: 'fRouteNumber',
    width: 150,
  },
  {
    title: '产品分类',
    dataIndex: 'fErpClsName',
    sorter: true,
    width: 150,
  },

  {
    title: '自动签收',
    dataIndex: 'fAutoSign',
    sorter: true,
    width: 90,
    render: (val, record) => val ? <Tag color="green">是</Tag> : <Tag>否</Tag>,
  },
  {
    title: '签收人',
    dataIndex: 'fSignUserName',
    sorter: true,
    width: 150,
    render: (text, record) => record.fSignDate && !record.fSignUserName ? '自动签收' : record.fSignUserName,
  },
  {
    title: '签收日期',
    dataIndex: 'fSignDate',
    sorter: true,
    width: 180,
    render: (text, record) => defaultDateTimeFormat(text),
  },
  {
    title: '开工日期',
    dataIndex: 'fBeginDate',
    sorter: true,
    width: 180,
    render: (text, record) => defaultDateTimeFormat(text),
  },
  {
    title: '机台名称',
    dataIndex: 'fMachineName',
    sorter: true,
    width: 150,
  },
  {
    title: '机台编码',
    dataIndex: 'fMachineNumber',
    sorter: true,
    width: 150,
  },
  {
    title: '操作员',
    dataIndex: 'fOperatorName',
    sorter: true,
    width: 150,
  },
  {
    title: '操作员编码',
    dataIndex: 'fOperatorNumber',
    sorter: true,
    width: 150,
  },
  {
    title: '调机员',
    dataIndex: 'fDebuggerName',
    sorter: true,
    width: 150,
  },
  {
    title: '调机员编码',
    dataIndex: 'fDebuggerNumber',
    sorter: true,
    width: 150,
  },

  {
    title: '优先级',
    dataIndex: 'fPriority',
    sorter: true,
    width: 120,
  },
  {
    title: '车间',
    dataIndex: 'fWorkShopName',
    sorter: true,
    width: 120,
  },
  {
    title: '车间编码',
    dataIndex: 'fWorkShopNumber',
    sorter: true,
    width: 120,
  },
  {
    title: '汇报单',
    dataIndex: 'fMoRptBillNo',
    sorter: true,
    width: 120,
  },
  {
    title: '底色编号',
    dataIndex: 'fMesSelf001',
    sorter: true,
    width: 120,
  },
  {
    title: '父件型号',
    dataIndex: 'fMesSelf002',
    sorter: true,
    width: 120,
  },
  {
    title: '内部订单号',
    dataIndex: 'fMesSelf003',
    sorter: true,
    width: 140,
  },
  {
    title: '自定义字段4',
    dataIndex: 'fMesSelf004',
    sorter: true,
    isHidden: true,
    width: 140,
  },
  {
    title: '自定义字段5',
    dataIndex: 'fMesSelf005',
    sorter: true,
    isHidden: true,
    width: 140,
  },
  {
    title: '自定义字段6',
    dataIndex: 'fMesSelf006',
    sorter: true,
    isHidden: true,
    width: 140,
  },
  {
    title: '自定义字段7',
    dataIndex: 'fMesSelf007',
    sorter: true,
    isHidden: true,
    width: 140,
  },
  {
    title: '自定义字段8',
    dataIndex: 'fMesSelf008',
    sorter: true,
    isHidden: true,
    width: 140,
  },
  {
    title: '自定义字段9',
    dataIndex: 'fMesSelf009',
    sorter: true,
    isHidden: true,
    width: 140,
  },
  {
    title: '自定义字段10',
    dataIndex: 'fMesSelf010',
    sorter: true,
    isHidden: true,
    width: 140,
  },
  {
    title: '操作',
    dataIndex: 'operators',
    fixed: 'right',
    width: 250,
  },
];
