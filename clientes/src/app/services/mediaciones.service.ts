import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediacionModel } from 'src/app/models/mediacion/mediacion.component'; // ajustá si tu path es distinto
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediacionesService {
  private apiUrl = 'http://192.168.1.36:3000/mediaciones';

  constructor(private http: HttpClient) {}

  crearMediacion(mediacion: MediacionModel): Observable<MediacionModel> {
    return this.http.post<MediacionModel>(this.apiUrl, mediacion);
  }

  getMediacionPorId(id: number): Observable<MediacionModel> {
  return this.http.get<MediacionModel>(`http://192.168.1.36:3000/mediaciones/${id}`);
}

}
