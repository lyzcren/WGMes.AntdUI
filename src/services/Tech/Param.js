import { stringify } from 'qs';
import request from '@/utils/request';


export async function fakeQuery (params) {
  return request('/api/Param/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRemove (params) {
  return request('/api/Param/delete', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function fakeAdd (params) {
  return request('/api/Param', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeUpdate (params) {
  return request('/api/Param/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeActive (params) {
  return request('/api/Param/active', {
    method: 'POST',
    body: {
      ...params,
      method: 'active',
    },
  });
}

export async function fakeQueryValue (params) {
  return request('/api/Param/getValues', {
    method: 'POST',
    body: {
      ...params,
      method: 'getValues',
    },
  });
}

export async function fakeAddValue (params) {
  return request('/api/Param/addValue', {
    method: 'POST',
    body: {
      ...params,
      method: 'addValue',
    },
  });
}

export async function fakeUpdateValue (params) {
  return request('/api/Param/UpdateValue', {
    method: 'POST',
    body: {
      ...params,
      method: 'UpdateValue',
    },
  });
}

export async function fakeRemoveValue (params) {
  return request('/api/Param/deleteValue', {
    method: 'POST',
    body: {
      ...params,
      method: 'deleteValue',
    },
  });
}