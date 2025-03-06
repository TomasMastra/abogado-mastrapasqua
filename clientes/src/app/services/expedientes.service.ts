import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin  } from 'rxjs';
import { ClienteModel } from 'src/app/models/cliente/cliente.component';
import { ExpedienteModel } from '../models/expediente/expediente.component';
import { map } from 'rxjs/operators';
import { Observable, throwError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  private apiUrl = 'http://localhost:3000/expedientes';  
  private expedientesSubject = new BehaviorSubject<ExpedienteModel[]>([]); // Emite un arreglo vacío inicialmente
  clientes$ = this.expedientesSubject.asObservable();  // Expone el observable de clientes

  constructor(private http: HttpClient) {}

    getExpedientes() {
      this.http.get<ExpedienteModel[]>(this.apiUrl).subscribe(
        (expedientes) => {
          expedientes.forEach((expediente) => {
            this.getClientesPorExpediente(expediente.id).subscribe((clientes) => {
              expediente.clientes = [];
              expediente.clientes = clientes; 
            });
          });
    
          this.expedientesSubject.next(expedientes);
        },
        (error) => {
          console.error('Error al obtener expedientes:', error);
        }
      );
    
      return this.clientes$;
    }




  getClientesPorExpediente(id_expediente: string) {
    const url = `${this.apiUrl}/clientesPorExpediente/${id_expediente}`;
    console.log('URL llamada:', url);  
    return this.http.get<ClienteModel[]>(url);
  }
    
  getClientePorId(id: string) {
    return this.http.get<ClienteModel>(`${this.apiUrl}/${id}`);
  }

  addExpediente(expediente: ExpedienteModel): Observable<any> {
    const url = `${this.apiUrl}/agregar`;
    console.log('URL de búsqueda:', url);
    console.log('Datos enviados:', expediente);
    return this.http.post(`${this.apiUrl}/agregar`, expediente);
  }


  actualizarExpediente(id: string, expediente: ExpedienteModel): Observable<ExpedienteModel> {
    const url = `${this.apiUrl}/modificar/${id}`;   
      return this.http.put<ExpedienteModel>(url, expediente);
    }

}
