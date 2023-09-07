import { onErrorCaptured, ref } from 'vue';

// 捕获 组件error
export const useErrorCaptured = () => {
  const errors = ref<string[]>([]);

  onErrorCaptured((e) => {
    errors.value.push(e.message);
  });

  return errors;
};
