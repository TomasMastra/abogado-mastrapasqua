import { MediacionModel } from '../mediacion/mediacion.component';
import { ClienteModel } from '../cliente/cliente.component';


export interface EventoModel {
    id?: number;
    titulo: string | null;
    descripcion?: string | null;
    fecha_evento: string;
    hora_evento?: string | null;
    tipo_evento: string;
    ubicacion?: string | null;
    creado_en?: string;
    actualizado_en?: string;
    mediacion_id?: number | null;
    mediacion: MediacionModel | null;
    clientes: ClienteModel[]; 

  }
  