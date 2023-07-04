import { isObject } from 'lodash';

type Event = { target: any };

export const isCheckBoxInput = (element: any): element is HTMLInputElement =>
  element.type === 'checkbox';

export const getEventValue = (event: unknown) =>
  isObject(event) && (event as Event).target
    ? isCheckBoxInput((event as Event).target)
      ? (event as Event).target.checked
      : (event as Event).target.value
    : event;
