export type MenuActionType = {
  name: string;
  tip: string;
  color?: string;
  tipDir?: string;
  btn?: boolean;
  disabled?: boolean;
};

export const ChatAction: MenuActionType[] = [
  { name: 'member', tip: '显示成员', color: undefined },
];

export const ChatInputAction: MenuActionType[] = [
  { name: 'emoji', tip: '表情' },
];

export const VideoMenuAction: MenuActionType[] = [
  {
    name: 'member',
    tip: '显示成员',
    color: undefined,
    tipDir: 'tooltip-top',
    btn: true,
  },
];

export const VideoControlMenuAction: MenuActionType[] = [
  {
    name: 'camera',
    tip: '开启/关闭摄像头',
    color: '#707070',
    tipDir: 'tooltip-top',
    btn: true,
    disabled: false,
  },
  // {
  //   name: 'mirror-image',
  //   tip: '开启镜像',
  //   color: '#707070',
  //   tipDir: 'tooltip-top',
  //   btn: true,
  //   disabled: false,
  // },
  {
    name: 'hang-up',
    tip: '结束通话',
    color: undefined,
    tipDir: 'tooltip-top',
    btn: true,
    disabled: false,
  },
];
