<template>
  <div id="app">
    <mu-appbar class="app-title" color="primary" title="上传图片测试"></mu-appbar>
    <section class="app-content">
      <ul class="image-list">
        <li class="image-line" v-for="image in images" :key="image.i">
          <i-checker :image-src="image.url"></i-checker>
          <span title="点击复制链接地址" @click="copy(image.url)">{{ image.url }}</span>
        </li>
      </ul>
      <i-upload
        :src="tempImage"
        @prepareError="uploadImageError"
        @uploadBegin="uploadImageStart"
        @error="uploadImageError"
        @success="uploadImageSuccess"></i-upload>
    </section>
  </div>
</template>

<script>
import imageUpload from '../components/imageUpload';
import imageWithChecker from '../components/imageWithChecker';

export default {
  data() {
    return {
      images: [],
      tempImage: '',
      imgUploading: false,
    };
  },
  methods: {
    uploadImageError(str) {
      this.$toast.error(str);
      this.imgUploading = false;
    },
    uploadImageStart() {
      this.imgUploading = true;
    },
    uploadImageSuccess(url) {
      this.images.push({ url, i: this.images.length });
      this.imgUploading = false;
      this.tempImage = '';
    },
    copy(url) {
      this
        .$copyText(url)
        .then(() => {
          this.$toast.success('已复制到剪贴板');
        }).catch((err) => {
          this.$toast.error(`复制失败 ${err}`);
        });
    },
  },
  components: {
    'i-upload': imageUpload,
    'i-checker': imageWithChecker,
  },
};
</script>

<style lang="less">
.app-title {
  width: 100%;
}
.app-content {
  padding: 20px;
  .image-list {
    padding: 0;
    margin: 0 0 20px 0;
    list-style: noen;
    .image-line {
      list-style: none;
      padding: 0;
      margin: 5px 0;
      display: flex;
      align-items: center;
      .thumbnail {
        max-width: 200px;
      }
      span {
        cursor: pointer;
        line-height: 36px;
        font-size: 14px;
        color: #2196f3;
        word-break: break-all;
        white-space: pre-wrap;
        margin-left: 10px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .image-upload {
    .image-upload-btn {
      font-size: 14px;
      // min-width: 88px;
      display: block;
      height: 36px;
      line-height: 36px;
      border-radius: 2px;
      background-color: #2196f3;
      color: #ffffff;
      -webkit-box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
      box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    }
    .image-with-checker {
      display: none;
    }
  }
}
</style>
