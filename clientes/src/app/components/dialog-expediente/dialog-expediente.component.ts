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

    private destroy$ = new Subject<void>(); 
    juzgadoElegido: any; 
    demandadoElegido: any;
    clienteSeleccionado: any; 

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
  }

  ngOnInit() {
    this.clienteSeleccionado = null; // Limpiar la selección

    this.cargarJuzgado();
    this.cargarDemandados();
    this.cargarClientes();

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

  acceptDialog(): void {


    if (this.form.valid) {
      console.log(this.clientesAgregados);
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
        demandadoModel: { id: '', nombre: '' } 
      };
      

      this.dialogRef.close(expediente);
    } else {
      let mensaje = "Errores en los siguientes campos:\n";

      Object.keys(this.form.controls).forEach(campo => {
        const control = this.form.get(campo);
        if (control?.invalid) {
          mensaje += `- ${campo}: `;

          if (control.errors?.['required']) {
            mensaje += "Este campo es obligatorio.\n";
          }
          if (control.errors?.['email']) {
            mensaje += "Debe ser un correo válido.\n";
          }
          if (control.errors?.['pattern']) {
            mensaje += "Formato inválido.\n";
          }
          if (control.errors?.['minlength']) {
            mensaje += `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.\n`;
          }
          if (control.errors?.['maxlength']) {
            mensaje += `Debe tener máximo ${control.errors['maxlength'].requiredLength} caracteres.\n`;
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
