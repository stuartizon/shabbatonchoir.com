import Link from "next/link";
import { FC } from "react";
import Logo from './logo';

const HeaderDesktop: FC = () => (
    <header>
        <div className="hidden md:flex container px-10 pt-4 mx-auto justify-between items-center">
            <Logo />
            <div className="flex space-y-4 px-2 py-6 uppercase text-center md:static md:flex-row md:space-x-10 md:space-y-0 md:border-0 md:w-fit">
                <Link href="/"><a className="text-sm font-medium">Home</a></Link>
                <Link href="/music"><a className="text-sm font-medium">Music</a></Link>
                <Link href="/leadership"><a className="text-sm font-medium">Leadership</a></Link>
                <Link href="/history"><a className="text-sm font-medium">History</a></Link>
                <Link href="/contact"><a className="text-sm font-medium">Contact</a></Link>
            </div>
        </div>
    </header >
);

export default HeaderDesktop;