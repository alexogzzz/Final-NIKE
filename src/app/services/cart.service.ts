import { Injectable, type Signal, signal, computed, effect } from "@angular/core"
import { product } from "../interface/productos"

export interface CartItem {
  product: product
  quantity: number
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  private cartItems = signal<CartItem[]>([])

  // Señales computadas para el contador y el total
  public cartItemCount = computed(() => this.cartItems().reduce((total, item) => total + item.quantity, 0))

  public cartTotal = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.precio * item.quantity, 0),
  )

 

  // Obtener los items del carrito
  getCartItems(): Signal<CartItem[]> {
    return this.cartItems
  }

  // Obtener el número total de productos en el carrito
  getCartItemCount(): Signal<number> {
    return this.cartItemCount
  }

  // Obtener el precio total del carrito
  getCartTotal(): Signal<number> {
    return this.cartTotal
  }

  // Añadir un producto al carrito
  addToCart(product: product, quantity = 1): void {
    const currentItems = this.cartItems()
    const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id)

    if (existingItemIndex !== -1) {
      // Si el producto ya está en el carrito, aumentar la cantidad
      const updatedItems = [...currentItems]
      updatedItems[existingItemIndex].quantity += quantity
      this.cartItems.set(updatedItems)
    } else {
      // Si es un producto nuevo, añadirlo al carrito
      this.cartItems.set([...currentItems, { product, quantity }])
    }
  }

  // Eliminar un producto del carrito
  removeFromCart(productId: number): void {
    const currentItems = this.cartItems()
    const updatedItems = currentItems.filter((item) => item.product.id !== productId)
    this.cartItems.set(updatedItems)
  }

  // Actualizar la cantidad de un producto en el carrito
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId)
      return
    }

    const currentItems = this.cartItems()
    const updatedItems = currentItems.map((item) => {
      if (item.product.id === productId) {
        return { ...item, quantity }
      }
      return item
    })

    this.cartItems.set(updatedItems)
  }

  // Vaciar el carrito
  clearCart(): void {
    this.cartItems.set([])
  }

}

