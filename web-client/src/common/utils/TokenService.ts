export class TokenService {
  public static getToken(): string | null {
    return localStorage.getItem('alapon:accessToken');
  }

  public static setToken(token: string) {
    localStorage.setItem('alapon:accessToken', token);
  }

  public static removeToken() {
    localStorage.removeItem('alapon:accessToken');
  }
}
