export class TokenService {
  public static getToken(): string | null {
    return localStorage.getItem("mini-page:accessToken");
  }

  public static setToken(token: string) {
    localStorage.setItem("mini-page:accessToken", token);
  }

  public static removeToken() {
    localStorage.removeItem("mini-page:accessToken");
  }
}
