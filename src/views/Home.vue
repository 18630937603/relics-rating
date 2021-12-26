<template>
  <div class="home">
    <div id="drop_zone" @drop="dropHandler($event);" @dragover="$event.preventDefault()"
         @dragenter="isHighLighted = true"
         @dragleave="isHighLighted = false"
         :class="isHighLighted ? 'highlight' : ''">
      <p>Put picture here ...</p>
    </div>
    <img id="img" src="" alt="">
  </div>
</template>

<script lang="ts">
import {ref} from "vue";
import axios from "axios";

export default {
  name: 'Home',
  setup() {
    const isHighLighted = ref(false)

    function dropHandler(e: DragEvent) {
      e.preventDefault()
      isHighLighted.value = false
      for (let file of e.dataTransfer?.files || []) {
        if (!file.type.startsWith('image')) {
          alert(`${file.name}不是图片文件，请重新上传`)
        } else if ((file.size / 1024) > 10240) {
          alert(`${file.name}大于10MB，请压缩后重新上传`)
        } else {
          fileToBase64(file).then(base64=> {
            // console.log(base64)
            const img = document.getElementById('img') as HTMLImageElement;
            img.setAttribute('src', base64 || '')
            // axios.post('http://localhost:8081/relicRating/ocr',{
            //   picture: base64
            // }).then(res=>{
            //   console.log(res)
            // })
          })
        }
      }
    }

    async function fileToBase64(file: File) {
      return new Promise<string | undefined>(((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onloadend = (res) => {
          resolve(res.target?.result as string | undefined)
        }
        reader.onerror = (err) => {
          reject(err)
        }
      }))
    }

    return {
      isHighLighted,
      dropHandler,
    }
  }
};
</script>

<style scoped lang="scss">
#drop_zone {
  background: rgb(156, 206, 255);
  border: 5px solid blue;
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.highlight {
    opacity: 0.5;
  }
}
</style>
