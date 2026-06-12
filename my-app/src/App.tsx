import { useEffect, useState } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { PinInput } from './components/base/input/pin-input'
import { Checkbox } from './components/base/checkbox/checkbox.tsx'
import { Button } from './components/base/buttons/button.tsx'

import { AlertCircle } from '@untitledui/icons'

export default function App () {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [page, setPage] = useState<'verify' | 'profile'>(() => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('staySignedIn') === 'true'
    ) {
      return 'profile'
    }
    return 'verify'
  })
  const [staySignedIn, setStaySignedIn] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      localStorage.getItem('staySignedIn') === 'true'
    ) {
      return true
    }
    return false
  })

  const signOut = () => {
    setPage('verify')
    setValue('')
    setStatus('idle')
    setMessage('')
    setStaySignedIn(false)
    localStorage.removeItem('staySignedIn')
  }

  const handleStaySignedInChange = () => {
    const next = !staySignedIn
    setStaySignedIn(next)
    if (typeof window !== 'undefined') {
      if (next) {
        localStorage.setItem('staySignedIn', 'true')
      } else {
        localStorage.removeItem('staySignedIn')
      }
    }
  }

  const verifyCode = async (code: string) => {
    if (!code || code.length !== 6) return
    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const res = await fetch(
        'https://packofgum.onrender.com/api/auth/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ code })
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Verification failed')
      }

      setStatus('success')
      setPage('profile')
      if (staySignedIn) {
        localStorage.setItem('staySignedIn', 'true')
      } else {
        localStorage.removeItem('staySignedIn')
      }
    } catch (err: any) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  if (page === 'profile') {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm'>
          <h1 className='text-3xl font-semibold text-slate-900'>
            Profil page
          </h1>
          <p className='mt-3 text-slate-500'>You are signed in.</p>
          {message && <p className='mt-4 text-sm text-slate-600'>{message}</p>}
          <Button
            type='button'
            onClick={signOut}
            color='secondary'
            size='md'
            className='w-1/1 mt-6'
          >
            Sign out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <PinInput size='xs'>
        <PinInput.Group
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={value}
          onChange={v => setValue(String(v))}
        >
          <PinInput.Slot index={0} />
          <PinInput.Slot index={1} />
          <PinInput.Slot index={2} />
          <PinInput.Separator />
          <PinInput.Slot index={3} />
          <PinInput.Slot index={4} />
          <PinInput.Slot index={5} />
        </PinInput.Group>
      </PinInput>

      <label className='flex items-center gap-2 text-sm text-slate-700'>
        <Checkbox
          label='Remember me'
          hint='Save my login details for next time.'
          size='sm'
          checked={staySignedIn}
          disabled={loading}
          onChange={handleStaySignedInChange}
        ></Checkbox>
      </label>
        <Button
          color='secondary'
          size='md'
          onClick={() => verifyCode(value)}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </Button>

      {status === 'error' && (
        <div className='flex items-center gap-2 text-red-600'>
          <AlertCircle />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
