import { defaultDateTimeFormat, DecimalModes, ConvertModes } from '@/utils/GlobalConst';
import { Switch } from 'antd';

export const columns = [
  {
    title: '名称',
    dataIndex: 'fName',
    width: 160,
    sorter: true,
  },
  {
    title: '单位',
    dataIndex: 'fInUnitName',
    width: 160,
    sorter: true,
  },
  {
    title: '区分大小写',
    dataIndex: 'fInUnitCaseSensitive',
    width: 160,
    sorter: true,
    render(val, record) {
      return <Switch disabled checked={record.fInUnitCaseSensitive} />;
    },
  },
  {
    title: '副单位',
    dataIndex: 'fOutUnitName',
    width: 160,
    sorter: true,
  },
  {
    title: '保留小数位',
    dataIndex: 'fDecimal',
    width: 160,
    sorter: true,
  },
  {
    title: '计数保留法',
    dataIndex: 'fDecimalMode',
    width: 160,
    sorter: true,
    render: (text, record) => {
      const decimalModel = DecimalModes.find(x => x.fKey === text);
      if (decimalModel) {
        return decimalModel.fName;
      }
      return '';
    },
  },
  {
    title: '转算方式',
    dataIndex: 'fConvertMode',
    width: 160,
    sorter: true,
    render: (text, record) => {
      const convertMode = ConvertModes.find(x => x.fKey === text);
      if (convertMode) {
        return convertMode.fName;
      }
      return '';
    },
  },
  {
    title: '转换率计算公式',
    dataIndex: 'fFormula',
    width: 160,
    sorter: true,
  },
  {
    title: '备注',
    dataIndex: 'fComments',
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
    title: '操作',
    dataIndex: 'operators',
    width: 160,
  },
];
