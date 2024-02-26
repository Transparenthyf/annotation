<script setup lang="ts">
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import { onMounted, reactive, ref } from 'vue'
import {
  DrawShapePolygon,
  DrawShapeRect,
  DrawShapeCircle,
  DrawShapePolyLine,
  DrawShapePath
} from './utils/constant/annotationConstant'

const canvasRef = ref()

const view = reactive({
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
  ],
  selectedLabel: '',
  annotationShape: [
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
    },
    {
      shape: DrawShapePath,
      displayName: '环形'
    }
  ],
  selectShape: ''
})

function selectLabel(labelName: string) {
  console.log(labelName)
}

function canvasScroll() {}

function canvasWheel() {}

function clickCanvas() {}

function finishDraw() {}

function cancelDraw() {}

onMounted(() => {
  console.log(canvasRef.value.style.backgroundImage)
  canvasRef.value.setAttribute('width', 1000)
  canvasRef.value.setAttribute('height', 500)
  canvasRef.value.style.backgroundImage = 'url(http://localhost:2999/ImageCrop-131-1705397125719-6-7267.png)'
})
</script>

<template>
  <Header></Header>
  <el-container id="annotationBox">
    <el-header id="statusBar">
      <span>当前状态：指针状态</span>
      <el-radio-group v-model="view.selectShape" size="small">
        <el-radio border v-for="item in view.annotationShape" :key="item.shape" :label="item.shape">
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
  height: calc(100% - 90px);
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
