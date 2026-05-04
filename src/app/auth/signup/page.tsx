import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-900'>Create account</h1>
          <p className='mt-2 text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              href='/auth/signin'
              className='font-medium text-indigo-600 hover:text-indigo-500'
            >
              Sign in
            </Link>
          </p>
        </div>

        <form className='mt-8 space-y-6'>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  First name
                </label>
                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='given-name'
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                />
              </div>
              <div>
                <label
                  htmlFor='surname'
                  className='block text-sm font-medium text-gray-700'
                >
                  Last name
                </label>
                <input
                  id='surname'
                  name='surname'
                  type='text'
                  autoComplete='family-name'
                  className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                />
              </div>
            </div>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='new-password'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='birthdate'
                className='block text-sm font-medium text-gray-700'
              >
                Date of birth
              </label>
              <input
                id='birthdate'
                name='birthdate'
                type='date'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              />
            </div>
            <div>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-gray-700'
              >
                Address
              </label>
              <input
                id='address'
                name='address'
                type='text'
                autoComplete='street-address'
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'
              />
            </div>
          </div>

          <button
            type='submit'
            disabled
            className='w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  )
}
