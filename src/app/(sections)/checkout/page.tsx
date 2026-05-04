import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getSession } from '@/lib/auth'

const CheckoutContent = dynamic(
  () => import('@/components/CheckoutContent'),
  { ssr: false }
)

export default async function CheckoutPage() {
  const session = await getSession()

  if (!session) {
    return (
      <div className='flex flex-col items-center py-24 text-center'>
        <h2 className='text-2xl font-bold text-gray-900'>
          Sign in to complete your purchase
        </h2>
        <p className='mt-3 text-sm text-gray-500'>
          You need an account to process your order. Your cart is saved.
        </p>
        <div className='mt-8 flex gap-4'>
          <Link
            href='/auth/signin'
            className='rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500'
          >
            Sign in
          </Link>
          <Link
            href='/auth/signup'
            className='rounded-md border border-indigo-600 px-6 py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50'
          >
            Create account
          </Link>
        </div>
        <Link
          href='/cart'
          className='mt-6 text-sm text-gray-400 hover:text-gray-600'
        >
          &larr; Back to cart
        </Link>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <h2 className='pb-4 text-3xl font-bold text-gray-900 sm:pb-6 lg:pb-8'>
        Checkout
      </h2>
      <CheckoutContent />
    </div>
  )
}
