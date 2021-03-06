import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any[] = [];

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
      this.menu = JSON.parse( localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage ( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

      this.usuario = usuario;
      this.token = token;
      this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + 'login/google';

    return this.http.post( url, { token } )
                    .pipe(map( (res: any) => {
                      this.guardarStorage( res.id, res.token, res.usuario, res.menu );
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
                      this.guardarStorage( res.id, res.token, res.usuario, res.menu );
                      return true;
                      }),
                      catchError( err => {
                        return throwError(err.error.mensaje);
                      }));

  }

  crearUsuario( usuario: Usuario) {
    const url = URL_SERVICIOS + 'usuario';

    return this.http.post( url, usuario )
                    .pipe(catchError( err => {
                      console.log(err);
                      return throwError(err);
                    }));

  }

  updateUser ( usuario: Usuario ) {
    let url = URL_SERVICIOS + 'usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario ).pipe(map((res: any) => {
      if ( usuario._id === this.usuario._id ) {

        const usuarioDB: Usuario = res.usuario;
        this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
      }

      Swal.fire({
        icon: 'success',
        title: 'Usuario Actualizado',
        text: usuario.nombre
      });
      return true;
    }));
  }

  renuevatoken() {
    let url = URL_SERVICIOS + 'login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get(url).pipe(map( (res: any) => {
                                    this.token = res.token;
                                    localStorage.setItem('token', this.token);
                                    return true;
                                    }),
                                    catchError( err => {
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Error en el token',
                                        text: 'No se pudo actualizar token'
                                      });
                                      this.router.navigate(['/login']);
                                      return throwError(err);
                                    }));
  }

  actualizarImagen( file: File, id: string ) {
    this.service.subirArchivo( file, 'usuarios', id).then( (res: any) => {
      this.usuario.img = res.usuario.img;
      Swal.fire({
        icon: 'success',
        title: 'Imagen Actualizada'
      });

      this.guardarStorage( id, this.token, this.usuario, this.menu);

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
