<template>
  <div>
    <mu-button icon @click="selectImage()" title="上传">
      <mu-icon value="vertical_align_top"></mu-icon>
    </mu-button>
    <input
      ref="imageInput"
      class="hidden-input"
      type="file"
      accept="image/png,image/jpeg,image/gif,image/bmp"
      @change="uploadImage()" />
    <i-checker :image-src="imgUrl"></i-checker>
  </div>
</template>

<script>
import imageWithChecker from './imageWithChecker';
import { calculateBytes } from '../lib/util';

export default {
  date() {
    return {
      imgUrl: this.src,
      imgTitle: '',
      allowImageUploadFiles: ['.png', '.jpg', '.bmp', '.gif'],
      MAX_IMG_SIZE: 5 * 1024 * 1024,
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
      this.$emit('uploadBegin');
      const formData = new FormData();
      formData.append('upfile', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload_image', true);
      xhr.send(formData);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status !== 200) {
            return this.$emit('prepareError', `上传失败：${xhr.status} ${xhr.statusText}`);
          }
          try {
            const { result, url } = JSON.parse(xhr.responseText);
            if (result !== 0) {
              return this.$emit('prepareError', `上传失败：${xhr.responseText}`);
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
