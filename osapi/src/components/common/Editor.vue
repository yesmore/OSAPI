<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, reactive } from 'vue';
import WangEditor from 'wangeditor';

interface contentDTO {
  html: string;
  instance: any;
}

export default defineComponent({
  name: 'Editor',
  props: {
    oldContent: {
      type: String,
    }
  },
  setup(props) {
    const editor = ref();
    // 存储输入的内容
    const content: contentDTO  = reactive({
      html: '',        // 存储输入的内容
      instance: null,  // 存储 富文本编辑器对象的实例
    })

    onMounted(() => {
      // 初始化 wangEditor
      content.instance = new WangEditor(editor.value);

      // 运行 wangEditor
      content.instance.create();
      // 初始化
      content.instance.txt.html(props.oldContent)
    });

    // 在组件 卸载之前 执行，注销 wangEditor
    onBeforeUnmount((): void => {
      content.instance.destroy();
      content.instance = null;
    });

    // 点击按钮时，存储用户的内容
    const syncHTML = (): void => {
      // 将 编辑器 中的内容，赋值到变量中
      content.html = content.instance.txt.html();
    }

    return { editor,  content, syncHTML }
  }
})
</script>

<template>
  <div ref="editor" class="mt-5"></div>
</template>
