import { Component } from "@angular/core"
import { Componente1Component } from "../component/componente1/componente1.component"
import { Componente2Component } from "../component/componente2/componente2.component"
import { Componente3Component } from "../component/componente3/componente3.component"

@Component({
  selector: "app-home",
  imports: [Componente1Component, Componente2Component, Componente3Component],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {}

