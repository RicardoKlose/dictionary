<template>
  <div id="app">
    <mu-appbar class="app-title" color="primary">
      <!-- <mu-button icon slot="left">
        <mu-icon value="menu"></mu-icon>
      </mu-button> -->
      Ricardo Klose的字典咯
    </mu-appbar>
    <mu-list class="app-sidemenu">
      <mu-list-item button v-for="dic in nowDics" :key="dic.name" @click="openDic(dic)">
        <mu-list-item-action>
          <mu-icon value="book"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>{{ dic.name }}</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button @click="showAddDialog">
        <mu-list-item-action>
          <mu-icon value="add"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>添加字典</mu-list-item-title>
      </mu-list-item>
    </mu-list>
    <mu-dialog title="添加字典" width="360" :open.sync="showAddDic">
      请输入字典名称
      <mu-text-field
        placeholder="最多不超过30个字"
        :max-length="30"
        v-model="dicName"></mu-text-field>
      <mu-alert color="error" delete :show.sync="dicNameErrored">字典名称不能为空</mu-alert>
      <mu-flex class="add-dic-buttons" justify-content="end">
        <mu-button @click="cancelAddDic">取消</mu-button>
        <mu-button color="primary" @click="confirmAddDic">确定</mu-button>
      </mu-flex>
    </mu-dialog>
    <div class="app-content">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      dic: {},
      errMsg: '',
      showSuc: false,
      showErr: false,
      dicName: '',
      showAddDic: false,
      nowDics: [],
      dicNameErrored: false,
    };
  },
  methods: {
    showAddDialog() {
      this.dicName = '';
      this.showAddDic = true;
    },
    cancelAddDic() {
      this.showAddDic = false;
    },
    confirmAddDic() {
      if (!this.dicName) {
        this.dicNameErrored = true;
        return;
      }
      this.nowDics.push({
        type: 'root',
        children: [],
        name: this.dicName,
      });
      this.showAddDic = false;
    },
    say() {
      this.$http.get('http://localhost:3000/dic')
        .then((response) => {
          this.dic = response.data;
          this.showSuc = true;
        })
        .catch((err) => {
          this.errMsg = err.message;
          this.showErr = true;
        });
    },
    openDic(dic) {
      console.log(dic);
    },
  },
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  .app-title {
    width: 100%;
  }
  .app-sidemenu {
    position: absolute;
    top: 64px;
    bottom: 0;
    left: 0;
    width: 180px;
    background-color: #80cbc4;
  }
}
.add-dic-buttons {
  margin-top: 10px;
  .mu-button + .mu-button {
    margin-left: 20px;
  }
}
</style>
