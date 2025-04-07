import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { ProductosService } from "../services/products.service"
import { product } from "../interface/productos"
import { Router } from "@angular/router"

@Component({
  selector: "app-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: "./form.component.html",
  styleUrl: "./form.component.css",
})
export class FormComponent {
  MyNewForm: FormGroup
  selectedFile: File | null = null
  isSubmitting = false
  previewUrl: string | null = null

  constructor(
    private service: ProductosService,
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.MyNewForm = this.fb.group({
      nombre: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      precio: ["", [Validators.required, Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")]],
      descripcion: ["", [Validators.required]],
      tipoProducto: ["zapato", [Validators.required]],
      productoOferta: [false],
      img: [""],
    })
  }

  // Manejo del archivo de imagen con vista previa
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
    if (this.MyNewForm.valid) {
      this.isSubmitting = true
      let imageUrl = ""

      try {
        // Si hay una imagen, subirla antes de enviar el producto
        if (this.selectedFile) {
          imageUrl = await this.service.uploadImage(this.selectedFile)
        }

        const newProduct: product = {
          id: 0, // El backend asignará el ID
          ...this.MyNewForm.value,
          productoOferta: this.MyNewForm.value.productoOferta ? "true" : "false",
          img: imageUrl,
        }

        // Agregar el producto
        this.service.addProduct(newProduct)

        console.log("Producto agregado:", newProduct)

        // Resetear el formulario
        this.MyNewForm.reset({
          tipoProducto: "zapato",
          productoOferta: false,
        })
        this.selectedFile = null
        this.previewUrl = null

        // Redirigir a la lista de productos después de un breve retraso
        setTimeout(() => {
          this.router.navigate(["/products"])
        }, 1500)
      } catch (error) {
        console.error("Error al agregar el producto:", error)
      } finally {
        this.isSubmitting = false
      }
    }
  }
}

