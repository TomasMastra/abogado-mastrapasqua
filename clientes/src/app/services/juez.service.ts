import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JuezModel } from 'src/app/models/juez/juez.component';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class JuezService {

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    };
  
    private apiUrl = 'http://localhost:3000/juez';  
    private juezSubject = new BehaviorSubject<JuezModel[]>([]); 
    juez$ = this.juezSubject.asObservable();  
  
    constructor(private http: HttpClient) {}
  
    getJuez() {
      this.http.get<JuezModel[]>(this.apiUrl).subscribe(
        (juez) => {
          this.juezSubject.next(juez); 
        },
        (error) => {
          console.error('Error al obtener jueces:', error);
        }
      );
      return this.juez$;  
    }

}
