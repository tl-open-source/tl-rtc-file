import { CommonFnType, PathValue, StringKeyObject } from '@/types';
import { Ref, ref, shallowRef, UnwrapRef } from 'vue';
import { isEmpty, cloneDeep } from 'lodash';
import { getEventValue } from './util';

export type FormItemRegister<T, Values> = {
  validate: (
    value: T,
    values: Values
  ) => FieldErrorType | Promise<FieldErrorType>;
};

export type RegisterReturns = {
  name: string;
  onChange: CommonFnType;
  onInput: CommonFnType;
};

export type FormMethods<Field extends StringKeyObject = StringKeyObject> = {
  resetFields: () => void;
  handleSubmit: (
    onValid?: CommonFnType,
    onInValid?: CommonFnType
  ) => (e: Event) => void;
  register: <S extends keyof StringKeyObject>(
    name: S,
    options?: FormItemRegister<PathValue<Field, S>, Field>
  ) => RegisterReturns;
  setFormValue: <S extends keyof StringKeyObject>(
    name: S,
    value: PathValue<Field, S>
  ) => void;
  get formData(): Ref<UnwrapRef<Field>>;
  get formErrors(): Ref<Partial<Record<string, FieldErrorType>>>;
};

export type UseFormParamsType<T extends StringKeyObject> = {
  defaultValues: T;
};

export type FieldErrorType = {
  message: string;
  valid: boolean;
};

export const useForm = <FormData extends StringKeyObject>(
  options?: UseFormParamsType<FormData>
): FormMethods<FormData> => {
  const defaultValues = options?.defaultValues || ({} as FormData);
  const formData = ref(cloneDeep(defaultValues));
  const __filedValidate = shallowRef<Record<string, CommonFnType>>({}); // 字段校验函数
  const __fieldErrors: FormMethods<FormData>['formErrors'] = ref({}); // 字段错误集

  const executeValidation = async () => {
    for (const name in __filedValidate.value) {
      await executeFieldValidation(name);
    }
  };

  const executeFieldValidation = async (name: string) => {
    const fieldValidate = __filedValidate.value[name];
    if (fieldValidate) {
      const { message, valid } = await fieldValidate(
        formData.value[name],
        formData.value
      );
      if (!valid) {
        __fieldErrors.value[name] = {
          message,
          valid,
        };
      } else {
        delete __fieldErrors.value[name];
      }
    }
  };

  const onChange = (event: any) => {
    const target = event.target;
    const name = target.name as string;
    const fieldValue = getEventValue(event);
    setFormValue(name, fieldValue);
    executeFieldValidation(name);
  };

  const register: FormMethods<FormData>['register'] = (
    name,
    registerOptions
  ) => {
    const validate = registerOptions?.validate;
    if (validate) {
      __filedValidate.value[name] = validate;
    }
    return {
      name,
      onChange,
      onInput: onChange,
      ref: (ref: HTMLInputElement) => {
        if (ref) {
          ref.value = formData.value[name] || '';
        }
      },
    };
  };

  const resetFields = () => {
    formData.value = cloneDeep(defaultValues) as UnwrapRef<FormData>;

    __fieldErrors.value = {};
  };

  // 设置 formData 的值
  const setFormValue: FormMethods<FormData>['setFormValue'] = (name, val) => {
    formData.value[name] = val as any;
  };

  const handleSubmit: FormMethods<FormData>['handleSubmit'] =
    (onValid, onInvalid) => async (e) => {
      if (e) {
        e.preventDefault?.();
      }
      await executeValidation();

      if (isEmpty(__fieldErrors.value)) {
        onValid?.(formData.value);
      } else {
        onInvalid?.(__fieldErrors.value);
      }
    };

  return {
    get formData() {
      return formData;
    },
    get formErrors() {
      return __fieldErrors;
    },
    setFormValue,
    register,
    resetFields,
    handleSubmit,
  };
};
