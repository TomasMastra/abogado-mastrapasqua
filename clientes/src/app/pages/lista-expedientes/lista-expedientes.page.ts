import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonText, IonItem, IonItemOption, IonItemOptions, IonLabel, IonItemSliding, IonList, IonIcon, IonButton, IonButtons, IonInput } from '@ionic/angular/standalone';
import { ExpedientesService } from 'src/app/services/expedientes.service';
import { ExpedienteModel } from 'src/app/models/expediente/expediente.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { MatDialog } from '@angular/material/dialog';
import { DialogExpedienteComponent } from '../../components/dialog-expediente/dialog-expediente.component'; 
import { DialogExpedienteModificarComponent } from '../../components/dialog-expediente-modificar/dialog-expediente-modificar.component'; 

@Component({
  selector: 'app-lista-expedientes',
  templateUrl: './lista-expedientes.page.html',
  styleUrls: ['./lista-expedientes.page.scss'],
  standalone: true,
  imports: [IonInput, 
    CommonModule,
    FormsModule,
    IonButtons, IonButton, IonIcon, IonList, IonItemSliding, IonLabel, IonItemOptions, IonItemOption, 
    IonItem, IonCardContent, IonCard, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, IonText,
    MatSidenavModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatFormFieldModule, MatToolbarModule, MatIconModule, MatDividerModule,
  ]
})
export class ListaExpedientesPage implements OnInit, OnDestroy {
  expedientes: ExpedienteModel[] = [];
  expedientesOriginales: ExpedienteModel[] = [];
  hayExpedientes: boolean = true;

  busqueda: string = "";
  private destroy$ = new Subject<void>(); // Subject para gestionar la destrucción

  constructor(
    private expedienteService: ExpedientesService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarExpedientes(); // Cargar expedientes al iniciar


  }

  cargarExpedientes() {
    this.expedienteService.getExpedientes()
      .pipe(takeUntil(this.destroy$)) // Cancela la suscripción cuando destroy$ emita
      .subscribe(
        (expedientes) => {
          this.expedientes = expedientes;
          this.expedientesOriginales = [...expedientes];
          this.hayExpedientes = this.expedientes.length > 0;
          //alert(this.expedientes.length);
        },
        (error) => {
          console.error('Error al obtener expedientes:', error);
        }
      );
  }

  ngOnDestroy() {
    this.destroy$.next(); // Emite un valor para cancelar las suscripciones
    this.destroy$.complete(); // Completa el subject
  }

  abrirModificar(expediente: ExpedienteModel){
    // Abre el diálogo para modificar el expediente
  }

  abrirDialog() {
    // Abre un diálogo para crear o añadir un nuevo expediente
  }

  goTo(path: string){
    this.router.navigate([path]); // Navega a la ruta deseada
  }

  buscar() {
    // Lógica para buscar expedientes
  }
}
