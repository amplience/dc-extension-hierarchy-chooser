<template>
  <div class="ml-4 mt-4">
    <v-fade-transition mode="out-in">
      <v-virtual-scroll
        class="am-taxonomy-tree__container"
        :bench="5"
        :items="treeStore.visibleNodes"
        :item-height="50"
        :height="442"
        v-if="treeStore.visibleNodes.length"
      >
        <template v-slot:default="{ item }">
          <tree-node :node="item" :key="item.id"></tree-node>
        </template>
      </v-virtual-scroll>
      <div
        class="d-flex align-center justify-center taxonomy-tree__loader"
        v-else
      >
        <v-progress-circular
          indeterminate
          :size="32"
          color="grey"
        ></v-progress-circular>
      </div>
    </v-fade-transition>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { Observer } from "mobx-vue";

import { complement, equals, ifElse, isNil, when } from "ramda";
import TreeStore from "@/store/Tree";
import DynamicContentStore from "@/store/DynamicContent";
import Alert from "@/mixins/ShowAlert.mixin";
import TreeNode from "./TreeNode.vue";
import NodeTransition from "@/components/NodeTransition.vue";
import { notError } from "@/utils/helpers";
// eslint-disable-next-line no-unused-vars
import { HierarchyChildren, HierarchyNode } from "dc-management-sdk-js";
// eslint-disable-next-line no-unused-vars
import { ContentItemModel } from "@/store/FieldModel";

const loadTree: any = when(complement(isNil), TreeStore.loadTree);

@Observer
@Component({
  components: { NodeTransition, TreeNode },
})
export default class TreeView extends Mixins(Alert) {
  treeStore = TreeStore;

  created() {
    this.init();
  }

  async init() {
    when(equals(false), this.loadTree)(this.treeStore.treeLoaded);
  }

  async loadTree() {
    ifElse(notError, this.setTree, () => this.showAlert("Could not load tree"))(
      await loadTree(DynamicContentStore.getNodeId())
    );
  }

  setTree({
    children,
    ...node
  }: {
    children: HierarchyNode[];
    node: HierarchyNode;
  }) {
    TreeStore.setRootNode(node).setChildren(children);
    TreeStore.rootNode?.showChildren(true);
    TreeStore.setTreeLoaded(true);
  }
}
</script>

<style lang="scss" scoped>
.taxonomy-tree {
  &__loader {
    height: 200px;
  }
}
</style>
