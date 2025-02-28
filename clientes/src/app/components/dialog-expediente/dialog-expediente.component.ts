import { Component, Inject } from '@angular/core';
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
    MatInputModule, ReactiveFormsModule
  ]
})
export class DialogExpedienteComponent   {

 /* form = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    direccion: new FormControl(''),
    dni: new FormControl(''),
    telefono: new FormControl(''),
  });*/
  protected form: FormGroup;

  constructor(
    private expedienteService: ExpedientesService,
    public dialogRef: MatDialogRef<DialogExpedienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.form = new FormGroup ({
      //email: new FormControl('', [Validators.required, Validators.email]),
      titulo: new FormControl('', [Validators.required]),
      descripcion: new FormControl(),

    });

    if (data) {
      this.form.setValue({
        titulo: data.titulo || '',
        descripcion: data.descripcion || ''

      });



    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  acceptDialog(): void {
    // Accede a los valores del formulario para crear el cliente

    if(this.form.valid){
 
    const expediente: ExpedienteModel = {
      titulo: this.form.value.titulo ?? null,
      descripcion: this.form.value.descripcion ?? null,
      id: '0',
      fecha_creacion: '2025-02-02',
      clientes: []

    };

    this.dialogRef.close(expediente);
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
}
