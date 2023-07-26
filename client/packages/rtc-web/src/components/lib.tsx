import { SetupContext } from 'vue';
import { SvgIcon, NavIcons } from './base';
import { MenuSide } from './menu';

export const NavHeader = () => {
  return (
    <div class="drawer shadow-md dark:shadow-sm dark:shadow-neutral-600">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        {/* Navbar */}
        <div class="navbar w-full">
          <div class="flex-none lg:hidden">
            <label for="my-drawer-3" class="btn-ghost btn-square btn">
              <SvgIcon
                name="nav-menu"
                color="#A6ADBA"
                class="inline-block h-6 w-6"
              />
            </label>
          </div>
          <div class="mx-2 flex-1 px-2">Web-Rtc</div>
          <NavIcons class="flex-none pr-3" />
        </div>
      </div>
      <div class="drawer-side">
        <label for="my-drawer-3" class="drawer-overlay"></label>
        <MenuSide class="bg-base-200"></MenuSide>
      </div>
    </div>
  );
};

export type FullHeightFlexBoxProps = Partial<{
  dire: 'col' | 'row';
  type: 'full' | 'screen';
}>;

export const FullHeightFlexBox = (
  props: FullHeightFlexBoxProps,
  ctx: SetupContext
) => {
  const { dire = 'row', type = 'screen' } = props;

  const height: Record<'full' | 'screen', string> = {
    full: 'h-full',
    screen: 'h-screen',
  };

  return (
    <div class={['flex', height[type], `flex-${dire}`, 'min-h-0']}>
      {ctx.slots.default?.()}
    </div>
  );
};
