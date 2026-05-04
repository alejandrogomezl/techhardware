'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getGuestCart } from '@/lib/guestCart'

export default function CheckoutContent() {
  const [items] = useState(() => getGuestCart())

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  if (items.length === 0) {
    return (
      <div className='py-16 text-center'>
        <p className='text-sm text-gray-400'>Your cart is empty.</p>
        <Link
          href='/'
          className='mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500'
        >
          Continue shopping &rarr;
        </Link>
      </div>
    )
  }

  return (
    <div className='lg:grid lg:grid-cols-2 lg:gap-x-12'>
      {/* Order summary */}
      <div>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Order summary
        </h3>
        <div className='overflow-hidden rounded-lg border border-gray-200'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Product
                </th>
                <th className='px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Qty
                </th>
                <th className='px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                  Total
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 bg-white'>
              {items.map((item) => (
                <tr key={item.productId}>
                  <td className='px-4 py-3'>
                    <Link
                      href={`/products/${item.productId}`}
                      className='text-sm font-medium text-gray-900 hover:text-indigo-600'
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className='px-4 py-3 text-center text-sm text-gray-700'>
                    {item.qty}
                  </td>
                  <td className='px-4 py-3 text-right text-sm font-medium text-gray-900'>
                    {(item.price * item.qty).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className='mt-4 text-right text-lg font-semibold text-gray-900'>
          Total:{' '}
          <span className='text-indigo-600'>{total.toFixed(2)} €</span>
        </p>
      </div>

      {/* Payment form */}
      <div className='mt-10 lg:mt-0'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Payment details
        </h3>
        <form className='space-y-4'>
          <div>
            <label
              htmlFor='address'
              className='block text-sm font-medium text-gray-700'
            >
              Shipping address
            </label>
            <input
              id='address'
              name='address'
              type='text'
              placeholder='123 Main St, 12345 City, Country'
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label
              htmlFor='cardHolder'
              className='block text-sm font-medium text-gray-700'
            >
              Card holder
            </label>
            <input
              id='cardHolder'
              name='cardHolder'
              type='text'
              placeholder='John Doe'
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label
              htmlFor='cardNumber'
              className='block text-sm font-medium text-gray-700'
            >
              Card number
            </label>
            <input
              id='cardNumber'
              name='cardNumber'
              type='text'
              placeholder='0000 1111 2222 3333'
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
            />
          </div>
          <button
            type='submit'
            disabled
            className='w-full rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'
          >
            Confirm purchase
          </button>
        </form>
      </div>
    </div>
  )
}
