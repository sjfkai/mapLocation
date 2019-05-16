import coordTransform from 'coordtransform'


const coordsList = ['gcj02', 'wgs84', 'bd09']

export function sleep(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, timeout);
  })
}

/**
 * 判断是否在国内
 * @param lng 经度
 * @param lat 纬度
 * @returns {boolean}
 */
export function isInChina(lng, lat) {
  // 纬度3.86~53.55,经度73.66~135.05 
  return (lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
};

/**
 * 取得google的坐标系 国内 gcj02 国外 wgs84
 * @param {number} lng  经度
 * @param {number} lat  纬度
 */
export function getGoogleCoords(lng, lat) {
  return isInChina(lng, lat) ? 'gcj02' : 'wgs84';
};

/**
 * 转换坐标系
 * @param {string} fromCoords 
 * @param {string} toCoords 
 * @param {object} code 
 */
export function transformCoords(fromCoords, toCoords, code) {
  if (
    coordsList.indexOf(fromCoords) === -1
    || coordsList.indexOf(toCoords) === -1
  ) {
    throw new Error('Error params')
  }

  if (fromCoords === toCoords) {
    return {...code}
  }

  const transformFunc = coordTransform[`${fromCoords}to${toCoords}`];
  if (transformFunc) {
    const transformedArr =  transformFunc(code.lng, code.lat)
    return {
      lng: transformedArr[0],
      lat: transformedArr[1],
    }
  }

  let transformedArr = coordTransform[`${fromCoords}togcj02`](code.lng, code.lat)
  transformedArr = coordTransform[`gcj02to${toCoords}`](transformedArr[0], transformedArr[1])
  return {
    lng: transformedArr[0],
    lat: transformedArr[1],
  }
}

let id = 0
export function uniqueId() {
  id += 1
  return id
}
