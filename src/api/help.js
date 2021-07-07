import request from '@/utils/request'

export function getQuestionList(data) {
  return request({
    url: '/kgQuestion/pageQuestionList/',
    method: 'post',
    data
  })
}

// 删除
export function delQuestion(data) {
  return request({
    url: '/kgQuestion/delQuestion',
    method: 'post',
    data
  })
}

// 新增
export function addQuestion(data) {
  return request({
    url: '/kgQuestion/addQuerystion/',
    method: 'post',
    data
  })
}

// 处理问题
export function dealQuestionReq(data) {
  return request({
    url: '/kgQuestion/dealQuestion/',
    method: 'post',
    data
  })
}

// 获取系统类型
export function listQuestionTypes(data) {
  return request({
    url: '/kgQuestion/listQuestionTypes/',
    method: 'post',
    data
  })
}
