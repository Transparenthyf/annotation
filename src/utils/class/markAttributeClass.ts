import { DrawShapePolygon } from '../constant/annotationConstant'

let markId = 0

/**
 * 标记属性的基类
 * @porperty label 标签id
 * @porperty color 标记颜色
 * @porperty style 标签属性
 */
export class markAttributeClass {
  /**name属性 用于删除面积*/
  name: number
  /** 标签 */
  label: string
  /** 标记颜色 */
  color: string
  /** 标签属性 */
  style: string
  /** 标记类型 */
  type: string

  constructor() {
    this.name = ++markId
    this.label = ''
    this.color = ''
    this.style = ''
    this.type = 'mark'
  }
}

/**
 * 多边形属性类
 * @porperty points 多边形点的集合
 * @porperty label 标签id
 * @porperty color 标记颜色
 * @porperty style 标签属性
 */
export class polygonAttributeClass extends markAttributeClass {
  /** 多边形点的集合 */
  points: string

  /**
   * @param { SVGElement | object } polygon 一个多边形元素或者多边形参数对象,为空表示使用默认值
   */
  constructor(polygon?: SVGElement | polygonAttributeClass) {
    super()
    this.points = ''

    if (typeof polygon !== 'undefined') {
      if (polygon instanceof SVGElement) {
        this.points = polygon.getAttribute('points') || this.label
        this.label = polygon.getAttribute('label') || this.label
        this.color = polygon.getAttribute('color') || this.color
        this.style = polygon.getAttribute('style') || this.style
      } else {
        this.points = polygon.points
        this.label = polygon.label
        this.color = polygon.color
        this.style = polygon.style
      }
    }
  }

  /**
   * 获取创建多边形标记的属性
   */
  getAttributeForMake() {
    return this
  }

  /**
   * 获取上传多边形标记的属性
   */
  getAttributeForUpload() {
    return {
      points: this.points
    }
  }
}

/**
 * 矩形属性类
 * @porperty x 矩形左上角横坐标
 * @porperty y 矩形左上角纵坐标
 * @porperty width 宽
 * @porperty height 高
 * @porperty label 标签id
 * @porperty color 标记颜色
 * @porperty style 标签属性
 */
export class rectAttributeClass extends markAttributeClass {
  /** 矩形左上角横坐标 */
  x: number
  /** 矩形左上角纵坐标 */
  y: number
  /** 宽 */
  width: number
  /** 高 */
  height: number
  /** 旋转 */
  transform: string

  /**
   * @param { SVGElement | object } rect 一个矩形元素或者多边形参数对象,为空表示使用默认值
   */
  constructor(rect?: SVGElement | rectAttributeClass) {
    super()
    this.x = 0
    this.y = 0
    this.width = 0
    this.height = 0
    this.transform = 'rotate(0, 0, 0)'

    if (typeof rect !== 'undefined') {
      if (rect instanceof SVGElement) {
        this.x = Number(rect.getAttribute('x') || this.x)
        this.y = Number(rect.getAttribute('y') || this.y)
        this.width = Number(rect.getAttribute('width') || this.width)
        this.height = Number(rect.getAttribute('height') || this.height)
        this.label = rect.getAttribute('label') || this.label
        this.color = rect.getAttribute('color') || this.color
        this.style = rect.getAttribute('style') || this.style
      } else {
        this.x = rect.x
        this.y = rect.y
        this.width = rect.width
        this.height = rect.height
        this.transform = rect.transform
        this.label = rect.label
        this.color = rect.color
        this.style = rect.style
      }
    }
  }

  /**
   * 获取创建多边形标记的属性
   */
  getAttributeForMake() {
    return this
  }

  /**
   * 获取上传多边形标记的属性
   */
  getAttributeForUpload() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      angle: parseInt(this.transform.split('(')[1].split(',')[0])
    }
  }
}

/**
 * 圆形属性类
 * @porperty cx 圆心横坐标
 * @porperty cy 圆心纵坐标
 * @porperty r 半径
 * @porperty label 标签id
 * @porperty color 标记颜色
 * @porperty style 标签属性
 */
export class circleAttributeClass extends markAttributeClass {
  /** 圆心横坐标 */
  cx: number
  /** 圆心纵坐标 */
  cy: number
  /** 半径 */
  r: number

  /**
   * @param { SVGElement | object } circle 一个圆形元素或者圆形参数对象,为空表示使用默认值
   */
  constructor(circle?: SVGElement | circleAttributeClass) {
    super()

    this.cx = 0
    this.cy = 0
    this.r = 0

    if (typeof circle !== 'undefined') {
      if (circle instanceof SVGElement) {
        this.cx = Number(circle.getAttribute('cx') || this.cx)
        this.cy = Number(circle.getAttribute('cy') || this.cy)
        this.r = Number(circle.getAttribute('r') || this.r)
        this.label = circle.getAttribute('label') || this.label
        this.color = circle.getAttribute('color') || this.color
        this.style = circle.getAttribute('style') || this.style
      } else {
        this.cx = circle.cx
        this.cy = circle.cy
        this.r = circle.r
        this.label = circle.label
        this.color = circle.color
        this.style = circle.style
      }
    }
  }

  /**
   * 获取创建圆形标记的属性
   */
  getAttributeForMake() {
    return this
  }

  /**
   * 获取上传圆形标记的属性
   */
  getAttributeForUpload() {
    return {
      cx: this.cx,
      cy: this.cy,
      r: this.r
    }
  }
}

/**
 * 路径属性类
 * @porperty d 路径
 * @porperty label 标签id
 * @porperty color 标记颜色
 * @porperty style 标签属性
 */
export class pathAttributeClass extends markAttributeClass {
  /** 路径 */
  d: string
  /** 填充规则 */
  'fill-rule': string

  /**
   * @param { SVGElement | object } path 一个路径元素或者路径参数对象,为空表示使用默认值
   */
  constructor(path?: SVGElement | pathAttributeClass) {
    super()
    this.d = ''
    this['fill-rule'] = 'evenodd'

    if (typeof path !== 'undefined') {
      if (path instanceof SVGElement) {
        this.d = path.getAttribute('d') || this.d
        this.label = path.getAttribute('label') || this.label
        this.color = path.getAttribute('color') || this.color
        this.style = path.getAttribute('style') || this.style
      } else {
        this.d = path.d
        this.label = path.label
        this.color = path.color
        this.style = path.style
      }
    }
  }

  /**
   * 获取创建路径标记的属性
   */
  getAttributeForMake() {
    return this
  }

  /**
   * 获取上传路径标记的属性
   */
  getAttributeForUpload() {
    let uploadInfo = {
      mark: {
        points: ''
      },
      cutMark: [] as {
        labelType: string
        points: string
      }[]
    }
    let isLead = true
    for (const points of this.d.split('Z')) {
      if (points !== '') {
        if (isLead) {
          uploadInfo.mark.points = points.trim().replace(/[a-zA-Z]/g, '')
          isLead = false
        } else {
          let tmpMark = {
            labelType: DrawShapePolygon,
            points: points.trim().replace(/[a-zA-Z]/g, '')
          }
          uploadInfo.cutMark.push(tmpMark)
        }
      }
    }
    return uploadInfo
  }
}
