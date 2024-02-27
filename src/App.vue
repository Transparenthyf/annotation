<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { onMounted, reactive, ref } from 'vue'

// 函数
import {
  formatFloat,
  makeMark,
  getMarkStyle,
  getRectTransform,
  getRectCenterPoint,
  setRectTransfrom,
  PolylineToPolygon,
  threePointsToCircle,
  circleToPolygon
} from './utils/method/annotationMethod'

// 类
import {
  polygonAttributeClass,
  rectAttributeClass
  // circleAttributeClass,
  // pathAttributeClass
} from './utils/class/markAttributeClass'

// 常量
import {
  DrawStatePoint,
  DrawStateReady,
  DrawStateDrawing,
  DrawStateAlter,
  DrawStateAltering,
  DrawStateCutout,
  DrawStateCutouting,
  DrawStateCut,
  DrawStateCuting,
  DrawShapePolygon,
  DrawShapeRect,
  DrawShapeCircle,
  DrawShapePolyline
  // DrawShapePath
} from './utils/constant/annotationConstant'

/** 画布 */
const canvasRef = ref()

/** 画布相对窗口的横坐标 */
const canvasOffsetX = 100
/** 画布相对窗口的纵坐标 */
const canvasOffsetY = 90

interface label {
  name: string
  displayName: string
  color: string
}
/** 界面相关 */
const view = reactive({
  /** 标签列表 */
  labelList: [
    {
      name: 'L1',
      displayName: '缺块',
      color: '#FF0000'
    },
    {
      name: 'L2',
      displayName: '裂缝',
      color: '#0000FF'
    },
    {
      name: 'L3',
      displayName: '杂质',
      color: '#00FF00'
    }
  ] as label[],
  /** 选择的标签 */
  selectedLabel: {} as label,
  /** 标记形状 */
  drawShape: [
    {
      shape: DrawShapePolygon,
      displayName: '多边形'
    },
    {
      shape: DrawShapeRect,
      displayName: '矩形'
    },
    {
      shape: DrawShapeCircle,
      displayName: '圆形'
    },
    {
      shape: DrawShapePolyline,
      displayName: '多段线'
    }
  ] as { shape: string; displayName: string }[]
})

/** 绘制相关 */
const draw = reactive({
  /** 绘制状态 */
  state: DrawStatePoint,
  /** 形状 */
  shape: DrawShapePolygon,
  /** 标签 */
  label: '',
  /** 颜色 */
  color: '',
  /** 多段线宽度 */
  polylineWidth: 10,
  /** 当前操作的标记 */
  mark: null as SVGElement | null
})

/** 绘制辅助 */
const assist = reactive({
  polyline: {
    points: ''
  },
  polygon: {
    points: ''
  },
  rect: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  circle: {
    cx: 0,
    cy: 0,
    r: 0
  },
  path: {
    d: ''
  }
})

/** 图片信息 */
const imageInfo = reactive({
  /** 图片链接 */
  url: 'http://localhost:2999/ImageCrop-131-1705397125719-6-7267.png',
  /** 原始宽度 */
  naturalWidth: 0,
  /** 原始高度 */
  naturalHeight: 0,
  /** 宽高比 */
  aspectRatio: 1
})

/** 画布信息 */
const canvasInfo = reactive({
  /** 当前宽度 */
  width: 800,
  /** 缩放比 */
  zoomRatio: 1,
  /** 滚动条上下偏移量 */
  offsetTop: 0,
  /** 滚动条左右偏移量 */
  offsetLeft: 0
})

/** 光标信息 */
const cursorInfo = reactive({
  /** 绝对横坐标 */
  absoluteX: 0,
  /** 绝对纵坐标 */
  absoluteY: 0,
  /** 相对画布横坐标 */
  relativeX: 0,
  /** 相对画布纵坐标 */
  relativeY: 0
})

// **************************** 界面操作 ****************************

/** 选择标签 */
function selectLabel(labelName: string) {
  for (const label of view.labelList) {
    if (label.name === labelName) {
      view.selectedLabel = label
      draw.label = label.name
      draw.color = label.color
      changeDrawState(DrawStateReady)
    }
  }
}

// **************************** 监听浏览器事件 ****************************

/** 鼠标移动事件 */
function mousemove(event: any) {
  cursorInfo.absoluteX = formatFloat(event.clientX, 3)
  cursorInfo.absoluteY = formatFloat(event.clientY, 3)
  cursorInfo.relativeX = formatFloat((event.clientX - canvasOffsetX + canvasInfo.offsetLeft) * canvasInfo.zoomRatio, 3)
  cursorInfo.relativeY = formatFloat((event.clientY - canvasOffsetY + canvasInfo.offsetTop) * canvasInfo.zoomRatio, 3)

  switch (draw.state) {
    case DrawStatePoint:
      break

    case DrawStateReady:
      break

    case DrawStateDrawing:
      updateMarkAttribute()
      break

    case DrawStateAlter:
      break

    case DrawStateAltering:
      break

    case DrawStateCutout:
      break

    case DrawStateCutouting:
      break

    case DrawStateCut:
      break

    case DrawStateCuting:
      break
  }
}

/** 滚动条事件 */
function canvasScroll(event: any) {
  canvasInfo.offsetTop = event.target.scrollTop
  canvasInfo.offsetLeft = event.target.scrollLeft
}

/** 鼠标滚轮事件 */
function canvasWheel(event: any) {
  if (canvasInfo.width > 300 || event.wheelDelta > 0) {
    canvasInfo.width += event.wheelDelta / 5
    canvasInfo.zoomRatio = imageInfo.naturalWidth / canvasInfo.width

    // 修改画布大小
    canvasRef.value.width.baseVal.value = canvasInfo.width
    canvasRef.value.height.baseVal.value = formatFloat(canvasInfo.width * imageInfo.aspectRatio, 3)
  }
}

/** 点击画布事件 */
function clickCanvas() {
  switch (draw.state) {
    case DrawStatePoint:
      break

    case DrawStateReady:
      startDraw()
      break

    case DrawStateDrawing:
      drawing()
      break

    case DrawStateAlter:
      break

    case DrawStateAltering:
      break

    case DrawStateCutout:
      break

    case DrawStateCutouting:
      break

    case DrawStateCut:
      break

    case DrawStateCuting:
      break
  }
}

/** 双击画布事件 */
function dblclickCanvas() {
  finishDraw()
}

/** 右键画布事件 */
function cancelDraw() {
  if (draw.mark !== null) {
    draw.mark.remove()
    changeDrawState(DrawStateReady)
    draw.mark = null
  }
}

// **************************** 绘制相关函数 ****************************

/** 开始标注 */
function startDraw() {
  let tmpShape = draw.shape === DrawShapeCircle ? DrawShapePolygon : draw.shape
  draw.mark = makeMark(tmpShape, getMarkAttribute(tmpShape))

  if (draw.mark !== null) {
    // 记录辅助信息
    let tmpPoints = '' as string | null
    switch (draw.shape) {
      case DrawShapePolyline:
        tmpPoints = draw.mark.getAttribute('points')
        if (tmpPoints !== null) {
          assist.polyline.points = tmpPoints
        }
        break

      case DrawShapePolygon:
        tmpPoints = draw.mark.getAttribute('points')
        if (tmpPoints !== null) {
          assist.polygon.points = tmpPoints
        }
        break

      case DrawShapeRect:
        let tmpX = draw.mark.getAttribute('x')
        if (tmpX !== null) {
          assist.rect.x = formatFloat(parseFloat(tmpX), 3)
        }

        let tmpY = draw.mark.getAttribute('y')
        if (tmpY !== null) {
          assist.rect.y = formatFloat(parseFloat(tmpY), 3)
        }
        break

      case DrawShapeCircle:
        tmpPoints = draw.mark.getAttribute('points')
        if (tmpPoints !== null) {
          assist.polygon.points = tmpPoints
        }
        break
    }

    canvasRef.value.append(draw.mark)

    switch (draw.state) {
      case DrawStateReady:
        changeDrawState(DrawStateDrawing)
        break

      case DrawStateCut:
        changeDrawState(DrawStateCuting)
        break
    }
  }
}

/** 根据标记类型更新相应的标记属性 */
function updateMarkAttribute() {
  if (draw.mark !== null) {
    switch (draw.shape) {
      case DrawShapePolyline:
        draw.mark.setAttribute(
          'points',
          assist.polyline.points + ' ' + cursorInfo.relativeX + ',' + cursorInfo.relativeY
        )
        break

      case DrawShapePolygon:
        draw.mark.setAttribute(
          'points',
          assist.polygon.points + ' ' + cursorInfo.relativeX + ',' + cursorInfo.relativeY
        )
        break

      case DrawShapeRect: //绘制矩形
        let rectAttribute = new rectAttributeClass(draw.mark)
        let angle = getRectTransform(draw.mark).angle
        draw.mark.setAttribute('width', String(formatFloat(cursorInfo.relativeX - assist.rect.x, 3)))
        draw.mark.setAttribute('height', String(formatFloat(cursorInfo.relativeY - assist.rect.y, 3)))
        draw.mark.setAttribute('transform', setRectTransfrom(angle, getRectCenterPoint(rectAttribute)))
        break

      case DrawShapeCircle: //绘制圆形
        draw.mark.setAttribute(
          'points',
          assist.polygon.points + ' ' + cursorInfo.relativeX + ',' + cursorInfo.relativeY
        )
        break
    }
  }
}

/** 此时为标注中状态 继续绘制 */
function drawing() {
  if (draw.mark !== null) {
    let tmpPoints = '' as string | null
    switch (draw.shape) {
      //画多段线与画多边形一样
      case DrawShapePolyline:
        tmpPoints = draw.mark.getAttribute('points')
        if (tmpPoints !== null) {
          assist.polyline.points = tmpPoints
        }
        break

      case DrawShapePolygon:
        tmpPoints = draw.mark.getAttribute('points')
        if (tmpPoints !== null) {
          assist.polygon.points = tmpPoints
        }
        break

      case DrawShapeRect:
        // console.log('这里画的是矩形缺陷,功能还未添加')
        break

      case DrawShapeCircle:
        tmpPoints = draw.mark.getAttribute('points')
        if (tmpPoints !== null) {
          assist.polygon.points = tmpPoints
        }

        //判断多边形的点是否为3个,若是则进入结束绘制
        if (assist.polygon.points.split(' ').length === 3) {
          finishDraw()
        }
        break
    }
  }
}

/** 结束绘制 */
function finishDraw() {
  if (draw.mark === null) {
    return
  }
  switch (draw.state) {
    case DrawStateDrawing:
      /** 能否结束 */
      let finishEnable = false

      // 判断能否结束
      let tmpPoints = '' as string | null
      switch (draw.shape) {
        case DrawShapePolyline:
          tmpPoints = draw.mark.getAttribute('points')
          if (tmpPoints !== null && tmpPoints.split(' ').length >= 2) {
            // 将多段线转换成多边形
            let tmpPolygon = PolylineToPolygon(draw.mark, draw.polylineWidth)
            draw.mark.remove()
            canvasRef.value.append(tmpPolygon)
            draw.mark = tmpPolygon

            finishEnable = true
          }
          break

        case DrawShapePolygon:
          tmpPoints = draw.mark.getAttribute('points')
          if (tmpPoints !== null && tmpPoints.split(' ').length > 2) {
            finishEnable = true
          }
          break

        case DrawShapeRect:
          let tmpWidth = draw.mark.getAttribute('width')
          let tmpHeight = draw.mark.getAttribute('height')
          if (tmpWidth !== null && parseFloat(tmpWidth) > 0 && tmpHeight !== null && parseFloat(tmpHeight) > 0) {
            finishEnable = true
          }
          break

        case DrawShapeCircle:
          tmpPoints = draw.mark.getAttribute('points')
          if (tmpPoints !== null && tmpPoints.split(' ').length === 3) {
            let tmpCircle = circleToPolygon(threePointsToCircle(draw.mark))
            draw.mark.remove()
            canvasRef.value.append(tmpCircle)
            draw.mark = tmpCircle

            finishEnable = true
          }
          break
      }

      if (finishEnable === true) {
        changeDrawState(DrawStateReady)
        draw.mark = null
      }
      break
  }
}

/**
 * 根据标记形状生成标记属性
 * @param shape 标记形状
 */
function getMarkAttribute(shape: string) {
  /** 标签属性 */
  let attribute = null
  // 根据标记类型，添加属性
  switch (shape) {
    //绘制多段线与绘制多边形都是记录点信息
    case DrawShapePolyline:
    case DrawShapePolygon:
      attribute = new polygonAttributeClass()
      attribute.points = cursorInfo.relativeX + ',' + cursorInfo.relativeY

      break

    case DrawShapeRect:
      attribute = new rectAttributeClass()
      attribute.x = cursorInfo.relativeX
      attribute.y = cursorInfo.relativeY
      break

    case DrawShapeCircle:
      attribute = new polygonAttributeClass()
      attribute.points = cursorInfo.relativeX + ',' + cursorInfo.relativeY
      break
  }
  if (attribute !== null) {
    attribute.label = view.selectedLabel.name
    attribute.color = view.selectedLabel.color
    attribute.style = getMarkStyle(view.selectedLabel.color, 0)
  }

  return attribute
}

/**
 * 改变标注状态
 * @param state 标注状态
 */
function changeDrawState(state: string) {
  draw.state = state
}

// **************************** 加载相关函数 ****************************

async function loadImage() {
  let tmpImage = new Image()
  tmpImage.src = imageInfo.url

  canvasRef.value.style.backgroundImage = 'url(' + imageInfo.url + ')'

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(false)
    }, 3000)
    tmpImage.onload = () => {
      imageInfo.naturalWidth = tmpImage.naturalWidth
      imageInfo.naturalHeight = tmpImage.naturalHeight
      imageInfo.aspectRatio = formatFloat(tmpImage.naturalHeight / tmpImage.naturalWidth, 3)

      canvasInfo.zoomRatio = tmpImage.naturalWidth / canvasInfo.width

      canvasRef.value.viewBox.baseVal.width = imageInfo.naturalWidth
      canvasRef.value.viewBox.baseVal.height = imageInfo.naturalHeight

      canvasRef.value.width.baseVal.value = canvasInfo.width
      canvasRef.value.height.baseVal.value = formatFloat(canvasInfo.width * imageInfo.aspectRatio, 3)
      resolve(true)
    }
  })
}

// **************************** 生命周期钩子函数 ****************************

onMounted(() => {
  document.addEventListener('mousemove', mousemove)
  loadImage()
})
</script>

<template>
  <Header></Header>
  <el-container id="annotationBox">
    <el-header id="statusBar">
      <span>当前状态：{{ draw.state }}</span>
      <el-radio-group v-model="draw.shape" size="small">
        <el-radio border v-for="item in view.drawShape" :key="item.shape" :label="item.shape">
          {{ item.displayName }}
        </el-radio>
      </el-radio-group>
    </el-header>
    <el-container id="annotationBody">
      <!-- 主体的左侧区域 标签组部分-->
      <el-aside id="labelSide">
        <!-- 左侧标签部分 -->
        <el-radio-group v-model="view.selectedLabel.name" size="small">
          <el-radio
            border
            v-for="label in view.labelList"
            :key="label.name"
            :label="label.name"
            :style="'border-color:' + label.color"
            @change="selectLabel(label.name)"
          >
            {{ label.displayName }}
          </el-radio>
        </el-radio-group>
      </el-aside>

      <!-- 标注区域 -->
      <el-main id="annotationMain" @scroll="canvasScroll" @wheel.prevent="canvasWheel">
        <svg
          id="canvas"
          ref="canvasRef"
          height="0"
          width="0"
          @click="clickCanvas"
          @dblclick="dblclickCanvas"
          @contextmenu.prevent="cancelDraw"
          onselectstart="return false;"
        ></svg>
      </el-main>
    </el-container>
  </el-container>
  <Footer></Footer>
</template>

<style scoped lang="less">
#annotationBox {
  height: calc(100% - 60px);
  #annotationHeader {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-bottom: 1px solid #dcdfe6;
    h1 {
      margin: 0;
    }
  }
  #statusBar {
    padding: 0;
    height: 30px;
    * {
      margin-right: 10px;
    }
  }
  #annotationBody {
    overflow: hidden;
    #labelSide {
      display: flex;
      flex-direction: column;
      width: 100px;
      padding: 10px;
      .el-radio {
        width: 100%;
        margin: 5px 0;
      }
    }
    #annotationMain {
      padding: 0;
      #canvas {
        background-repeat: no-repeat;
        background-size: cover;
      }
    }
  }
}
</style>
