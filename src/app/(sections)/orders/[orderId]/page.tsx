import { Types } from 'mongoose'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getOrder } from '@/lib/handlers'

export default async function OrderPage({
  params,
}: {
  params: { orderId: string }
}) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  if (!Types.ObjectId.isValid(params.orderId)) {
    notFound()
  }

  const order = await getOrder(session.userId, params.orderId)
  if (!order) {
    notFound()
  }

  const total = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )

  return (
    <div className='flex flex-col'>
      <h2 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Order details
      </h2>

      <div className='mb-8 rounded-lg border border-gray-200 bg-white p-6'>
        <dl className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wider text-gray-500'>
              Order ID
            </dt>
            <dd className='mt-1 font-mono text-sm text-gray-900'>
              {order._id.toString()}
            </dd>
          </div>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wider text-gray-500'>
              Date
            </dt>
            <dd className='mt-1 text-sm text-gray-900'>
              {new Date(order.date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </dd>
          </div>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wider text-gray-500'>
              Shipping address
            </dt>
            <dd className='mt-1 text-sm text-gray-900'>{order.address}</dd>
          </div>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wider text-gray-500'>
              Card holder
            </dt>
            <dd className='mt-1 text-sm text-gray-900'>{order.cardHolder}</dd>
          </div>
          <div>
            <dt className='text-xs font-medium uppercase tracking-wider text-gray-500'>
              Card number
            </dt>
            <dd className='mt-1 font-mono text-sm text-gray-900'>
              **** **** **** {order.cardNumber.slice(-4)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Order items */}
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
            {order.orderItems.map((item) => (
              <tr key={item.product._id.toString()}>
                <td className='px-6 py-4'>
                  <Link
                    href={`/products/${item.product._id}`}
                    className='font-medium text-gray-900 hover:text-indigo-600'
                  >
                    {item.product.name}
                  </Link>
                </td>
                <td className='px-6 py-4 text-center text-sm text-gray-700'>
                  {item.qty}
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

      <p className='mt-6 text-right text-lg font-semibold text-gray-900'>
        Total: <span className='text-indigo-600'>{total.toFixed(2)} €</span>
      </p>
    </div>
  )
}
