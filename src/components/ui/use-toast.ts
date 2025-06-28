import { useToast as useToastOriginal } from '@/hooks/use-toast'

export interface ToastProps {
  title?: string
  description?: string
}

export const useToast = () => {
  const { toast } = useToastOriginal()
  return {
    toast: (props: ToastProps) => toast(props)
  }
} 