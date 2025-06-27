export function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatTime(time: string): string {
  return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
} 