import { toFixed3 } from '../method/commonMethod'
import { setRectTransfrom, getRectCenterPoint } from '../method/annotationMethod'
import { DrawShapePolygon } from '../constant/annotationConstant'

let markId = 0

/**
 * 标记属性的基类
 * @porperty label 标签id
 * @porperty color 标记颜色
 * @porperty style 标签属性
 */
export class markAttributeClass {
  constructor() {
    /**name属性 用于删除面积*/
    this.name = ++markId
    /** 标签id */
    this.label = ''
    /** 标记颜色 */
    this.color = ''
    /** 标签属性 */
    this.style = ''
    /** 标记类型 */
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
  /**
   * @param {SVGElement|object|undefined} polygon 一个多边形元素或者多边形参数对象,为空表示使用默认值
   */
  constructor(polygon) {
    super()
    /** 多边形点的集合 */
    this.points = ''

    if (typeof polygon !== 'undefined') {
      if (polygon instanceof SVGElement) {
        this.points = polygon.getAttribute('points')
      } else {
        this.points = polygon.points
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
  /**
   * @param {SVGElement|object|undefined} rect 一个矩形元素或者多边形参数对象,为空表示使用默认值
   */
  constructor(rect) {
    super()
    /** 矩形左上角横坐标 */
    this.x = 0
    /** 矩形左上角纵坐标 */
    this.y = 0
    /** 宽 */
    this.width = 0
    /** 高 */
    this.height = 0
    /** 旋转 */
    this.transform = 'rotate(0, 0, 0)'

    if (typeof rect !== 'undefined') {
      if (rect instanceof SVGElement) {
        this.x = toFixed3(rect.getAttribute('x'))
        this.y = toFixed3(rect.getAttribute('y'))
        this.width = toFixed3(rect.getAttribute('width'))
        this.height = toFixed3(rect.getAttribute('height'))
        this.transform = rect.getAttribute('transform')
      } else {
        this.x = rect.x
        this.y = rect.y
        this.width = rect.width
        this.height = rect.height
        //防止返回的标记身上没有angel会报错
        if (rect.angle !== undefined) {
          this.transform = setRectTransfrom(rect.angle, getRectCenterPoint(this))
        } else {
          this.transform = setRectTransfrom(0, getRectCenterPoint(this))
        }
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
  /**
   * @param {SVGElement|object|undefined} circle 一个圆形元素或者圆形参数对象,为空表示使用默认值
   */
  constructor(circle) {
    super()
    /** 圆心横坐标 */
    this.cx = 0
    /** 圆心纵坐标 */
    this.cy = 0
    /** 半径 */
    this.r = 0

    if (typeof circle !== 'undefined') {
      if (circle instanceof SVGElement) {
        this.cx = toFixed3(circle.getAttribute('cx'))
        this.cy = toFixed3(circle.getAttribute('cy'))
        this.r = toFixed3(circle.getAttribute('r'))
      } else {
        this.cx = circle.cx
        this.cy = circle.cy
        this.r = circle.r
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
  /**
   * @param {SVGElement|object|undefined} path 一个路径元素或者路径参数对象,为空表示使用默认值
   */
  constructor(path) {
    super()
    /** 路径 */
    this.d = ''
    this['fill-rule'] = 'evenodd'

    if (typeof path !== 'undefined') {
      if (path instanceof SVGElement) {
        this.d = path.getAttribute('d')
        this.label = path.getAttribute('label')
        this.color = path.getAttribute('color')
        this.style = path.getAttribute('style')
      } else {
        this.d = path.d
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
      cutMark: []
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

//在这里添加一个文本标记的类（类似于多边形等）
