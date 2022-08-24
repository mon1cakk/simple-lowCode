import { defineComponent, inject, computed, ref } from "vue";
import './editor.scss'
 
export default defineComponent({

  setup(props) {
    // 设置计算属性，以便于实现数据的双向绑定
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newValue) {
        ctx.emit('update:modelValue', deepcopy(newValue))
      }
    })
    // 设置计算属性，用来改变和渲染画布的大小
    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px',
    }))
    const containerRef = ref(null)
    const config = inject('config')

    return () => <div class="editor">
      <div class="editor-left">
        {/*根据注册列表  渲染对应的内容*/}
        {config.componentList.map(component => (
          <div
            class='editor-left-item'
          >
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>
        ))}
      </div>
      <div class="editor-top">编辑区</div>
      <div class="editor-right">属性区</div>
    </div>
  }
})