import { Info, Languages} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ThemeToggle } from './ThemeToggle'

const Navbar = () => {
    return (
        <nav className='sticky top-0 z-50 w-full border-b border-gray-200/20 shadow-sm bg-white dark:bg-gray-900'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16'>
                    <Link href="/" className='flex items-center space-x-0 group'>
                        <div className='relative'>
                            <Languages className='w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110' />
                            <div className='absolute -inset-1 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                        </div>
                        <h2 className='text-2xl sm:text-3xl font-bold'>
                            <span className=' group-hover: transition-colors duration-300'>
                                Gbe
                            </span>
                            <span className='text-primary'>Cé</span>
                        </h2>
                    </Link>

                    <div className='flex  items-center'>
                        <ThemeToggle />

                        <Link
                            href="/about"
                            className=' group flex items-center space-x-2 px-4 py-2 rounded-lg  hover:text-primary hover:bg-primary/5 transition-all duration-300 font-medium'
                        >
                            <Info className='w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300' />
                            <span className='hidden md:block'>À propos</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar