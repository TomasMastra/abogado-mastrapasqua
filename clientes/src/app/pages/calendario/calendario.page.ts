import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, startWith, map } from 'rxjs';

import { EventosService } from 'src/app/services/eventos.service';
import { EventoModel } from 'src/app/models/evento/evento.component';

import { MediacionesService } from 'src/app/services/mediaciones.service';
import { MediacionModel } from 'src/app/models/mediacion/mediacion.component';

import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteModel } from 'src/app/models/cliente/cliente.component';

import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/models/usuario/usuario.component';

import { DemandadosService } from 'src/app/services/demandado.service';
import { DemandadoModel } from 'src/app/models/demandado/demandado.component';

import Swal from 'sweetalert2';

import { CalendarioAvanzadoComponent } from '../../components/calendario-avanzado/calendario-avanzado.component'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    CalendarioAvanzadoComponent,
    MatAutocompleteModule,
    ReactiveFormsModule
  ],
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss']
})
export class CalendarioPage implements OnInit, OnDestroy {

  @ViewChild(CalendarioAvanzadoComponent) calendarioAvanzado!: CalendarioAvanzadoComponent;

  eventos: EventoModel[] = [];
  hayEventos: boolean = false;
  private timeoutId: any;
  private destroy$ = new Subject<void>();
  mostrarFormulario = false;

  listaAbogados: UsuarioModel[] = [];
  listaClientes: ClienteModel[] = [];
  listaDemandados: DemandadoModel[] = [];
  clientesAgregados: ClienteModel[] = [];
  clienteCtrl = new FormControl<string>('');
  filteredClientes!: Observable<ClienteModel[]>;
  clienteSeleccionado: any; 

  nuevoEvento: EventoModel = {
    titulo: null,
    descripcion: null,
    fecha_evento: '',
    hora_evento: null,
    tipo_evento: '',
    ubicacion: null,
    mediacion: null,
    clientes: []

  };

  nuevaMediacion: MediacionModel = {
    numero: '',
    abogado_id: 0,
    cliente_id: null,
    demandado_id: 0,
    fecha: null,
    mediadora: '',
    finalizada: false
  };

  constructor(
    private eventosService: EventosService,
    private mediacionesService: MediacionesService,
    private clienteService: ClientesService,
    private demandadoService: DemandadosService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.cargarEventos();
    this.cargarClientes();
    this.cargarDemandados();
    this.cargarUsuarios();

  this.filteredClientes = this.clienteCtrl.valueChanges.pipe(
  startWith(''),
  map(text => this.filtrarClientes(text!))
);

  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarEventos() {
    this.eventosService.getEventos().subscribe((eventos: EventoModel[]) => {
      this.eventos = [...eventos];
      this.hayEventos = this.eventos.length > 0;
    },
    (error: any) => {
      console.error('Error al obtener eventos:', error);
    },
    () => {
      this.timeoutId = setTimeout(() => {
        this.cargarEventos();
      }, 5000);
    });
  }

  cargarDemandados() {
    this.demandadoService.getDemandados()
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(
        (demandado) => {
          this.listaDemandados = demandado;
        },
        (error) => {
          console.error('Error al obtener demandados:', error);
        }
      );
  }

  cargarClientes() {
    this.clienteService.getClientes()
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(
        (cliente) => {
          this.listaClientes = cliente!;
        },
        (error) => {
          console.error('Error al obtener clientes:', error);
        }
      );
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (usuarios) => {
          this.listaAbogados = usuarios;
        },
        (error) => {
          console.error('Error al obtener abogados:', error);
        }
      );
  }

  guardarEvento() {
    if (this.nuevoEvento.fecha_evento && this.nuevoEvento.tipo_evento) {
      if (this.nuevoEvento.tipo_evento) {
        console.log('Clientes agregados para enviar:', this.clientesAgregados);
        this.mediacionesService.crearMediacion(this.nuevaMediacion).subscribe({
          next: (mediacionCreada) => {
        const eventoConMediacion: EventoModel = {
          ...this.nuevoEvento,
          mediacion_id: mediacionCreada.id,
          mediacion: null, // o mediacionCreada si querés guardar también el objeto
          clientes: this.clientesAgregados
        };


            this.guardarEventoFinal(eventoConMediacion);
          },
          error: (error) => {
            console.error('Error al crear mediación:', error);
            alert('Error al crear la mediación');
          }
        });
      } else {
        const eventoSinMediacion = {
          ...this.nuevoEvento,
        };
        this.guardarEventoFinal(eventoSinMediacion);
      }
    } else {
      alert('Completa al menos Título, Fecha y Tipo');
    }
  }

  private guardarEventoFinal(evento: EventoModel) {
    evento.hora_evento = null;
    console.log(evento.clientes[0].id)
    this.eventosService.addEvento(evento).subscribe({
      next: (response) => {
        const eventoConId = { ...evento, id: response.id };
        this.eventos.push(eventoConId);

        console.log(this.nuevoEvento.clientes)
        this.nuevoEvento = {
          titulo: '',
          descripcion: '',
          fecha_evento: '',
          hora_evento: '',
          tipo_evento: '',
          ubicacion: '',
          mediacion: null,
          clientes: []
        };

        this.nuevaMediacion = {
          numero: '',
          abogado_id: 0,
          cliente_id: null,
          demandado_id: 0,
          fecha: '',
          mediadora: '',
          finalizada: false
        };

        this.clientesAgregados = [];
        this.mostrarFormulario = false;
        Swal.fire({
          icon: 'success',
          title: 'Evento agregado con exito',
          confirmButtonText: 'Entendido',
        });
        this.calendarioAvanzado?.refrescar();
      },
      error: (error) => {
        console.error('Error al guardar el evento:', error);
        alert('Ocurrió un error al guardar el evento');
      }
    });
  }

  seleccionarCliente(cliente: ClienteModel): void { 
    this.clienteSeleccionado = cliente;
  
    if (!this.clientesAgregados.includes(cliente)) {
      this.clientesAgregados.push(cliente);
    }
  
    // Limpia el input para que puedas buscar otro cliente
    this.clienteCtrl.setValue('');
  
    // 👇 Reasigna el observable para que vuelva a escuchar cambios del input
    this.filteredClientes = this.clienteCtrl.valueChanges.pipe(
      startWith(''),
      map(text => this.filtrarClientes(text!))
    );
  }
  private filtrarClientes(text: string) {
    const term = text.toLowerCase();
    return this.listaClientes.filter(c =>
      (`${c.nombre} ${c.apellido}`).toLowerCase().includes(term)
    );
  }

  agregarCliente(): void {

    if (this.clienteSeleccionado) {
      this.clientesAgregados.push(this.clienteSeleccionado);
      this.clienteSeleccionado = null;
    }
  }

  eliminarCliente(cliente: ClienteModel): void {
    const index = this.clientesAgregados.indexOf(cliente);
    if (index > -1) {
      this.clientesAgregados.splice(index, 1);
    }
  }

  compararClientes(c1: ClienteModel, c2: ClienteModel): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }


displayCliente(cliente: ClienteModel): string {
  return cliente ? `${cliente.nombre} ${cliente.apellido}` : '';
}



}
