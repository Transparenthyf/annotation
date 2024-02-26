import { polygonAttributeClass, rectAttributeClass, circleAttributeClass } from './markAttributeClass'

/**
 * 标记文本属性类
 */
export class markTextAttributeClass {
  constructor() {
    /** 标记 id */
    this.name = -1
    /** 显示位置横坐标 */
    this.x = -1
    /** 显示位置纵坐标 */
    this.y = ''
    /** 字体颜色 */
    this.fill = '#FF0000'
  }
}

/**
 * 标记文本类
 * @porperty message 要显示的信息
 * @porperty markTextAttribute 标签属性
 */
export class markTextClass {
  constructor() {
    /** 要显示的信息 */
    this.message = ''
    /** 标签属性 */
    this.markTextAttribute = new markTextAttributeClass()
  }
}

/**
 * 标记信息类
 * @porperty markId 标记 id
 * @porperty shape 标记类型
 * @porperty markAttribute 标记属性
 * @porperty markText 标记文本信息
 */
export class markInfoClass {
  constructor(shape) {
    /** 标记 id */
    this.name = -1
    /** 标记类型 */
    this.shape = shape
    /**
     * 标记属性
     * @type {polygonAttributeClass | rectAttributeClass | circleAttributeClass}
     */
    this.markAttribute = null
    /**
     * 标记文本信息
     * @type {markTextClass[]}
     */
    this.markText = []
  }
}
