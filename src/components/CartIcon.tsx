'use client'

import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getGuestCart, CART_EVENT } from '@/lib/guestCart'
import { navbarButtonClasses } from '@/components/NavbarButton'

export default function CartIcon() {
  const [count, setCount] = useState(0)

  const refresh = () => {
    setCount(getGuestCart().reduce((s, i) => s + i.qty, 0))
  }

  useEffect(() => {
    refresh()
    window.addEventListener(CART_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(CART_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  return (
    <Link href='/cart' className={`relative ${navbarButtonClasses}`}>
      <span className='sr-only'>Cart</span>
      <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
      {count > 0 && (
        <span className='absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white'>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
