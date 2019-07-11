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

export async function fakeGet(params) {
  return request(`/api/Flow?${stringify(params)}`);
}

export async function fakeGetDepts(params) {
  return request(`/api/flow/${params.fInterID}/nextDepts`);
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

export async function fakeSign4Reject(params) {
  return request('/api/record/sign4Reject', {
    method: 'POST',
    body: {
      ...params,
      method: 'sign4Reject',
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
  return request('/api/flow/fromMission', {
    method: 'POST',
    body: {
      ...params,
      method: 'fromMission',
    },
  });
}

export async function fakeUpdate(params) {
  return request('/api/flow/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeRefund(params) {
  return request(`/api/flow/${params.fInterID}/refund`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'refund',
    },
  });
}

export async function fakeReject(params) {
  return request(`/api/reject`, {
    method: 'POST',
    body: {
      ...params,
      method: 'reject',
    },
  });
}

export async function fakeChangeRoute(params) {
  console.log(params);
  return request(`/api/flow/${params.fInterID}/changeRoute`, {
    method: 'PUT',
    body: {
      ...params,
      method: 'changeRoute',
    },
  });
}
