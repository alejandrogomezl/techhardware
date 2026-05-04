'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  GuestCartItem,
  getGuestCart,
  updateGuestCartQty,
  CART_EVENT,
} from '@/lib/guestCart'

export default function GuestCartPage() {
  const [items, setItems] = useState<GuestCartItem[]>(() => getGuestCart())

  const refresh = () => setItems(getGuestCart())

  useEffect(() => {
    window.addEventListener(CART_EVENT, refresh)
    return () => window.removeEventListener(CART_EVENT, refresh)
  }, [])

  const update = (productId: string, qty: number) => {
    updateGuestCartQty(productId, qty)
  }

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div className='flex flex-col'>
      <h2 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        My Shopping Cart
      </h2>

      {items.length === 0 ? (
        <div className='py-16 text-center'>
          <p className='text-sm text-gray-400'>Your cart is empty.</p>
          <Link
            href='/'
            className='mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500'
          >
            Continue shopping &rarr;
          </Link>
        </div>
      ) : (
        <>
          <div className='overflow-hidden rounded-lg border border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Product
                  </th>
                  <th className='px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Qty
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Unit price
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td className='px-6 py-4'>
                      <Link
                        href={`/products/${item.productId}`}
                        className='font-medium text-gray-900 hover:text-indigo-600'
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center justify-center gap-2'>
                        <button
                          type='button'
                          onClick={() => update(item.productId, item.qty - 1)}
                          className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50'
                        >
                          −
                        </button>
                        <span className='w-8 text-center text-sm text-gray-900'>
                          {item.qty}
                        </span>
                        <button
                          type='button'
                          onClick={() => update(item.productId, item.qty + 1)}
                          className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50'
                        >
                          +
                        </button>
                        <button
                          type='button'
                          onClick={() => update(item.productId, 0)}
                          className='ml-2 text-xs text-red-500 hover:text-red-700'
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                    <td className='px-6 py-4 text-right text-sm text-gray-900'>
                      {item.price.toFixed(2)} €
                    </td>
                    <td className='px-6 py-4 text-right text-sm font-medium text-gray-900'>
                      {(item.price * item.qty).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-6 flex items-center justify-between'>
            <p className='text-lg font-semibold text-gray-900'>
              Total:{' '}
              <span className='text-indigo-600'>{total.toFixed(2)} €</span>
            </p>
            <Link
              href='/checkout'
              className='rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500'
            >
              Go to checkout &rarr;
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
