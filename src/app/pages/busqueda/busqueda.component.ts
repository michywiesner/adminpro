import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Usuario } from 'src/app/models/usuario.model';
import { Medico } from 'src/app/models/medico.model';
import { Hospital } from 'src/app/models/hospital.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  usuarios: Usuario[] = [];
  medicos: Medico[] = [];
  hospitales: Hospital[] = [];

  constructor( public activatedRoute: ActivatedRoute, public http: HttpClient) {
    activatedRoute.params.subscribe( params => {
                                      const termino = params['termino'];
                                      this.buscarTermino(termino);
                                    });
   }

  ngOnInit() {
  }

  buscarTermino( termino: string) {
    const url = URL_SERVICIOS + 'busqueda/todo/' + termino;
    this.http.get( url ).subscribe( (res: any) => {
                                    this.hospitales = res.hospitales;
                                    this.medicos = res.medicos;
                                    this.usuarios = res.usuarios;
                                  });
  }

}
