import { useEffect, useState } from 'react'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { PinInput } from './components/base/input/pin-input'

export default function App () {
  console.log('APP LOADED')
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

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
    console.log('VALUE:', value)
  }, [value])

  return (
    <div className='flex flex-col gap-4'>
      <PinInput size='xs'>
        <PinInput.Group maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
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
        <div className='flex items-center gap-2'>
          <AlertCircle />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}
