import { ElMessage } from 'element-plus'
import axios from 'axios'

/**
 * 公用方法
 */

/**
 * 从文件路径中获取指定 level 对应的 key
 * @param path 当前路径
 * @param level 指定目录层级
 * @param directory 目录结构
 */
export function getKeyFromPath(path, level, directory) {
  // 找到目标文件层级
  let folderIndex = directory.indexOf(level)
  return path[folderIndex].key
}

/** 报错弹窗 */
export function showError(errorMessage) {
  ElMessage({
    type: 'error',
    message: errorMessage,
    showClose: true,
    duration: 2000
  })
}

/** 警告弹窗 */
export function showWarning(warningMessage) {
  ElMessage({
    type: 'warning',
    message: warningMessage,
    showClose: true,
    duration: 2000
  })
}

/** 成功弹窗 */
export function showSuccess(successMessage) {
  ElMessage({
    type: 'success',
    message: successMessage,
    showClose: true,
    duration: 2000
  })
}

/** 保留三位小数 */
export function toFixed3(number) {
  number = Number(number)
  return Number(number.toFixed(3))
}

/** 获取本地缓存 */
export function localGet(key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    return value
  }
}

/** 设置本地缓存 */
export function localSet(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

/** 删除本地缓存 */
export function localRemove(key) {
  window.localStorage.removeItem(key)
}

//相册的日期文件夹里的内容按照日期进行排序、训练界面的“创建时间”也按照日期进行排序
export function sortBy(props) {
  return function (a, b) {
    const timeA = new Date(a[props]).getTime() // 将时间字符串转换为时间戳
    const timeB = new Date(b[props]).getTime() // 将时间字符串转换为时间戳
    return timeB - timeA //值小于0，A在B前面
  }
}

//节流函数
export function throttl(fn, delay) {
  let flag = true
  return function () {
    if (!flag) return
    flag = false
    setTimeout(() => {
      fn.apply(this, arguments)
      flag = true
    }, delay)
  }
}

// 格式化时间
export function formatDate(date, returnFlag) {
  let reg = /^[0-9]*$/
  let newDate
  // 时间戳格式
  if (reg.test(date)) {
    newDate = new Date(parseInt(date))
    // 其他格式
  } else {
    newDate = new Date(date)
  }

  let Y = newDate.getFullYear()
  let M = addZero(newDate.getMonth() + 1)
  let D = addZero(newDate.getDate())
  let h = addZero(newDate.getHours())
  let m = addZero(newDate.getMinutes())
  let s = addZero(newDate.getSeconds())
  if (returnFlag === 'date') {
    return Y + '-' + M + '-' + D
  } else if (returnFlag === 'time') {
    return h + ':' + m + ':' + s
  } else {
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
  }
}
export function addZero(num) {
  return num < 10 ? '0' + num : num
}

//训练界面和测试界面将socket得到的当前任务与任务队列中的input_dir得到与任务列表中名称一致的格式
export function changeName(input_dir) {
  let tmpName = input_dir.split('/').slice(0, -1).slice(-3) //取到最后三个跟模型名有关的
  let nameArr = []
  tmpName.forEach((item, index) => {
    if (index === 1) {
      nameArr.push(tmpName[0])
    } else if (index === 0) {
      nameArr.push(tmpName[1])
    } else {
      nameArr.push(item)
    }
  })
  return nameArr
}

//数组去重
export function reduceArrObj(data) {
  let obj = {}
  return data.reduce((cur, next) => {
    obj[next.value] ? '' : (obj[next.value] = true && cur.push(next))
    return cur
  }, [])
}

// //获取字典数据
// export async function getDictionary() {
//   try {
//     const response = await axios.get('/dataset/dictionary', {})
//     return response.data
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }

// // 替换名称
// export async function replaceName(inputString) {
//   try {
//     const dictionary = await getDictionary()
//     let newString = inputString

//     for (const key in dictionary) {
//       if (inputString.includes(key)) {
//         const replacement = dictionary[key]
//         newString = inputString.replace(key, replacement)
//         break
//       }
//     }

//     return newString
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }
