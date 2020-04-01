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

export async function fakeGet(id) {
  return request(`/api/Flow/${id}`);
}

export async function fakeGetByBatchNo(params) {
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

export async function fakeCancelTransfer(params) {
  return request(`/api/record/cancelTransfer/${params.id}`, {
    method: 'PUT',
    body: {
      method: 'cancelTransfer',
    },
  });
}

export async function fakeCancel(params) {
  return request(`/api/flow/cancel/${params.id}`, {
    method: 'PUT',
    body: {
      method: 'fakeCancel',
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
