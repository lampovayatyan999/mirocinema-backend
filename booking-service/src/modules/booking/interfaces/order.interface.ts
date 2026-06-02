import type { OrderStatus } from '../enums/order-status.enum'
import type { Ticket } from './ticket.interface'

export interface Order {
    id: string
    amount: number
    currency: string
    status: OrderStatus
    qr_code: string | null
    user_id: string
    tickets: Ticket[]
    created_at: Date
    updated_at: Date
}