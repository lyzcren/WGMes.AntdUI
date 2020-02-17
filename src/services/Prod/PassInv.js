import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/passInv/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeFecthReportInv(params) {
  return request(`/api/passInv/getReportInv?${stringify(params)}`);
}
