import { useEffect, useState } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { PinInput } from './components/base/input/pin-input'
import { AlertCircle } from "@untitledui/icons";

export default function App () {
  console.log('APP LOADED')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [page, setPage] = useState<'verify' | 'profile'>('verify')

  const verifyCode = async (code: string) => {
    if (!code || code.length !== 6) return
    console.log('Calling backend with:', code)
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
      setMessage('Code verified successfully ✅')
      setPage('profile')
      console.log('Success:', data)
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong ❌')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (value.length === 6 && !loading) {
      verifyCode(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (page === 'profile') {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm'>
          <h1 className='text-3xl font-semibold text-slate-900'>Profile Page</h1>
          <p className='mt-3 text-slate-500'>This is your blank profile page after successful verification.</p>
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
          onChange={(v) => setValue(String(v))}
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

      {status === 'error' && (
        <div className='flex items-center gap-2 text-red-600'>
          <AlertCircle />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
