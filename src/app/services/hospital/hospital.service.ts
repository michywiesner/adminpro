import { Injectable } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( public http: HttpClient, public _usuarioService: UsuarioService) { }

  cargarHospital( desde: number, limit: number) {
    const url = URL_SERVICIOS + 'hospital?desde=' + desde + '&limit=' + limit;
    return this.http.get(url);
  }

  obtenerHospital( id: string ) {
    const url = URL_SERVICIOS + 'hospital/' + id;
    return this.http.get( url ).pipe(map( (res: any) => res.hospital ));
  }

  updateHospital ( hospital: Hospital ) {
    let url = URL_SERVICIOS + 'hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put( url, hospital ).pipe(map( res => {
                                          Swal.fire({
                                            icon: 'success',
                                            title: 'Actualizado',
                                            text: 'Hospital actualizado'
                                          });
                                        }));
  }

  deleteHospital ( id: string ) {
    let url = URL_SERVICIOS + 'hospital/' + id;
    url += '?token=' + this._usuarioService.token;

    return this.http.delete( url ).pipe(map( res => {
                                        Swal.fire({
                                          icon: 'success',
                                          title: 'Borrado',
                                          text: 'Hospital borrado'
                                        });
                                      }));

  }

  crearHospital ( nombre: string ) {
    let url = URL_SERVICIOS + 'hospital/';
    url += '?token=' + this._usuarioService.token;

    return this.http.post( url, { nombre: nombre });
  }

  busquedaHospitales( termino: string ) {
    const url = URL_SERVICIOS + 'busqueda/coleccion/hospitales/' + termino;
    return this.http.get( url ).pipe(map( (res: any) => res.hospitales ));
  }

}
