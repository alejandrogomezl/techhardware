import Link from 'next/link'
import SignUpForm from '@/components/SignUpForm'

export default function SignUpPage() {
  return (
    <div className='flex w-full flex-col px-6 py-12'>
      <div className='mx-auto w-full max-w-sm'>
        <img
          className='mx-auto h-10 w-auto'
          src='/img/logo.svg'
          alt='TechHardware logo'
        />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
          Create your account
        </h2>
      </div>

      <div className='mx-auto mt-10 w-full max-w-sm'>
        <SignUpForm />
        <p className='mt-10 text-center text-sm text-gray-500'>
          Already a member?{' '}
          <Link
            href='/auth/signin'
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
