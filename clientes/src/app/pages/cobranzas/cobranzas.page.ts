import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subscription, Observable, forkJoin, Subject } from 'rxjs';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
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

import { ExpedienteModel } from 'src/app/models/expediente/expediente.component';
import { ExpedientesService } from 'src/app/services/expedientes.service';

import { UsuarioModel } from 'src/app/models/usuario/usuario.component';
import { UsuarioService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

// Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-consultas',
  templateUrl: './cobranzas.page.html',
  styleUrls: ['./cobranzas.page.scss'],
  standalone: true,
  imports: [IonInput, IonItem, IonLabel, IonItemSliding, IonList, CommonModule, FormsModule,
    MatSidenavModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatFormFieldModule, MatToolbarModule, MatIconModule, MatDividerModule, MatMenuModule, MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
  ]
})
export class CobranzasPage implements OnInit {

  cargando: boolean = false;
  expedientes: any[] = [];
  expedientesOriginales: any[] = [];

  hayExpedientes: boolean = true;
  private destroy$ = new Subject<void>();
  busqueda: string = '';

  ordenCampo: string = '';
  ordenAscendente: boolean = true;

  mesesDisponibles: string[] = [];
  cobrosPorMes: { [mes: string]: any[] } = {};

  grafico: any;

  ngOnInit() {
    const desdeAnio = 2016;
    const hoy = new Date();
    const hastaAnio = hoy.getFullYear();
    const hastaMes = hoy.getMonth() + 1;

    const mesesTemporales: string[] = [];

    for (let anio = desdeAnio; anio <= hastaAnio; anio++) {
      const mesInicio = 1;
      const mesFin = (anio === hastaAnio) ? hastaMes : 12;

      for (let mes = mesInicio; mes <= mesFin; mes++) {
        const clave = `${anio}-${mes.toString().padStart(2, '0')}`;
        mesesTemporales.push(clave);
      }
    }

    // Invertimos el orden (meses más recientes primero)
    this.mesesDisponibles = mesesTemporales.reverse();

    this.mesesDisponibles.forEach(mes => {
      const [anio, mesStr] = mes.split('-').map(Number);

      this.expedienteService.obtenerCobrosPorMes(anio, mesStr).subscribe(cobros => {
        let total = 0;

        for (const item of cobros) {
          if (item.fecha_cobro_capital) total += item.montoCapital || 0;
          if (item.fecha_cobro) total += item.montoHonorarios || 0;
          if (item.fechaCobroAlzada) total += item.montoAlzada || 0;
          if (item.fechaCobroEjecucion) total += item.montoEjecucion || 0;
          if (item.fechaCobroDiferencia) total += item.montoDiferencia || 0;
        }

        if (total > 0) {
          this.cobrosPorMes[mes] = [{ monto: total }];
        }

        this.actualizarGrafico();
      });
    });
  }

  actualizarGrafico() {
    const canvas = document.getElementById('grafico-cobranzas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const labels = this.mesesDisponibles.filter(m => this.cobrosPorMes[m])
      .map(m => `${this.convertirMes(m)} / ${m.split('-')[0]}`);

    const data = this.mesesDisponibles.filter(m => this.cobrosPorMes[m])
      .map(m => this.cobrosPorMes[m]?.[0]?.monto || 0);

    if (this.grafico) this.grafico.destroy();

    this.grafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Cobrado',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `$${(context.raw as number).toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => `$${value}`
            }
          }
        }
      }
    });
  }

  constructor(
    private expedienteService: ExpedientesService,
    private juzgadoService: JuzgadosService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  // ...resto del código sin cambios...

  convertirMes(mes: string): string {
    const meses = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];
    const numeroMes = parseInt(mes.split('-')[1], 10);
    return meses[numeroMes - 1];
  }

  calcularTotalMes(mes: string): number {
    return (this.cobrosPorMes[mes] || []).reduce((acc, item) => acc + Number(item.monto || 0), 0);
  }

}
