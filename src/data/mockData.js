export const revenueData = [
  { date: "Jan", revenue: 18200, orders: 142 },
  { date: "Feb", revenue: 21500, orders: 168 },
  { date: "Mar", revenue: 19800, orders: 155 },
  { date: "Apr", revenue: 24300, orders: 191 },
  { date: "May", revenue: 22100, orders: 174 },
  { date: "Jun", revenue: 26800, orders: 210 },
  { date: "Jul", revenue: 28500, orders: 224 },
  { date: "Aug", revenue: 31200, orders: 245 },
  { date: "Sep", revenue: 29700, orders: 233 },
  { date: "Oct", revenue: 33400, orders: 262 },
  { date: "Nov", revenue: 37800, orders: 297 },
  { date: "Dec", revenue: 41200, orders: 324 },
];

export const orderStatusData = [
  { name: "Delivered", value: 1842, color: "#059669" },
  { name: "Processing", value: 483, color: "#4F46E5" },
  { name: "Shipped", value: 317, color: "#2563EB" },
  { name: "In Transit", value: 241, color: "#7C3AED" },
  { name: "Pending", value: 198, color: "#D97706" },
  { name: "Cancelled", value: 124, color: "#DC2626" },
  { name: "Returned", value: 67, color: "#6B7280" },
];

export const recentOrders = [
  { id: "ORD-10023", customer: "Marcus Webb", email: "m.webb@email.com", date: "Dec 11, 2026", items: 3, total: 284.50, payment: "Cash on Delivery", paymentStatus: "Pending", status: "Processing" },
  { id: "ORD-10022", customer: "Priya Sharma", email: "priya.s@email.com", date: "Dec 10, 2026", items: 1, total: 149.99, payment: "Cash on Delivery", paymentStatus: "Paid", status: "Shipped" },
  { id: "ORD-10021", customer: "James O'Brien", email: "james.ob@email.com", date: "Dec 10, 2026", items: 2, total: 392.00, payment: "Cash on Delivery", paymentStatus: "Paid", status: "Delivered" },
  { id: "ORD-10020", customer: "Sofia Andersen", email: "sofia.a@email.com", date: "Dec 09, 2026", items: 4, total: 512.75, payment: "Cash on Delivery", paymentStatus: "Pending", status: "Pending" },
  { id: "ORD-10019", customer: "Kwame Asante", email: "k.asante@email.com", date: "Dec 09, 2026", items: 1, total: 89.00, payment: "Cash on Delivery", paymentStatus: "Failed", status: "Cancelled" },
  { id: "ORD-10018", customer: "Elena Volkov", email: "elena.v@email.com", date: "Dec 08, 2026", items: 2, total: 237.50, payment: "Cash on Delivery", paymentStatus: "Paid", status: "In Transit" },
];

export const products = [
  { id: "PRD-001", name: "Premium Wireless Headphones", category: "Electronics", price: 149.99, stock: 84, rating: 4.8, reviews: 312, created: "Oct 5, 2026", status: "Active", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop&auto=format" },
  { id: "PRD-002", name: "Classic Leather Wallet", category: "Accessories", price: 59.99, stock: 6, rating: 4.6, reviews: 189, created: "Sep 14, 2026", status: "Active", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=60&h=60&fit=crop&auto=format" },
  { id: "PRD-003", name: "Smart Fitness Watch", category: "Electronics", price: 299.00, stock: 0, rating: 4.7, reviews: 441, created: "Aug 22, 2026", status: "Inactive", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop&auto=format" },
  { id: "PRD-004", name: "Minimalist Backpack", category: "Bags", price: 89.00, stock: 23, rating: 4.5, reviews: 267, created: "Aug 1, 2026", status: "Active", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=60&h=60&fit=crop&auto=format" },
  { id: "PRD-005", name: "Trail Running Shoes", category: "Footwear", price: 129.99, stock: 4, rating: 4.9, reviews: 523, created: "Jul 18, 2026", status: "Active", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop&auto=format" },
  { id: "PRD-006", name: "Ceramic Pour-Over Set", category: "Kitchen", price: 45.00, stock: 57, rating: 4.4, reviews: 98, created: "Jul 3, 2026", status: "Active", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=60&h=60&fit=crop&auto=format" },
  { id: "PRD-007", name: "Merino Wool Sweater", category: "Apparel", price: 110.00, stock: 31, rating: 4.7, reviews: 176, created: "Jun 12, 2026", status: "Active", image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=60&h=60&fit=crop&auto=format" },
];

export const customers = [
  { id: "CUS-001", name: "Marcus Webb", email: "m.webb@email.com", phone: "+1 (555) 201-3847", orders: 14, spent: 2840.50, joined: "Mar 12, 2024", status: "Active", avatar: "MW" },
  { id: "CUS-002", name: "Priya Sharma", email: "priya.s@email.com", phone: "+1 (555) 384-9021", orders: 8, spent: 1249.99, joined: "Jun 5, 2024", status: "Active", avatar: "PS" },
  { id: "CUS-003", name: "James O'Brien", email: "james.ob@email.com", phone: "+1 (555) 741-6320", orders: 21, spent: 4192.00, joined: "Jan 18, 2024", status: "Active", avatar: "JO" },
  { id: "CUS-004", name: "Sofia Andersen", email: "sofia.a@email.com", phone: "+1 (555) 823-4719", orders: 5, spent: 612.75, joined: "Sep 2, 2025", status: "Active", avatar: "SA" },
  { id: "CUS-005", name: "Kwame Asante", email: "k.asante@email.com", phone: "+1 (555) 109-5562", orders: 2, spent: 178.00, joined: "Nov 14, 2025", status: "Inactive", avatar: "KA" },
  { id: "CUS-006", name: "Elena Volkov", email: "elena.v@email.com", phone: "+1 (555) 637-8844", orders: 11, spent: 2037.50, joined: "Apr 27, 2024", status: "Active", avatar: "EV" },
];

export const inventoryItems = [
  { id: "PRD-001", name: "Premium Wireless Headphones", category: "Electronics", stock: 84, threshold: 20, status: "In Stock", updated: "Dec 10, 2026" },
  { id: "PRD-002", name: "Classic Leather Wallet", category: "Accessories", stock: 6, threshold: 15, status: "Low Stock", updated: "Dec 9, 2026" },
  { id: "PRD-003", name: "Smart Fitness Watch", category: "Electronics", stock: 0, threshold: 10, status: "Out of Stock", updated: "Dec 8, 2026" },
  { id: "PRD-004", name: "Minimalist Backpack", category: "Bags", stock: 23, threshold: 10, status: "In Stock", updated: "Dec 7, 2026" },
  { id: "PRD-005", name: "Trail Running Shoes", category: "Footwear", stock: 4, threshold: 15, status: "Low Stock", updated: "Dec 6, 2026" },
  { id: "PRD-006", name: "Ceramic Pour-Over Set", category: "Kitchen", stock: 57, threshold: 10, status: "In Stock", updated: "Dec 5, 2026" },
  { id: "PRD-007", name: "Merino Wool Sweater", category: "Apparel", stock: 31, threshold: 10, status: "In Stock", updated: "Dec 4, 2026" },
];

export const invoices = [
  { id: "INV-2026-000023", orderId: "ORD-10023", customer: "Marcus Webb", date: "Dec 11, 2026", amount: 284.50, orderStatus: "Processing" },
  { id: "INV-2026-000022", orderId: "ORD-10022", customer: "Priya Sharma", date: "Dec 10, 2026", amount: 149.99, orderStatus: "Shipped" },
  { id: "INV-2026-000021", orderId: "ORD-10021", customer: "James O'Brien", date: "Dec 10, 2026", amount: 392.00, orderStatus: "Delivered" },
  { id: "INV-2026-000020", orderId: "ORD-10020", customer: "Sofia Andersen", date: "Dec 9, 2026", amount: 512.75, orderStatus: "Pending" },
  { id: "INV-2026-000019", orderId: "ORD-10019", customer: "Kwame Asante", date: "Dec 9, 2026", amount: 89.00, orderStatus: "Cancelled" },
];

export const notifications = [
  { id: 1, type: "order", title: "New order received", message: "Order ORD-10023 placed by Marcus Webb for $284.50", time: "5 min ago", read: false },
  { id: 2, type: "stock", title: "Low stock alert", message: "Classic Leather Wallet has only 6 units remaining", time: "32 min ago", read: false },
  { id: 3, type: "review", title: "New product review", message: "Priya Sharma left a 5-star review on Premium Wireless Headphones", time: "1 hr ago", read: false },
  { id: 4, type: "order", title: "Order delivered", message: "Order ORD-10021 has been successfully delivered to James O'Brien", time: "2 hr ago", read: true },
  { id: 5, type: "stock", title: "Low stock alert", message: "Trail Running Shoes has only 4 units remaining", time: "3 hr ago", read: true },
  { id: 6, type: "customer", title: "New customer registration", message: "Sofia Andersen created a new account", time: "5 hr ago", read: true },
  { id: 7, type: "order", title: "Order cancelled", message: "Order ORD-10019 was cancelled by Kwame Asante", time: "Yesterday", read: true },
];

export const reviews = [
  { id: 1, product: "Premium Wireless Headphones", customer: "Priya Sharma", rating: 5, comment: "Exceptional sound quality and comfortable fit. The noise cancellation is best-in-class.", date: "Dec 10, 2026" },
  { id: 2, product: "Trail Running Shoes", customer: "Marcus Webb", rating: 5, comment: "Incredibly lightweight and grippy. Completed a 20-mile trail run with zero discomfort.", date: "Dec 9, 2026" },
  { id: 3, product: "Classic Leather Wallet", customer: "James O'Brien", rating: 4, comment: "Quality leather, slim profile. Could use one more card slot, but overall excellent.", date: "Dec 8, 2026" },
  { id: 4, product: "Minimalist Backpack", customer: "Elena Volkov", rating: 4, comment: "Clean design and durable materials. Fits a 15\" laptop perfectly.", date: "Dec 7, 2026" },
  { id: 5, product: "Smart Fitness Watch", customer: "Sofia Andersen", rating: 3, comment: "Good features but battery life is disappointing. Expected more from the price point.", date: "Dec 6, 2026" },
];

export const categories = [
  { id: 1, name: "Electronics", products: 2, created: "Jan 15, 2024" },
  { id: 2, name: "Accessories", products: 1, created: "Jan 15, 2024" },
  { id: 3, name: "Bags", products: 1, created: "Feb 3, 2024" },
  { id: 4, name: "Footwear", products: 1, created: "Feb 3, 2024" },
  { id: 5, name: "Kitchen", products: 1, created: "Mar 20, 2024" },
  { id: 6, name: "Apparel", products: 1, created: "Apr 7, 2024" },
];

export const inventoryHistory = [
  { id: 1, date: "Dec 11, 2026 09:14", product: "Premium Wireless Headphones", prev: 72, change: +12, newStock: 84, action: "PURCHASE", reason: "New stock received from supplier" },
  { id: 2, date: "Dec 10, 2026 14:22", product: "Trail Running Shoes", prev: 11, change: -7, newStock: 4, action: "SALE", reason: "Order fulfillment" },
  { id: 3, date: "Dec 9, 2026 11:05", product: "Classic Leather Wallet", prev: 14, change: -8, newStock: 6, action: "SALE", reason: "Order fulfillment" },
  { id: 4, date: "Dec 8, 2026 16:48", product: "Smart Fitness Watch", prev: 3, change: -3, newStock: 0, action: "SALE", reason: "Order fulfillment" },
  { id: 5, date: "Dec 7, 2026 10:30", product: "Minimalist Backpack", prev: 20, change: +3, newStock: 23, action: "RETURN", reason: "Customer return — wrong size" },
  { id: 6, date: "Dec 6, 2026 13:15", product: "Ceramic Pour-Over Set", prev: 60, change: -3, newStock: 57, action: "SALE", reason: "Order fulfillment" },
  { id: 7, date: "Dec 5, 2026 08:55", product: "Merino Wool Sweater", prev: 33, change: -2, newStock: 31, action: "ADJUSTMENT", reason: "Inventory count correction" },
];
