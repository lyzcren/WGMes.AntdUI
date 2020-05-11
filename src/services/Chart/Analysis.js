import request from '@/utils/request';
import { stringify } from 'qs';

export async function fakeAnalysis(params) {
  return request(`/api/chart/analysis?${stringify(params)}`);
}

export async function fakeChartData(params) {
  return request(`/api/chart/chart_data?${stringify(params)}`);
}
