import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white text-sidebar-primary-foreground">
            {/* <AppLogoIcon className="size-5 fill-current text-white dark:text-black" /> */}
            <img src="/assets/logo_socio.png" alt="Logo" className="size-5" />
        </div>
    );
}
