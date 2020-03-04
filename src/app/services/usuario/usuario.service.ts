import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor( public http: HttpClient, public router: Router, public service: SubirArchivoService) {
    this.cargarStorage();
   }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {
    if ( localStorage.getItem('token') ) {
      this.token = localStorage.getItem('token');
      console.log(this.token);
      this.usuario = JSON.parse( localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }
  }

  guardarStorage ( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id);
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      this.usuario = usuario;
      this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + 'login/google';

    return this.http.post( url, { token } )
                    .pipe(map( (res: any) => {
                      this.guardarStorage( res.id, res.token, res.usuario );
                      return true;
                    }));

  }

  login( usuario: Usuario, recordar: boolean = false ) {
    if (recordar) {
      localStorage.setItem( 'email', usuario.email );
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICIOS + 'login';

    return this.http.post( url, usuario )
                    .pipe(map( (res: any) => {
                      this.guardarStorage( res.id, res.token, res.usuario );
                      return true;
                      }));

  }

  crearUsuario( usuario: Usuario) {
    const url = URL_SERVICIOS + 'usuario';

    return this.http.post( url, usuario );

  }

  updateUser ( usuario: Usuario ) {
    let url = URL_SERVICIOS + 'usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario ).pipe(map((res: any) => {
      if ( usuario._id === this.usuario._id ) {

        const usuarioDB: Usuario = res.usuario;
        this.guardarStorage( usuarioDB._id, this.token, usuarioDB );
      }

      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        text: usuario.nombre
      });
      return true;
    }));
  }

  actualizarImagen( file: File, id: string ) {
    this.service.subirArchivo( file, 'usuarios', id).then( (res: any) => {
      this.usuario.img = res.usuario.img;
      Swal.fire({
        icon: 'success',
        title: 'Imagen Actualizada'
      });

      this.guardarStorage( id, this.token, this.usuario);

    }).catch( error => {
      console.error( error );
    });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = URL_SERVICIOS + 'usuario?desde=' + desde;
    return this.http.get(url);
  }

  busquedaUsuarios( termino: string ) {
    const url = URL_SERVICIOS + 'busqueda/coleccion/usuarios/' + termino;
    return this.http.get( url ).pipe(map( (res: any) => res.usuarios ));
  }

  deleteUsuario ( id: string ) {
    let url = URL_SERVICIOS + 'usuario/' + id;
    url += '?token=' + this.token;

    return this.http.delete( url );

  }
}
