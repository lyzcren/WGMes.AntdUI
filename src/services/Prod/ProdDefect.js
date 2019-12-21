import request from '@/utils/request';

export async function fakeQuery(params) {
  return request('/api/ProdDefect/getList', {
    method: 'POST',
    body: {
      ...params,
      method: 'getList',
    },
  });
}

export async function fakeRepair(params) {
  return request('/api/ProdDefect/repair', {
    method: 'POST',
    body: {
      ...params,
      method: 'repair',
    },
  });
}

export async function fakeScrap(params) {
  return request('/api/ProdDefect/scrap', {
    method: 'POST',
    body: {
      ...params,
      method: 'scrap',
    },
  });
}
