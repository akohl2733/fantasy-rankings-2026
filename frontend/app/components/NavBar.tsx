'use client';
import Link from "next/link";
import Image from 'next/image';
import { ClerkProvider, Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'


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
                <div className="flex-1 max-w-64 min-w-32 p-5 rounded-md text-center font-medium text-2xl text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                    <Show when="signed-out">
                        {/* Wrap both in a sub-flex container to control their spacing explicitly */}
                        <div className="flex items-center justify-center gap-8"> 
                            <SignInButton>
                                <button className="text-gray-500 hover:text-gray-700 font-medium text-lg cursor-pointer transition-colors">
                                    Sign In
                                </button>
                            </SignInButton>
                            
                            <SignUpButton>
                                <button className="bg-[#6c47ff] hover:bg-[#5b3ce0] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-5 sm:px-6 cursor-pointer transition-colors shadow-sm">
                                    Sign Up
                                </button>
                            </SignUpButton>
                        </div>
                    </Show>
                    
                    <Show when="signed-in">
                        <div className="flex justify-center items-center">
                            <UserButton 
                                appearance={{
                                    elements: {
                                        userButtonTrigger: {
                                            width: "56px",
                                            height: "56px",
                                        },
                                        avatarBox: {
                                            width: "56px",
                                            height: "56px",
                                        }
                                    }
                                }}
                            />
                        </div>
                    </Show>
                </div>
            </div>
        </nav>
    )
}