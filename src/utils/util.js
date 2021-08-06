/**
 * 对象深拷贝
 */
export const deepClone = (data) => {
  var type = getObjType(data)
  var obj
  if (type === 'array') {
    obj = []
  } else if (type === 'object') {
    obj = {}
  } else {
    //不再具有下一层次
    return data
  }
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      obj.push(deepClone(data[i]))
    }
  } else if (type === 'object') {
    for (var key in data) {
      obj[key] = deepClone(data[key])
    }
  }
  return obj
}

export const getSelect = (data) => {
  var type = getObjType(data)
  var obj = []
  if (type === 'array' && data.length > 0) {
    data.forEach(item => {
      let info = {label: item.resourceName, id: item.id}
      if (getObjType(item.childCategoryList) === 'array'
      && item.childCategoryList.length > 0) {
        info.children = getSelect(item.childCategoryList)
      }
      obj.push(info)
    })
  }
  return obj
}

export const getTreeAllData = (data, parentId) => {
  var type = getObjType(data)
  var obj = []
  if (type === 'array' && data.length > 0) {
    data.forEach(item => {
      let id = parentId ? (parentId + '-' +item.id) : item.id
      let info = {label: item.resourceName, id: id}
      obj.push(info)
      if (getObjType(item.childCategoryList) === 'array'
      && item.childCategoryList.length > 0) {
        obj = obj.concat(getTreeAllData(item.childCategoryList, id))
      }
    })
  }
  return obj
}

export const getObjType = (obj) => {
  var toString = Object.prototype.toString
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  }
  if (obj instanceof Element) {
    return 'element'
  }
  return map[toString.call(obj)]
}

/**
 * 打开小窗口
 */
export const openWindow = (url, title, w, h) => {
  // Fixes dual-screen position                            Most browsers       Firefox
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : screen.left
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : screen.top

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height

  const left = width / 2 - w / 2 + dualScreenLeft
  const top = height / 2 - h / 2 + dualScreenTop
  const newWindow = window.open(
    url,
    title,
    'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  )

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
}

export function getQueryString(url, paraName) {
  const arrObj = url.split('?')
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split('&')
    let arr
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=')
      // eslint-disable-next-line eqeqeq
      if (arr != null && arr[0] == paraName) {
        return arr[1]
      }
    }
    return ''
  } else {
    return ''
  }
}

/**
 *
 1 满额减
 2 满额折
 3 满量减
 4 满量折
 5 满额赠
 6 满量赠
 * */
export function couponTypeStr(type) {
  let str = ''
  switch (type) {
    case 1:
      str = '满额减';
      break
    case 2:
      str = '满额折';
      break
    case 3:
      str = '满量减';
      break
    case 4:
      str = '满量折';
      break
    case 5:
      str = '满额赠';
      break
    case 6:
      str = '满量赠';
      break
  }
  return str
}

export function couponStatusFn(type) {
  let str = ''
  switch (type) {
    case 0:
      str = '未开始';
      break
    case 1:
      str = '进行中';
      break
    case 2:
      str = '已结束';
      break
    case 3:
      str = '已关闭';
      break
    case 4:
      str = '草稿';
      break
  }
  return str
}

export function mergeObj(obj1, obj2) {
  let obj = Object.assign({}, obj1)
  for(var key in obj2){
    if(!!obj2[key]){
      obj[key]=obj2[key]
    }
  }
  obj = deepClone(obj)
  return obj
}

export function uniqueObject(arr, key) {
  console.log(arr)
  var result = []
  var obj = {}
  if (key) {
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i][key]]) {
        result.push(arr[i])
        obj[arr[i][key]] = true
      }
    }
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (!obj[arr[i]]) {
        result.push(arr[i])
        obj[arr[i]] = true
      }
    }
  }
  return result
}

//防抖
export function debounce(fn, delay) {
  delay = delay || 1000
  let timer = null
  return function () {
    let self = this
    clearTimeout(timer)
    timer = setTimeout(fn.bind(self, arguments), delay);
  }
}

function validatorNumber(min, max) {
  return function intvalValidate(rule, value, callback) {
    if (!value) callback(new Error())

    if (isNaN(value)) {
      callback(new Error())
    }

    const val = parseInt(value, 10)

    if (isNaN(val)) callback(new Error())

    if (min <= val && val <= max) {
      callback()
    } else {
      callback(new Error())
    }
  }
}
