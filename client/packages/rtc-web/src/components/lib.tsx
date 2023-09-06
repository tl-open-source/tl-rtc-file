import { SetupContext } from 'vue';
import { SvgIcon, NavIcons } from './base';
import { MenuSide } from './menu';
import { resetUrl } from '@/utils';

export const NavHeader = (
  { showSiderbar }: Partial<{ showSiderbar: boolean }>,
  ctx: SetupContext
) => {
  return (
    <div class="drawer shadow-md dark:shadow-sm dark:shadow-neutral-600">
      <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex flex-col">
        {/* Navbar */}
        <div class="navbar w-full">
          <div class="flex-none lg:hidden">
            {showSiderbar ? (
              <label
                for="my-drawer-3"
                class="btn-ghost btn-square btn"
                onClick={() => ctx.emit('toggle')}
              >
                <SvgIcon
                  name="nav-menu"
                  color="#A6ADBA"
                  class="inline-block h-6 w-6"
                />
              </label>
            ) : undefined}
          </div>
          <div class="mx-2 flex-1 px-2">
            <span class="cursor-pointer" onClick={resetUrl}>
              Web-Rtc
            </span>
          </div>
          <NavIcons class="flex-none pr-3" />
        </div>
      </div>

      {showSiderbar ? (
        <div class="drawer-side z-50">
          <label
            for="my-drawer-3"
            class="drawer-overlay"
            onClick={() => ctx.emit('toggle')}
          ></label>
          <MenuSide class="bg-base-200"></MenuSide>
        </div>
      ) : undefined}
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
