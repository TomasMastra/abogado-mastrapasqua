import { Component, OnInit, Inject } from '@angular/core';


import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ExpedientesService } from 'src/app/services/expedientes.service';
import { ExpedienteModel } from 'src/app/models/expediente/expediente.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-dialog-expediente-modificar',
  templateUrl: './dialog-expediente-modificar.component.html',
  styleUrls: ['./dialog-expediente-modificar.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatButtonModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule
  ]
})

export class DialogExpedienteModificarComponent   {
 protected form: FormGroup;

  constructor(
    private expedienteService: ExpedientesService,
    public dialogRef: MatDialogRef<DialogExpedienteModificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExpedienteModel
  ) {
    this.form = new FormGroup({
      titulo: new FormControl(data?.titulo ?? '', [Validators.required]),
      descripcion: new FormControl(data?.descripcion ?? ''),

    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  acceptDialog(): void {
    if (this.form.valid) {
      const expediente: ExpedienteModel = {
        id: this.data?.id ?? '0',  
        titulo: this.form.value.titulo ?? null,
        descripcion: this.form.value.descripcion ?? null, 
        fecha_creacion: this.data?.fecha_creacion ?? '', 
        clientes: this.data?.clientes ?? null
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

    }
  }
}
