import { Component, Inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteModel } from 'src/app/models/cliente/cliente.component';
import { Subscription } from 'rxjs';

import { ExpedienteModel } from 'src/app/models/expediente/expediente.component';
import { ExpedientesService } from 'src/app/services/expedientes.service';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonLabel, IonItem } from "@ionic/angular/standalone";

@Component({
  selector: 'app-dialog-cliente',
  templateUrl: './dialog-cliente.component.html',
  styleUrls: ['./dialog-cliente.component.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, 
    CommonModule, 
    FormsModule,
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, ReactiveFormsModule,
    MatListModule,  // <-- Agregado
    MatCheckboxModule // <-- Agregado
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Agregar esto si usas Ionic

})
export class DialogClienteComponent {

 /* form = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    direccion: new FormControl(''),
    dni: new FormControl(''),
    telefono: new FormControl(''),
  });*/
  menu: number = 1;
  protected form: FormGroup;
  listaExpedientes: ExpedienteModel[] = [];
  getExpedientes$!: Subscription;
  hayExpedientes: boolean = true;
  constructor(
    private clienteService: ClientesService,
    private expedienteService: ExpedientesService,
    public dialogRef: MatDialogRef<DialogClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = new FormGroup ({
      //email: new FormControl('', [Validators.required, Validators.email]),
      nombre: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      apellido: new FormControl('', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      dni: new FormControl('', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]),
      telefono: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(14), Validators.pattern("^[0-9]+$")]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      direccion: new FormControl('', [Validators.required]),

    });

    if (data) {
      this.form.setValue({
        nombre: data.nombre || '',
        apellido: data.apellido || '',
        fechaNacimiento: data.fechaNacimiento || '',
        direccion: data.direccion || '',
        dni: data.dni || '',
        telefono: data.telefono || '',
      });



    }

    this.obtenerExpedientes();
  }

  obtenerExpedientes(){

    this.getExpedientes$ = this.expedienteService.getExpedientes().subscribe(
      (expedientes) => {
        //this.listaExpedientes = expedientes;            //DESCOMENTAR
        this.hayExpedientes = this.listaExpedientes.length > 0;
      },
      (error) => {
        console.error('Error al obtener ex`pedientes:', error);
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  acceptDialog(): void {

    if(this.form.valid){
 
    const cliente: ClienteModel = {
      nombre: this.form.value.nombre ?? null,
      apellido: this.form.value.apellido ?? null,
      fecha_nacimiento: this.form.value.fechaNacimiento ?? '',
      direccion: this.form.value.direccion ?? '',
      dni: this.form.value.dni ? Number(this.form.value.dni) : null,
      telefono: this.form.value.telefono ?? '',
      email: this.form.value.nombre,
      id: '0',
      fecha_creacion: 'ejemplo',

    };

    this.dialogRef.close(cliente);
  }else {
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

  cambiarMenu(menu: number){
    this.menu = menu;
  }
}
