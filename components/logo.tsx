import { FC } from "react"
import Link from "next/link";

// A plain <img> rather than next/image: the logo is an SVG (nothing to
// optimise) and next/image's default loader blocks `next export`.
const Logo: FC = () => (
    <Link href="/">
        <a className="hover:opacity-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Shabbaton Choir" width={205} height={59} />
        </a>
    </Link>
);

export default Logo;
