import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpedientesService } from 'src/app/services/expedientes.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, Observable  } from 'rxjs';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDialog } from '@angular/material/dialog';
import { IonList, IonItemSliding, IonLabel, IonItem, IonInput } from "@ionic/angular/standalone";

import { JuzgadosService } from 'src/app/services/juzgados.service';
import { JuzgadoModel } from 'src/app/models/juzgado/juzgado.component';


@Component({
  selector: 'app-honorario-diferido',
  templateUrl: './honorario-diferido.page.html',
  styleUrls: ['./honorario-diferido.page.scss'],
  standalone: true,
    imports: [IonInput, IonItem, IonLabel, IonItemSliding, IonList, CommonModule, FormsModule,
      MatSidenavModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
      MatFormFieldModule, MatToolbarModule, MatIconModule, MatDividerModule, MatMenuModule, MatProgressSpinnerModule,
      MatSelectModule,
      MatOptionModule,
    ]
})
export class HonorarioDiferidoPage implements OnInit {

  cargando: boolean = false;
  honorariosDiferidos: any[] = [];
  honorariosOriginales: any[] = [];

  hayHonorarios: boolean = true;
  private destroy$ = new Subject<void>();
  busqueda: string = '';

  constructor(
    private expedienteService: ExpedientesService,
    private juzgadoService: JuzgadosService,

    private router: Router
  ) {}

  ngOnInit() {
    this.cargarHonorariosDiferidos();
  }
  cargarHonorariosDiferidos() {
    this.cargando = true;
    this.expedienteService.getExpedientes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (honorarios) => {
          this.honorariosDiferidos = honorarios;
          this.hayHonorarios = this.honorariosDiferidos.length > 0;
  
          // ✅ Solo agregar el juzgado a cada expediente
          this.honorariosDiferidos.forEach(expediente => {
            this.juzgadoService.getJuzgadoPorId(expediente.juzgado_id).subscribe(juzgado => {
              expediente.juzgadoModel = juzgado;
            });
          });
  
          this.cargando = false;
        },
        (error) => {
          console.error('Error al obtener expedientes:', error);
          this.cargando = false;
        }
      );
  }
  
  cargarPorEstado(estado: string) {
    this.cargando = true;
    this.expedienteService.getExpedientesPorEstado(estado)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (honorarios) => {
          this.honorariosDiferidos = honorarios;
          this.hayHonorarios = this.honorariosDiferidos.length > 0;
  
          // ✅ Solo agregar el juzgado a cada expediente
          this.honorariosDiferidos.forEach(expediente => {
            this.juzgadoService.getJuzgadoPorId(expediente.juzgado_id).subscribe(juzgado => {
              expediente.juzgadoModel = juzgado;
            });
          });
  
          this.busqueda = '';
          this.cargando = false;
        },
        (error) => {
          console.error('Error al obtener expedientes:', error);
          this.cargando = false;
        }
      );
  }
  

  goTo(ruta: string) {
    this.router.navigate([ruta]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  cambiarEstado(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Estado seleccionado:', selectedValue);
  
      if(selectedValue == 'todos'){
        this.cargarHonorariosDiferidos();
      }else{
        
        this.cargarPorEstado(selectedValue);
      }
  }

  async buscar() {
    this.expedienteService.buscarExpedientes(this.busqueda).subscribe(
      (expediente) => {
        this.honorariosDiferidos = expediente;
        this.honorariosOriginales = [...expediente];
        this.hayHonorarios = this.honorariosDiferidos.length > 0;

        this.honorariosDiferidos.forEach(expediente => {
          this.juzgadoService.getJuzgadoPorId(expediente.juzgado_id).subscribe(juzgado => {
            expediente.juzgadoModel = juzgado;
          });
        });
        //this.texto = 'No se encontraron expedientes';
      },
      (error) => {
        console.error('Error al obtener expedientes:', error);
      },
      
    );
}

obtenerJuzgado(id: number){

}

  
}