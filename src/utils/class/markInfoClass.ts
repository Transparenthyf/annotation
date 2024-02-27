import {
  polygonAttributeClass,
  rectAttributeClass,
  circleAttributeClass,
  pathAttributeClass
} from './markAttributeClass'

/**
 * 标记文本属性类
 */
export class markTextAttributeClass {
  /** 标记 id */
  name: number
  /** 显示位置横坐标 */
  x: number
  /** 显示位置纵坐标 */
  y: string
  /** 字体颜色 */
  fill: string

  constructor() {
    this.name = -1
    this.x = -1
    this.y = ''
    this.fill = '#FF0000'
  }
}

/**
 * 标记文本类
 * @porperty message 要显示的信息
 * @porperty markTextAttribute 标签属性
 */
export class markTextClass {
  /** 要显示的信息 */
  message: string
  /** 标签属性 */
  markTextAttribute: markTextAttributeClass

  constructor() {
    this.message = ''
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
  /** 标记 id */
  name: number
  /** 标记类型 */
  shape: string
  /** 标记属性 */
  markAttribute: polygonAttributeClass | rectAttributeClass | circleAttributeClass | pathAttributeClass | null
  /** 标记文本 */
  markText: markTextClass[]
  /**
   * 标记属性
   * @type {}
   */
  constructor(shape: string) {
    this.name = -1
    this.shape = shape
    this.markAttribute = null
    this.markText = []
  }
}
