<template>
  <div class="dictionary-node">
    <ul class="mu-breadcrumbs">
      <li :class="{ 'mu-breadcrumbs-item': true, 'is-disabled': item.disabled }"
        v-for="item in lastNodes"
        :key="item.text"
        @click="jumpBackNode(item.step, item.disabled)">
        <a href="javascript:void(0)">{{item.text}}</a>
      </li>
    </ul>
    <!-- <mu-list>
      <mu-list-item button v-for="node in children" :key="node.text" @click="enterNode(node)">
        <mu-list-item-action>
          <mu-icon :value="judgeNodeType(node)"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>{{ node.text }}</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button @click="showAddNodeDialog">
        <mu-list-item-action>
          <mu-icon value="add"></mu-icon>
        </mu-list-item-action>
        <mu-list-item-title>添加节点</mu-list-item-title>
      </mu-list-item>
    </mu-list> -->
    <mu-data-table :columns="nodeColumns" :data="children">
      <template slot-scope="scope">
        <td><mu-icon :value="judgeNodeType(scope.row)"></mu-icon></td>
        <td>
          <a
            class="node-click-text"
            href="javascript:void(0)"
            @click="enterNode(scope.row)">
            {{scope.row.text}}
          </a>
        </td>
        <td>{{scope.row.fat}}</td>
      </template>
    </mu-data-table>
    <mu-dialog title="添加节点" width="360" :open.sync="showAddNode">
      <mu-form ref="addForm" :model="addNodeForm" label-position="right" label-width="100">
        <mu-form-item prop="type" label="节点类型">
          <mu-radio v-model="addNodeForm.type" value="condition" label="条件"></mu-radio>
          <mu-radio v-model="addNodeForm.type" value="result" label="结果"></mu-radio>
        </mu-form-item>
        <mu-form-item prop="text" label="判断条件">
          <mu-text-field v-model="addNodeForm.text" :max-length="100"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="name" label="名称" v-show="addNodeForm.type === 'result'">
          <mu-text-field v-model="addNodeForm.name" :max-length="50"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="desc" label="描述" v-show="addNodeForm.type === 'result'">
          <mu-text-field
            v-model="addNodeForm.desc"
            :max-length="200"
            multi-line
            :rows="1"
            :rowsMax="3"></mu-text-field>
        </mu-form-item>
      </mu-form>
      <mu-alert color="error" v-show="addNodeForm.showErrAlert">
        <mu-icon left value="warning"></mu-icon>{{addNodeForm.errMessage}}
      </mu-alert>
      <mu-flex class="add-dic-buttons" justify-content="end">
        <mu-button @click="cancelAddDic">取消</mu-button>
        <mu-button color="primary" @click="confirmAddDic">确定</mu-button>
      </mu-flex>
    </mu-dialog>
    <mu-dialog title="查看结论" width="360" :open.sync="showCheckNode">
      <mu-form :model="checkNodeForm" label-position="right" label-width="100">
        <mu-form-item prop="text" label="判断条件">
          <span>{{checkNodeForm.text}}</span>
        </mu-form-item>
        <mu-form-item prop="name" label="名称">
          <span>{{checkNodeForm.name}}</span>
        </mu-form-item>
        <mu-form-item prop="desc" label="描述">
          <p>{{checkNodeForm.desc}}</p>
        </mu-form-item>
      </mu-form>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showAddNode: false,
      showCheckNode: false,
      addNodeForm: {
        type: 'condition',
        text: '',
        name: '',
        desc: '',
        showErrAlert: false,
        errMessage: '',
      },
      checkNodeForm: {
        text: '',
        name: '',
        desc: '',
      },
    };
  },
  props: {
    dicName: {
      type: String,
      required: true,
    },
  },
  computed: {
    lastNodes() {
      return this.$store.getters.lastNodes(this.dicName);
    },
    children() {
      return this.$store.getters.nowNode(this.dicName).children;
    },
  },
  methods: {
    jumpBackNode(step, disabled = false) {
      if (disabled) {
        return;
      }
      this.$store.commit('jumpBackNode', { dicName: this.dicName, step });
    },
    enterNode(node) {
      const { type, text, name, desc } = node;
      if (type === 'condition') {
        this.$store.commit('enterNode', { dicName: this.dicName, node });
        return;
      }
      this.checkNodeForm = {
        text, name, desc,
      };
      this.showCheckNode = true;
    },
    judgeNodeType({ type }) {
      if (type === 'condition') {
        return 'list';
      }
      return 'note';
    },
    showAddNodeDialog() {
      this.addNodeForm = {
        type: 'condition',
        text: '',
        name: '',
        desc: '',
        showErrAlert: false,
        errMessage: '',
      };
      this.showAddNode = true;
    },
    cancelAddDic() {
      this.showAddNode = false;
    },
    confirmAddDic() {
      const { type, text, name, desc } = this.addNodeForm;
      if (!text) {
        this.showErrAlert('判断条件不能为空');
        return;
      }
      if (type === 'condition') {
        this.$store.commit('addNodeToChildren', { dicName: this.dicName, node: { type, text, children: [] } });
        this.showAddNode = false;
        return;
      }
      if (!name) {
        this.showErrAlert('判断条件不能为空');
        return;
      }
      this.$store.commit('addNodeToChildren', { dicName: this.dicName, node: { type, text, name, desc } });
      this.showAddNode = false;
    },
    showErrAlert(msg) {
      this.addNodeForm.errMessage = msg;
      this.addNodeForm.showErrAlert = true;
    },
  },
};
</script>

<style lang="less">
  li.mu-breadcrumbs-item {
    &.is-disabled > a {
      cursor: initial;
      color: #000000;
    }
    &+ li.mu-breadcrumbs-item:before {
      content: '/';
      margin: 0 5px;
      color: #000000;
      user-select: none;
    }
  }
</style>
