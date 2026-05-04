'use client'

import { useState } from 'react'
import { addToGuestCart } from '@/lib/guestCart'

interface Props {
  productId: string
  name: string
  price: number
  img: string
}

export default function AddToCartButton({ productId, name, price, img }: Props) {
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addToGuestCart({ productId, name, price, img, qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className='mt-8 flex items-center gap-4'>
      <button
        type='button'
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
      >
        −
      </button>
      <span className='w-8 text-center text-lg font-medium text-gray-900'>
        {qty}
      </span>
      <button
        type='button'
        onClick={() => setQty((q) => q + 1)}
        className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
      >
        +
      </button>
      <button
        type='button'
        onClick={handleAdd}
        className='ml-4 rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500'
      >
        {added ? '✓ Added!' : 'Add to cart'}
      </button>
    </div>
  )
}
