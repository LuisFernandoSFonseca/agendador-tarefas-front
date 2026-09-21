import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { RouterStateService } from '../../../../core/router/router-state';
import { AuthService } from '../../../../services/auth';
import { UserService } from '../../../../services/user';

@Component({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterModule,
    MatMenuModule],
  selector: 'app-top-menu',
  styleUrl: './top-menu.scss',
  templateUrl: './top-menu.html',
})
export class TopMenu implements OnInit, OnDestroy {
  appLogo = "assets/logo-agendador-javanauta.png";

  rotaAtual = signal('');
  inscricaoRota!: Subscription;

  private routerService = inject(RouterStateService)
  private authService = inject(AuthService)
  private userService = inject(UserService)
  private route = inject(Router)

  ngOnInit(): void {
    this.inscricaoRota = this.routerService.rotaAtual$.subscribe(url => {
      this.rotaAtual.set(url);
    })
  }

  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  isOnRouteRegister(): boolean {
    return this.rotaAtual() === '/register'
  }

  isOnRouteLogin(): boolean {
    return this.rotaAtual() === '/login'
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedin();
  }

  getUserInitial(): string {
    const user = this.userService.getUser();
    if (user && user.nome) {
      return user.nome.charAt(0).toUpperCase()
    }
    return '?'
  }

  logout(): void {
    this.authService.logout();
    this.route.navigate(['/login']);
  }

}
