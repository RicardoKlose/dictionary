<template>
  <div class="image-with-checker">
    <img v-if="srcValid" :src="imageSrc" title="查看大图" @click="checkBigImage()" />
    <span v-if="!srcValid">无</span>
    <mu-dialog
      class="check-image-dialog"
      max-width="75%"
      title="查看大图"
      :append-body="true"
      :open.sync="showChecker">
      <img class="check-origin-image" :src="imageSrc" />
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showChecker: false,
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
  },
  methods: {
    checkBigImage() {
      this.showChecker = true;
    },
  },
};
</script>

<style scope lang="less">
.image-with-checker {
  img {
    cursor: pointer;
  }
  .check-image-dialog {
    img.check-origin-image {
      max-width: 90%;
      max-height: none;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
