export interface GuestCartItem {
  productId: string
  name: string
  price: number
  img: string
  qty: number
}

const CART_KEY = 'guest_cart'
const CART_EVENT = 'guest-cart-updated'

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function setGuestCart(items: GuestCartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event(CART_EVENT))
}

export function addToGuestCart(item: GuestCartItem) {
  const cart = getGuestCart()
  const existing = cart.find((i) => i.productId === item.productId)
  if (existing) {
    existing.qty += item.qty
    setGuestCart(cart)
  } else {
    setGuestCart([...cart, item])
  }
}

export function updateGuestCartQty(productId: string, qty: number) {
  if (qty <= 0) {
    setGuestCart(getGuestCart().filter((i) => i.productId !== productId))
  } else {
    setGuestCart(
      getGuestCart().map((i) => (i.productId === productId ? { ...i, qty } : i))
    )
  }
}

export function clearGuestCart() {
  localStorage.removeItem(CART_KEY)
  window.dispatchEvent(new Event(CART_EVENT))
}

export { CART_EVENT }
