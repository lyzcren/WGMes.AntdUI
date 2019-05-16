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

export async function fakeGetDepts(params) {
  return request('/api/flow/nextDepts', {
    method: 'POST',
    body: {
      ...params,
      method: 'nextDepts',
    },
  });
}

export async function fakeGetRecord(params) {
  return request(`/api/flow/${params.fInterID}/record`);
}

export async function fakeSign(params) {
  return request('/api/flow/sign', {
    method: 'POST',
    body: {
      ...params,
      method: 'sign',
    },
  });
}

export async function fakeReport(params) {
  return request('/api/flow/report', {
    method: 'POST',
    body: {
      ...params,
      method: 'report',
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

export async function fakeUpdate(params) {
  return request('/api/Flow/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
