import { FC } from "react"
import Image from "next/image";
import Link from "next/link";

const Logo: FC = () => (
    <Link href="/">
        <a className="hover:opacity-100">
            <Image src="/logo.svg" alt="Shabbaton Choir" width={205} height={59} />
        </a>
    </Link>
);

export default Logo;