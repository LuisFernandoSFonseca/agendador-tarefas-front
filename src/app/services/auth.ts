import { Service } from '@angular/core';

@Service()
export class AuthService {

    private readonly TOKEN_KEY = 'auth_token'

    saveToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    isLoggedin(): boolean {
        return !!this.getToken();
    }
}
