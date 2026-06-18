'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FormValues {
  name: string
  surname: string
  email: string
  password: string
  birthdate: string
  address: string
}

export default function SignUpForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [formValues, setFormValues] = useState<FormValues>({
    name: '',
    surname: '',
    email: '',
    password: '',
    birthdate: '',
    address: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!event.currentTarget.checkValidity()) return

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formValues),
    })

    if (res.ok) {
      setError('')
      router.push('/auth/signin')
    } else {
      const data = await res.json()
      if (data.error === 'DUPLICATED_EMAIL') {
        setError('An account with this email already exists.')
      } else {
        setError('An error occurred while processing your request. Please try again later.')
      }
    }
  }

  const inputClass =
    'peer mt-2 block w-full rounded-md border-0 px-1.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 invalid:[&:not(:placeholder-shown):not(:focus)]:ring-red-500 sm:text-sm sm:leading-6'

  return (
    <form className='group space-y-6' onSubmit={handleSubmit} noValidate>
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium leading-6 text-gray-900'>
            First name
          </label>
          <input
            id='name'
            name='name'
            type='text'
            autoComplete='given-name'
            placeholder='John'
            required
            className={inputClass}
            value={formValues.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor='surname' className='block text-sm font-medium leading-6 text-gray-900'>
            Last name
          </label>
          <input
            id='surname'
            name='surname'
            type='text'
            autoComplete='family-name'
            placeholder='Doe'
            required
            className={inputClass}
            value={formValues.surname}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor='email' className='block text-sm font-medium leading-6 text-gray-900'>
          E-mail address
        </label>
        <input
          id='email'
          name='email'
          type='email'
          autoComplete='email'
          placeholder='johndoe@example.com'
          required
          className={inputClass}
          value={formValues.email}
          onChange={handleChange}
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please provide a valid email address.
        </p>
      </div>

      <div>
        <label htmlFor='password' className='block text-sm font-medium leading-6 text-gray-900'>
          Password
        </label>
        <input
          id='password'
          name='password'
          type='password'
          autoComplete='new-password'
          placeholder=' '
          required
          className={inputClass}
          value={formValues.password}
          onChange={handleChange}
        />
        <p className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
          Please input a password.
        </p>
      </div>

      <div>
        <label htmlFor='birthdate' className='block text-sm font-medium leading-6 text-gray-900'>
          Date of birth
        </label>
        <input
          id='birthdate'
          name='birthdate'
          type='date'
          required
          className={inputClass}
          value={formValues.birthdate}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor='address' className='block text-sm font-medium leading-6 text-gray-900'>
          Address
        </label>
        <input
          id='address'
          name='address'
          type='text'
          autoComplete='street-address'
          placeholder='123 Main St, 12345 City, Country'
          required
          className={inputClass}
          value={formValues.address}
          onChange={handleChange}
        />
      </div>

      <div className={error ? '' : 'hidden'}>
        <p className='mt-2 rounded-md border-0 bg-red-500 bg-opacity-30 px-3 py-1.5 text-sm text-gray-900 ring-1 ring-inset ring-red-500'>
          {error}
        </p>
      </div>

      <div>
        <button
          type='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30'
        >
          Create account
        </button>
      </div>
    </form>
  )
}
