// Estructura base para el calendario completo con navegación de meses y marcación de eventos

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoModel } from 'src/app/models/evento/evento.component';
import { EventosService } from 'src/app/services/eventos.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-calendario-avanzado',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './calendario-avanzado.component.html',
  styleUrls: ['./calendario-avanzado.component.scss']
})
export class CalendarioAvanzadoComponent implements OnInit {

  currentDate: Date = new Date();
  diasDelMes: { dia: number; tieneEvento: boolean }[] = [];
  nombreMes: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anioActual: number = 0;
  mesActual: number = 0;
  eventos: EventoModel[] = [];
  diasConEventos: Set<number> = new Set();
  eventosSeleccionados: EventoModel[] = [];
  fechaSeleccionada: Date | null = null;

  constructor(private eventosService: EventosService) {}

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos() {
    this.eventosService.getEventos().subscribe((eventos) => {
      this.eventos = eventos;
      this.actualizarCalendario();
    });
  }

  actualizarCalendario() {
    this.diasConEventos.clear();

    this.mesActual = this.currentDate.getMonth();
    this.anioActual = this.currentDate.getFullYear();

    const cantidadDias = new Date(this.anioActual, this.mesActual + 1, 0).getDate();
    const primerDiaSemana = new Date(this.anioActual, this.mesActual, 1).getDay();

    const eventosDelMes = this.eventos.filter(e => {
      const fecha = new Date(e.fecha_evento);
      return (
        fecha instanceof Date && !isNaN(fecha.getTime()) &&
        fecha.getFullYear() === this.anioActual &&
        fecha.getMonth() === this.mesActual
      );
    });

    eventosDelMes.forEach(evento => {
      const fecha = new Date(evento.fecha_evento);
      fecha.setDate(fecha.getDate() + 1);

      if (fecha instanceof Date && !isNaN(fecha.getTime())) {
        const dia = fecha.getDate();
        this.diasConEventos.add(dia);
      }
    });

    this.diasDelMes = [];
    for (let i = 0; i < primerDiaSemana; i++) {
      this.diasDelMes.push({ dia: 0, tieneEvento: false });
    }

    for (let dia = 1; dia <= cantidadDias; dia++) {
      this.diasDelMes.push({
        dia,
        tieneEvento: this.diasConEventos.has(dia)
      });
    }
  }

  cambiarMes(offset: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.actualizarCalendario();
    this.eventosSeleccionados = [];
  }

  mesAnterior() {
    this.cambiarMes(-1);
  }

  mesSiguiente() {
    this.cambiarMes(1);
  }
/*
    seleccionarDia(dia: number) {
      if (dia === 0) return;
      this.fechaSeleccionada = new Date(this.anioActual, this.mesActual, dia);
      //this.fechaSeleccionada.setDate(this.fechaSeleccionada.getDate() - 1);
      console.log(this.fechaSeleccionada);

      this.eventosSeleccionados = this.eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha_evento);
        return (
          fechaEvento instanceof Date && !isNaN(fechaEvento.getTime()) &&
          fechaEvento.getDate() === dia &&
          fechaEvento.getMonth() === this.mesActual &&
          fechaEvento.getFullYear() === this.anioActual
        );
      });
    }*/

  seleccionarDia(dia: number) {
  if (dia === 0) return;
  this.fechaSeleccionada = new Date(this.anioActual, this.mesActual, dia);
  const fechaStr = this.fechaSeleccionada.toISOString().slice(0, 10); // YYYY-MM-DD

  this.eventosSeleccionados = this.eventos.filter(evento => {
    const eventoStr = new Date(evento.fecha_evento).toISOString().slice(0, 10);
      console.log(eventoStr);

    return eventoStr === fechaStr;
  });
}

  obtenerColorTipo(tipo: string): string {
    switch (tipo) {
      case 'Mediación': return 'mediacion';
      case 'Audiencia 360 vitual': return 'audienciaVirtual';
      case 'Audiencia 360 personal': return 'audienciaPersonal';
      case 'Notificación': return 'notificacion';
      case 'Sentencia': return 'sentencia';
      default: return 'otro';
    }
  }

  refrescar(): void {
  this.cargarEventos();
}



} 
