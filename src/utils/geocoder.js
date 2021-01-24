import jsonp from 'jsonp'
import axios from 'axios'
import { sleep } from './index'
import { getGoogleCoords } from '../utils'

const interval = parseInt(process.env.REACT_APP_INRERVAL, 10) || 0

console.log('interval', interval)

const urlCacheKey = 'maplocation-geocoding-url'
function getUrl() {
  if (!localStorage) {
    return 'https://api.map.baidu.com/geocoding/v3/'
  }
  let url = localStorage.getItem(urlCacheKey)
  if (!url) {
    url = Math.random() < 0.5
      ? 'https://api.map.baidu.com/geocoding/v3/'
      : 'https://api.map.baidu.com/geocoder/v2/'
    localStorage.setItem(urlCacheKey, url)
  }
  return url
}

function getFromStorage(key) {
  if (!localStorage) {
    return null
  }
  const cache = localStorage.getItem(key)
  if (!cache) {
    return null
  }
  return JSON.parse(cache)
}

function saveToStorage(key, value) {
  if (!localStorage) {
    return null
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // 缓存已满
    clearStorage()
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function clearStorage(count = 10) {
  for(let i = 0; i < count; i++) {
    localStorage.removeItem(localStorage.key(0))
  }
}

export async function getCode(platform, locations, apiKey, onProgress) {
  if(!locations || !locations.length) {
    return []
  }
  const result = []
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    let code
    if(platform ==='google') {
      code = await getCodeFromGoogle(location, apiKey)
      if (code.isError && code.status === 'OVER_QUERY_LIMIT') {
        throw new Error('OVER_QUERY_LIMIT')
      }
    } else {
      code = await getCodeFromBaidu(location)
    }
    onProgress(code)
  }
  return result
}

async function getCodeFromBaidu(location){
  const cacheKey = `baidu_${location}`
  const cache = getFromStorage(cacheKey)
  if (cache) {
    return {...cache, coords: cache.coords || 'bd09'}
  }
  // 为了不超qps限制，手动增加间隔
  await sleep(interval)
  const url = `${getUrl()}?address=${encodeURIComponent(location)}&output=json&ak=${window.baiduApiKey}`
  const res = await jsonpPromise(url, {
    param: 'callback',
    prefix: 'showLocation',
    timeout: 5000,
  })

  if (res.status !== 0) {
    return {
      location,
      isError: true,
      message: res.msg,
      status: res.status,
    }
  }

  const result = {
    location,
    isError: false,
    code: res.result.location,
    precise: res.result.precise,
    confidence: res.result.confidence,
    level: res.result.level,
    coords: 'bd09',
  }
  saveToStorage(cacheKey, result)
  return result
}

async function getCodeFromGoogle(location, apiKey){
  const cacheKey = `google_${location}`
  const cache = getFromStorage(cacheKey)
  if (cache) {
    return {...cache, coords: cache.coords || getGoogleCoords(cache.code.lng, cache.code.lat)}
  }
  // 为了不超qps限制，手动增加间隔
  await sleep(interval)
  let result
  if (apiKey) {
    result = await getCodeFromGoogleByApiKey(location, apiKey)
  } else {
    result = await getCodeFromGoogleByDefault(location)
  }
  if (!result.isError) {
    saveToStorage(cacheKey, result)
  }
  return result
}

async function getCodeFromGoogleByDefault(location) {
  const { results, status } = await googleGeoCodePromise(location);
  if (status === 'ERROR') {
    return {
      location,
      isError: true,
      message: `请求Google服务失败，请使用Baidu或使用代理。`,
      status: '',
    }
  }
  if (status !== 'OK') {
    return {
      location,
      isError: true,
      message: `${status}`,
      status: status,
    }
  }

  const result = {
    location,
    isError: false,
    code: {
      lat: results[0].geometry.location.lat(),
      lng: results[0].geometry.location.lng(),
    },
    precise: results[0].geometry.location_type,
    coords: getGoogleCoords(results[0].geometry.location.lng, results[0].geometry.location.lat)
  }

  return result
}

async function getCodeFromGoogleByApiKey(location, apiKey) {
  // const url = `https://maps.google.cn/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
  let res;
  try {
    res = (await axios.get(url, {timeout: 5000})).data
  } catch (error) {
    if (error.message && error.message.indexOf('timeout') !== -1) {
      return {
        location,
        isError: true,
        message: `请求Google服务失败，请使用Baidu或使用代理。`,
        status: '',
      }
    }
    throw error;
  }
  if (res.status !== 'OK') {
    return {
      location,
      isError: true,
      message: `${res.status}: ${res.error_message}`,
      status: res.status,
    }
  }
  const result = {
    location,
    isError: false,
    code: res.results[0].geometry.location,
    precise: res.results[0].geometry.location_type,
    coords: getGoogleCoords(res.results[0].geometry.location.lng, res.results[0].geometry.location.lat)
  }

  return result
}

function jsonpPromise(url, opts) {
  return new Promise((resolve, reject) => {
    jsonp(url, opts, (err, data) => {
      if(err) {
        return reject(err)
      }
      return resolve(data)
    })
  })
}

let geocoder = null;
function googleGeoCodePromise(location) {
  if (!geocoder) {
    if (!window.google) {
      return Promise.resolve({
        status: 'ERROR',
      })
    }
    geocoder = new window.google.maps.Geocoder()
  }
  return new Promise((resolve) => {
    geocoder.geocode( { 'address': location}, function(results, status) {
      resolve({
        results,
        status,
      })
    });
  })
}
