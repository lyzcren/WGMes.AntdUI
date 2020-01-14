import { Badge } from 'antd';
import moment from 'moment';

export const defaultDateTimeFormat = datetime => {
  if (!datetime || !moment(datetime).isValid()) return '';
  return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
};

export const GlobalConst = {
  passwordProgressMap: {
    ok: 'success',
    pass: 'normal',
    poor: 'exception',
  },
  DefectTypeData: [
    {
      text: '外观',
      value: 0,
    },
    {
      text: '功能',
      value: 1,
    },
  ],
  PlanStatusData: [
    {
      text: '计划',
      value: 0,
    },
    {
      text: '下达',
      value: 1,
    },
    {
      text: '结案',
      value: 3,
    },
    {
      text: '确认',
      value: 5,
    },
  ],
  FlowStatusArray: [
    {
      text: '待生产',
      value: 0,
      number: 'BeforeProduce',
      badgeStatus: 'default',
    },
    {
      text: '生产中',
      value: 1,
      number: 'Producing',
      badgeStatus: 'processing',
    },
    {
      text: '待汇报',
      value: 2,
      number: 'EndProduce',
      badgeStatus: 'success',
    },
    {
      text: '已汇报',
      value: 3,
      number: 'Reported',
      badgeStatus: 'success',
    },
    {
      text: '无产出',
      value: 4,
      number: 'NonProduced',
      badgeStatus: 'error',
    },
  ],
  ManufStatusArray: [
    {
      text: '可签收',
      value: 1,
      number: 'ManufWait4Sign',
      badgeStatus: 'default',
    },
    {
      text: '生产中',
      value: 2,
      number: 'ManufProducing',
      badgeStatus: 'processing',
    },
    {
      text: '完成',
      value: 3,
      number: 'ManufEndProduce',
      badgeStatus: 'success',
    },
    {
      text: '错误',
      value: 4,
      number: 'ManufNonProduced',
      badgeStatus: 'error',
    },
  ],
};

export const badgeStatusList = statusArray =>
  statusArray.map(x => ({
    text: <Badge status={x.badgeStatus} text={x.text} />,
    value: x.number,
  }));

export const DecimalModes = [
  { fKey: 'round', fName: '四舍五入' },
  { fKey: 'floor', fName: '向下舍入' },
  { fKey: 'ceil', fName: '向上舍入' },
  { fKey: 'round2', fName: '四舍六入五成双' },
];

export const ConvertModes = [{ fKey: 'multi', fName: '乘' }, { fKey: 'div', fName: '除' }];

export const pageMapper = { mission: '生产任务单', flow: '流程单', quickOps: '快速操作' };
