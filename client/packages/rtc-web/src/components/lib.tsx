import { SetupContext } from 'vue';
import { MenuSide, SvgIcon, NavIcons } from './base';

export const NavHeader = () => {
  return (
    <div class="drawer">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        {/* Navbar */}
        <div class="navbar w-full bg-base-300">
          <div class="flex-none lg:hidden">
            <label for="my-drawer-3" class="btn-ghost btn-square btn">
              <SvgIcon
                name="nav-menu"
                color="#A6ADBA"
                class="inline-block h-6 w-6 stroke-current"
              />
            </label>
          </div>
          <div class="mx-2 flex-1 px-2">Web-Rtc</div>
          <NavIcons class="flex-none pr-3" />
        </div>
      </div>
      <div class="drawer-side">
        <label for="my-drawer-3" class="drawer-overlay"></label>
        <MenuSide></MenuSide>
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
    <div class={['flex', height[type], `flex-${dire}`]}>
      {ctx.slots.default?.()}
    </div>
  );
};
