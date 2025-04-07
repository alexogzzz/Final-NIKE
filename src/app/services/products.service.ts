import { Injectable, type Signal, signal } from "@angular/core"
import { product } from "../interface/productos"
import { HttpClient } from "@angular/common/http"
import { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ProductosService {
  // Cambiamos la URL de la API para que apunte al backend correcto
  private apiUrl = "http://localhost:5000/api"
  // URL para la API de imágenes
  private imageApiUrl = "http://localhost:3000"

  public products = signal<product[]>([])

  constructor(private http: HttpClient) {}

  // Método para obtener productos
  obtenerProductos(): Observable<product[]> {
    return this.http.get<product[]>(`${this.apiUrl}/productos`)
  }

  // Método para obtener un producto por ID
  obtenerProductoPorId(id: number): Observable<product> {
    return this.http.get<product>(`${this.apiUrl}/productos/${id}`)
  }

  loadProducts(): Signal<product[]> {
    this.obtenerProductos().subscribe({
      next: (productos) => {
        this.products.set(productos)
      },
      error: (err) => {
        console.error("Error al obtener productos:", err)
      },
    })

    return this.products
  }

  addProduct(product: product): void {
    console.log("Creando producto:", product)

    this.http.post<{ msg: string; producto: product }>(`${this.apiUrl}/productos`, product).subscribe({
      next: (response) => {
        // Actualizar la lista de productos añadiendo el nuevo
        this.products.update((products) => [...products, response.producto])
        console.log("Producto creado correctamente:", response)
      },
      error: (err) => {
        console.error("Error al crear el producto:", err)
      },
    })
  }

  // Método para actualizar un producto
  updateProduct(product: product): Observable<{ msg: string; producto: product }> {
    return this.http.put<{ msg: string; producto: product }>(`${this.apiUrl}/productos/${product.id}`, product)
  }

  // Método para eliminar un producto
  deleteProduct(id: number): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(`${this.apiUrl}/productos/${id}`)
  }

  async uploadImage(image: File): Promise<string> {
    const formData = new FormData()
    formData.append("image", image)

    try {
      // Usamos la nueva API de imágenes
      const response = await fetch(`${this.imageApiUrl}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Error al subir la imagen")
      }

      const data = await response.json()
      console.log("Imagen subida correctamente:", data)

      return data.imageUrl // Devolver la URL de la imagen
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      return ""
    }
  }
}

