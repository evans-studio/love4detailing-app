import { useToast as useToastOriginal } from '@/hooks/use-toast'

export interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export const useToast = () => {
  const { toast: toastFn } = useToastOriginal()
  return {
    toast: (props: ToastProps) => toastFn(props)
  }
} 