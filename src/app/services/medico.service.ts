import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from './usuario/usuario.service';
import { Medico } from '../models/medico.model';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( public http: HttpClient, public _usuarioService: UsuarioService) { }

  cargarMedicos( desde: number) {
    const url = URL_SERVICIOS + 'medico?desde=' + desde;

    return this.http.get( url );
  }

  cargarMedico( id: string) {
    const url = URL_SERVICIOS + 'medico/' + id;
    return this.http.get( url ).pipe(map( (res: any) => res.medico));
  }

  busquedaMedicos( termino: string ) {
    const url = URL_SERVICIOS + 'busqueda/coleccion/medicos/' + termino;
    return this.http.get( url ).pipe(map( (res: any) => res.medicos ));
  }

  deleteMedico ( id: string ) {
    let url = URL_SERVICIOS + 'medicos/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url );

  }

  guardarMedico( medico: Medico ) {
    let url = URL_SERVICIOS + 'medico';

    if ( medico._id ) {
      // actualizando
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;
      return this.http.put(url, medico)
                      .pipe(map( (res: any) => {
                        Swal.fire({
                          icon: 'success',
                          title: 'Actualizado',
                          text: 'Medico actualizado correctamente'
                        });
                        return res.medico;
                      }));
    } else {
      // creando
      url += '?token=' + this._usuarioService.token;

      return this.http.post( url, medico ).pipe(map( (res: any) => {
                                          Swal.fire({
                                            icon: 'success',
                                            title: 'Guardado',
                                            text: 'Medico ' + medico.nombre + ' creado correctamente'
                                          });
                                          return res.medico;
                                        }));
    }
  }

}
