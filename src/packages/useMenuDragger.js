// 菜单拖拽功能
import { events } from "@/packages/events";

export function useMenuDragger(containerRef, data) {
  let currentComponent = null;
  const dragenter = (e) => {
    e.dataTransfer.dropEffect = "move";
  };
  const dragover = (e) => {
    e.preventDefault();
  };
  const dragleave = (e) => {
    e.dataTransfer.dropEffect = "none";
  };
  const drop = (e) => {
    let blocks = data.value.blocks; // 内部已经渲染的组件
    data.value = {
      ...data.value,
      blocks: [
        ...blocks,
        {
          top: e.offsetY,
          left: e.offsetX,
          zIndex: 1,
          key: currentComponent.key,
          alignCenter: true, // 实现松手的时候鼠标可以居中
          focus: false, // 没有选定的状态
        },
      ],
    };
    currentComponent = null;
  };
  const dragstart = (e, component) => {
    containerRef.value.addEventListener("dragenter", dragenter);
    containerRef.value.addEventListener("dragover", dragover);
    containerRef.value.addEventListener("dragleave", dragleave);
    containerRef.value.addEventListener("drop", drop);
    currentComponent = component;
    events.emit("start");
  };
  const dragend = (e) => {
    containerRef.value.removeEventListener("dragenter", dragenter);
    containerRef.value.removeEventListener("dragover", dragover);
    containerRef.value.removeEventListener("dragleave", dragleave);
    containerRef.value.removeEventListener("drop", drop);
    events.emit("end");
  };
  return {
    dragstart,
    dragend,
  };
}
