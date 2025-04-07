import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
})
export class RegisterComponent {
  registerForm: FormGroup
  errorMessage = ""
  isSubmitting = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group(
      {
        name: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        role: ["user", Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (password !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isSubmitting = true
      this.errorMessage = ""

      const { name, email, password, role } = this.registerForm.value

      this.authService.register({ name, email, password, role }).subscribe({
        next: (response) => {
          console.log("Registro exitoso", response)
          this.router.navigate(["/login"])
        },
        error: (error) => {
          console.error("Error en el registro", error)
          this.errorMessage = error.error?.msg || "Error al registrar usuario. Inténtalo de nuevo."
          this.isSubmitting = false
        },
        complete: () => {
          this.isSubmitting = false
        },
      })
    }
  }
}

