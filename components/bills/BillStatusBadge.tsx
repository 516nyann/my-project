import { cn } from '@/lib/utils'

type BillStatus = 'open' | 'closed' | 'paid'

interface BillStatusBadgeProps {
  status: BillStatus
  className?: string
}

const STATUS_CONFIG: Record<BillStatus, { label: string; className: string }> = {
  open: {
    label: '営業中',
    className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  },
  closed: {
    label: '会計済',
    className: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  },
  paid: {
    label: '入金済',
    className: 'bg-green-500/20 text-green-400 border border-green-500/30',
  },
}

export function BillStatusBadge({ status, className }: BillStatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
