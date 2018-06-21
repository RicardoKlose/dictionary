<template>
  <div id="app">
    <mu-appbar :class="{'app-title': true, 'is-open': docked}" color="primary">
      <mu-button icon slot="left" v-show="!docked" @click="toggleOpen">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      Ricardo Klose的字典咯
    </mu-appbar>
    <!-- <mu-list class="app-sidemenu">
      <mu-list-item
        button
        v-for="dic in nowDics"
        :key="dic.name"
        :to="`/dics/${dic.path}`"
        replace
        active-class="active-list">
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
    </mu-list> -->
    <mu-drawer :open.sync="open" :docked="docked" :width="255" :z-depth="docked ? 1 : 16">
      <mu-appbar class="drawer-title" :z-depth="1">
        Dictionary
      </mu-appbar>
      <mu-list class="app-sidemenu">
        <mu-list-item
          button
          v-for="dic in nowDics"
          :key="dic.name"
          :to="`/dics/${dic.path}`"
          replace
          active-class="active-list">
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
    </mu-drawer>
    <mu-dialog title="添加字典" width="360" :open.sync="showAddDic">
      请输入字典名称
      <mu-text-field
        placeholder="最多不超过30个字"
        :max-length="30"
        v-model="addDicForm.dicName"></mu-text-field>
      <mu-alert
        color="error"
        v-show="addDicForm.dicNameErrored">{{addDicForm.dicNameErrMessage}}</mu-alert>
      <mu-flex class="edit-dic-buttons" justify-content="end">
        <mu-button @click="cancelAddDic">取消</mu-button>
        <mu-button color="primary" @click="confirmAddDic">确定</mu-button>
      </mu-flex>
    </mu-dialog>
    <div :class="{'app-content': true, 'is-open': docked }">
      <router-view/>
    </div>
  </div>
</template>

<script>

// function isDesktop() {
//   return window.innerWidth > 993;
// }

function isMobile() {
  return window.innerWidth < 660;
}

export default {
  name: 'App',
  data() {
    return {
      docked: !isMobile(),
      mobile: isMobile(),
      open: !isMobile(),
      msg: 'Welcome to Your Vue.js App',
      dic: {},
      errMsg: '',
      showSuc: false,
      showErr: false,
      addDicForm: {
        dicName: '',
        dicNameErrored: false,
        dicNameErrMessage: '',
      },
      showAddDic: false,
      nowDics: [],
    };
  },
  methods: {
    showAddDialog() {
      this.addDicForm = {
        dicName: '',
        dicNameErrored: false,
        dicNameErrMessage: '',
      };
      this.showAddDic = true;
    },
    cancelAddDic() {
      this.showAddDic = false;
    },
    confirmAddDic() {
      let { dicName } = this.addDicForm;
      dicName = dicName.trim();
      if (!dicName) {
        this.addDicForm.dicNameErrored = true;
        this.addDicForm.dicNameErrMessage = '字典名称不能为空';
        return;
      }
      if (this.$store.getters.dicExists(dicName)) {
        this.addDicForm.dicNameErrored = true;
        this.addDicForm.dicNameErrMessage = '字典名称已存在';
        return;
      }
      const node = {
        type: 'root',
        children: [],
        name: dicName,
        text: dicName,
        path: encodeURIComponent(dicName),
      };
      this.nowDics.push(node);
      this.$store.dispatch('nodeOperate', {
        optName: 'initDic',
        payLoad: {
          dicName,
          dic: node,
        },
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
    changeNav() {
      const mobile = isMobile();
      this.docked = !mobile;
      if (mobile === this.mobile) return;
      if (mobile && !this.mobile && this.open) {
        this.open = false;
      }
      if (!mobile && this.mobile && !this.open) {
        this.open = true;
      }
      this.mobile = mobile;
    },
    toggleOpen() {
      this.open = !this.open;
    },
    // openDic(dic) {
    //   console.log(dic);
    // },
  },
  created() {
    let lastDics = localStorage.getItem('lastDics');
    if (!lastDics) {
      return;
    }
    lastDics = JSON.parse(lastDics);
    Object.entries(lastDics).forEach(([name, dic]) => {
      this.nowDics.push(dic);
      this.$store.commit('initDic', { dicName: name, dic });
    });
  },
  mounted() {
    this.changeNav();
    this.handleResize = () => {
      this.changeNav();
      this.isMobile = isMobile();
    };
    window.addEventListener('resize', this.handleResize);
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
    &.is-open {
      width: auto;
      padding-left: 256px;
    }
  }
  .app-sidemenu {
    // position: absolute;
    // top: 64px;
    // bottom: 0;
    // left: 0;
    // width: 180px;
    // background-color: #80cbc4;
    .active-list {
      background-color: #2196f3;
    }
  }
  .app-content {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    &.is-open {
      left: 256px;
    }
  }
}
.edit-dic-buttons {
  margin-top: 10px;
  .mu-button + .mu-button {
    margin-left: 20px;
  }
}
</style>
