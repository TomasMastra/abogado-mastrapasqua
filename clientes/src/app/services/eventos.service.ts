import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoModel } from '../models/evento/evento.component';
import { map } from 'rxjs/operators';
import { Observable, throwError, of, firstValueFrom, BehaviorSubject, forkJoin } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MediacionModel } from '../models/mediacion/mediacion.component';
import { MediacionesService } from 'src/app/services/mediaciones.service';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private apiUrl = 'http://192.168.1.36:3000/eventos';
  private eventosSubject = new BehaviorSubject<EventoModel[]>([]);
  eventos$ = this.eventosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private mediacionesService: MediacionesService
  ) {}
/*
  getEventos() {
    this.http.get<EventoModel[]>(this.apiUrl).subscribe(
      (eventos) => {
        this.eventosSubject.next(eventos);
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );
    return this.eventos$;
  }*/

  getEventos() {
    this.http.get<EventoModel[]>(this.apiUrl).subscribe(
      async (eventos) => {
        const eventosConMediacion = await Promise.all(
          eventos.map(async (evento) => {
            if (evento.tipo_evento && evento.mediacion_id) {
              try {
                const mediacion = await firstValueFrom(
                  this.mediacionesService.getMediacionPorId(evento.mediacion_id)
                );
                (evento as any).mediacion = mediacion;
              } catch (error) {
                console.warn('No se pudo obtener mediación para evento con ID', evento.id);
              }
            }
            return evento;
          })
        );

        this.eventosSubject.next(eventosConMediacion);
      },
      (error) => {
        console.error('Error al obtener eventos:', error);
      }
    );

    return this.eventos$;
  }


  addEvento(evento: EventoModel): Observable<any> {
    const url = `${this.apiUrl}/agregar`;
    //console.log('URL de búsqueda:', url);
    //console.log('Datos enviados:', cliente);
    return this.http.post(`${this.apiUrl}/agregar`, evento);
  }



/*
    getDemandadoPorId(id: number) {
      return this.http.get<DemandadoModel>(`${this.apiUrl}/${id}`);
    }


    actualizarDemandado(id: string, demandado: DemandadoModel): Observable<DemandadoModel> {
    const url = `${this.apiUrl}/modificar/${id}`;
      return this.http.put<DemandadoModel>(url, demandado);
    }
   

  
  addDemandado(demandado: DemandadoModel): Observable<any> {
    const url = `${this.apiUrl}/agregar`;
    console.log('URL de búsqueda:', url);
    console.log('Datos enviados:', demandado);
    return this.http.post(`${this.apiUrl}/agregar`, demandado);
  }*/

/*
  actualizarExpediente(id: string, expediente: ExpedienteModel): Observable<ExpedienteModel> {
    const url = `${this.apiUrl}/modificar/${id}`;   
      return this.http.put<ExpedienteModel>(url, expediente);
    }
*/


}
