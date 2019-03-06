import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeDeptTreeData (params) {
  return request('/api/Dept/GetTreeData', {
    method: 'POST',
    body: {
      ...params,
      method: 'GetTreeData',
    },
  });
}