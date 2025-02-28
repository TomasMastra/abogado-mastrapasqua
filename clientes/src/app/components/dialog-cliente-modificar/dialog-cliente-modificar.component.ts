import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteModel } from 'src/app/models/cliente/cliente.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-cliente-modificar',
  templateUrl: './dialog-cliente-modificar.component.html',
  styleUrls: ['./dialog-cliente-modificar.component.scss'],
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
export class DialogClienteModificarComponent {

  protected form: FormGroup;

  constructor(
    private clienteService: ClientesService,
    public dialogRef: MatDialogRef<DialogClienteModificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteModel
  ) {
    this.form = new FormGroup({
      nombre: new FormControl(data?.nombre ?? '', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      apellido: new FormControl(data?.apellido ?? '', [Validators.required, Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),
      dni: new FormControl(data?.dni ?? '', [Validators.required, Validators.minLength(7), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]),
      telefono: new FormControl(data?.telefono ?? '', [Validators.required, Validators.minLength(6), Validators.maxLength(14), Validators.pattern("^[0-9]+$")]),
      fechaNacimiento: new FormControl(data?.fecha_nacimiento ?? '', [Validators.required]),
      direccion: new FormControl(data?.direccion ?? '', [Validators.required])
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  acceptDialog(): void {
    if (this.form.valid) {
      const cliente: ClienteModel = {
        id: this.data?.id ?? '0',  // Si tiene un ID, lo conserva; si no, asignamos "0"
        nombre: this.form.value.nombre ?? null,
        apellido: this.form.value.apellido ?? null,
        fecha_nacimiento: this.form.value.fechaNacimiento || '', // Aseguramos que nunca sea null
        direccion: this.form.value.direccion ?? '',
        dni: this.form.value.dni ? Number(this.form.value.dni) : null,
        telefono: this.form.value.telefono ?? '',
        fecha_creacion: this.data?.fecha_creacion ?? 'ejemplo', // Conservar fecha original si existe
        email: this.form.value.nombre,
      };

      this.dialogRef.close(cliente);
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
