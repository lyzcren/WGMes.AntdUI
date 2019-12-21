import request from '@/utils/request';

export async function fakeAnalysis() {
  return request(`/api/chart/analysis`);
}
