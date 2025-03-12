import { Component, OnInit, ViewChild, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';  // Necesario para usar firstValueFrom

import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonCard, IonCardContent, IonText, IonItem, IonItemOption, IonItemOptions, IonLabel, IonItemSliding, IonList, IonIcon, IonButton, IonButtons, IonInput } from '@ionic/angular/standalone';
import { ClientesService } from 'src/app/services/clientes.service';
import { ClienteModel } from 'src/app/models/cliente/cliente.component';

import { ClientesExpedientesService } from 'src/app/services/clientes-expedientes.service';

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
import { DialogClienteComponent } from '../../components/dialog-cliente/dialog-cliente.component'; 
import { DialogClienteModificarComponent } from '../../components/dialog-cliente-modificar/dialog-cliente-modificar.component'; 

// src\app\components\dialog-cliente\dialog-cliente.component.ts
@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.page.html',
  styleUrls: ['./lista-clientes.page.scss'],
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
export class ListaClientesPage implements OnInit {

  private clienteService: ClientesService;
private cliExpServ: ClientesExpedientesService;

  clientes: ClienteModel[] = [];
  clientesOriginales: ClienteModel[] = []; 

  getClientes$!: Subscription;
  hayClientes: boolean = true;
  busqueda: string = '';
  busquedaAnterior: string = ''; 
  texto: string = '';

  /* mostrar x cantidad de clientes por pagina */
  clientesPaginados: any[] = []; // Clientes filtrados por página
  pageSize = 5; // Número de clientes por página
  pageIndex = 0; // Página actual

  private destroy$ = new Subject<void>(); // Subject para gestionar la destrucción

  private timeoutId: any; // Almacenar el ID del timeout

  //getClientes$: Subscription | null = null; // Asignar null


  constructor(clientesService: ClientesService, private dialog: MatDialog,
    private router: Router, cliExpServ: ClientesExpedientesService) {
    this.clienteService = clientesService;
    this.cliExpServ = cliExpServ;

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
              this.cargarClientes(); // Cargar clientes al iniciar
            }
          }
        
          cargarClientes() {
            this.clienteService.getClientes().subscribe(
              (clientes) => {
                this.clientes = clientes;
                this.clientesOriginales = [...clientes];
                this.hayClientes = this.clientes.length > 0;
              },
              (error) => {
                console.error('Error al obtener clientes:', error);
              },
              () => {
                // Programar la próxima ejecución después de 5 segundos
                this.timeoutId = setTimeout(() => {
                  this.cargarClientes();

                }, 5000);
              }
            );
          }
        


      obtenerLista(){
        this.clienteService.getClientes()
          .pipe(takeUntil(this.destroy$)) 
          .subscribe(
            (clientes) => {
              this.clientes = clientes;
              this.clientesOriginales = [...clientes];
              this.hayClientes = this.clientes.length > 0;
            },
            (error) => {
              console.error('Error al obtener clientes:', error);
            }
          );
        
      }

      abrirDialog(): void {
        const dialogRef = this.dialog.open(DialogClienteComponent, {
          width: '500px',
        });
      
        dialogRef.afterClosed().subscribe((cliente: ClienteModel) => {
          if (cliente) {
            // Primero, agregar el cliente a la base de datos
            this.clienteService.addCliente(cliente).subscribe(response => {
              // El cliente agregado tendrá ahora el ID asignado
              cliente.id = response.id; // Asignamos el ID devuelto desde la base de datos
      
              console.log('Cliente agregado:', response);
              this.clientes.push(cliente);
      
              // Si la búsqueda está vacía, obtener todos los clientes
              if (this.busqueda == '') {
                this.obtenerClientes();
              } else {
                this.clienteService.searchClientes(this.busqueda);
              }
      
              // Ahora, agregar la relación cliente-expediente
              if (cliente.expedientes != null && cliente.expedientes.length > 0) {
                cliente.expedientes.forEach((expediente: any) => {
                  if (cliente.id) {  // Solo agregar la relación si el cliente tiene un ID válido
                    this.cliExpServ.addClienteExpediente(cliente.id, expediente.id).subscribe(response => {
                      console.log('Relación cliente-expediente agregada:', response);
                    }, error => {
                      console.error('Error al agregar relación cliente-expediente:', error);
                    });
                  }
                });
              }
      
            }, error => {
              console.error('Error al agregar cliente:', error);
            });
          }
        });
      }
      
      

      goTo(path: string) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([path]); // Esto forzará la recarga del componente
        });
      }
      

      obtenerClientes() {
        this.getClientes$ = this.clienteService.getClientes().subscribe(
          (clientes) => {
            this.clientes = clientes;
            this.clientesOriginales = [...clientes]; 
            this.hayClientes = this.clientes.length > 0;
          },
          (error) => {
            console.error('Error al obtener clientes:', error);
          }
        );
      }
     /* 
      abrirModificar(cliente: ClienteModel) {
        const dialogRef = this.dialog.open(DialogClienteModificarComponent, {
          width: '500px',
          data: cliente
        });
      
        dialogRef.afterClosed().subscribe((clienteModificado: ClienteModel) => {
          if (clienteModificado) {
            this.clienteService.actualizarCliente(clienteModificado.id, clienteModificado).subscribe(response => {
              console.log('Cliente actualizado:', response);
            }, error => {
              console.error('Error al actualizar cliente:', error);
            });      
            //this.clientes = this.clientes.map(c => c.id === clienteModificado.id ? clienteModificado : c);
  
            if(this.busqueda == ''){
              this.obtenerClientes();
            }else {
              this.clienteService.searchClientes(this.busqueda);
            }
            
            // Limpiamos la búsqueda para asegurar que la lista completa se muestre
            // this.busqueda = ''; // Borra el texto de búsqueda
          //  this.busquedaAnterior = '';
           // this.clientes = [...this.clientesOriginales]; // Recupera la lista completa
           // this.hayClientes = this.clientes.length > 0; // Actualiza el estado de la lista
      
          }
        });
      }*/

        abrirModificar(cliente: ClienteModel) {
          const dialogRef = this.dialog.open(DialogClienteModificarComponent, {
            width: '500px',
            data: cliente
          });
        
          dialogRef.afterClosed().subscribe((clienteModificado: ClienteModel) => {
            if (clienteModificado) {
              this.clienteService.actualizarCliente(clienteModificado.id, clienteModificado).subscribe(response => {
                console.log('Cliente actualizado:', response);
        
                // Actualiza solo el cliente en la lista sin recargar todo
                this.clientes = this.clientes.map(c => 
                  c.id === clienteModificado.id ? clienteModificado : c
                );
        
              }, error => {
                console.error('Error al actualizar cliente:', error);
              });
        
              if (this.busqueda == '') {
                this.obtenerClientes();
              } else {
                this.clienteService.searchClientes(this.busqueda);
              }
            }
          });
        }
        
      
      


      async buscar() {

          this.clienteService.searchClientes(this.busqueda).subscribe(
            (clientes) => {
              this.clientes = clientes;
              this.clientesOriginales = [...clientes];
              this.hayClientes = this.clientes.length > 0;
              this.texto = 'No se encontraron clientes';
            },
            (error) => {
              console.error('Error al obtener clientes:', error);
            },
            
          );
      }

      cambiarPagina(event: PageEvent) {
        const inicio = event.pageIndex * event.pageSize;
        const fin = inicio + event.pageSize;
        this.clientesPaginados = this.clientes.slice(inicio, fin);
      }
      
      
      actualizarClientesPaginados() {
        const inicio = this.pageIndex * this.pageSize;
        const fin = inicio + this.pageSize;
        this.clientesPaginados = this.clientes.slice(inicio, fin);
      }





}
