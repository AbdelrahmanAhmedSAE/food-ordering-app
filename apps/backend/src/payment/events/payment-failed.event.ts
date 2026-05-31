export class PaymentFailedEvent {
  constructor(public readonly orderId: string) {}
}
