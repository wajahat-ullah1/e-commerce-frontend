export const orders = [
  {
    id: 'ord-001',
    orderNumber: '123456',
    date: '2026-09-05',
    status: 'In Transit',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery',
    invoiceNumber: 'INV-2026-001234',
    invoiceDate: '2026-09-05',
    items: [
      {
        id: 'i1',
        productId: '1',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        image:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop&auto=format',
        price: 279.99,
        quantity: 1,
      },
      {
        id: 'i2',
        productId: '4',
        name: 'Ceramic Pour-Over Coffee Set',
        image:
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&auto=format',
        price: 64.0,
        quantity: 1,
      },
    ],
    subtotal: 343.99,
    shipping: 0,
    total: 343.99,
    customer: {
      name: 'Alex Johnson',
      phone: '+1 555 0123',
      email: 'alex@example.com',
    },
    address: {
      line1: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
    },
    timeline: [
      {
        status: 'Pending',
        date: '2026-09-05 10:30',
        done: true,
      },
      {
        status: 'Processing',
        date: '2026-09-05 14:00',
        done: true,
      },
      {
        status: 'Shipped',
        date: '2026-09-06 09:15',
        done: true,
      },
      {
        status: 'In Transit',
        date: '2026-09-07 08:00',
        done: true,
      },
      {
        status: 'Delivered',
        date: '',
        done: false,
      },
    ],
  },

  {
    id: 'ord-002',
    orderNumber: '123455',
    date: '2026-08-28',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Cash on Delivery',
    invoiceNumber: 'INV-2026-001233',
    invoiceDate: '2026-08-28',
    items: [
      {
        id: 'i3',
        productId: '2',
        name: 'Minimalist Leather Watch',
        image:
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&auto=format',
        price: 189.0,
        quantity: 1,
      },
    ],
    subtotal: 189.0,
    shipping: 0,
    total: 189.0,
    customer: {
      name: 'Alex Johnson',
      phone: '+1 555 0123',
      email: 'alex@example.com',
    },
    address: {
      line1: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
    },
    timeline: [
      {
        status: 'Pending',
        date: '2026-08-28 11:00',
        done: true,
      },
      {
        status: 'Processing',
        date: '2026-08-28 15:30',
        done: true,
      },
      {
        status: 'Shipped',
        date: '2026-08-29 10:00',
        done: true,
      },
      {
        status: 'In Transit',
        date: '2026-08-30 08:00',
        done: true,
      },
      {
        status: 'Delivered',
        date: '2026-08-31 14:30',
        done: true,
      },
    ],
  },

  {
    id: 'ord-003',
    orderNumber: '123454',
    date: '2026-08-15',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    paymentMethod: 'Cash on Delivery',
    invoiceNumber: 'INV-2026-001232',
    invoiceDate: '2026-08-15',
    items: [
      {
        id: 'i4',
        productId: '7',
        name: 'Apple MacBook Air M3',
        image:
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop&auto=format',
        price: 1299.0,
        quantity: 1,
      },
    ],
    subtotal: 1299.0,
    shipping: 0,
    total: 1299.0,
    customer: {
      name: 'Alex Johnson',
      phone: '+1 555 0123',
    },
    address: {
      line1: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
    },
    timeline: [
      {
        status: 'Pending',
        date: '2026-08-15 09:00',
        done: true,
      },
      {
        status: 'Cancelled',
        date: '2026-08-15 11:00',
        done: true,
      },
    ],
  },

  {
    id: 'ord-004',
    orderNumber: '123453',
    date: '2026-09-08',
    status: 'Processing',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery',
    invoiceNumber: 'INV-2026-001231',
    invoiceDate: '2026-09-08',
    items: [
      {
        id: 'i5',
        productId: '5',
        name: 'Natural Skincare Gift Set',
        image:
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=200&h=200&fit=crop&auto=format',
        price: 74.0,
        quantity: 2,
      },
      {
        id: 'i6',
        productId: '12',
        name: 'Vitamin C Brightening Serum',
        image:
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop&auto=format',
        price: 48.0,
        quantity: 1,
      },
    ],
    subtotal: 196.0,
    shipping: 0,
    total: 196.0,
    customer: {
      name: 'Alex Johnson',
      phone: '+1 555 0123',
      email: 'alex@example.com',
    },
    address: {
      line1: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
    },
    timeline: [
      {
        status: 'Pending',
        date: '2026-09-08 10:00',
        done: true,
      },
      {
        status: 'Processing',
        date: '2026-09-08 12:00',
        done: true,
      },
      {
        status: 'Shipped',
        date: '',
        done: false,
      },
      {
        status: 'In Transit',
        date: '',
        done: false,
      },
      {
        status: 'Delivered',
        date: '',
        done: false,
      },
    ],
  },

  {
    id: 'ord-005',
    orderNumber: '123452',
    date: '2026-09-09',
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash on Delivery',
    invoiceNumber: 'INV-2026-001230',
    invoiceDate: '2026-09-09',
    items: [
      {
        id: 'i7',
        productId: '11',
        name: 'Tailored Wool Blazer',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
        price: 249.0,
        quantity: 1,
      },
    ],
    subtotal: 249.0,
    shipping: 0,
    total: 249.0,
    customer: {
      name: 'Alex Johnson',
      phone: '+1 555 0123',
      email: 'alex@example.com',
    },
    address: {
      line1: '123 Maple Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'United States',
    },
    timeline: [
      {
        status: 'Pending',
        date: '2026-09-09 08:00',
        done: true,
      },
      {
        status: 'Processing',
        date: '',
        done: false,
      },
      {
        status: 'Shipped',
        date: '',
        done: false,
      },
      {
        status: 'In Transit',
        date: '',
        done: false,
      },
      {
        status: 'Delivered',
        date: '',
        done: false,
      },
    ],
  },
];

export const notifications = [
  {
    id: 'n1',
    type: 'order',
    title: 'Order In Transit',
    message:
      'Your order #123456 is on its way! Expected delivery: Sep 10.',
    date: '2026-09-07 08:00',
    read: false,
  },
  {
    id: 'n2',
    type: 'order',
    title: 'Order Shipped',
    message:
      'Your order #123456 has been shipped via Express Courier.',
    date: '2026-09-06 09:15',
    read: false,
  },
  {
    id: 'n3',
    type: 'order',
    title: 'Order Processing',
    message:
      'Your order #123456 is being prepared for shipment.',
    date: '2026-09-05 14:00',
    read: true,
  },
  {
    id: 'n4',
    type: 'order',
    title: 'Order Confirmed',
    message:
      'Thank you! Your order #123456 has been placed successfully.',
    date: '2026-09-05 10:30',
    read: true,
  },
  {
    id: 'n5',
    type: 'order',
    title: 'Order Delivered',
    message:
      'Your order #123455 has been delivered. Enjoy your purchase!',
    date: '2026-08-31 14:30',
    read: true,
  },
  {
    id: 'n6',
    type: 'promo',
    title: 'New Arrivals This Week',
    message:
      'Check out our latest collection — fresh styles added for the season.',
    date: '2026-08-29 10:00',
    read: true,
  },
  {
    id: 'n7',
    type: 'order',
    title: 'Order Cancelled',
    message:
      'Your order #123454 has been cancelled as per your request.',
    date: '2026-08-15 11:00',
    read: true,
  },
  {
    id: 'n8',
    type: 'promo',
    title: 'Sale Ends Tonight',
    message:
      "Up to 30% off selected items. Don't miss out — offer ends at midnight.",
    date: '2026-08-10 09:00',
    read: true,
  },
];