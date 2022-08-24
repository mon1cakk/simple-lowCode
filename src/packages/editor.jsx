import { defineComponent, inject, computed, ref } from "vue";
import './editor.scss'
import {useMenuDragger} from "@/packages/useMenuDragger";
import {useCommand} from "@/packages/useCommand";
 
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

    const state = {
      current: -1,
      queue: [],
      commands: {},
      commandArray: [],
      destroyArray: []
    }
    
    // 设置计算属性，用来改变和渲染画布的大小
    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px',
    }))
    // 实现菜单拖拽功能
    const containerRef = ref(null)
    const { dragstart, dragend } = useMenuDragger(containerRef, data);
    const config = inject('config')
    const { commands } = useCommand(data, state);
    const buttons = [
      { label: '撤销', handler: () => commands.undo() },
      { label: '重做', handler: () => commands.redo() },
      { label: '导出', handler: () => commands.output() },
      { label: '导入', },
      { label: '预览', handler: () => commands.preview() },
      { label: '清空', handler: () => commands.clear() },
      { label: '删除', handler: () => commands.remove() },
      { label: '置顶', handler: () => commands.top() },
      { label: '置底', handler: () => commands.bottom() },
      { label: '锁定', handler: () => commands.lock() },
      { label: '解锁', handler: () => commands.unlock() },
    ]

    return () => <div class="editor">
      <div class="editor-left">
        {/*根据注册列表  渲染对应的内容*/}
        {config.componentList.map(component => (
          <div
            class='editor-left-item'
            draggable
            onDragstart={e => dragstart(e, component)}
            onDragend={dragend}
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