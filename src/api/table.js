import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/api/user/search',
    method: 'get',
    params
  })
}
