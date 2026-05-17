'use client';
import Link from "next/link";

const NAV_LINKS = [
    { name: "Home", href: '/'},
    { name: "Rankings", href: '/rankings'},
    { name: "Search", href: '/search'},
];

export default function NavBar() {

    return (
        <nav className='w-full py-5'>
            <div className="w-full flex justify-evenly items-center">
                <div className="flex-1 max-w-64 min-w-32 p-5 rounded-md text-center font-medium text-2xl text-gray-500 hover:text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                    Zeebe Fantasy
                </div>
                <div className="flex-1 flex gap-25 p-5 rounded-md justify-center items-center">
                    {NAV_LINKS.map((link, idx) => {
                        return <Link 
                                key={idx} 
                                href={link.href} 
                                className="font-medium text-2xl text-gray-500 hover:text-gray-700">
                                    {link.name}
                                </Link>
                    })
                    }
                </div>
                <div className="flex-1 max-w-64 min-w-32 p-5 rounded-md font-medium text-2xl text-center text-gray-500 hover:text-gray-700  overflow-hidden text-ellipsis whitespace-nowrap">
                    Learn our Story
                </div>
            </div>
        </nav>
    )
}