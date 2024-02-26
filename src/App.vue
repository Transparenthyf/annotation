<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { onMounted, reactive, ref } from 'vue'

// 常量
import {
  // DrawStatePoint,
  // DrawStateReady,
  // DrawStateDrawing,
  // DrawStateAlter,
  // DrawStateAltering,
  // DrawStateCutout,
  // DrawStateCutouting,
  // DrawStateCut,
  // DrawStateCuting,
  DrawShapePolygon,
  DrawShapeRect,
  DrawShapeCircle,
  DrawShapePolyLine
  // DrawShapePath
} from './utils/constant/annotationConstant'

// 函数
import { formatFloat } from './utils/method/annotationMethod'

const canvasRef = ref()

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
  ] as { name: string; displayName: string; color: string }[],
  /** 选择的标签 */
  selectedLabel: '',
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
      shape: DrawShapePolyLine,
      displayName: '多段线'
    }
  ] as { shape: string; displayName: string }[],
  /** 选择的标记形状 */
  selectShape: ''
})

/** 绘制相关 */
const draw = reactive({
  /** 绘制状态 */
  state: ''
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
  width: 800
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
  console.log(labelName)
}

// **************************** 监听浏览器事件 ****************************

/** 鼠标移动事件 */
function mousemove(event: any) {
  cursorInfo.absoluteX = event.clientX
  cursorInfo.absoluteY = event.clientY
}

/** 滚动条事件 */
function canvasScroll(event: any) {
  console.log('触发了滚动条事件', event)
}

/** 鼠标滚轮事件 */
function canvasWheel(event: any) {
  console.log('触发了鼠标滚轮事件', event)
}

/** 点击画布事件 */
function clickCanvas(event: any) {
  console.log('触发了点击画布事件', event)
}

/** 双击画布事件 */
function finishDraw(event: any) {
  console.log('触发了双击画布事件', event)
}

/** 右键画布事件 */
function cancelDraw(event: any) {
  console.log('触发了右键画布事件', event)
}

// **************************** 绘制相关函数 ****************************

// **************************** 加载相关函数 ****************************

async function loadImage() {
  let tmpImage = new Image()
  tmpImage.src = imageInfo.url

  canvasRef.value.style.backgroundImage = imageInfo.url

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(false)
    }, 3000)
    tmpImage.onload = () => {
      imageInfo.naturalWidth = tmpImage.naturalWidth
      imageInfo.naturalHeight = tmpImage.naturalHeight
      imageInfo.aspectRatio = formatFloat(tmpImage.naturalHeight / tmpImage.naturalWidth, 3)

      canvasRef.value.viewBox.baseVal.width = imageInfo.naturalWidth
      canvasRef.value.viewBox.baseVal.height = imageInfo.naturalHeight

      canvasRef.value.width.baseVal.value = canvasInfo.width
      canvasRef.value.height.baseVal.value = formatFloat(canvasInfo.width * imageInfo.aspectRatio, 3)

      console.log(imageInfo)
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
      <el-radio-group v-model="view.selectShape" size="small">
        <el-radio border v-for="item in view.drawShape" :key="item.shape" :label="item.shape">
          {{ item.displayName }}
        </el-radio>
      </el-radio-group>
    </el-header>
    <el-container id="annotationBody">
      <!-- 主体的左侧区域 标签组部分-->
      <el-aside id="labelSide">
        <!-- 左侧标签部分 -->
        <el-radio-group v-model="view.selectedLabel" size="small">
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
          @dblclick="finishDraw"
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
      }
    }
  }
}
</style>
