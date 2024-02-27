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
export function formatFloat(number: number, places: number) {
  return parseFloat(number.toFixed(places))
}

/**************************************计算标记面积******************************/

/**
 * 计算多边形面积
 * @param points 多边形坐标的字符串形式 x,y x,y x,y ...
 * @param locationFlag 要显示在多边形的什么位置
 */
export function getPolygonInfo(points: string, locationFlag: string) {
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
    info: Math.abs(formatFloat(S, 2)),
    x: formatFloat(targetPoint.x, 2),
    y: formatFloat(targetPoint.y, 2)
  }
}

/**
 * 将path中的d属性转为点
 *
 */
function pathToPoints(pathData: string) {
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
export function getPathInfo(d: string, locationFlag: string) {
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
export function getRectInfo(
  rectAttribute: { x: number; y: number; width: number; height: number },
  locationFlag: string
) {
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
    info: Math.abs(formatFloat(S, 2)),
    x: formatFloat(targetPoint.x, 2),
    y: formatFloat(targetPoint.y, 2)
  }
}

/*********************************** 标注相关方法****************************************/

/** 获取画布标记信息
 *  * @param onlyChioce 是否只获取选中的标注信息
 */
export function getMarkList(canvas: any, onlyChioce = false) {
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
      mark: null as any,
      cutMark: [] as {
        labelType: string
        points: string
      }[]
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
 * @param canvas 表示是哪一个画布上的元素，与元素的1type属性有关
 */
export function formatAnnotationInfo(annotationInfo: any, canvasType: string, labelInfo = '', isAutoAnn = false) {
  let markInfoList = []
  if (typeof annotationInfo.markList !== 'undefined') {
    for (const item of annotationInfo.markList) {
      let markInfo = new markInfoClass(item.shape)
      let opacity = 0
      // let rightPoint = {}
      // 根据标记类型读取信息
      switch (markInfo.shape) {
        case DrawShapePolygon:
          markInfo.markAttribute = new polygonAttributeClass(item.mark)
          //得到多边形的点并计算面积
          // rightPoint = getPolygonInfo(item.mark.points, DirectionDown)
          break

        case DrawShapeRect:
          markInfo.markAttribute = new rectAttributeClass(item.mark)
          // rightPoint = getRectInfo(
          //   {
          //     x: markInfo.markAttribute.x,
          //     y: markInfo.markAttribute.y,
          //     width: markInfo.markAttribute.width,
          //     height: markInfo.markAttribute.height
          //   },
          //   DirectionDown
          // )
          break

        case DrawShapeCircle:
          markInfo.markAttribute = new circleAttributeClass(item.mark)
          break

        case DrawShapePath:
          opacity = 0.1
          let d = ''
          d = polygonToPath(item.mark.points)
          if (item.hasOwnProperty('cutMark') === true) {
            for (const tmpMark of item.cutMark) {
              d += ' ' + polygonToPath(tmpMark.points)
            }
          }
          markInfo.markAttribute = new pathAttributeClass()
          markInfo.markAttribute.d = d
          // rightPoint = getPathInfo(markInfo.markAttribute.d, DirectionDown)
          break
      }
      if (markInfo.markAttribute !== null) {
        // 读取基本信息
        if (labelInfo !== '') {
          //给辅标结果添加标签名以及标签颜色
          markInfo.markAttribute.label = labelInfo.split('_')[0]
          markInfo.markAttribute.color = labelInfo.split('_')[1]
          markInfo.markAttribute.style = getMarkStyle(labelInfo.split('_')[1], opacity, '')
        } else {
          markInfo.markAttribute.label = item.label
          markInfo.markAttribute.color = item.color
          markInfo.markAttribute.style = getMarkStyle(item.color, opacity, '')
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

/**
 * 多边形转化为路径
 * @param points 多边形坐标点
 */
export function polygonToPath(points: string) {
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
export function getPolylineInfo(point1: number[] | null, point2: number[], point3: number[] | null) {
  // 角平分线角度
  let angle = 0
  // 两条边的角度
  let a = 0
  let b = 0
  if (point1 === null && point3 !== null) {
    angle = Math.atan2(point3[1] - point2[1], point3[0] - point2[0])
    if (angle < 0) {
      angle += 2 * Math.PI
    }
  } else if (point3 === null && point1 !== null) {
    angle = Math.atan2(point2[1] - point1[1], point2[0] - point1[0])
    if (angle < 0) {
      angle += 2 * Math.PI
    }
  } else if (point1 !== null && point3 !== null) {
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
    x: point2[0],
    y: point2[1],
    angle: angle
  }
}

/**
 *
 * @param drawMark 正在标注的标记
 * @returns
 */
export function PolylineToPolygon(drawMark: SVGElement, polylineWidth: number) {
  //获取多段线的所有点
  let tmpPoints = drawMark.getAttribute('points')
  let pointsString = [] as string[]
  if (tmpPoints !== null) {
    pointsString = tmpPoints.split(' ')
  }

  // 转化为数字格式
  let pointsNumber = [] as number[][]
  for (const point of pointsString) {
    pointsNumber.push(point.split(',').map((item) => Number(item)))
  }

  // 计算每个点(与相邻两个点形成的角平分线)的角度
  let pointInfo = [] as {
    x: number
    y: number
    angle: number
  }[]
  pointInfo.push(getPolylineInfo(null, pointsNumber[0], pointsNumber[1]))
  for (let i = 1; i < pointsNumber.length - 1; i++) {
    pointInfo.push(getPolylineInfo(pointsNumber[i - 1], pointsNumber[i], pointsNumber[i + 1]))
  }
  pointInfo.push(getPolylineInfo(pointsNumber.slice(-2)[0], pointsNumber.slice(-1)[0], null))

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
  let polygonPointsString = polygonPoints.join(' ')
  let polygonAttribute = new polygonAttributeClass()
  let tmpLabel = drawMark.getAttribute('label')
  if (tmpLabel !== null) {
    polygonAttribute.label = tmpLabel
  }
  let tmpColor = drawMark.getAttribute('color')
  if (tmpColor !== null) {
    polygonAttribute.color = tmpColor
  }
  let tmpStyle = drawMark.getAttribute('style')
  if (tmpStyle !== null) {
    polygonAttribute.style = tmpStyle
  }

  let tempMark = makeMark(DrawShapePolygon, polygonAttribute)
  if (tempMark !== null) {
    tempMark.setAttribute('points', polygonPointsString)
  }

  return tempMark
}

/**
 * 三个点转化成圆
 * @param polygon 多边形元素
 */
export function threePointsToCircle(polygonSVG: SVGElement) {
  let polygon = new polygonAttributeClass(polygonSVG) //得到svg标签的一些属性
  let pointsArray = []
  //遍历多边形标签中的每个点
  for (const pointString of polygon.points.split(' ')) {
    let pointArray = pointString.split(',').map((item) => Number(item))
    pointsArray.push([formatFloat(pointArray[0], 2), formatFloat(pointArray[1], 2)])
  }

  let a = pointsArray[0][0] - pointsArray[1][0]
  let b = pointsArray[0][1] - pointsArray[1][1]
  let c = pointsArray[0][0] - pointsArray[2][0]
  let d = pointsArray[0][1] - pointsArray[2][1]
  let e =
    (Math.pow(pointsArray[0][0], 2) -
      Math.pow(pointsArray[1][0], 2) -
      (Math.pow(pointsArray[1][1], 2) - Math.pow(pointsArray[0][1], 2))) /
    2
  let f =
    (Math.pow(pointsArray[0][0], 2) -
      Math.pow(pointsArray[2][0], 2) -
      (Math.pow(pointsArray[2][1], 2) - Math.pow(pointsArray[0][1], 2))) /
    2

  let circle = new circleAttributeClass()
  circle.cx = formatFloat((e * d - b * f) / (a * d - b * c), 2)
  circle.cy = formatFloat((a * f - e * c) / (a * d - b * c), 2)
  circle.r = Math.sqrt(Math.pow(circle.cx - pointsArray[0][0], 2) + Math.pow(circle.cy - pointsArray[0][1], 2))
  circle.label = polygon.label
  circle.color = polygon.color
  circle.style = polygon.style

  return makeMark(DrawShapeCircle, circle)
}

/**
 * 将圆转化成多边形
 * @param circleSVG 圆形元素
 */
export function circleToPolygon(circleSVG: SVGElement) {
  //传入的是三点成圆函数得到的圆形svg标签
  let circle = new circleAttributeClass(circleSVG)
  let r = circle.r
  let cx = circle.cx
  let cy = circle.cy
  let numberOfPoints = r
  //控制圆显示的点的个数
  if (numberOfPoints > 50) {
    numberOfPoints = numberOfPoints - numberOfPoints / 2
  } else if (numberOfPoints > 20) {
    numberOfPoints = numberOfPoints - 10
  }
  let points = cx + r + ',' + cy
  for (let i = 1; i < numberOfPoints; i++) {
    let angle = (i * 2 * Math.PI) / numberOfPoints
    let x = formatFloat(cx + r * Math.cos(angle), 2)
    let y = formatFloat(cy - r * Math.sin(angle), 2)
    points += ' ' + x + ',' + y
  }
  let polygon = new polygonAttributeClass()
  polygon.points = points
  polygon.label = circle.label
  polygon.color = circle.color
  polygon.style = circle.style

  return makeMark(DrawShapePolygon, polygon)
}

// /**
//  * 格式化界面标记
//  * @param svg svg 标签
//  */
// function getInterfaceMarkInfo(svg: SVGElement) {
//   let tmpMarkInfo = null

//   // 位置
//   switch (svg.tagName) {
//     case DrawShapePolygon:
//       tmpMarkInfo = new polygonAttributeClass(svg)
//       break

//     case DrawShapeRect:
//       tmpMarkInfo = new rectAttributeClass(svg)
//       break

//     case DrawShapeCircle:
//       tmpMarkInfo = new circleAttributeClass(svg)
//       break

//     case DrawShapePath:
//       tmpMarkInfo = new pathAttributeClass(svg)
//       break
//   }

//   if (tmpMarkInfo !== null) {
//     tmpMarkInfo.label = svg.getAttribute('label') || tmpMarkInfo.label
//     tmpMarkInfo.color = svg.getAttribute('color') || tmpMarkInfo.color
//     tmpMarkInfo.style = svg.getAttribute('style') || tmpMarkInfo.style
//   }

//   return tmpMarkInfo
// }

/**
 * 计算矩形中心点
 * @param {rectAttributeClass} rectAttribute
 */
export function getRectCenterPoint(rectAttribute: rectAttributeClass) {
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
export function getRectTransform(rectElement: any) {
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
export function setRectTransfrom(angle: number, centerPoint: { x: number; y: number }) {
  return 'rotate(' + angle + ', ' + centerPoint.x + ', ' + centerPoint.y + ')'
}

/**
 * 计算 BC 与 AB 的夹角
 */
export function getAngleFromThreePoint(
  pointA: { x: number; y: number },
  pointB: { x: number; y: number },
  pointC: { x: number; y: number }
) {
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
export function rotatePoint(point: { x: number; y: number }, centerPoint: { x: number; y: number }, angle: number) {
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
export function clearCanvas(canvas: Element) {
  canvas.innerHTML = ''
}

/**
 * 获取标记的 style
 * @param color 颜色
 * @param fillOpacity 内部透明度
 * @param otherStyle 其他样式
 */
export function getMarkStyle(color: string, fillOpacity: number, otherStyle?: string) {
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
export function makeMark(tag: string, attrs: any) {
  let el = document.createElementNS('http://www.w3.org/2000/svg', tag)
  // 给标签增加属性
  for (var k in attrs) {
    el.setAttribute(k, attrs[k])
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

export function insertSortDesc(array: any, property: string) {
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
    array = array.filter((item: any) => item.area)
    array.sort((a: any, b: any) => b.area - a.area)
  }

  return array
}

/** 交换数组中元素位置 */
function arraySwap(arr: any, index1: number, index2: number) {
  let temp = arr[index1]
  arr[index1] = arr[index2]
  arr[index2] = temp
}
