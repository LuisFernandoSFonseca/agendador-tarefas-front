import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [MatButtonModule, RouterLink],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {

  imgHero = 'assets/imagem-hero.svg'

  private authService = inject(AuthService)
  private router = inject(Router)

  ngOnInit(): void {
    if (this.authService.isLoggedin()) {
      this.router.navigate(['/tasks'])
    }
  }
}
