'use client';
import Link from "next/link";
import Image from 'next/image';

const NAV_LINKS = [
    { name: "Home", href: '/'},
    { name: "Rankings", href: '/rankings'},
    { name: "Search", href: '/search'},
];

export default function NavBar() {

    return (
        <nav className='w-full pt-5 pb-20'>
            <div className="w-full flex justify-evenly items-center">
                <div className="flex-1 max-w-64 min-w-32 p-5 rounded-md text-center font-medium text-2xl text-gray-500 overflow-hidden flex justify-center items-center">
                    <Image src="/logo/zeebe_fantasy.png" width={120} height={120} alt="ZF Logo"/>
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
                <div className="flex-1 max-w-64 min-w-32 p-5 rounded-md font-medium text-2xl text-center text-gray-500  overflow-hidden text-ellipsis whitespace-nowrap">
                    Learn our Story
                </div>
            </div>
        </nav>
    )
}