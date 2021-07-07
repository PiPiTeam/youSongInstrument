import request from '@/utils/request'
import qs from 'qs'

export function getTaskList(params) {
  return request({
    url: '/task/pageList',
    method: 'get',
    params
  })
}

export function getDeviceTypeList(params) {
  return request({
    url: 'kgDeviceType/getDeviceTypeList',
    method: 'get',
    params
  })
}

export function deleteByIds(ids) {
  return request({
    url: 'kgDevice/deleteByIds/?ids=' + ids,
    method: 'delete'
  })
}

export function getDeviceList(params) {
  return request({
    url: 'kgDevice/getDeviceList',
    method: 'post',
    params
  })
}

export function findUpload(data) {
  return request({
    url: 'kgDevice/addDevice',
    method: 'post',
    data
  })
}
// 新增设备，提交
export function addDevice(data) {
  return request({
    url: 'kgDevice/addDevice',
    method: 'post',
    data
  })
}
// 编辑设备详情，提交
export function updateDevice(data) {
  return request({
    url: 'kgDevice/updateDevice',
    method: 'post',
    data
  })
}
// 获取设备编辑详情
export function getDeviceInfo(params) {
  return request({
    url: 'kgDevice/getDeviceDetail',
    method: 'get',
    params
  })
}
// 获取上传json的数据
export function getJsonData(data) {
  return request({
    url: 'kgDevice/getJsonData',
    method: 'post',
    data
  })
}
// 获取上传参数文件返回list数据
export function getParameterData(data) {
  return request({
    url: 'kgDevice/getParameterData',
    method: 'post',
    data
  })
}
// 设备参数excel下载
export function downloadDeviceParameterFile(params) {
  return request({
    url: 'kgDevice/downloadDeviceParameterFile',
    method: 'get',
    params
  })
}
// 上传附件
export function uploadEnclosure(data) {
  return request({
    url: '/kgDevice/uploadEnclosure',
    method: 'post',
    data
  })
}

export function taskSave(data) {
  return request({
    url: 'task/save',
    method: 'post',
    data
  })
}

export function taskUpdate(data) {
  return request({
    url: 'task/update',
    method: 'put',
    data
  })
}

export function deleteTask(ids) {
  return request({
    url: 'task/batchDelete/?ids=' + ids,
    method: 'delete'
  })
}

export function getPersonalInfo(params) {
  return request({
    url: '/atlas/getPersonalInfo',
    method: 'get',
    params
  })
}

export function getPersonalTasks(params) {
  return request({
    url: '/atlas/getPersonalTasks',
    method: 'get',
    params
  })
}

export function getAllUsers() {
  return request({
    url: '/task/getAllUsers',
    method: 'get'
  })
}

export function batchReleaseTask(ids) {
  return request({
    url: '/task/batchReleaseTask?ids=' + ids,
    method: 'put'
  })
}

export function filterTaskStatus(ids) {
  // 筛选任务状态
  return request({
    url: `/task/pageList?=` + ids,
    method: 'get'
  })
}

export function getTasksByAtlasTypeIds(atlasTypeIds) {
  return request({
    url: '/task/getTasksByAtlasTypeIds?atlasTypeIds=' + atlasTypeIds,
    method: 'get'
  })
}

export function getUserTaskPage(params) {
  return request({
    url: '/task/getUserTaskPage',
    method: 'get',
    params
  })
}

export function getMaxFileNum(params) {
  return request({
    url: '/export/maxFileNum',
    method: 'get',
    params
  })
}

export function exportXmlLabel(params) {
  return request({
    url: '/export/Label',
    method: 'get',
    responseType: 'blob',
    isExport: true,
    params
  })
}

export function freeFilesUser(params) {
  return request({
    url: 'task/freeFiles?' + qs.stringify(params),
    method: 'delete'
  })
}

export function labelUpload(data) {
  return request({
    url: 'file/labelUpload',
    method: 'post',
    data
  })
}

export function getDeviceDetail(params) {
  return request({
    url: 'kgDevice/getDeviceDetail',
    method: 'get',
    params
  })
}
export function downloadDeviceFile(params) {
  return request({
    url: 'kgDevice/downloadDeviceFile',
    method: 'get',
    params
  })
}

export function sendRecordList(params) {
  return request({
    url: 'kgDevice/sendRecordList',
    method: 'get',
    params
  })
}

export function getHospitalList(params) {
  return request({
    url: 'kgDevice/getHospitalList',
    method: 'get',
    params
  })
}

export function sendDevice(data) {
  return request({
    url: 'kgDevice/sendDevice',
    method: 'post',
    data
  })
}

export function reviewDevice(data) {
  return request({
    url: 'kgDeviceVersion/reviewDevice',
    method: 'post',
    data
  })
}
