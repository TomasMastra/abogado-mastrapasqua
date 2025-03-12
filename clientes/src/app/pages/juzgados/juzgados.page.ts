import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';  // Necesario para usar firstValueFrom

import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonText, IonItem, IonItemOption, IonItemOptions, IonLabel, IonItemSliding, IonList, IonIcon, IonButton, IonButtons, IonInput } from '@ionic/angular/standalone';
import { JuzgadosService } from 'src/app/services/juzgados.service';
import { JuzgadoModel } from 'src/app/models/juzgado/juzgado.component';


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
import { DialogJuzgadoComponent } from '../../components/dialog-juzgado/dialog-juzgado.component'; 
import { DialogClienteModificarComponent } from '../../components/dialog-cliente-modificar/dialog-cliente-modificar.component'; 

// src\app\components\dialog-cliente\dialog-cliente.component.ts
@Component({
  selector: 'app-juzgados',
  templateUrl: './juzgados.page.html',
  styleUrls: ['./juzgados.page.scss'],
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
export class JuzgadosPage implements OnInit {

  private juzgadosService: JuzgadosService;

  juzgados: JuzgadoModel[] = [];
  juzgadosOriginales: JuzgadoModel[] = []; 

  getJuzgados$!: Subscription;
  hayJuzgados: boolean = true;
  busqueda: string = '';
  busquedaAnterior: string = ''; 
  texto: string = '';

  private destroy$ = new Subject<void>(); // Subject para gestionar la destrucción

  private timeoutId: any; // Almacenar el ID del timeout



  constructor(juzgadosService: JuzgadosService, private dialog: MatDialog,
    private router: Router) {
    this.juzgadosService = juzgadosService;
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
              this.cargarJuzgados(); 
            }
          }
        
          cargarJuzgados() {
            this.juzgadosService.getJuzgados().subscribe(
              (juzgados) => {
                this.juzgados = juzgados;
                this.juzgadosOriginales = [...juzgados];
                this.hayJuzgados = this.juzgados.length > 0;
              },
              (error) => {
                console.error('Error al obtener juzgados:', error);
              },
              () => {
                this.timeoutId = setTimeout(() => {
                  this.cargarJuzgados();

                }, 5000);
              }
            );
          }
        


      obtenerLista(){
        this.juzgadosService.getJuzgados()
          .pipe(takeUntil(this.destroy$)) 
          .subscribe(
            (juzgados) => {
              this.juzgados = juzgados;
              this.juzgadosOriginales = [...juzgados];
              this.hayJuzgados = this.juzgados.length > 0;
            },
            (error) => {
              console.error('Error al obtener localidades:', error);
            }
          );
        
      }

      abrirDialog(): void {
        const dialogRef = this.dialog.open(DialogJuzgadoComponent, {
          width: '500px',
        });
      
        dialogRef.afterClosed().subscribe((juzgado: JuzgadoModel) => {
          if (juzgado) {
            // Primero, agregar el cliente a la base de datos
            console.log('localidadElegida.id', juzgado.localidad_id);
            console.log('Tipo de localidadElegida.id', typeof juzgado.localidad_id);

            this.juzgadosService.addJuzgado(juzgado).subscribe(juzgado => {
              // El cliente agregado tendrá ahora el ID asignado     
              this.juzgados.push(juzgado);
      
              // Si la búsqueda está vacía, obtener todos los clientes
              if (this.busqueda == '') {
                this.obtenerJuzgados();
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

      obtenerJuzgados() {
        this.getJuzgados$ = this.juzgadosService.getJuzgados().subscribe(
          (juzgados) => {
            this.juzgados = juzgados;
            this.juzgadosOriginales = [...juzgados]; 
            this.hayJuzgados = this.juzgados.length > 0;
          },
          (error) => {
            console.error('Error al obtener clientes:', error);
          }
        );
      }


      buscar(){

      }


}
