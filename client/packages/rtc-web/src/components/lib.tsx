import { SetupContext } from 'vue';
import { MenuSide, SvgIcon } from './base';

<SvgIcon
  name="nav-menu"
  color="#A6ADBA"
  class="stroke-curren inline-block h-5 w-5"
/>;

export function NavHeader() {
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
        </div>
      </div>
      <div class="drawer-side">
        <label for="my-drawer-3" class="drawer-overlay"></label>
        <MenuSide></MenuSide>
      </div>
    </div>
  );
}

export function FullScreenBox(
  props: { dire: 'col' | 'row' },
  ctx: SetupContext
) {
  const { dire } = props;
  return (
    <div class={['flex', 'h-screen', `flex-${dire}`]}>
      {ctx.slots.default?.()}
    </div>
  );
}

export function NavContent(_: unknown, ctx: SetupContext) {
  return <div class="flex h-full">{ctx.slots.default?.()}</div>;
}
