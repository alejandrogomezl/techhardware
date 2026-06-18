'use client'

import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { navbarButtonClasses } from '@/components/NavbarButton'

export default function NavbarSignOutButton() {
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button onClick={handleSignOut} className={navbarButtonClasses}>
      <span className='sr-only'>Sign out</span>
      <ArrowRightStartOnRectangleIcon className='h-6 w-6' aria-hidden='true' />
    </button>
  )
}
