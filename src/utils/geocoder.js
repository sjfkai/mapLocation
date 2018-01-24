import axios from 'axios'
import jsonp from 'jsonp'

export async function getCode(platform, locations) {
  if(!locations || !locations.length) {
    return []
  }
  const result = []
  for (const location of locations) {
    let code
    if(platform ==='google') {
      code = await getCodeFromGoogle(location)
    } else {
      code = await getCodeFromBaidu(location)
    }
    result.push(code)
  }
  return result
}

async function getCodeFromBaidu(location){
  const ak = 'gQsCAgCrWsuN99ggSIjGn5nO'
  const url = `http://api.map.baidu.com/geocoder/v2/?address=${location}&output=json&ak=${ak}`

  const res = await jsonpPromise(url, {
    param: 'callback',
    prefix: 'showLocation',
  })

  if (res.status !== 0) {
    return {
      location,
      isError: true,
      message: res.msg,
      status: res.status,
    }
  }

  return {
    location,
    isError: false,
    code: res.result.location,
    precise: res.result.precise,
    confidence: res.result.confidence,
    level: res.result.level,
  }
}

async function getCodeFromGoogle(location){
  const ak = 'AIzaSyC8KXjTx1zmigxX1-iMAa9xkUWIQdXIO4Y'
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${ak}`
  const res = (await axios.get(url)).data
  console.log(res)
  if (res.status !== 'OK') {
    return {
      location,
      isError: true,
      message: `${res.status}: ${res.error_message}`,
      status: res.status,
    }
  }
  return {
    location,
    isError: false,
    code: res.results[0].geometry.location,
    precise: res.results[0].geometry.location_type,
  }
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
