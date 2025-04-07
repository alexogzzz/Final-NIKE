import { Component, type OnInit, type Signal } from "@angular/core"
import { RouterLink } from "@angular/router"
import { CommonModule } from "@angular/common"
import { CartService } from "../../services/cart.service"

@Component({
  selector: "app-header",
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent implements OnInit {
  cartItemCount: Signal<number>

  constructor(private cartService: CartService) {
    this.cartItemCount = this.cartService.getCartItemCount()
  }

  ngOnInit(): void {}
}

