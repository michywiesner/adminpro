import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadsService {

  public id: string;

  public notificacion = new EventEmitter<any>();

  constructor() {
    console.log('funciona');
   }

   cerrarModal() {
     this.id = null;
   }

    abrirModal( idx: string ) {
     this.id = idx;
    }
}
