import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UserInterface } from '@app/interfaces/user-interface';
import { PocketAuthService } from '@services/pocket-auth.service'; // Importa el nuevo servicio

@Injectable({
  providedIn: 'root',
})
export class AuthRESTService {
  indentity: any = { name: 'name', email: 'email' };
  constructor(private http: HttpClient) {}
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  //registerUser( email: string, password: string,status :string,userType :string){
  registerUser(email: string, password: string, type: string) {
    const url_api = 'http://localhost:7777/api/Users';
    return (
      this.http
        //.post<UserInterface>(url_api,{email,password,status,userType},{headers:this.headers})
        .post<UserInterface>(
          url_api,
          { email, password, type },
          { headers: this.headers }
        )
        .pipe(map((data) => data))
    );
  }
  loginUser(email: string, password: string): Observable<any> {
    const url_api = 'http://localhost:7777/api/Users/login?include=user';
    return this.http
      .post<UserInterface>(
        url_api,
        { email, password },
        { headers: this.headers }
      )
      .pipe(map((data) => data));
  }
  setUser(user: UserInterface): void {
    let user_string = JSON.stringify(user);
    let type = JSON.stringify(user.type);
    localStorage.setItem('currentUser', user_string);
    localStorage.setItem('type', type);
  }
  setType(user: UserInterface): void {
    let user_string = JSON.stringify(user.type);
    localStorage.setItem('type', user_string);
  }
  getType(): string | null {
    return localStorage.getItem('type');
  }
  setToken(token: any): void {
    localStorage.setItem('accessToken', token);
  }
  getToken() {
    return localStorage.getItem('accessToken');
  }
  getStatus() {
    return localStorage.getItem('status');
  }
  getCurrentUserId(): string | null {
    let user_string = localStorage.getItem('currentUser');
    if (user_string) {
      let user: UserInterface = JSON.parse(user_string);
      return user.id ?? null;
    } else {
      return null;
    }
  }

  getConversationId(userId: string): Observable<string | null> {
	const url_api = `https://db.buckapi.com:8090/api/collections/vendricomMessages/records?filter=sender_Id="${userId}"`;
	return this.http
	  .get<{ items: Array<{ conversationId: string }> }>(url_api, { headers: this.headers })
	  .pipe(
		map(response => {
		  if (response.items.length > 0) {
			// Suponiendo que el conversationId está en el primer mensaje encontrado
			return response.items[0].conversationId;
		  } else {
			return null;
		  }
		})
	  );
  }
  getCurrentUser(): UserInterface {
    let user_string = localStorage.getItem('currentUser');
    if (user_string) {
      let user: UserInterface = JSON.parse(user_string!);
      return user;
    } else {
      let user = this.indentity;
      return user!;
    }
  }

  logoutUser() {
    let accessToken = localStorage.getItem('accessToken');
    const url_api =
      'http://localhost:7777/api/users/logout?access_token=${accessToken}';
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('dist');
    localStorage.removeItem('userId');
    localStorage.removeItem('type');
    localStorage.removeItem('clientCard');
    localStorage.removeItem('clientFicha');
    // this._butler.userActive={};
    return this.http.post<UserInterface>(url_api, { headers: this.headers });
  }
}
