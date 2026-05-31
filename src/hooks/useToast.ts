// src/hooks/useToast.ts
import { useCallback, useState } from 'react'

type ToastState = {
  message: string
  type:    'success' | 'error'
  visible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type:    'success',
    visible: false,
  })

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, visible: true })
  }, [])

  const hideToast = useCallback(() => {
    setToast(t => ({ ...t, visible: false }))
  }, [])

  return { toast, showToast, hideToast }
}