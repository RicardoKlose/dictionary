<template>
  <div class="dictionary-node">
    <mu-breadcrumbs>
      <mu-breadcrumbs-item v-for="item in lastNodes" :key="item.index" :disabled="false">{{item.text}}</mu-breadcrumbs-item>
    </mu-breadcrumbs>
    <mu-list>
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
    </mu-list>
    <mu-dialog title="添加节点" width="360" :open.sync="showAddNode">
      <mu-form :model="addNodeForm" label-position="right" label-width="100">
        <mu-form-item prop="type" label="节点类型">
          <mu-radio v-model="addNodeForm.type" value="condition" label="条件"></mu-radio>
          <mu-radio v-model="addNodeForm.type" value="result" label="结果"></mu-radio>
        </mu-form-item>
        <mu-form-item prop="text" label="判断条件" v-show="addNodeForm.type === 'result'">
          <mu-text-field v-modle="addNodeForm.text" :max-length="100"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="name" label="名称">
          <mu-text-field v-modle="addNodeForm.name" :max-length="50"></mu-text-field>
        </mu-form-item>
        <mu-form-item prop="desc" label="描述">
          <mu-text-field v-modle="addNodeForm.desc" :max-length="200" multi-line :rows="1" :rowsMax="3"></mu-text-field>
        </mu-form-item>
      </mu-form>
      <mu-flex class="add-dic-buttons" justify-content="end">
        <mu-button @click="cancelAddDic">取消</mu-button>
        <mu-button color="primary" @click="confirmAddDic">确定</mu-button>
      </mu-flex>
    </mu-dialog>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
