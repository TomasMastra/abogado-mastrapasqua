import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';  // Necesario para usar firstValueFrom

import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonText, IonItem, IonItemOption, IonItemOptions, IonLabel, IonItemSliding, IonList, IonIcon, IonButton, IonButtons, IonInput } from '@ionic/angular/standalone';
import { LocalidadesService } from 'src/app/services/localidades.service';
import { LocalidadModel } from 'src/app/models/localidad/localidad.component';


import { Subscription, Observable  } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';


import { MatDialog } from '@angular/material/dialog';
import { DialogLocalidadComponent } from '../../components/dialog-localidad/dialog-localidad.component'; 
import { DialogClienteModificarComponent } from '../../components/dialog-cliente-modificar/dialog-cliente-modificar.component'; 

// src\app\components\dialog-cliente\dialog-cliente.component.ts
@Component({
  selector: 'app-localidades',
  templateUrl: './localidades.page.html',
  styleUrls: ['./localidades.page.scss'],
  standalone: true,
  imports: [IonInput, 
    CommonModule,
    FormsModule,
    IonButtons, IonButton, IonIcon, IonList, IonItemSliding, IonLabel, IonItemOptions, IonItemOption, 
    IonItem, IonCardContent, IonCard, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, IonText,
    MatSidenavModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatFormFieldModule, MatToolbarModule, MatIconModule, MatDividerModule, MatPaginatorModule,
    MatMenuModule, MatButtonModule, MatIconModule

 
  ]
})
export class LocalidadesPage implements OnInit {

  private localidadesService: LocalidadesService;

  localidades: LocalidadModel[] = [];
  localidadesOriginales: LocalidadModel[] = []; 

  getLocalidades$!: Subscription;
  hayLocalidades: boolean = true;
  busqueda: string = '';
  busquedaAnterior: string = ''; 
  texto: string = '';

  private destroy$ = new Subject<void>(); // Subject para gestionar la destrucción

  private timeoutId: any; // Almacenar el ID del timeout



  constructor(localidadesService: LocalidadesService, private dialog: MatDialog,
    private router: Router) {
    this.localidadesService = localidadesService;
  }

/*
  ngOnInit() {
    this.getClientes$ = this.clienteService.getClientes().subscribe(
      (clientes) => {
        this.clientes = Array.isArray(clientes) ? clientes : []; // Asegurarse de que es un arreglo
        this.clientesOriginales = Array.isArray(clientes) ? [...clientes] : Object.values(clientes);
        this.hayClientes = this.clientes.length > 0;
      },
      (error) => {
        console.error('Error al obtener clientes:', error);
      }
    );
  }*/


          ngOnInit() {
            if(this.busqueda == ''){
              this.cargarLocalidades(); 
            }
          }
        
          cargarLocalidades() {
            this.localidadesService.getLocalidades().subscribe(
              (localidades) => {
                this.localidades = localidades;
                this.localidadesOriginales = [...localidades];
                this.hayLocalidades = this.localidades.length > 0;
              },
              (error) => {
                console.error('Error al obtener localidades:', error);
              },
              () => {
                this.timeoutId = setTimeout(() => {
                  this.cargarLocalidades();

                }, 5000);
              }
            );
          }
        


      obtenerLista(){
        this.localidadesService.getLocalidades()
          .pipe(takeUntil(this.destroy$)) 
          .subscribe(
            (localidades) => {
              this.localidades = localidades;
              this.localidadesOriginales = [...localidades];
              this.hayLocalidades = this.localidades.length > 0;
            },
            (error) => {
              console.error('Error al obtener localidades:', error);
            }
          );
        
      }

      abrirDialog(): void {
        const dialogRef = this.dialog.open(DialogLocalidadComponent, {
          width: '500px',
        });
      
        dialogRef.afterClosed().subscribe((localidad: LocalidadModel) => {
          this.obtenerLocalidades();

          if (localidad) {
            // Primero, agregar el cliente a la base de datos
            this.localidadesService.addLocalidad(localidad).subscribe(response => {
              // El cliente agregado tendrá ahora el ID asignado
              localidad.id = response.id; // Asignamos el ID devuelto desde la base de datos
      
              console.log('Localidad agregado:', response);
              this.localidades.push(localidad);
      
              // Si la búsqueda está vacía, obtener todos los clientes
              if (this.busqueda == '') {
                this.obtenerLocalidades();
              } else {
                //this.localidadesService.sea(this.busqueda);
              }
      
      
            }, error => {
              console.error('Error al agregar cliente:', error);
            });
          }
        });
      }
      
      

      goTo(path: string) {
        this.router.navigate([path]);
      }

      obtenerLocalidades() {
        this.getLocalidades$ = this.localidadesService.getLocalidades().subscribe(
          (localidades) => {
            this.localidades = localidades;
            this.localidadesOriginales = [...localidades]; 
            this.hayLocalidades = this.localidades.length > 0;
          },
          (error) => {
            console.error('Error al obtener clientes:', error);
          }
        );
      }


      buscar(){

      }


}
