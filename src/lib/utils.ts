import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, differenceInDays, addDays, addMonths } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM d, yyyy')
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'MMM d, yyyy h:mm a')
}

export function formatRelativeDate(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function getTrainingStatus(dueDate: string | Date, completedAt: string | Date | null) {
  if (completedAt) return 'completed'

  const today = new Date()
  const due = new Date(dueDate)
  const daysUntilDue = differenceInDays(due, today)

  if (daysUntilDue < 0) return 'overdue'
  if (daysUntilDue <= 30) return 'due_soon'
  return 'current'
}

export function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
    case 'current':
    case 'vaccinated':
      return 'text-green-600 bg-green-50'
    case 'due_soon':
    case 'in_progress':
      return 'text-yellow-600 bg-yellow-50'
    case 'overdue':
    case 'declined':
      return 'text-red-600 bg-red-50'
    case 'pending':
    case 'not_started':
      return 'text-gray-600 bg-gray-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
    case 'current':
    case 'vaccinated':
      return '✓'
    case 'due_soon':
    case 'in_progress':
      return '⚠'
    case 'overdue':
      return '✗'
    case 'pending':
    case 'not_started':
      return '○'
    default:
      return '○'
  }
}

export function calculateNewHireDeadline(hireDate: string | Date) {
  return addDays(new Date(hireDate), 10)
}

export function calculateNextTrainingDue(lastCompleted: string | Date | null, frequencyMonths: number) {
  if (!lastCompleted) return new Date()
  return addMonths(new Date(lastCompleted), frequencyMonths)
}

export function generateMagicLinkToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const

export const PLAN_PRICING = {
  solo: { min: 1, max: 5, monthly: 99, annual: 1089 },
  small: { min: 6, max: 15, monthly: 129, annual: 1419 },
  medium: { min: 16, max: 30, monthly: 169, annual: 1859 },
  large: { min: 31, max: Infinity, monthly: 219, annual: 2409 },
} as const

export function getPlanForEmployeeCount(count: number) {
  if (count <= 5) return 'solo'
  if (count <= 15) return 'small'
  if (count <= 30) return 'medium'
  return 'large'
}
