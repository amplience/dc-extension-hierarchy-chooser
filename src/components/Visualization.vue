<template>
  <iframe src="src" frameborder="0" scrolling="no"></iframe>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { detokenize } from "@/utils/helpers";

export interface VisualizationParams {
  contentItemId?: string;
  snapshotId?: string;
  stagingEnvironment?: string;
  locales?: string;
}

@Component
export default class Visualization extends Vue {
  public src: string = "";

  @Prop(String) template!: string;
  @Prop(Object) params!: VisualizationParams;

  @Watch("params")
  generateURL() {
    const params = this.params;

    this.src = detokenize(this.template, {
      "content.sys.id": params.contentItemId,
      "content.sys.iri": `http://content.cms.amplience.com/${params.contentItemId}`,
      "snapshot.id": params.snapshotId,
      "vse.domain": params.stagingEnvironment,
      "vse.src": `//${params.stagingEnvironment}/cms/content/query?fullBodyObject=true&query=%7B%22sys.iri%22%3A%22http%3A%2F%2Fcontent.cms.amplience.com%2F${params.contentItemId}%22%7D&scope=tree&store=staging`,
      locales: params.locales,
    });
  }
}
</script>
