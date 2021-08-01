import axios from 'axios';

let qs = require('qs')

axios.defaults.timeout = 600000; // 10分钟 单位是ms
axios.defaults.baseURL = '';
axios.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'



axios.interceptors.request.use(
  config => {
    let url = config.url
    // get参数编码
    if (config.method === 'get' && config.params) {
      url += '?'
      let keys = Object.keys(config.params)
      for (let key of keys) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
      url = url.substring(0, url.length - 1)
      config.params = {}
    }
    config.url = url
    return config
  })

function makeResp(resolve, reject) {
  return function (r) {
    let d = r.data
    if (d.status === 0) {
      resolve(d.data)
    } else {
      reject(d.msg)
    }
  }
}

function serialize(args) {
  return qs.stringify(args, {
    arrayFormat: 'repeat'
  })
}

function adaAJAX(method, url, params) {
  return new Promise((resolve, reject) => {
    //console.log(params);
    let data = null;
    if ('get' === method || 'delete' === method) {
      data = {
        params
      }
      if (params.repeatArray) {
        data.paramsSerializer = serialize
      }
    } else {
      data = params.repeatArray ? serialize(params) : qs.stringify(params)
    }
    axios[method](url, data)
      .then(r => {
        let d = r.data
        if (d.status === 0) {
          let d1 = d.data
          if (d.pager) {
            d1 = d1 || []
            d1.pager = d.pager //这里采用了非正常手段 为数组添加自定义属性
          }
          resolve(d1)
        } else {
          reject(d.msg)
        }
      }).catch(err => {
        reject(err)
      })
  })
}

export function ajaxGET(url, params = {}) {
  return adaAJAX('get', url, params)
}

export function ajaxPUT(url, data = {}) {
  return adaAJAX('put', url, data)
}

export function ajaxPOST(url, data = {},) {
  return adaAJAX('post', url, data,)
}
export function ajaxPOSTone(url, data = {},) {
  return adaAJAX('post', url, data,{responseType:"blob"})
}

export function ajaxDELETE(url, data = {}) {
  return adaAJAX('delete', url, data)
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {

  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: params
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}
