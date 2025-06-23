import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { UsuarioModel } from 'src/app/models/usuario/usuario.component';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  // private apiUrl = 'http://localhost:3000/usuario';
  private apiUrl = 'http://192.168.1.36:3000/usuario';

  private logeadoSubject = new BehaviorSubject<boolean>(false);
  logeado$ = this.logeadoSubject.asObservable();

  private usuarioSubject = new BehaviorSubject<UsuarioModel[]>([]);
  usuario$ = this.usuarioSubject.asObservable();

  usuarioLogeado: UsuarioModel | null = null;

  constructor(private http: HttpClient) { }

  setLogeado(valor: boolean) {
    this.logeadoSubject.next(valor);
  }

  getUsuarios(): Observable<UsuarioModel[]> {
    console.log('Obteniendo usuarios');
    return this.http.get<UsuarioModel[]>(this.apiUrl, this.httpOptions).pipe(
      tap((usuarios) => this.usuarioSubject.next(usuarios)),
      catchError(this.handleError<UsuarioModel[]>('getUsuarios', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error('Error en la solicitud HTTP'));
    };
  }
}
