'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
    const pathname = usePathname();

    const setLinkStyle = (val: string) => {
        return val === pathname ? "text-gray-500 hover:gray-700" : 'text-white hover:gray-300'
    }

    return (
        <nav className="p-5">
            <div className="flex gap-10 p-5 bg-red-200 rounded-md">
                <Link href="/" className={`font-bold ${setLinkStyle("/")}`}>Home</Link>
                <Link href="/rankings" className={`font-bold ${setLinkStyle("/rankings")}`}>Rankings</Link>
                <Link href="/search" className={`font-bold ${setLinkStyle("/search")}`}>Search</Link>
            </div>
        </nav>
    )
}