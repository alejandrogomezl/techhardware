import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getUser, getUserOrders } from '@/lib/handlers'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/signin')
  }

  const [user, ordersData] = await Promise.all([
    getUser(session.userId),
    getUserOrders(session.userId),
  ])

  if (!user || !ordersData) {
    redirect('/auth/signin')
  }

  return (
    <div className='flex flex-col gap-10'>
      <div>
        <h2 className='pb-4 text-3xl font-bold text-gray-900'>My profile</h2>
        <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
          <dl className='divide-y divide-gray-100'>
            <div className='px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4'>
              <dt className='text-sm font-medium text-gray-500'>Name</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                {user.name} {user.surname}
              </dd>
            </div>
            <div className='px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4'>
              <dt className='text-sm font-medium text-gray-500'>Email</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                {user.email}
              </dd>
            </div>
            <div className='px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4'>
              <dt className='text-sm font-medium text-gray-500'>Date of birth</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                {new Date(user.birthdate).toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
            <div className='px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4'>
              <dt className='text-sm font-medium text-gray-500'>Address</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                {user.address}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h3 className='pb-4 text-2xl font-bold text-gray-900'>Order history</h3>

        {ordersData.orders.length === 0 ? (
          <div className='py-10 text-center'>
            <p className='text-sm text-gray-400'>You have no orders yet.</p>
            <Link
              href='/'
              className='mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500'
            >
              Start shopping &rarr;
            </Link>
          </div>
        ) : (
          <div className='overflow-hidden rounded-lg border border-gray-200'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Order ID
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Address
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500'>
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 bg-white'>
                {ordersData.orders.map((order) => (
                  <tr key={order._id.toString()}>
                    <td className='px-6 py-4 font-mono text-xs text-gray-700'>
                      {order._id.toString()}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-700'>
                      {new Date(order.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-700'>
                      {order.address}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <Link
                        href={`/orders/${order._id}`}
                        className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
