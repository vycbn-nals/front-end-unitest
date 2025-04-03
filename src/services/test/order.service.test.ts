import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderService } from '../order.service';
import { PaymentService } from '../payment.service';
import { Order } from '../../models/order.model';

describe('OrderService', () => {
  const mockPaymentService = {
    buildPaymentMethod: vi.fn(),
    payViaLink: vi.fn(),
  } as unknown as PaymentService;

  const orderService = new OrderService(mockPaymentService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw an error if order items are not provided', async () => {
    const order: Partial<Order> = {};

    await expect(orderService.process(order)).rejects.toThrow('Order items are required');
  });

  it('should throw an error if any order item has invalid price or quantity', async () => {
    const order: Partial<Order> = {
      items: [{ id: 'id', productId: 'product-id', price: 0, quantity: 0 }],
    };

    await expect(orderService.process(order)).rejects.toThrow('Order items are invalid');
  });

  it('should apply a valid coupon and adjust the total price', async () => {
    const order: Partial<Order> = {
      items: [{ id: 'id', productId: 'product-id', price: 100, quantity: 1 }],
      couponId: 'valid-coupon',
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ discount: 50 }),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ id: 'order-id' }),
      });

    mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

    await orderService.process(order);

    expect(global.fetch).toHaveBeenCalledWith('https://67eb7353aa794fb3222a4c0e.mockapi.io/coupons/valid-coupon');
    expect(global.fetch).toHaveBeenCalledWith('https://67eb7353aa794fb3222a4c0e.mockapi.io/order', expect.any(Object));
    expect(mockPaymentService.payViaLink).toHaveBeenCalledWith(expect.objectContaining({ "id": "order-id" }));
  });

  it('should handle a coupon discount that reduces total price to 0', async () => {
    const order: Partial<Order> = {
      items: [{ id: 'id', productId: 'product-id', price: 50, quantity: 1 }],
      couponId: 'valid-coupon',
    };

    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ discount: 100 }),
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ id: 'order-id' }),
      });

    mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

    await orderService.process(order);

    expect(mockPaymentService.payViaLink).toHaveBeenCalledWith(expect.objectContaining({ "id": "order-id", }));
  });

  it('should throw an error if the coupon is invalid', async () => {
    const order: Partial<Order> = {
      items: [{ id: 'id', productId: 'product-id', price: 100, quantity: 1 }],
      couponId: 'invalid-coupon',
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue(null),
    });

    await expect(orderService.process(order)).rejects.toThrow('Invalid coupon');
  });

  it('should process the order without a coupon', async () => {
    const order: Partial<Order> = {
      items: [{ id: 'id', productId: 'product-id', price: 100, quantity: 2 }],
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ id: 'order-id' }),
    });

    mockPaymentService.buildPaymentMethod.mockReturnValue('mock-payment-method');

    await orderService.process(order);

    expect(global.fetch).toHaveBeenCalledWith('https://67eb7353aa794fb3222a4c0e.mockapi.io/order', expect.any(Object));
    expect(mockPaymentService.payViaLink).toHaveBeenCalledWith(expect.objectContaining({ "id": "order-id", }));
  });
});