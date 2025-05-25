import Navbar from '@/components/Navbar'
import React from 'react'


type Props = {
    children: React.ReactNode
}
const layout = ({ children }: Props) => {
  return (
    <main className='min-h-screend'>
        <Navbar />
        {children}
    </main>
  )
}

export default layout