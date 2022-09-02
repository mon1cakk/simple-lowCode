import { defineComponent, inject, computed, ref, reactive } from "vue";
import './editor.scss'
import {useMenuDragger} from "@/packages/useMenuDragger";
import {useCommand} from "@/packages/useCommand";
import deepcopy from "deepcopy";
import EditorBlock from './editor-block'
import GridTemplate from "../utils/grid-template.vue"
import {useFocus} from "@/packages/useFocus";
 
export default defineComponent({
  props: {
    modelValue: {type: Object}
  },
  components: {
    GridTemplate,
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
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

    // 设置复制和剪切的内容容器，用来实现复制粘贴功能
    const copyContent = reactive({
      blockRightClickBox: false,
      containerRightClickBox: false,
      unlockRightClickBox: false,
      copyContent: [],
      startX: null,
      startY: null,
      data: data.value,
      state: state
    });

    // 设置计算属性，用来改变和渲染画布的大小
    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px',
    }))

    const config = inject('config')

    // 实现菜单拖拽功能
    const containerRef = ref(null)
    const { dragstart, dragend } = useMenuDragger(containerRef, data);

    // 实现获取焦点
    let {blockMousedown, focusData, containerMousedown, lastSelectBlock} = useFocus(data, copyContent, (e) => {
      mousedown(e)
      // console.log(JSON.stringify(attrs_style.value.attribute))
      // console.log(JSON.stringify(attrs_style.value.block))
    });
    
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
      <div class="editor-container">
        {/*产生滚动条*/}
        <div class="editor-container-canvas">
        {/*产生内容区域*/}
        <div
          class="editor-container-canvas_content"
          style={containerStyles.value}
          ref={containerRef}
          // onmousedown={containerMousedown}
          // oncontextmenu={containerRightClick}
        >
        {/*网格线*/}
        <grid-template></grid-template>
            {
              (data.value.blocks.map((block, index) => {
                  console.log(index, data)
                  return <EditorBlock
                      // class={"iconfont icon-suo"}
                      // cursor="move"
                      class={block.lock ? 'iconfont icon-suo' : ''}
                      class={block.focus ? 'editor-block-focus' : ''}
                      block={block}
                      data={data}
                      index={index}
                      onmousedown={(e) => e.target.className === 'editor-block' || e.target.className === 'editor-block editor-block-focus' || e.target.className === 'editor-block iconfont icon-suo' ? blockMousedown(e, block, index) : ''}
                      onmouseover={(e) => e.target.className === 'editor-block' || e.target.className === 'editor-block editor-block-focus' || e.target.className === 'editor-block iconfont icon-suo' ? e.target.style.cursor = block.moveSign : ''}
                      // onmouseover={(e) => e.target.children.length === 0 ? '' : e.target.children[0].style.cursor ='move'}
                      // onmouseover={(e) => console.log(e.target.className)}
                      oncontextmenu={(e) => blockRightClick(e, block)}
                  />
              }))
            }
            {/* {markLine.x !== null && <div class='line-x' style={{left: markLine.x + 'px'}}/>} */}
            {/* {markLine.y !== null && <div class='line-y' style={{top: markLine.y + 'px'}}/>} */}
          </div>
        </div>
      </div>
    </div>
  }
})