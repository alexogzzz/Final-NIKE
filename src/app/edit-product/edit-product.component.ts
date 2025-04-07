import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { ProductosService } from "../services/products.service"
import { product } from "../interface/productos"

@Component({
  selector: "app-edit-product",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./edit-product.component.html",
  styleUrls: ["./edit-product.component.css"],
})
export class EditProductComponent implements OnInit {
  editForm: FormGroup
  productId = 0
  isSubmitting = false
  errorMessage = ""
  selectedFile: File | null = null
  previewUrl: string | null = null
  currentProduct: product | null = null

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
  ) {
    this.editForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      precio: ["", [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      descripcion: ["", [Validators.required]],
      tipoProducto: ["zapato", [Validators.required]],
      productoOferta: [false],
      img: [""],
    })
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params["id"]) {
        this.productId = +params["id"]
        this.loadProduct(this.productId)
      } else {
        this.router.navigate(["/products"])
      }
    })
  }

  loadProduct(id: number): void {
    this.productosService.obtenerProductoPorId(id).subscribe({
      next: (product) => {
        this.currentProduct = product
        this.editForm.patchValue({
          nombre: product.nombre,
          precio: product.precio,
          descripcion: product.descripcion,
          tipoProducto: product.tipoProducto,
          productoOferta: product.productoOferta === "true",
          img: product.img,
        })

        if (product.img) {
          this.previewUrl = product.img
        }
      },
      error: (error) => {
        console.error("Error al cargar el producto:", error)
        this.errorMessage = "No se pudo cargar el producto. Inténtalo de nuevo."
      },
    })
  }

  onFileChange(event: any): void {
    const file = event.target.files[0]
    if (file) {
      this.selectedFile = file

      // Crear vista previa
      const reader = new FileReader()
      reader.onload = () => {
        this.previewUrl = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  async onSubmit(): Promise<void> {
    if (this.editForm.valid && this.currentProduct) {
      this.isSubmitting = true
      this.errorMessage = ""

      try {
        let imageUrl = this.currentProduct.img || ""

        // Si hay una nueva imagen, subirla
        if (this.selectedFile) {
          imageUrl = await this.productosService.uploadImage(this.selectedFile)
        }

        const updatedProduct: product = {
          id: this.productId,
          ...this.editForm.value,
          img: imageUrl,
          productoOferta: this.editForm.value.productoOferta ? "true" : "false",
        }

        this.productosService.updateProduct(updatedProduct).subscribe({
          next: (response) => {
            console.log("Producto actualizado:", response)

            // Actualizar la lista de productos
            this.productosService.loadProducts()

            // Redirigir a la lista de productos
            this.router.navigate(["/products"])
          },
          error: (error) => {
            console.error("Error al actualizar el producto:", error)
            this.errorMessage = "Error al actualizar el producto. Inténtalo de nuevo."
            this.isSubmitting = false
          },
        })
      } catch (error) {
        console.error("Error al procesar la imagen:", error)
        this.errorMessage = "Error al procesar la imagen. Inténtalo de nuevo."
        this.isSubmitting = false
      }
    }
  }

  onCancel(): void {
    this.router.navigate(["/products"])
  }
}

