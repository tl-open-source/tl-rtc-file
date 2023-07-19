type MenuActionType = { name: string; tip: string; color?: string };

export const ChatAction: MenuActionType[] = [
  { name: 'member', tip: '显示成员', color: undefined },
];

export const ChatInputAction: MenuActionType[] = [
  { name: 'emoji', tip: '表情' },
];
