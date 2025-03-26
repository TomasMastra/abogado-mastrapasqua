import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,  } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonText, IonItem, IonItemOption, IonItemOptions, IonLabel, IonItemSliding, IonList, IonIcon, IonButton, IonButtons, IonInput } from '@ionic/angular/standalone';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { Router } from '@angular/router';

import { ExpedientesService } from 'src/app/services/expedientes.service';
import { ExpedienteModel } from 'src/app/models/expediente/expediente.component';

import { JuezService } from 'src/app/services/juez.service';
import { JuezModel } from 'src/app/models/juez/juez.component';

import Swal from 'sweetalert2'

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-estado',
  templateUrl: './estado.page.html',
  styleUrls: ['./estado.page.scss'],
  standalone: true,
  imports: [FormsModule, IonItemSliding, IonList, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, CommonModule, FormsModule,
        MatSidenavModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
        MatFormFieldModule, MatToolbarModule, MatIconModule, MatDividerModule,
        MatMenuModule, MatButtonModule, MatIconModule, MatSelectModule, ReactiveFormsModule
  ]
})
export class EstadoPage implements OnInit {

  protected form: FormGroup;

  numero: string = '';
  anio: string = '';
  menu: string = '1';
  honorario: string = '';
  jueces: JuezModel[] = [];

  estados: any[] = ['en gestíon', 'prueba', 'clausura p.', 'fiscal', 'sentencia'];
  estadoSeleccionado: any;

  private destroy$ = new Subject<void>(); 
  
  juezSeleccionado: any;

  apelable: any;

  constructor(
    private router: Router,     
    private expedienteService: ExpedientesService,
      private juezService: JuezService,
    ) {
  
      this.form = new FormGroup({
        nombre: new FormControl('', [Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),  // Sin 'Validators.required'
        apellido: new FormControl('', [Validators.pattern("^(?!\\s*$)[a-zA-ZÀ-ÿ\\s]+$")]),  // Sin 'Validators.required'
        dni: new FormControl('', [Validators.minLength(7), Validators.maxLength(8), Validators.pattern("^[0-9]+$")]),
        telefono: new FormControl('', [Validators.minLength(6), Validators.maxLength(14), Validators.pattern("^[0-9]+$")]),
        fechaNacimiento: new FormControl(''),  // No tiene validadores
        fecha_inicio: new FormControl('')  // No tiene validadores
      });
      
  /*
      if (data) {
        this.form.setValue({
          nombre: data.nombre || '',
          apellido: data.apellido || '',
          fechaNacimiento: data.fechaNacimiento || '',
          direccion: data.direccion || '',
          dni: data.dni || '',
          telefono: data.telefono || '',
        });
  
  
  
      }*/
  
      this.cargarJueces();
    }

  ngOnInit() {
    //this.cargarJueces();

  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  buscar() {
    this.expedienteService.getClientePorNumeroYAnio(this.numero, this.anio).subscribe(
      (expedientes) => {
        if (!expedientes || expedientes.length === 0) {
          console.error("No se encontraron expedientes con ese número y año.");
          //alert("No se encontraron expedientes con ese número y año."); // O manejarlo de otra forma
          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "error",
            title: "No se encontro un expediente",
            showConfirmButton: false,
            timer: 1500
          });

        } else {
          console.log("Expedientes encontrados:", expedientes);
          this.menu = '2';

          Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            title: "Expediente encontrado",
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      (error) => {
        console.error("Error en la búsqueda:", error);
        //alert("Ocurrió un error al buscar el expediente.");
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Ingrese numero y año",
          showConfirmButton: false,
          timer: 1500
        });
      }
    );
  }

  cambiarMenu(menu: string){
    this.menu = menu;
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
  

}
