<template>
  <div class="image-with-checker">
    <img v-if="srcValid" :src="imageSrc" title="查看大图" @click="checkBigImage()" />
    <span v-if="!srcValid">无</span>
    <mu-dialog
      class="check-image-dialog"
      max-width="75%"
      :scrollable="true"
      :fullscreen="full"
      :open.sync="showChecker">
      <mu-flex class="check-image-dialog-title" slot="title" align-items="center">
        <mu-flex class="title-left" justify-content="start" fill>
          查看大图
        </mu-flex>
        <mu-flex class="title-right" justify-content="end" fill>
          <mu-button slot="right" :title="fullBtnTitle" icon @click="toggleFull">
            <mu-icon :value="fullBtnValue"></mu-icon>
          </mu-button>
          <mu-button slot="right" title="关闭" icon @click="closeDialog">
            <mu-icon value="close"></mu-icon>
          </mu-button>
        </mu-flex>
      </mu-flex>
      <img class="check-origin-image" :src="imageSrc" />
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showChecker: false,
      full: false,
    };
  },
  props: {
    imageSrc: {
      type: String,
    },
  },
  computed: {
    srcValid() {
      return this.imageSrc && this.imageSrc !== 'about:blank';
    },
    fullBtnValue() {
      return this.full ? 'fullscreen_exit' : 'fullscreen';
    },
    fullBtnTitle() {
      return this.full ? '退出全屏' : '全屏';
    },
  },
  methods: {
    checkBigImage() {
      this.showChecker = true;
      this.full = false;
    },
    toggleFull() {
      this.full = !this.full;
    },
    closeDialog() {
      this.showChecker = false;
    },
  },
};
</script>

<style scope lang="less">
.image-with-checker {
  img {
    cursor: pointer;
    max-width: 150px;
    max-height: 150px;
  }
}
.check-image-dialog {
  .check-image-dialog-title {
    font-size: 22px;
    font-weight: 400;
    width: 100%;
  }
  .check-origin-image {
    max-width: 90%;
    max-height: none;
    display: block;
    margin: 0 auto;
  }
}
</style>
