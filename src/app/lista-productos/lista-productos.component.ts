import { Component, type OnInit, type Signal } from "@angular/core"
import { ProductosService } from "../services/products.service"
import { CommonModule } from "@angular/common"
import { product } from "../interface/productos"
import { Router } from "@angular/router"
import { CartService } from "../services/cart.service"

@Component({
  selector: "app-lista-productos",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./lista-productos.component.html",
  styleUrls: ["./lista-productos.component.css"],
})
export class ListaProductosComponent implements OnInit {
  productos: Signal<product[]>
  loading = true

  constructor(
    private productosService: ProductosService,
    private cartService: CartService,
    private router: Router,
  ) {
    this.productos = this.productosService.products
  }

  ngOnInit() {
    this.loading = true
    this.productos = this.productosService.loadProducts()

    // Simular un tiempo de carga para mostrar el spinner
    setTimeout(() => {
      this.loading = false
    }, 1000)
  }

  editProduct(id: number) {
    this.router.navigate(["/edit-product", id])
  }

  deleteProduct(id: number) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      this.loading = true
      this.productosService.deleteProduct(id).subscribe({
        next: (response) => {
          console.log("Producto eliminado:", response)
          // Actualizar la lista de productos
          this.productos = this.productosService.loadProducts()
          setTimeout(() => {
            this.loading = false
          }, 500)
        },
        error: (error) => {
          console.error("Error al eliminar el producto:", error)
          this.loading = false
        },
      })
    }
  }

  addToCart(product: product) {
    this.cartService.addToCart(product)
    alert(`${product.nombre} añadido al carrito`)
  }
}

