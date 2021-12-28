<template>
  <div class="home">
    <div class="drop_zone" @drop="dropHandler($event);" @dragover="$event.preventDefault()"
         @dragenter="isHighLighted = true"
         @dragleave="isHighLighted = false"
         :class="isHighLighted ? 'highlight' : ''">
      <div>粘贴截图或把截图拖到这里 ...</div>
      <div>(一次只支持一张)</div>
    </div>
    <div v-for="(result,index) of results" class="result_zone">
      <img :src="result.imageSrc" :key="index" style="height: 300px" alt="">
      <div v-for="(item,index) of result.result" :key="index">
        {{ item.name }}(总量{{ item.total }})可能的情况为：
        <div v-for="(res,index) of item.result" :key="index">
          &nbsp;&nbsp;&nbsp;&nbsp;该词条出现{{ res.times }}次，每次分别为：{{ res.values }}，该情况词条品质得分(满分100)：{{ res.score }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
import axios from "axios";
import { analyzeRelicInfo, fileToBase64 } from "@/utils";
import { ArtifactAnalysis } from "@/types";

export default {
  name: 'Home',
  setup() {
    const isHighLighted = ref<boolean>(false)
    const results = ref<Array<ArtifactAnalysis>>([])

    function dropHandler(e: DragEvent) {
      e.preventDefault()
      isHighLighted.value = false
      if (e.dataTransfer?.files[0]) {
        handleFileUpload(e.dataTransfer.files[0])
      }
    }

    document.onpaste = function (e: ClipboardEvent) {
      if (e.clipboardData?.files[0]) {
        handleFileUpload(e.clipboardData.files[0])
      }
    }

    function handleFileUpload(file: File) {
      if (!file.type.startsWith('image')) {
        alert(`${file.name}不是图片文件，请重新上传`)
      } else if ((file.size / 1024) > 10240) {
        alert(`${file.name}大于10MB，请压缩后重新上传`)
      } else {
        fileToBase64(file).then(base64 => {
          // console.log(base64)
          axios.post('http://www.lzh0129.top:8081/relicRating/ocr', {
            picture: base64
          }).then(res => {
            console.log('接口请求成功', res)
            results.value.push({
              imageSrc: base64 || '',
              result: analyzeRelicInfo(res.data.data)
            })
          })
        })
      }
    }

    return {
      isHighLighted,
      dropHandler,
      results
    }
  }
};
</script>

<style scoped lang="scss">
.drop_zone {
  background: rgb(156, 206, 255);
  border: 4px dashed blue;
  width: 250px;
  height: 100px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  &.highlight {
    opacity: 0.5;
  }
}
</style>
