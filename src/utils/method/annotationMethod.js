// 类
import {
  polygonAttributeClass,
  rectAttributeClass,
  circleAttributeClass,
  pathAttributeClass
} from '../class/markAttributeClass'
import { markInfoClass } from '../class/markInfoClass'

// 常量
import {
  DrawShapePolygon,
  DrawShapeRect,
  DrawShapeCircle,
  DrawShapePath,
  DirectionLeft,
  DirectionRight,
  DirectionDown
} from '../constant/annotationConstant'

/** 格式化浮点数 */
function formatFloat(number, places) {
  return parseFloat(parseFloat(number).toFixed(places))
}

/**************************************计算标记面积******************************/

/**
 * 计算多边形面积
 * @param points 多边形坐标的字符串形式 x,y x,y x,y ...
 * @param locationFlag 要显示在多边形的什么位置
 */
export function getPolygonInfo(points, locationFlag) {
  // 记录多边形点坐标
  let pointsArray = []
  for (let tmpPoint of points.split(' ')) {
    let point = {
      x: 0,
      y: 0
    }
    // 拆解坐标
    point.x = parseFloat(tmpPoint.split(',')[0])
    point.y = parseFloat(tmpPoint.split(',')[1])
    if (!isNaN(point.x) && !isNaN(point.y)) {
      pointsArray.push(point)
    }
  }
  // 面积
  let S = 0
  // 显示位置的坐标
  let targetPoint = {
    x: 0,
    y: 0
  }
  for (let i = 0; i < pointsArray.length; i++) {
    if (locationFlag === DirectionLeft) {
      if (pointsArray[i].x < targetPoint.x || targetPoint.x === 0) {
        targetPoint.x = pointsArray[i].x
        targetPoint.y = pointsArray[i].y
      }
    } else if (locationFlag === DirectionRight) {
      if (pointsArray[i].x > targetPoint.x) {
        targetPoint.x = pointsArray[i].x
        targetPoint.y = pointsArray[i].y
      }
    } else if (locationFlag === DirectionDown) {
      //下方
      if (pointsArray[i].y > targetPoint.y) {
        targetPoint.x = pointsArray[i].x
        targetPoint.y = pointsArray[i].y
      }
    }
    // 下一点索引
    let next = 0
    if (i === pointsArray.length - 1) {
      next = 0
    } else {
      next = i + 1
    }
    let x = pointsArray[next].x - pointsArray[i].x
    let y = (pointsArray[next].y + pointsArray[i].y) / 2
    S += x * y
  }
  //面积不同，显示的坐标点位置不同，防止重叠
  if (S <= 3500) {
    targetPoint.x += 10
    targetPoint.y += 10
  } else if (S <= 10000) {
    targetPoint.x += 16
    targetPoint.y += 16
  } else if (S <= 30000) {
    targetPoint.x += 20
    targetPoint.y += 20
  } else {
    targetPoint.x += 23
    targetPoint.y += 23
  }
  return {
    info: Math.abs(S.toFixed(2)),
    x: formatFloat(targetPoint.x, 2),
    y: formatFloat(targetPoint.y, 2)
  }
}

/**
 * 将path中的d属性转为点
 *
 */
function pathToPoints(pathData) {
  let pointsArr = pathData
    .split(/([A-Za-z])/)
    .filter((s) => {
      return s && s.trim()
    })
    .filter(function (item) {
      return item !== 'L' && item !== 'M' && item !== 'Z'
    })
  return pointsArr
}

/**计算圆环（path）的面积
 * @param locationFlag 要显示在多边形的什么位置
 * @aram d path 的位置信息
 */
export function getPathInfo(d, locationFlag) {
  //将d属性拆分，分别得到内圆和外圆
  let all = d.split('Z')
  all.pop()
  let outCirclePoints = pathToPoints(all[0]) //外圆所有的点
  let outCircleArea = getPolygonInfo(outCirclePoints.join(''), DirectionRight).info
  let insideCirclePoints = pathToPoints(all[1]) //内圆所有的点
  let insideCircleArea = getPolygonInfo(insideCirclePoints.join(''), DirectionRight).info
  let pathArea = formatFloat(outCircleArea - insideCircleArea, 3)
  // 显示位置的坐标 以内圆的坐标点计算
  // 记录多边形点坐标
  let pointsArray = []
  for (let tmpPoint of outCirclePoints) {
    let point = {
      x: 0,
      y: 0
    }
    // 拆解坐标
    point.x = parseFloat(tmpPoint.split(',')[0])
    point.y = parseFloat(tmpPoint.split(',')[1])
    if (!isNaN(point.x) && !isNaN(point.y)) {
      pointsArray.push(point)
    }
  }
  // 显示位置的坐标
  let targetPoint = {
    x: 0,
    y: 0
  }
  for (let i = 0; i < pointsArray.length; i++) {
    if (locationFlag === DirectionLeft) {
      if (pointsArray[i].x < targetPoint.x || targetPoint.x === 0) {
        targetPoint.x = pointsArray[i].x
        targetPoint.y = pointsArray[i].y
      }
    } else if (locationFlag === DirectionRight) {
      if (pointsArray[i].x > targetPoint.x) {
        targetPoint.x = pointsArray[i].x
        targetPoint.y = pointsArray[i].y
      }
    } else if (locationFlag === DirectionDown) {
      //下方
      if (pointsArray[i].y > targetPoint.y) {
        targetPoint.x = 26 + pointsArray[i].x
        targetPoint.y = 26 + pointsArray[i].y
      }
    }
  }
  return {
    info: pathArea,
    x: formatFloat(targetPoint.x, 2),
    y: formatFloat(targetPoint.y, 2)
  }
}

/**
 * 计算矩形的面积
 * @param point 矩形起始点（左上角）
 * @param width 宽
 * @param height 高
 * @param locationFlag 要显示在矩形的什么位置
 */
export function getRectInfo(rectAttribute, locationFlag) {
  // 面积
  let S = rectAttribute.width * rectAttribute.height
  // 起始点坐标
  let targetPoint = {
    x: 0,
    y: 0
  }
  if (locationFlag === DirectionLeft) {
    targetPoint.x = rectAttribute.x
    targetPoint.y = rectAttribute.y
  } else if (locationFlag === DirectionRight) {
    targetPoint.x = rectAttribute.x + rectAttribute.width
    targetPoint.y = rectAttribute.y + rectAttribute.height
  } else if (locationFlag == DirectionDown) {
    targetPoint.x = rectAttribute.x
    targetPoint.y = 15 + rectAttribute.y + rectAttribute.height
  }

  return {
    info: Math.abs(S.toFixed(2)),
    x: formatFloat(targetPoint.x, 2),
    y: formatFloat(targetPoint.y, 2)
  }
}

/*********************************** 标注相关方法****************************************/

/** 获取画布标记信息
 *  * @param onlyChioce 是否只获取选中的标注信息
 */
export function getMarkList(canvas, onlyChioce = false) {
  let markList = []
  for (const mark of canvas.childNodes) {
    // 跳过标记锚点
    if (
      mark.getAttribute('class') === 'alterPoint' ||
      mark.getAttribute('type') === 'copy' ||
      mark.tagName === 'text' ||
      mark.tagName === 'line' ||
      (onlyChioce && mark.getAttribute('class') !== 'chosen') ||
      (mark.tagName === 'polygon' && mark.getAttribute('points').split(' ').length <= 2) ||
      (mark.tagName === 'polygon' && mark.getAttribute('points').indexOf('NaN') !== -1)
    ) {
      continue
    }

    let annotationInfo = {
      label: mark.getAttribute('label'),
      shape: mark.tagName,
      color: mark.getAttribute('color'),
      mark: null,
      cutMark: []
    }

    let tmpMarkAttribute = null
    switch (annotationInfo.shape) {
      case DrawShapePolygon:
        tmpMarkAttribute = new polygonAttributeClass(mark)
        annotationInfo.mark = tmpMarkAttribute.getAttributeForUpload()
        break

      case DrawShapeRect:
        tmpMarkAttribute = new rectAttributeClass(mark)
        annotationInfo.mark = tmpMarkAttribute.getAttributeForUpload()
        break

      case DrawShapeCircle:
        tmpMarkAttribute = new circleAttributeClass(mark)
        annotationInfo.mark = tmpMarkAttribute.getAttributeForUpload()
        break

      case DrawShapePath:
        tmpMarkAttribute = new pathAttributeClass(mark)
        let uploadInfo = tmpMarkAttribute.getAttributeForUpload()
        annotationInfo.mark = uploadInfo.mark
        annotationInfo.cutMark = uploadInfo.cutMark
        break
    }

    markList.push(annotationInfo)
  }

  return markList
}

/**
 * 格式化标记信息,将数据库标记信息转化成可用形式
 * @param annotationInfo
 * @param canvas表示是哪一个画布上的元素，与元素的1type属性有关
 */
export function formatAnnotationInfo(annotationInfo, canvasType, labelInfo = '', isAutoAnn = false) {
  // console.log('从数据库中受到的标记', annotationInfo)
  let markInfoList = []
  // console.log('3333:格式化之前的标记annotationInfo.markList ：', annotationInfo.markList)
  if (typeof annotationInfo.markList !== 'undefined') {
    for (const item of annotationInfo.markList) {
      let markInfo = new markInfoClass(item.shape)
      let opacity = 0
      // 根据标记类型读取信息
      let rightPoint = null
      switch (markInfo.shape) {
        case DrawShapePolygon:
          markInfo.markAttribute = new polygonAttributeClass(item.mark)
          //得到多边形的点并计算面积
          rightPoint = getPolygonInfo(item.mark.points, DirectionDown)
          markInfo.area = rightPoint.info
          break

        case DrawShapeRect:
          markInfo.markAttribute = new rectAttributeClass(item.mark)
          rightPoint = getRectInfo(
            {
              x: parseFloat(markInfo.markAttribute.x),
              y: parseFloat(markInfo.markAttribute.y),
              width: markInfo.markAttribute.width,
              height: markInfo.markAttribute.height
            },
            DirectionDown
          )
          markInfo.area = rightPoint.info
          break

        case DrawShapeCircle:
          markInfo.markAttribute = new circleAttributeClass(item.mark)
          break

        case DrawShapePath:
          opacity = 0.1
          let pathInfo = {
            d: ''
          }
          pathInfo.d = polygonToPath(item.mark.points)
          if (item.hasOwnProperty('cutMark') === true) {
            for (const tmpMark of item.cutMark) {
              pathInfo.d += ' ' + polygonToPath(tmpMark.points)
            }
          }
          markInfo.markAttribute = new pathAttributeClass(pathInfo)
          rightPoint = getPathInfo(markInfo.markAttribute.d, DirectionDown)
          markInfo.area = rightPoint.info
          break
      }
      if (markInfo.markAttribute !== null) {
        // 读取基本信息
        markInfo.markAttribute.labelGroup = annotationInfo.labelGroup
        if (labelInfo !== '') {
          //给辅标结果添加标签名以及标签颜色
          markInfo.markAttribute.label = labelInfo.split('_')[0]
          markInfo.markAttribute.color = labelInfo.split('_')[1]
          markInfo.markAttribute.style = getMarkStyle(labelInfo.split('_')[1], opacity)
        } else {
          markInfo.markAttribute.label = item.label
          markInfo.markAttribute.color = item.color
          markInfo.markAttribute.style = getMarkStyle(item.color, opacity)
        }
        if (item.mark.resultType !== undefined) {
          markInfo.markAttribute.resultType = item.mark.resultType //将ok/NG/POK添加到属性身上
        }
        if (isAutoAnn) {
          //给辅助标注的标记添加type属性
          markInfo.markAttribute.type = 'autoAnnRes'
        }
        if (canvasType === 'testRecordMarkRef') {
          markInfo.markAttribute.type = 'testMark'
        } else if (canvasType === 'otherImageRef') {
          markInfo.markAttribute.type = 'otherImageMark'
        } else if (canvasType === 'multiDatasetMarkRef') {
          markInfo.markAttribute.type = 'multiDatasetMark'
        }
        markInfoList.push(markInfo)
      }
    }
  }
  // console.log('44444:格式化之后的标记annotationInfo.markList ：', markInfoList)
  return markInfoList
}

/**格式化现场标记 */
export function formatSpotAnnotationInfo(annotationInfo, canvasType) {
  // console.log('进入了现场标记格式化函数传进来的annotationInfo：', annotationInfo)
  let markInfoList = []
  if (typeof annotationInfo.markList !== 'undefined') {
    for (const item of annotationInfo.markList) {
      //每一条标记信息
      let markInfo = new markInfoClass(item.shape)
      let opacity = 0
      let rightPoint = null
      if (markInfo.shape === 'text') {
        //文本标记 只需要文本标记内容即可，显示在现场标记详情中
        let textContent = `${item.mark.text}  level:${item.mark.level}`
        markInfo.markText.push(textContent)
        markInfoList.push(markInfo)
      } else {
        //显示标记
        switch (markInfo.shape) {
          case DrawShapePolygon:
            markInfo.markAttribute = new polygonAttributeClass(item.mark)
            markInfo.area = item.mark.realAreaWithMask
            break
          case DrawShapeRect:
            markInfo.markAttribute = new rectAttributeClass(item.mark)
            //矩形没有蒙版，所以使用计算的面积
            rightPoint = getRectInfo(
              {
                x: parseFloat(markInfo.markAttribute.x),
                y: parseFloat(markInfo.markAttribute.y),
                width: markInfo.markAttribute.width,
                height: markInfo.markAttribute.height
              },
              DirectionDown
            )
            markInfo.area = rightPoint.info
            break
          case DrawShapeCircle:
            markInfo.markAttribute = new circleAttributeClass(item.mark)
            markInfo.area = item.mark.realAreaWithMask
            break
          case DrawShapePath:
            opacity = 0.1
            let pathInfo = {
              d: ''
            }
            pathInfo.d = polygonToPath(item.mark.points)
            if (item.hasOwnProperty('cutMark') === true) {
              for (const tmpMark of item.cutMark) {
                pathInfo.d += ' ' + polygonToPath(tmpMark.points)
              }
            }
            markInfo.markAttribute = new pathAttributeClass(pathInfo)
            markInfo.area = item.mark.realAreaWithMask //将自带面积添加到属性身上
            break
        }

        if (markInfo.markAttribute !== null) {
          // 读取基本信息
          markInfo.markAttribute.labelGroup = annotationInfo.labelGroup
          markInfo.markAttribute.label = item.label
          if (item.mark.resultType === 'UNKNOWN') {
            markInfo.markAttribute.color = '#DCDCDC'
            markInfo.markAttribute.style = getMarkStyle('#DCDCDC', opacity)
          } else {
            markInfo.markAttribute.color = item.color
            markInfo.markAttribute.style = getMarkStyle(item.color, opacity)
          }
          markInfo.markAttribute.resultType = item.mark.resultType //将ok/NG/POK添加到属性身上
          if (markInfo.shape !== DrawShapeRect) {
            //矩形没有蒙版，所以使用自己计算的面积
            markInfo.markAttribute.area = item.mark.realAreaWithMask
          }
          if (canvasType === 'otherImageRef') {
            markInfo.markAttribute.type = 'otherImageMark'
          }
          markInfoList.push(markInfo)
        }
      }
    }
  }
  if (typeof annotationInfo.maskList !== 'undefined') {
    //显示蒙版
    for (const item of annotationInfo.maskList) {
      //每一条标记信息
      let spotMarkInfo = new markInfoClass(item.shape)
      let opacity = 0
      switch (spotMarkInfo.shape) {
        case DrawShapePolygon:
          spotMarkInfo.markAttribute = new polygonAttributeClass(item.mark)
          spotMarkInfo.area = item.mark.realAreaWithMask
          break
        case DrawShapeRect:
          spotMarkInfo.markAttribute = new rectAttributeClass(item.mark)
          rightPoint = getRectInfo(
            {
              x: parseFloat(spotMarkInfo.markAttribute.x),
              y: parseFloat(spotMarkInfo.markAttribute.y),
              width: spotMarkInfo.markAttribute.width,
              height: spotMarkInfo.markAttribute.height
            },
            DirectionDown
          )
          spotMarkInfo.area = rightPoint.info
          break
        case DrawShapeCircle:
          spotMarkInfo.markAttribute = new circleAttributeClass(item.mark)
          spotMarkInfo.area = item.mark.realAreaWithMask
          break
        case DrawShapePath:
          opacity = 0.1
          let pathInfo = {
            d: ''
          }
          pathInfo.d = polygonToPath(item.mark.points)
          if (item.hasOwnProperty('cutMark') === true) {
            for (const tmpMark of item.cutMark) {
              pathInfo.d += ' ' + polygonToPath(tmpMark.points)
            }
          }
          spotMarkInfo.markAttribute = new pathAttributeClass(pathInfo)
          spotMarkInfo.area = item.mark.realAreaWithMask //将自带面积添加到属性身上
          break
        case 'text':
          break
      }
      if (spotMarkInfo.markAttribute !== null) {
        // 读取基本信息
        spotMarkInfo.markAttribute.labelGroup = annotationInfo.labelGroup
        spotMarkInfo.markAttribute.label = item.label
        if (item.mark.resultType === 'UNKNOWN') {
          spotMarkInfo.markAttribute.color = '#DCDCDC'
          spotMarkInfo.markAttribute.style = getMarkStyle('#DCDCDC', opacity, 'stroke-dasharray:5,5')
        } else {
          spotMarkInfo.markAttribute.color = item.color
          spotMarkInfo.markAttribute.style = getMarkStyle(item.color, opacity, 'stroke-dasharray:5,5')
        }
        spotMarkInfo.markAttribute.resultType = item.mark.resultType //将ok/NG/POK添加到属性身上
        if (spotMarkInfo.shape !== DrawShapeRect) {
          //矩形没有蒙版，所以使用自己计算的面积
          spotMarkInfo.markAttribute.area = item.mark.realAreaWithMask
        }
        spotMarkInfo.markAttribute.level = item.mark.level
        if (canvasType === 'otherImageRef') {
          spotMarkInfo.markAttribute.type = 'otherImageMark'
        }
        markInfoList.push(spotMarkInfo)
      }
    }
  }
  return markInfoList
}

/**
 * 多边形转化为路径
 * @param points 多边形坐标点
 */
export function polygonToPath(points) {
  let tmpPointsArray = points.split(' ')
  let tmpPoints = ''
  for (let i = 0; i <= tmpPointsArray.length; i++) {
    if (i === 0) {
      tmpPoints = 'M' + tmpPointsArray[i]
    } else if (i === tmpPointsArray.length) {
      tmpPoints += ' Z'
    } else {
      tmpPoints += ' L' + tmpPointsArray[i]
    }
  }
  return tmpPoints
}

/** 求三个点的夹角 */
export function getPolylineInfo(point1, point2, point3) {
  // 角平分线角度
  let angle = 0
  // 两条边的角度
  let a = 0
  let b = 0
  if (point1 === null) {
    angle = Math.atan2(point3[1] - point2[1], point3[0] - point2[0])
    if (angle < 0) {
      angle += 2 * Math.PI
    }
  } else if (point3 === null) {
    angle = Math.atan2(point2[1] - point1[1], point2[0] - point1[0])
    if (angle < 0) {
      angle += 2 * Math.PI
    }
  } else {
    a = Math.atan2(point2[1] - point1[1], point2[0] - point1[0])
    b = Math.atan2(point3[1] - point2[1], point3[0] - point2[0])
    if (a < 0) {
      a += 2 * Math.PI
    }
    if (b < 0) {
      b += 2 * Math.PI
    }
    angle = (a + b) / 2

    let absAsubB = Math.abs(a - b)
    if (absAsubB > Math.PI) {
      angle += Math.PI
    }
  }
  angle += Math.PI / 2

  return {
    x: parseInt(point2[0]),
    y: parseInt(point2[1]),
    angle: angle
  }
}

/**
 *
 * @param {*} drawMark 正在标注的标记
 * @returns
 */
export function PolylineToPolygon(drawMark, polylineWidth) {
  //获取多段线的所有点
  let points = drawMark.getAttribute('points').split(' ')
  // 计算每个点(与相邻两个点形成的角平分线)的角度
  let pointInfo = []
  pointInfo.push(getPolylineInfo(null, points[0].split(','), points[1].split(',')))
  for (let i = 1; i < points.length - 1; i++) {
    pointInfo.push(getPolylineInfo(points[i - 1].split(','), points[i].split(','), points[i + 1].split(',')))
  }
  pointInfo.push(getPolylineInfo(points.slice(-2)[0].split(','), points.slice(-1)[0].split(','), null))

  // 将多段线转换成多边形
  let polygonPoints = []
  // 来回遍历两遍，根据角平分线的角度找出两个边
  for (let i = 0; i < pointInfo.length; i++) {
    let xAdd = polylineWidth * Math.cos(pointInfo[i].angle)
    let yAdd = polylineWidth * Math.sin(pointInfo[i].angle)
    polygonPoints.push((pointInfo[i].x + xAdd).toFixed(2) + ',' + (pointInfo[i].y + yAdd).toFixed(2))
  }
  for (let i = pointInfo.length - 1; i >= 0; i--) {
    let xAdd = polylineWidth * Math.cos(pointInfo[i].angle + Math.PI)
    let yAdd = polylineWidth * Math.sin(pointInfo[i].angle + Math.PI)
    polygonPoints.push((pointInfo[i].x + xAdd).toFixed(2) + ',' + (pointInfo[i].y + yAdd).toFixed(2))
  }

  // 以上得到了多边形的所有点, 创建多边形的绘画标签并将其添加到画布上
  polygonPoints = polygonPoints.join(' ')
  let polygonAttribute = new polygonAttributeClass()
  polygonAttribute.labelGroup = drawMark.getAttribute('labelGroup')
  polygonAttribute.label = drawMark.getAttribute('label')
  polygonAttribute.color = drawMark.getAttribute('color')
  polygonAttribute.style = drawMark.getAttribute('style')
  let tempMark = makeMark(DrawShapePolygon, polygonAttribute)
  tempMark.setAttribute('points', polygonPoints)

  return tempMark
}

/**
 * 计算矩形中心点
 * @param {rectAttributeClass} rectAttribute
 */
export function getRectCenterPoint(rectAttribute) {
  let centerPoint = {
    x: formatFloat(rectAttribute.x + rectAttribute.width / 2, 3),
    y: formatFloat(rectAttribute.y + rectAttribute.height / 2, 3)
  }
  return centerPoint
}

/**
 * 获取旋转属性
 * @param rectElement 矩形元素
 */
export function getRectTransform(rectElement) {
  let transform = rectElement.getAttribute('transform')
  let angle = parseInt(transform.split('(')[1].split(',')[0])
  let centerPoint = {
    x: parseInt(transform.split('(')[1].split(',')[1]),
    y: parseInt(transform.split('(')[1].split(',')[2])
  }
  return {
    angle: angle,
    centerPoint: centerPoint
  }
}

/**
 * 设置旋转属性
 * @param angle 角度
 * @param centerPoint 中心点
 */
export function setRectTransfrom(angle, centerPoint) {
  return 'rotate(' + angle + ', ' + centerPoint.x + ', ' + centerPoint.y + ')'
}

/**
 * 计算 BC 与 AB 的夹角
 */
export function getAngleFromThreePoint(pointA, pointB, pointC) {
  const ABX = pointA.x - pointB.x
  const ABY = pointA.y - pointB.y
  const CBX = pointC.x - pointB.x
  const CBY = pointC.y - pointB.y

  // 使用 Math.atan2 计算夹角
  const angle = Math.atan2(CBY, CBX) - Math.atan2(ABY, ABX)

  // 将弧度转换为角度
  return angle * (180 / Math.PI)
}

/**
 * 旋转点坐标
 * @param {number} angle
 */
export function rotatePoint(point, centerPoint, angle) {
  var a = centerPoint.x
  var b = centerPoint.y
  var x0 = point.x
  var y0 = point.y
  var ry = b + (x0 - a) * Math.sin((angle * Math.PI) / 180) + (y0 - b) * Math.cos((angle * Math.PI) / 180)
  var rx = a + (x0 - a) * Math.cos((angle * Math.PI) / 180) - (y0 - b) * Math.sin((angle * Math.PI) / 180)
  var targetPoint = { x: rx, y: ry }
  return targetPoint
}

/** 清理画布 */
export function clearCanvas(canvas) {
  canvas.innerHTML = ''
}

/**
 * 将图片以设定的宽度加载到画布上
 * @param url 图片地址
 * @param canvas 显示图片的画布
 */
export async function onloadImage(url, canvas, imageWidth) {
  try {
    let image = new Image()
    let imageRate = 0

    image.src = url
    canvas.style.backgroundImage = 'url("' + url + '")'
    await new Promise((resolve, reject) => {
      image.onload = () => {
        imageRate = image.naturalHeight / image.naturalWidth
        canvas.viewBox.baseVal.width = image.naturalWidth
        canvas.viewBox.baseVal.height = image.naturalWidth * imageRate
        canvas.width.baseVal.value = imageWidth
        canvas.height.baseVal.value = imageWidth * imageRate
        resolve()
      }
      image.onerror = (error) => {
        console.log('error:', error)
        image = null
        reject()
      }
    })
    return image
  } catch (err) {
    console.log('loadImage失败:', err)
  }
}

/**
 * 获取标记的 style
 * @param color 颜色
 * @param fillOpacity 内部透明度
 * @param otherStyle 其他样式
 */
export function getMarkStyle(color, fillOpacity, otherStyle) {
  let other = ''
  if (typeof otherStyle !== 'undefined') {
    other = otherStyle
  }
  return 'stroke:' + color + ';fill:' + color + ';fill-opacity:' + fillOpacity + ';stroke-width:1;' + other
}

/**
 * 创建标记   这个函数传来的第一个参数表示标注的形状，第二个参数表示获取到的对应形状的参数，即坐标点、宽、高等
 * @param { DrawShapePolygon | DrawShapeRect | DrawShapeCircle } tag 标记的形状
 * @param { polygonAttributeClass | rectAttributeClass | circleAttributeClass } attrs 标记的属性
 */
export function makeMark(tag, attrs) {
  let el = null
  try {
    el = document.createElementNS('http://www.w3.org/2000/svg', tag)
    // 给标签增加属性
    for (var k in attrs) {
      el.setAttribute(k, attrs[k])
    }
  } catch (err) {
    console.log('创建标记失败')
  }
  return el
}

/**
 * 插入排序(倒序)
 * @param array 要排序的数组
 * @param property 依据此属性排序
 * @returns 排序后的数组
 */
// export function insertSortDesc(array, property) {
//   for (let i = 1; i < array.length; i++) {
//     for (let j = i; j > 0; j--) {
//       if (typeof property === 'undefined') {
//         if (array[j] < array[j - 1]) {
//           arraySwap(array, j, j - 1)
//         } else {
//           break
//         }
//       } else {
//         if (array[j][property] > array[j - 1][property]) {
//           arraySwap(array, j, j - 1)
//         } else {
//           break
//         }
//       }
//     }
//   }
//   return array
// }

export function insertSortDesc(array, property) {
  let hasText = false // 标记是否存在 'text' 元素
  for (let i = 1; i < array.length; i++) {
    for (let j = i; j > 0; j--) {
      if (typeof property === 'undefined') {
        if (array[j].shape !== 'text' && array[j - 1].shape !== 'text') {
          // 都不是 'text' 元素，按照 area 进行排序
          if (array[j].area > array[j - 1].area) {
            arraySwap(array, j, j - 1)
          } else {
            break
          }
        } else if (array[j].shape !== 'text' && array[j - 1].shape === 'text') {
          // 当前元素不是 'text' 元素，前一个元素是 'text' 元素，交换位置
          arraySwap(array, j, j - 1)
        } else {
          // 当前元素是 'text' 元素，标记存在 'text' 元素
          hasText = true
          break
        }
      } else {
        if (array[j].shape !== 'text' && array[j - 1].shape !== 'text') {
          // 都不是 'text' 元素，按照指定的属性进行排序
          if (array[j][property] > array[j - 1][property]) {
            arraySwap(array, j, j - 1)
          } else {
            break
          }
        } else if (array[j].shape !== 'text' && array[j - 1].shape === 'text') {
          // 当前元素不是 'text' 元素，前一个元素是 'text' 元素，交换位置
          arraySwap(array, j, j - 1)
        } else {
          // 当前元素是 'text' 元素，标记存在 'text' 元素
          hasText = true
          break
        }
      }
    }
  }
  if (!hasText) {
    // 如果不存在 'text' 元素，对带有 area 的元素进行排序
    array = array.filter((item) => item.area)
    array.sort((a, b) => b.area - a.area)
  }

  return array
}

/** 交换数组中元素位置 */
function arraySwap(arr, index1, index2) {
  let temp = arr[index1]
  arr[index1] = arr[index2]
  arr[index2] = temp
}
