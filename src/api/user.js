import request from '@/utils/request'

// 定义接口路径的目录 api

export function login(data) {
  return request({
    url: '/api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/api/user/current',
    method: 'get'
    // params: { token } 不需要token
  })
}

export function logout() {
  return request({
    url: `${api_name}/logout`,
    method: 'post'
  })
}

const api_name = '/api/user'

export default {
  // 分页查询
  userPageList(current, limit, searchObj) {
    return request({
      url: `${api_name}/pageUserList/${current}/${limit}`,
      method: 'post',
      data: searchObj
    })
  },
  // 删除用户
  removeUserId(id) {
    return request({
      url: `${api_name}/delete/${id}`,
      method: 'post'
    })
  },
  // 批量删除
  batchRemove(idList) {
    return request({
      url: `${api_name}/deleteBatch`,
      method: 'post',
      data: idList
    })
  }
}

