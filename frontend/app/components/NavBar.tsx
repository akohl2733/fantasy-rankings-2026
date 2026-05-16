'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();

    const setLinkStyle = (val: string) => {
        val == pathname ? "text-blue-500 hover:blue-700" : 'text-white hover:gray-300'
    }

    return (
        <div>
            <ul>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/rankings">Rankings</Link></li>
                <li><Link href="/search">Search</Link></li>
            </ul>
        </div>
    )
}