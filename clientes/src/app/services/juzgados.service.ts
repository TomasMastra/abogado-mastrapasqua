import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JuzgadoModel } from 'src/app/models/juzgado/juzgado.component';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class JuzgadosService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  private apiUrl = 'http://localhost:3000/juzgados';  
  private juzgadosSubject = new BehaviorSubject<JuzgadoModel[]>([]); 
  juzgados$ = this.juzgadosSubject.asObservable();  

  constructor(private http: HttpClient) {}

  getJuzgados() {
    this.http.get<JuzgadoModel[]>(this.apiUrl).subscribe(
      (juzgado) => {
        this.juzgadosSubject.next(juzgado); 
      },
      (error) => {
        console.error('Error al obtener localidades:', error);
      }
    );
    return this.juzgados$;  
  }

  // NO ESTA EN EL SERVER
  getJuzgadoPorId(id: string) {
    return this.http.get<JuzgadoModel>(`${this.apiUrl}/${id}`);
  }

  addJuzgado(juzgado: JuzgadoModel): Observable<any> {

    console.log('localidadElegida.id', juzgado.localidad_id);
    console.log('Tipo de localidadElegida.id', typeof juzgado.localidad_id);
    console.log('Juzgado antes de enviarlo:', juzgado);

    const url = `${this.apiUrl}/agregar`;
    return this.http.post(`${this.apiUrl}/agregar`, juzgado);
  }
      
  /*
  actualizarCliente(id: string, cliente: ClienteModel): Observable<ClienteModel> {
  const url = `${this.apiUrl}/modificar/${id}`;
    return this.http.put<ClienteModel>(url, cliente);
  }

  searchClientes(texto: string): Observable<ClienteModel[]> {
    const textoLower = texto.toLowerCase();
    const url = `${this.apiUrl}/buscar?texto=${textoLower}`;
  
    return this.http.get<ClienteModel[]>(url).pipe(
      tap(response => {
        console.log('Respuesta de la API:', response);  
      }),
      catchError(error => {
        console.error('Error al buscar clientes', error);
        return of([]);  
      })
    );
  }

*/

  
}
