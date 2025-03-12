import { ClienteModel } from '../cliente/cliente.component';
import { DemandadoModel } from '../demandado/demandado.component';

export interface ExpedienteModel {
  id: string,
  titulo: string | null,
  clientes: ClienteModel[], 
  fecha_creacion: string,
  descripcion: string,
  juzgado_id: number | null,
  demandado_id: number | null,
  numero: number,
  anio: number,
  demandadoModel: DemandadoModel;
  }
  