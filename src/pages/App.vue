<template>
  <div id="app">
    <div id="browser" v-if="suggest">
      为了达到最佳使用效果，请使用Chrome进行访问
      <a class="browser-download" href="https://www.google.cn/chrome/" title="点击下载最新版Chrome">点击下载Chrome</a>
      <mu-icon class="close-icon" value="clear" @click="suggest = false"></mu-icon>
    </div>
    <mu-appbar :class="{'app-title': true, 'is-open': docked}" color="primary">
      <mu-button icon slot="left" v-show="!docked" @click="toggleOpen">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      Ricardo Klose的字典咯
      <mu-button icon slot="right" @click="importJson()" title="导入">
        <mu-icon value="vertical_align_top"></mu-icon>
      </mu-button>
      <input
        ref="importInput"
        class="hidden-input"
        type="file"
        accept="application/json"
        @change="parseImportJson()" />
      <mu-button icon slot="right" @click="exportJson()" title="导出">
        <mu-icon value="vertical_align_bottom"></mu-icon>
      </mu-button>
      <mu-snackbar position="top" :open.sync="alert.open">
        {{alert.message}}
      </mu-snackbar>
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

const BrowserDetect = {
  init() {
    this.browser = this.searchString(this.dataBrowser) || 'An unknown browser';
    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'an unknown version';
    this.OS = this.searchString(this.dataOS) || 'an unknown OS';
  },
  searchString(data) {
    for (const { string, prop, versionSearch, identity, subString } of data) {
      this.versionSearchString = versionSearch || identity;
      if (string) {
        if (string.indexOf(subString) !== -1) {
          return identity;
        }
      } else if (prop) {
        return identity;
      }
    }
    return '';
  },
  searchVersion(dataString) {
    const index = dataString.indexOf(this.versionSearchString);
    if (index === -1) {
      return 0;
    }
    return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
  },
  dataBrowser: [{
    string: navigator.userAgent,
    subString: 'Edge',
    identity: 'Edge',
  }, {
    string: navigator.userAgent,
    subString: 'Chrome',
    identity: 'Chrome',
  }, {
    string: navigator.userAgent,
    subString: 'OmniWeb',
    versionSearch: 'OmniWeb/',
    identity: 'OmniWeb',
  }, {
    string: navigator.vendor,
    subString: 'Apple',
    versionSearch: 'Version',
    identity: 'Safari',
  }, {
    prop: window.opera,
    versionSearch: 'Version',
    identity: 'Opera',
  }, {
    string: navigator.vendor,
    subString: 'iCab',
    identity: 'iCab',
  }, {
    string: navigator.vendor,
    subString: 'KDE',
    identity: 'Konqueror',
  }, {
    string: navigator.userAgent,
    subString: 'Firefox',
    identity: 'Firefox',
  }, {
    string: navigator.vendor,
    subString: 'Camino',
    identity: 'Camino',
  }, {
    string: navigator.userAgent,
    subString: 'Netscape',
    identity: 'Netscape',
  }, {
    string: navigator.userAgent,
    subString: 'MSIE',
    versionSearch: 'MSIE',
    identity: 'Explorer',
  }, {
    string: navigator.userAgent,
    subString: 'Gecko',
    versionSearch: 'rv',
    identity: 'Mozilla',
  }, {
    string: navigator.userAgent,
    subString: 'Mozilla',
    versionSearch: 'Mozilla',
    identity: 'Netscape',
  }],
  dataOS: [{
    string: navigator.platform,
    subString: 'Win',
    identity: 'Windows',
  }, {
    string: navigator.platform,
    subString: 'Mac',
    identity: 'Mac',
  }, {
    string: navigator.userAgent,
    subString: 'iPhone',
    identity: 'iPhone/iPad',
  }, {
    string: navigator.userAgent,
    subString: 'Linux',
    identity: 'Linux',
  }],
};

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
      suggest: false,
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
      alert: {
        timer: null,
        open: false,
        message: '',
      },
    };
  },
  methods: {
    importJson() {
      this.$refs.importInput.click();
    },
    parseImportJson() {
      const input = this.$refs.importInput;
      const filePath = input.value;
      if (!filePath) {
        return;
      }
      const fileExt = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
      if (!/^\.json$/.test(fileExt)) {
        this.alertMessage('文件格式错误');
        return;
      }
      if (!input.files || !input.files[0]) {
        return;
      }
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (oFREvent) => {
        try {
          const dics = JSON.parse(oFREvent.target.result);
          this.nowDics.splice(0);
          this.$store.commit('initStore');
          Object.entries(dics).forEach(([name, dic]) => {
            this.nowDics.push(dic);
            this.$store.commit('initDic', { dicName: name, dic });
          });
          this.$store.commit('saveDic');
          this.alertMessage('导入文件成功');
        } catch (err) {
          this.alertMessage(`文件解析失败 ${err.message}`);
        }
      };
    },
    exportJson() {
      const dics = localStorage.getItem('lastDics');
      const eleLink = document.createElement('a');
      eleLink.download = 'dictionaries.json';
      eleLink.style.display = 'none';
      const blob = new Blob([dics]);
      eleLink.href = URL.createObjectURL(blob);
      document.body.appendChild(eleLink);
      eleLink.click();
      document.body.removeChild(eleLink);
    },
    alertMessage(message, timeout = 3000) {
      if (this.alert.timer) {
        clearTimeout(this.alert.timer);
      }
      this.alert.message = message;
      this.alert.open = true;
      this.alert.timer = setTimeout(() => {
        this.alert.open = false;
        this.alert.timer = null;
      }, timeout);
    },
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
    BrowserDetect.init();
    const { OS, browser, version } = BrowserDetect;
    console.log(`${OS}下使用${browser} ${version}访问`);
    if (['Windows', 'Linux'].includes(OS)) {
      if (browser.toLowerCase() !== 'chrome' || version < 43) {
        this.suggest = true;
      }
    }
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
    .hidden-input {
      display: none;
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
#browser {
  position: fixed;
  width: 100%;
  background-color: #ffdd57;
  text-align: center;
  line-height: 30px;
  a {
    margin-left: 5px;
    &:hover {
      text-decoration: underline;
    }
  }
  .close-icon {
    cursor: pointer;
    font-size: 14px;
    vertical-align: top;
    margin-left: 10px;
    line-height: 30px;
  }
  z-index: 2000;
}
</style>
