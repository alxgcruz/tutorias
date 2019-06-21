import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/';
  private apiKey = 'AIzaSyCJPE8u9GjczvG4wpM_kw6K1E4VqBT0qag';
  userToken: string;
  // crear nuevo usuario
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]

// login
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY]

  constructor( private http: HttpClient ) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login( usuario: UsuarioModel ) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
          `${ this.url }verifyPassword?key=${ this.apiKey }`,
          authData
        ).pipe(
          map( resp => {
  // tslint:disable-next-line: no-string-literal
            this.guardarToken( resp['idToken'] );
            return resp;
          })
        );

  }

  nuevoUsuario( usuario: UsuarioModel ) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(
      `${ this.url }signupNewUser?key=${ this.apiKey }`,
      authData
      ).pipe(
        map( resp => {
// tslint:disable-next-line: no-string-literal
          this.guardarToken( resp['idToken'] );
          return resp;
        })
      );

  }


  private guardarToken( idToken: string ) {

    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds( 3600 );

    localStorage.setItem('expira', hoy.getTime().toString() );
  }

  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {

    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime( expira );

    if ( expiraDate > new Date() ) {
      return true;
    } else {
      return false;
    }

  }

}
