import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExpedientesService } from 'src/app/services/expedientes.service';
import { ExpedienteModel } from 'src/app/models/expediente/expediente.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, FormArray  } from '@angular/forms';
import { NgModule } from '@angular/core';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { DemandadosService } from 'src/app/services/demandado.service';
import { DemandadoModel } from 'src/app/models/demandado/demandado.component';

import { JuezService } from 'src/app/services/juez.service';
import { JuezModel } from 'src/app/models/juez/juez.component';

import { takeUntil } from 'rxjs/operators';
import { MatSelectModule } from '@angular/material/select';

import { JuzgadosService } from 'src/app/services/juzgados.service';
import { JuzgadoModel } from 'src/app/models/juzgado/juzgado.component';

import { Subject } from 'rxjs';

import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteModel } from 'src/app/models/cliente/cliente.component';
@Component({
  selector: 'app-dialog-expediente',
  templateUrl: './dialog-expediente.component.html',
  styleUrls: ['./dialog-expediente.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule   
  ]
})
export class DialogExpedienteComponent {
  protected form: FormGroup;

   juzgados: JuzgadoModel[] = [];
   demandados: DemandadoModel[] = [];
   clientes: ClienteModel[] = [];
   clientesAgregados: ClienteModel[] = [];
   jueces: JuezModel[] = [];


   estados: any[] = ['en gestíon', 'prueba', 'clausura p.', 'fiscal', 'sentencia'];
   estadoSeleccionado: any;

   menu: string = '1';

    private destroy$ = new Subject<void>(); 
    juzgadoElegido: any; 
    demandadoElegido: any;
    clienteSeleccionado: any; 
    juezSeleccionado: any;

/*
  constructor(
    private expedienteService: ExpedientesService,
    private juzgadoService: JuzgadosService,
    private demandadoService: DemandadosService,
    private clienteService: ClientesService,


    public dialogRef: MatDialogRef<DialogExpedienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = new FormGroup({
      //titulo: new FormControl('', [Validators.required]),  
      //descripcion: new FormControl('', [ Validators.minLength(6), Validators.maxLength(200)]),  
      juzgado: new FormControl('', [Validators.required]),
      demandado: new FormControl('', [Validators.required]),  
      numero: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]),  
      anio: new FormControl('', [Validators.required]),  
      clientes: new FormArray([])  // FormArray para los clientes


    });

    if (data) {
      this.form.setValue({
        //titulo: data.titulo || '',
        //descripcion: data.descripcion || '',  
        juzgado: data.juzgado || '' , 
        demandado: data.demandado || '',
        numero: data.numero || '', 
        anio: data.anio || ''  


      });
    }
  }*/


    constructor(
      private expedienteService: ExpedientesService,
      private juzgadoService: JuzgadosService,
      private demandadoService: DemandadosService,
      private clienteService: ClientesService,
      private juezService: JuezService,

      public dialogRef: MatDialogRef<DialogExpedienteComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.form = new FormGroup({
        juzgado: new FormControl('', [Validators.required]),
        demandado: new FormControl('', [Validators.required]),
        numero: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]),
        anio: new FormControl('', [Validators.required]),
        clientes: new FormArray([]),
        estado: new FormControl('', [Validators.required]),

        sala_radicacion: new FormControl(''),
        honorario: new FormControl(''),
        fecha_inicio: new FormControl(''),
        fecha_sentencia: new FormControl(''),
        hora_sentencia: new FormControl('')
      });
    
      // Si hay datos para cargar, asignarlos al formulario
      if (data) {
        this.form.setValue({
          juzgado: data.juzgado || '',
          demandado: data.demandado || '',
          numero: data.numero || '',
          anio: data.anio || '',
          estado: data.estado || '',
          sala_radicacion: data.sala_radicacion || '',
          honorario: data.honorario || '',
          fecha_inicio: data.fecha_inicio || '',
          fecha_sentencia: data.fecha_sentencia || '',
          hora_sentencia: data.hora_sentencia || ''
        });
    
        //this.actualizarValidadoresPorEstado(data.estado);  // Asume que "estado" es una propiedad en "data"
      }
    }
    
    actualizarValidadoresPorEstado(estado: string): void {
      console.log(estado);
      if (estado === 'sentencia') {
        //this.form.get('sala_radicacion')?.setValidators([Validators.required]);
        this.form.get('honorario')?.setValidators([Validators.required]);
        this.form.get('fecha_inicio')?.setValidators([Validators.required]);
        //this.form.get('fecha_sentencia')?.setValidators([Validators.required]);
        //this.form.get('hora_sentencia')?.setValidators([Validators.required]);
      } else {
        //this.form.get('sala_radicacion')?.clearValidators();
        this.form.get('honorario')?.clearValidators();
        this.form.get('fecha_inicio')?.clearValidators();
        //this.form.get('fecha_sentencia')?.clearValidators();
        //this.form.get('hora_sentencia')?.clearValidators();
      }
    
      //this.form.get('sala_radicacion')?.updateValueAndValidity();
      this.form.get('honorario')?.updateValueAndValidity();
      this.form.get('fecha_inicio')?.updateValueAndValidity();
      //this.form.get('fecha_sentencia')?.updateValueAndValidity();
      //this.form.get('hora_sentencia')?.updateValueAndValidity();




      ///////////



      if (estado === 'sentencia') {
        this.form.get('honorario')?.setValidators([Validators.required]);
        this.form.get('fecha_inicio')?.setValidators([Validators.required]);
      } else {
        this.form.get('honorario')?.clearValidators();
        this.form.get('fecha_inicio')?.clearValidators();
      }
    
      this.form.get('honorario')?.updateValueAndValidity();
      this.form.get('fecha_inicio')?.updateValueAndValidity();
    
      console.log('Honorario:', this.form.get('honorario')?.value);
      console.log('Fecha inicio:', this.form.get('fecha_inicio')?.value);
    }
    
    

  ngOnInit() {
    this.clienteSeleccionado = null; // Limpiar la selección

    this.cargarJuzgado();
    this.cargarDemandados();
    this.cargarClientes();
    this.cargarJueces();


    this.form.get('estado')?.valueChanges.subscribe(estado => {
      this.estadoSeleccionado = estado;  // Puedes actualizar el valor si lo necesitas
      //this.actualizarValidadoresPorEstado(estado);  // Para actualizar los validadores según el estado
    });

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  cargarJuzgado() {
    this.juzgadoService.getJuzgados()
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(
        (juzgados) => {
          this.juzgados = juzgados;
        },
        (error) => {
          console.error('Error al obtener juzgados:', error);
        }
      );
  }

  cargarDemandados() {
    this.demandadoService.getDemandados()
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(
        (demandado) => {
          this.demandados = demandado;
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
          this.clientes = cliente;
          console.log(this.clientes);

        },
        (error) => {
          console.error('Error al obtener clientes:', error);
        }
      );
  }

  cargarJueces() {
    this.juezService.getJuez()
      .pipe(takeUntil(this.destroy$)) 
      .subscribe(
        (jueces) => {
          this.jueces = jueces;
        },
        (error) => {
          console.error('Error al obtener jueces:', error);
        }
      );
  }

  acceptDialog(): void {
    console.log('Datos recibidos en el formulario:', this.data); // 👈 Verifica la estructura de los datos
  
    // Aseguramos que el formulario está validado antes de proceder
    if (this.form.valid) {
      console.log(this.clientesAgregados);
      
      // Crear el objeto expediente con los datos del formulario
      const expediente: ExpedienteModel = {
        id: this.data?.id ?? '0',
        titulo: '',
        descripcion: '',
        fecha_creacion: this.data?.fecha_creacion ?? '',
        clientes: this.clientesAgregados,
        juzgado_id: this.juzgadoElegido?.id ?? null,
        demandado_id: this.demandadoElegido?.id ?? null,
        numero: this.form.value.numero,
        anio: this.form.value.anio,
        demandadoModel: { id: '', nombre: '', estado: '' },
        estado: this.estadoSeleccionado, // Este es el valor por defecto. Se actualizaría si el estado es 'sentencia'.
        sala_radicacion: this.form.value.sala_radicacion ?? null,
        honorario: this.form.value.honorario ?? '1',
        fecha_inicio: this.form.value.fecha_inicio ?? null,
        fecha_sentencia: this.form.value.fecha_sentencia ?? null,
        hora_sentencia: this.form.value.hora_sentencia ?? null,
        juez_id: this.juezSeleccionado?.id ?? null,
        juezModel: { id: '', nombre: '' },

      };
  
      // Verificamos si el estado es 'sentencia' y aplicamos validaciones si es necesario
      //this.actualizarValidadoresPorEstado(this.estadoSeleccionado);
  
      // Si el estado es "sentencia", revisamos si el formulario es válido
      if (this.estadoSeleccionado === 'sentencia') {
        if (this.form.invalid) {
          let mensaje = "Errores en los siguientes campos:\n";
          Object.keys(this.form.controls).forEach(campo => {
            const control = this.form.get(campo);
            if (control?.invalid) {
              mensaje += `- ${campo}: `;
              if (control.errors?.['required']) {
                mensaje += "Este campo es obligatorio.\n";
              }
            }
          });
          alert(mensaje);
          return; // Si hay errores, no continuamos
        }
      }
  
      // Si todo está correcto, pasamos a la siguiente etapa
      if (this.estadoSeleccionado === 'sentencia' && this.menu === '1') {
        // Si estamos en "sentencia" y en "menu 1", pasamos al "menu 2"
        this.menu = '2'; // Cambiar al "menu 2"
        this.actualizarValidadoresPorEstado(this.estadoSeleccionado);
        } else {
          this.actualizarValidadoresPorEstado(this.estadoSeleccionado);
        this.dialogRef.close(expediente);  // Cerrar el diálogo con los datos del expediente
      }
    } else {
      let mensaje = "Errores en los siguientes campos:\n";
      Object.keys(this.form.controls).forEach(campo => {
        const control = this.form.get(campo);
        if (control?.invalid) {
          mensaje += `- ${campo}: `;
          if (control.errors?.['required']) {
            mensaje += "Este campo es obligatorio.\n";
          }
        }
      });
      alert(mensaje);
    }
  }
  
  
  

  seleccionarCliente(cliente: ClienteModel): void {
    // Mostrar una alerta (opcional, para ver el cliente seleccionado)
    console.log("Cliente seleccionado:", cliente);
    
    // Asignar el cliente seleccionado a la variable clienteSeleccionado
    this.clienteSeleccionado = cliente;
  
    // Verificar si el cliente ya está agregado a la lista
    if (this.clientesAgregados.indexOf(cliente) === -1) {
      // Si no está en la lista, agregarlo
      this.clientesAgregados.push(cliente);
    }
  }
  
  

  agregarCliente(): void {


    if (this.clienteSeleccionado) {
      this.clientesAgregados.push(this.clienteSeleccionado);  // Agregar cliente al expediente
      this.clienteSeleccionado = null;  // Limpiar la selección
    }
  }

  eliminarCliente(cliente: ClienteModel): void {
    const index = this.clientesAgregados.indexOf(cliente);
    if (index > -1) {
      this.clientesAgregados.splice(index, 1);  // Eliminar cliente de la lista
    }
  }



  // Método para agregar los clientes de manera secuencial
 /* async agregarClientes(expedienteId: string, clientes: ClienteModel[]): Promise<void> {
    try {
      if (!Array.isArray(clientes) || clientes.length === 0) {
        throw new Error('No se proporcionaron clientes válidos.');
      }

      // Aquí puedes llamar al servicio para guardar en la base de datos
      for (const cliente of clientes) {
        await this.expedienteService.agregarClientesAExpediente(expedienteId, cliente.id);
      }

      console.log('Clientes agregados exitosamente.');
    } catch (err) {
      console.error('Error al agregar los clientes:', err.message);
      throw err;
    }
  }*/
  

}
