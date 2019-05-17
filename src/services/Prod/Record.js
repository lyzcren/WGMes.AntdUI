import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeGet(params) {
  return request(`/api/Record/${params.fInterID}`);
}

export async function fakeQuery(params) {
  return request('/api/Record/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/Record/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeGetProducingRecord(params) {
  return request('/api/record/producingRecord', {
    method: 'POST',
    body: {
      ...params,
      method: 'producingRecord',
    },
  });
}

export async function fakeTransfer(params) {
  return request('/api/record/transfer', {
    method: 'POST',
    body: {
      ...params,
      method: 'transfer',
    },
  });
}
