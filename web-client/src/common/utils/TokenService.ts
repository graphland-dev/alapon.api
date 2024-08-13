export class TokenService {
  public static getToken(): string | null {
    return localStorage.getItem('blackout:accessToken');
  }

  public static setToken(token: string) {
    localStorage.setItem('blackout:accessToken', token);
  }

  public static removeToken() {
    localStorage.removeItem('blackout:accessToken');
  }
}
