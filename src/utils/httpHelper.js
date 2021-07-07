import request from '@/utils/request'

export const commonUpload = (url, fileForm, okcb, failcb) => {
  // console.log('fileForm', fileForm)
  request({
    url: url,
    method: 'post',
    fileForm
  }).then(response => {
    const status = response.status || 0
    const body = response.data || []
    if ((status >= 200 && status <= 204) && body.code === '1') {
      console.log('[POST]-OK with ' + url)
      return okcb(body)
    } else {
      console.log('[POST]-FAIL with ' + url)
      return failcb(body)
    }
  }).catch(trace => failcb(trace.response))
}
