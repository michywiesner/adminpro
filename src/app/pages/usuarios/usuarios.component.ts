import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadsService } from '../../components/modal-uploads/modal-uploads.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _usuarioService: UsuarioService, public _modalUploadService: ModalUploadsService) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
                          .subscribe( res => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.cargando = true;
    this._usuarioService.cargarUsuarios(this.desde)
                        .subscribe( (res: any) => {
                          this.totalRegistros = res.total;
                          this.usuarios = res.usuarios;

                          this.cargando = false;
                        });
  }

  cambiarDesde( valor: number ) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    console.log(this.desde);

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuario ( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }
    console.log( termino );

    this.cargando = true;
    this._usuarioService.busquedaUsuarios( termino )
                        .subscribe( (usuarios: Usuario[]) => {
                          this.usuarios = usuarios;
                          console.log(this.usuarios);
                          this.cargando = false;
                        });
  }

  borrarUsuario( usuario: Usuario ) {
    if ( usuario._id === this._usuarioService.usuario._id ) {
      Swal.fire({
        icon: 'error',
        title: 'No se puede borrar',
        text: 'No se puede borrar a si mismo'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You wont be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this._usuarioService.deleteUsuario( usuario._id )
                            .subscribe( res => {
                              Swal.fire(
                                'Deleted!',
                                'Your file has been deleted.',
                                'success'
                              );
                              this.cargarUsuarios();

                            });
      }
    });

  }

  saveChanges( usuario: Usuario ) {
    this._usuarioService.updateUser( usuario ).subscribe();
  }

}
