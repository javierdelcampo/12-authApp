import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthResponse, Usuario } from '../interfaces/auth-interface';
import { Observable, of } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario () {
    return { ...this._usuario }; // Por valor, por seguridad
  }

  constructor( private http: HttpClient ) { }

  registro ( name: string, email: string, password: string ) {
    const url = `${this.baseUrl}/auth/new`;

    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap( resp => {
          if ( resp.ok ) {
            localStorage.setItem('token', resp.token!);

            // No hace falta, la info ya está siendo recuperada por otro lado
            // this._usuario = { 
            //   name: resp.name!,   // Sabemos que viene correcto, no undefined, por lo que se coloca el !
            //   uid: resp.uid!,
            //   email: resp.email!
            // }
          }
        }),
        map ( resp => resp.ok ),
        catchError(err => of( err.error.msg )) 
      );

  }

  login( email: string, password: string ) {

    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body)
      .pipe(
        tap( resp => {
          if ( resp.ok ) {

            localStorage.setItem('token', resp.token!);  // Almacenamos el JWT en sesión para mantener el objeto de usuario. Sabemos que siempre viene (!)

            this._usuario = { 
              name: resp.name!,   // Sabemos que viene correcto, no undefined, por lo que se coloca el !
              uid: resp.uid!,
              email: resp.email!
            }
          }
        }),
        map( resp => resp.ok ),         // envío un OK indicando si las credenciales son correctas
        catchError( err => of( err.error.msg ) )  // Si hay un error (p.e. 400 por credenciales incorrectas), devuelvo el mensaje de error
      );

  }



  validarToken(): Observable<boolean> {

    const url = `${this.baseUrl}/auth/renew`;  // URL de renovación de token JWT
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '');   // si no hay un token en el storage, envía un string vacío. Puede pasar

    return this.http.get<AuthResponse>(url, { headers: headers } )
      .pipe (
        map( resp => {
          localStorage.setItem('token', resp.token!);  // Almacenamos el JWT en sesión para mantener el objeto de usuario. Sabemos que siempre viene (!)
          
          this._usuario = { 
            name: resp.name!,   // Sabemos que viene correcto, no undefined, por lo que se coloca el !
            uid: resp.uid!,
            email: resp.email!
          }

          return resp.ok
        }),
        catchError ( err => of(false))
      );

  }

  logout() {
    localStorage.removeItem('token');
  }

}
