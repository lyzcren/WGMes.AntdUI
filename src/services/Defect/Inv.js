import request from '@/utils/request';
import { stringify } from 'qs';

export async function fakeFetch(params) {
  return request(`/api/defectInv?${stringify(params)}`);
}

export async function fakeQuery(params) {
  return request('/api/DefectInv/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRepair(params) {
  return request('/api/DefectInv/repair', {
    method: 'POST',
    body: {
      ...params,
      method: 'repair',
    },
  });
}

export async function fakeScrap(params) {
  return request('/api/DefectInv/scrap', {
    method: 'POST',
    body: {
      ...params,
      method: 'scrap',
    },
  });
}
