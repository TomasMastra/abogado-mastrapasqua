import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClienteModel } from 'src/app/models/cliente/cliente.component';
import { ExpedienteModel } from '../models/expediente/expediente.component';

@Injectable({
  providedIn: 'root'
})
export class ExpedientesService {
  private apiUrl = 'http://localhost:3000/expedientes';  
  private expedientesSubject = new BehaviorSubject<ExpedienteModel[]>([]); // Emite un arreglo vacío inicialmente
  clientes$ = this.expedientesSubject.asObservable();  // Expone el observable de clientes

  constructor(private http: HttpClient) {}

  // Método para obtener los clientes desde el servidor y emitir los datos
  getExpedientes() {
    this.http.get<ExpedienteModel[]>(this.apiUrl).subscribe(
      (expedientes) => {
        this.expedientesSubject.next(expedientes); // Actualiza los datos emitidos por el BehaviorSubject
      },
      (error) => {
        console.error('Error al obtener expedientes:', error);
      }
    );
    return this.clientes$;  // Devuelve el observable para que el componente se suscriba
  }


  

  getClientePorId(id: string) {
    return this.http.get<ClienteModel>(`${this.apiUrl}/${id}`);
  }

  agregarCliente(cliente: ClienteModel) {
    return this.http.post(this.apiUrl, cliente); 
  }
}
