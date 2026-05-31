export class PaymentSucceededEvent {
  constructor(
    public readonly orderId: string,
    public readonly paymentIntentId: string,
  ) {}
}
