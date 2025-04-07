import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Router } from "@angular/router"

export interface AuthResponse {
  token: string
  user: {
    id: string
    nombre: string
    email: string
    role: string
  }
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Actualizamos la URL de la API
  private apiUrl = "http://localhost:5000/auth"

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  register(userData: { name: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData)
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token")
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem("token")
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem("token")
    this.router.navigate(["/login"])
  }
}

