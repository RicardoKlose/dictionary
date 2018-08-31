<template>
  <mu-flex class="image-upload" align-items="start">
    <mu-flex
      fill
      justify-content="start"
      data-mu-loading-color="secendary"
      data-mu-loading-overlay-color="rgba(0, 0, 0, .7)"
      v-loading="uploading">
      <i-checker :image-src="imgUrl"></i-checker>
    </mu-flex>
    <mu-flex fill justify-content="end">
      <a class="image-upload-btn" flat @click="selectImage()">
        上传
      </a>
    </mu-flex>
    <input
      ref="imageInput"
      class="hidden-input"
      type="file"
      accept="image/png,image/jpeg,image/gif,image/bmp"
      @change="uploadImage()" />
  </mu-flex>
</template>

<script>
import imageWithChecker from './imageWithChecker';
import { calculateBytes } from '../lib/util';

export default {
  data() {
    return {
      imgUrl: this.src,
      imgTitle: '',
      allowImageUploadFiles: ['.png', '.jpg', '.bmp', '.gif'],
      MAX_IMG_SIZE: 5 * 1024 * 1024,
      xhr: null,
      uploading: false,
    };
  },
  computed: {
    allowImageUploadFilesReg() {
      return new RegExp(`^(\\${this.allowImageUploadFiles.join('|\\')})$`);
    },
    UploadState() {
      return {
        SIZELIMITEXCEED: `图片文件大小不能超过${calculateBytes(this.MAX_IMG_SIZE)}`,
        TYPENOTALLOW: '不支持上传该文件类型',
      };
    },
  },
  props: {
    src: {
      type: String,
    },
  },
  methods: {
    selectImage() {
      this.$refs.imageInput.click();
    },
    uploadImage() {
      const input = this.$refs.imageInput;
      const filePath = input.value;
      if (!filePath) {
        return null;
      }
      const fileExt = `.${filePath.split('.').slice(-1)[0].toLowerCase()}`;
      if (!this.allowImageUploadFilesReg.test(fileExt)) {
        return this.$emit('prepareError', '文件格式错误');
      }
      const file = input.files[0];
      if (file.size > this.MAX_IMG_SIZE) {
        return this.$emit('prepareError', this.UploadState.SIZELIMITEXCEED);
      }
      this.uploading = false;
      if (this.xhr) {
        this.xhr.onreadystatechange = null;
        if (this.xhr.readyState === 3) {
          this.xhr.abort();
        }
      }
      this.$emit('uploadBegin');
      const formData = new FormData();
      formData.append('upfile', file);
      this.xhr = new XMLHttpRequest();
      this.xhr.open('POST', '/upload_image', true);
      this.xhr.send(formData);
      this.xhr.onreadystatechange = () => {
        if (this.xhr.readyState === 4) {
          this.uploading = false;
          if (this.xhr.status !== 200) {
            return this.$emit('prepareError', `上传失败：${this.xhr.status} ${this.xhr.statusText}`);
          }
          try {
            const { result, url } = JSON.parse(this.xhr.responseText);
            if (result !== 0) {
              return this.$emit('prepareError', `上传失败：${this.xhr.responseText}`);
            }
            this.$emit('success', url);
            this.imgUrl = url;
          } catch (err) {
            this.imgUrl = '';
            this.$emit('error', `上传失败 ${err}`);
          }
        }
        return null;
      };
      this.uploading = true;
      return null;
    },
  },
  watch: {
    src(val) {
      this.imgUrl = val;
      this.imgTitle = '';
    },
  },
  components: {
    'i-checker': imageWithChecker,
  },
};
</script>

<style scope lang="less">
.image-upload {
  .image-upload-btn {
    font-size: 16px;
    line-height: 24px;
    color: #2196f3;
    cursor: pointer;
    min-width: 50px;
    text-align: center;
    &:hover {
      text-decoration: underline;
    }
  }
  .image-with-checker {
    img {
      max-height: 300px;
      max-width: 100%;
    }
  }
  .hidden-input {
    visibility: hidden;
    height: 0;
    width: 0;
  }
}
</style>
