import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuarioService } from '../services/usuario/usuario.service';
import { Usuario } from '../models/usuario.model';
import { Router } from '@angular/router';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor( public _usuarioService: UsuarioService, public router: Router) { }

  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }
      return {
        sonIguales: true
      };
    };

  }

  ngOnInit() {
    init_plugins();
    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      email: new FormControl( null, [Validators.required, Validators.email]),
      password: new FormControl( null, Validators.required ),
      password2: new FormControl( null, Validators.required ),
      condiciones: new FormControl( false )
    }, { validators: this.sonIguales( 'password', 'password2' )});
  }

  registrarUsuario() {
    if ( this.forma.invalid) {
      return;
    }

    if ( !this.forma.value.condiciones) {
      Swal.fire({
        icon: 'warning',
        title: 'Importante',
        text: 'Debe aceptar las condiciones'
      });
      return;
    }
    console.log(this.forma.value);

    const usuario: Usuario = ({
      nombre: this.forma.value.nombre,
      email: this.forma.value.email,
      password: this.forma.value.password
    });

    this._usuarioService.crearUsuario( usuario )
                        .subscribe( res => {
                          Swal.fire({
                            icon: 'success',
                            title: 'Good',
                            text: ('Usuario ' + usuario.email + ' creado correctamente')
                          });
                          this.router.navigate(['/login']);
                        });
  }


}
