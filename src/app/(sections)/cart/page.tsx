'use client'

import dynamic from 'next/dynamic'

const GuestCartPage = dynamic(() => import('@/components/GuestCartPage'), {
  ssr: false,
})

export default function CartPage() {
  return <GuestCartPage />
}
