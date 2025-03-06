import { ClienteModel } from '../cliente/cliente.component';

export interface ExpedienteModel {
  id: string,
  titulo: string | null,
  clientes: ClienteModel[], 
  fecha_creacion: string,
  descripcion: string,
  
  }
  