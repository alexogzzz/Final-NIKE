import { Component } from "@angular/core"
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms"
import { CommonModule } from "@angular/common"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
})
export class LoginComponent {
  loginForm: FormGroup
  errorMessage = ""
  isSubmitting = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true
      this.errorMessage = ""

      const { email, password } = this.loginForm.value

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          localStorage.setItem("token", response.token)
          console.log("Usuario autenticado:", response.user)
          this.router.navigate(["/"])
        },
        error: (error) => {
          console.error("Error de autenticación:", error)
          this.errorMessage = error.error?.msg || "Error al iniciar sesión. Verifica tus credenciales."
          this.isSubmitting = false
        },
        complete: () => {
          this.isSubmitting = false
        },
      })
    }
  }
}

