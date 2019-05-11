import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/Flow/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeSign(params) {
  return request('/api/Flow/sign', {
    method: 'POST',
    body: {
      ...params,
      method: 'sign',
    },
  });
}

export async function fakeAddFromMission(params) {
  return request('/api/Flow/FromMission', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeCurrentRecord(params) {
  return request('/api/Flow/currentRecord', {
    method: 'POST',
    body: {
      ...params,
      method: 'currentRecord',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/Flow/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
