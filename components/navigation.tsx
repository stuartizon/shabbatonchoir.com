import cn from "classnames";
import Link from "next/link";
import { FC } from "react";

const Navigation: FC<NavigationProps> = ({ visible }) => (
    <nav className="relative">
        <div className={cn("absolute top-0 right-0 bottom-0 w-screen duration-500 z-10", { "translate-x-full": !visible, "translate-x-0": visible })}>
            <div className="bg-white flex flex-col space-y-4 px-2 py-6 uppercase text-center">
                <Link href="/"><a className="text-sm font-medium">Home</a></Link>
                <Link href="/music"><a className="text-sm font-medium">Music</a></Link>
                <Link href="/leadership"><a className="text-sm font-medium">Leadership</a></Link>
                <Link href="/history"><a className="text-sm font-medium">History</a></Link>
                <Link href="/contact"><a className="text-sm font-medium">Contact</a></Link>
            </div>
        </div>
    </nav>
);

export default Navigation;

interface NavigationProps {
    visible: boolean;
}