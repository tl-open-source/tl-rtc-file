import { isItBetween } from '@/utils';
import {
  MaybeElementRef,
  useMouseInElement,
  useMousePressed,
} from '@vueuse/core';
import { computed, ref, watch } from 'vue';

type ResizeOption = {
  initialSize?: {
    width?: string;
    height?: string;
  };
  position?: 'left' | 'right' | 'top' | 'bottom';
  persistentSize?: {
    width?: string;
    height?: string;
  }; // 用来控制在拖拽时不会变的数据
};

export const useDragChangeSize = (
  target: MaybeElementRef,
  options?: ResizeOption
) => {
  const offset = 5;
  const { elementX, elementY, elementWidth, elementHeight } =
    useMouseInElement(target);

  const style = computed(() => {
    return Object.assign(
      {},
      {
        width: `${
          elementWidth.value
            ? elementWidth.value + 'px'
            : options?.initialSize?.width ?? '100%'
        }`,
        height: `${
          elementHeight.value
            ? elementHeight.value + 'px'
            : options?.initialSize?.height ?? '100%'
        }`,
      },
      options?.persistentSize || ({} as any)
    );
  });

  const { pressed } = useMousePressed({ target, touch: false });

  const draggablePos = computed(() => ({
    left: {
      x: [-offset, offset],
      y: [0, elementHeight.value],
    },
    top: {
      x: [0, elementWidth.value],
      y: [-offset, offset],
    },
  }));

  const judgeEnterPos = () => {
    const findV = Object.keys(draggablePos.value).find((key) => {
      const posKey = key as keyof typeof draggablePos.value;

      return (
        isItBetween(elementX.value, draggablePos.value[posKey].x) &&
        isItBetween(elementY.value, draggablePos.value[posKey].y)
      );
    });
    const draggable = options?.position ? options.position === findV : !!findV;
    return {
      draggable,
      position: findV || '',
    };
  };

  // 判断点击时候是否在拖拽范围内
  const draggableByClick = ref({
    draggable: false,
    position: '',
  });

  // 供外部用的判断 是否可以拖拽
  const canDragged = computed(judgeEnterPos);

  const doResize = ([posX, posY]: number[], type: string) => {
    const movX = posX - offset;
    const movY = posY - offset;
    if (type === 'left') {
      const differenceX = -movX;
      elementWidth.value = elementWidth.value + differenceX;
    }

    if (type === 'top') {
      const differenceY = -movY;
      elementHeight.value = elementHeight.value + differenceY;
    }
  };

  watch([elementX, elementY], (v) => {
    if (pressed.value) {
      if (draggableByClick.value.draggable) {
        doResize(v, draggableByClick.value.position);
      }
    }
  });

  watch(pressed, (v) => {
    if (v) {
      draggableByClick.value = judgeEnterPos();
    } else {
      draggableByClick.value = {
        draggable: false,
        position: '',
      };
    }
  });

  return {
    canDragged,
    style,
  };
};
