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
    <h2 class="node-title" @click="showEditTitleDialog()">{{ getNodeTitle() }}</h2>
    <mu-data-table
      class="node-children-table"
      stripe border
      :columns="nodeColumns"
      :data="children"
      fit>
      <template slot-scope="scope">
        <td>
          <a
            class="node-click-text"
            href="javascript:void(0)"
            @click="enterNode(scope.row)">
            <mu-icon :value="judgeNodeType(scope.row)"></mu-icon>{{scope.row.text}}
          </a>
        </td>
        <td>
          <mu-button flat @click="showEditNodeDialog(scope.row)">
            编辑<mu-icon :size="24" value="edit" right></mu-icon>
          </mu-button>
          <mu-button flat @click="showRemoveNodeDialog(scope.row)">
            删除<mu-icon :size="24" value="delete" right></mu-icon>
          </mu-button>
        </td>
      </template>
    </mu-data-table>
    <mu-button
      class="add-node-fab-btn"
      large
      fab
      color="red"
      @click="showAddNodeDialog()">
      <mu-icon value="add"></mu-icon>
    </mu-button>

    <mu-dialog
      title="编辑条件类型"
      width="360"
      :open.sync="showEditTitle">
      请输入条件类型
      <mu-text-field
        placeholder="最多不超过30个字"
        :max-length="30"
        v-model="editTitleForm.title"></mu-text-field>
      <mu-alert color="error" v-show="editTitleForm.showErrAlert">
        <mu-icon left value="warning"></mu-icon>{{editTitleForm.errMessage}}
      </mu-alert>
      <mu-flex class="edit-dic-buttons" justify-content="end">
        <mu-button @click="cancelEditTitle">取消</mu-button>
        <mu-button color="primary" @click="confirmEditTitle">确定</mu-button>
      </mu-flex>
    </mu-dialog>

    <mu-dialog
      :scrollable="true"
      title="添加节点"
      width="75%"
      :open.sync="showAddNode">
      <mu-form ref="addForm" :model="addNodeForm" label-position="right" label-width="100">
        <mu-form-item prop="type" label="节点类型">
          <mu-radio v-model="addNodeForm.type" value="condition" label="条件"></mu-radio>
          <mu-radio v-model="addNodeForm.type" value="result" label="结果"></mu-radio>
        </mu-form-item>
        <mu-form-item prop="title" label="条件类型" v-show="addNodeForm.type === 'condition'">
          <mu-text-field v-model="addNodeForm.title" :max-length="30"></mu-text-field>
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
        <mu-form-item prop="img" label="图片" v-show="addNodeForm.type === 'result'">
          <i-upload
            :src="addNodeForm.img"
            @prepareError="uploadAddImageError"
            @uploadBegin="uploadAddImageStart"
            @error="uploadAddImageError"
            @success="uploadAddImageSuccess"></i-upload>
        </mu-form-item>
      </mu-form>
      <mu-alert color="error" v-show="addNodeForm.showErrAlert">
        <mu-icon left value="warning"></mu-icon>{{addNodeForm.errMessage}}
      </mu-alert>
      <mu-flex class="edit-dic-buttons" justify-content="end">
        <mu-button @click="cancelAddDic">取消</mu-button>
        <mu-button color="primary" @click="confirmAddDic">确定</mu-button>
      </mu-flex>
    </mu-dialog>

    <mu-dialog
      :scrollable="true"
      title="编辑节点"
      width="75%"
      :open.sync="showEditNode">
      <mu-form ref="editForm" :model="editNodeForm" label-position="right" label-width="100">
        <mu-form-item prop="title" label="条件类型" v-show="editNodeForm.type === 'condition'">
          <mu-text-field v-model="editNodeForm.title" :max-length="30"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="text" label="判断条件">
          <mu-text-field v-model="editNodeForm.text" :max-length="100"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="name" label="名称" v-show="editNodeForm.type === 'result'">
          <mu-text-field v-model="editNodeForm.name" :max-length="50"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="desc" label="描述" v-show="editNodeForm.type === 'result'">
          <mu-text-field
            v-model="editNodeForm.desc"
            :max-length="200"
            multi-line
            :rows="1"
            :rowsMax="3"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="img" label="图片" v-show="editNodeForm.type === 'result'">
          <i-upload
            :src="editNodeForm.img"
            @prepareError="uploadEditImageError"
            @uploadBegin="uploadEditImageStart"
            @error="uploadEditImageError"
            @success="uploadAEditImageSuccess"></i-upload>
        </mu-form-item>
      </mu-form>
      <mu-alert color="error" v-show="editNodeForm.showErrAlert">
        <mu-icon left value="warning"></mu-icon>{{editNodeForm.errMessage}}
      </mu-alert>
      <mu-flex class="edit-dic-buttons" justify-content="end">
        <mu-button @click="cancelEditDic">取消</mu-button>
        <mu-button color="primary" @click="confirmEditDic">确定</mu-button>
      </mu-flex>
    </mu-dialog>

    <mu-dialog
      title="删除节点"
      max-width="360"
      :open.sync="showRemoveNode">
      确认删除节点“{{removeNodeForm.text}}”？
      <mu-flex class="edit-dic-buttons" justify-content="end">
        <mu-button @click="cancelRemoveDic">取消</mu-button>
        <mu-button color="primary" @click="confirmRemoveDic">确定</mu-button>
      </mu-flex>
    </mu-dialog>
    <mu-dialog
      :scrollable="true"
      class="check-node-dialog"
      title="查看结论"
      width="75%"
      :open.sync="showCheckNode">
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
        <mu-form-item prop="img" label="图片">
          <i-checker :image-src="checkNodeForm.img"></i-checker>
        </mu-form-item>
      </mu-form>
    </mu-dialog>
  </div>
</template>

<script>
import imageUpload from './imageUpload';
import imageWithChecker from './imageWithChecker';

export default {
  data() {
    return {
      showEditTitle: false,
      showAddNode: false,
      showEditNode: false,
      showRemoveNode: false,
      showCheckNode: false,
      editTitleForm: {
        title: '',
      },
      addNodeForm: {
        type: 'condition',
        title: '',
        text: '',
        name: '',
        desc: '',
        img: '',
        imgUploading: false,
        showErrAlert: false,
        errMessage: '',
      },
      editNodeForm: {
        node: null,
        type: 'condition',
        title: '',
        text: '',
        name: '',
        desc: '',
        img: '',
        imgUploading: false,
        showErrAlert: false,
        errMessage: '',
      },
      removeNodeForm: {
        node: null,
        text: '',
      },
      checkNodeForm: {
        text: '',
        name: '',
        desc: '',
        img: '',
      },
      nodeColumns: [
        { title: '判断条件' },
        { title: '操作', width: 250 },
      ],
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
    thisNode() {
      return this.$store.getters.nowNode(this.dicName);
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
      const { type, text, name, desc, img } = node;
      if (type === 'condition') {
        this.$store.commit('enterNode', { dicName: this.dicName, node });
        return;
      }
      this.checkNodeForm = {
        text, name, desc, img,
      };
      this.showCheckNode = true;
    },
    judgeNodeType({ type }) {
      if (type === 'condition') {
        return 'list';
      }
      return 'note';
    },
    judgeChildrenHasSame(propName, value, nowNode = null) {
      let exists = false;
      this.children.forEach((node) => {
        if (node === nowNode) {
          return;
        }
        if (node[propName] === value) {
          exists = true;
        }
      });
      return exists;
    },
    getNodeTitle() {
      return this.thisNode.title ? this.thisNode.title : '默认条件类型';
    },
    showEditTitleDialog() {
      this.editTitleForm = {
        title: this.thisNode.title,
        showErrAlert: false,
        errMessage: '',
      };
      this.showEditTitle = true;
    },
    cancelEditTitle() {
      this.showEditTitle = false;
    },
    confirmEditTitle() {
      let { title } = this.editTitleForm;
      title = title.trim();
      if (!title) {
        this.$toast.error('条件类型不能为空');
        return;
      }
      this.$store.dispatch('nodeOperate', {
        optName: 'editTitle',
        payLoad: {
          dicName: this.dicName,
          title,
        },
      });
      this.showEditTitle = false;
    },
    showAddNodeDialog() {
      this.addNodeForm = {
        type: 'condition',
        title: '',
        text: '',
        name: '',
        desc: '',
        img: '',
        imgUploading: false,
        showErrAlert: false,
        errMessage: '',
      };
      this.showAddNode = true;
    },
    uploadAddImageError(str) {
      this.$toast.error(str);
      this.addNodeForm.imgUploading = false;
    },
    uploadAddImageStart() {
      this.addNodeForm.imgUploading = true;
    },
    uploadAddImageSuccess(url) {
      this.addNodeForm.img = url;
      this.addNodeForm.imgUploading = false;
    },
    cancelAddDic() {
      this.showAddNode = false;
    },
    confirmAddDic() {
      const { type, img, imgUploading } = this.addNodeForm;
      let { title, text, name, desc } = this.addNodeForm;
      text = text.trim();
      if (!text) {
        this.$toast.error('判断条件不能为空');
        return;
      }
      if (this.judgeChildrenHasSame('text', text)) {
        this.$toast.error('判断条件已存在');
        return;
      }
      if (type === 'condition') {
        title = title.trim();
        // if (!title) {
        //   this.$toast.error('条件类型不能为空');
        //   return;
        // }
        this.$store.dispatch('nodeOperate', {
          optName: 'addNodeToChildren',
          payLoad: {
            dicName: this.dicName,
            node: {
              title, type, text, children: [],
            },
          },
        });
        this.showAddNode = false;
        return;
      }
      name = name.trim();
      desc = desc.trim();
      if (!name) {
        this.$toast.error('名称不能为空');
        return;
      }
      if (this.judgeChildrenHasSame('name', name)) {
        this.$toast.error('名称已存在');
        return;
      }
      if (imgUploading) {
        this.$toast.error('图片仍在上传中');
        return;
      }
      this.$store.dispatch('nodeOperate', {
        optName: 'addNodeToChildren',
        payLoad: {
          dicName: this.dicName,
          node: {
            type, text, name, desc, img,
          },
        },
      });
      this.showAddNode = false;
    },
    showEditNodeDialog(node) {
      const { title = '', type, text, name = '', desc = '', img = '' } = node;
      this.editNodeForm = {
        node,
        type,
        title,
        text,
        name,
        desc,
        img,
        imgUploading: false,
        showErrAlert: false,
        errMessage: '',
      };
      this.showEditNode = true;
    },
    uploadEditImageError(str) {
      this.$toast.error(str);
      this.editNodeForm.imgUploading = false;
    },
    uploadEditImageStart() {
      this.editNodeForm.imgUploading = true;
    },
    uploadAEditImageSuccess(url) {
      this.editNodeForm.img = url;
      this.editNodeForm.imgUploading = false;
    },
    cancelEditDic() {
      this.showEditNode = false;
    },
    confirmEditDic() {
      const { node, type, img, imgUploading } = this.editNodeForm;
      let { title, text, name, desc } = this.editNodeForm;
      text = text.trim();
      if (!text) {
        this.$toast.error('判断条件不能为空');
        return;
      }
      if (this.judgeChildrenHasSame('text', text, node)) {
        this.$toast.error('判断条件已存在');
        return;
      }
      if (type === 'condition') {
        title = title.trim();
        // if (!title) {
        //   this.$toast.error('条件类型不能为空');
        //   return;
        // }
        this.$store.dispatch('nodeOperate', {
          optName: 'editNode',
          payLoad: {
            dicName: this.dicName,
            nowNode: node,
            node: {
              title,
              text,
            },
          },
        });
        this.showEditNode = false;
        return;
      }
      name = name.trim();
      desc = desc.trim();
      if (!name) {
        this.$toast.error('名称不能为空');
        return;
      }
      if (this.judgeChildrenHasSame('name', name, node)) {
        this.$toast.error('名称已存在');
        return;
      }
      if (imgUploading) {
        this.$toast.error('图片仍在上传中');
        return;
      }
      this.$store.dispatch('nodeOperate', {
        optName: 'editNode',
        payLoad: {
          dicName: this.dicName,
          nowNode: node,
          node: {
            text, name, desc, img,
          },
        },
      });
      this.showEditNode = false;
    },
    showRemoveNodeDialog(node) {
      this.removeNodeForm = {
        node,
        text: node.text,
      };
      this.showRemoveNode = true;
    },
    cancelRemoveDic() {
      this.showRemoveNode = false;
    },
    confirmRemoveDic() {
      const { node } = this.removeNodeForm;
      this.$store.dispatch('nodeOperate', {
        optName: 'removeNodeFromChildren',
        payLoad: {
          dicName: this.dicName,
          node,
        },
      });
      this.showRemoveNode = false;
    },
    showErrAlert(type, msg) {
      if (type === 'add') {
        this.addNodeForm.errMessage = msg;
        this.addNodeForm.showErrAlert = true;
      } else if (type === 'edit') {
        this.editNodeForm.errMessage = msg;
        this.editNodeForm.showErrAlert = true;
      } else if (type === 'title') {
        this.editTitleForm.errMessage = msg;
        this.editTitleForm.showErrAlert = true;
      }
    },
  },
  components: {
    'i-upload': imageUpload,
    'i-checker': imageWithChecker,
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
  .node-children-table {
    margin-bottom: 100px;
  }
  .node-click-text {
    line-height: 36px;
    font-size: 14px;
    color: #2196f3;
    &:hover {
      text-decoration: underline;
    }
    .mu-icon {
      vertical-align: top;
      margin: 6px;
    }
  }
  h2.node-title {
    text-align: left;
    padding: 0 24px;
    color: #2196f3;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  .add-node-fab-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  .mu-dialog-scrollable .mu-dialog-body {
    overflow-x: auto;
  }
  .check-node-dialog {
    .image-with-checker {
      img {
        max-height: 300px;
        max-width: 100%;
      }
    }
    .mu-form-item-content {
      min-width: 200px;
    }
  }
</style>
