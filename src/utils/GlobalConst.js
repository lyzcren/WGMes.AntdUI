import { Badge } from 'antd';

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
