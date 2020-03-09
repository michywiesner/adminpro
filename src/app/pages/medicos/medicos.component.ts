import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico.service';
import { ModalUploadsService } from '../../components/modal-uploads/modal-uploads.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _medicoService: MedicoService, public _modalUploadService: ModalUploadsService) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos(this.desde).subscribe( (res: any) => {
                                          this.medicos = res.medicos;
                                          console.log(this.medicos);
                                          this.totalRegistros = res.total;
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
    this.cargarMedicos();
  }

  crearMedico() {

  }

  buscarMedico ( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;
    this._medicoService.busquedaMedicos( termino )
                        .subscribe( (medicos: Medico[]) => {
                          this.medicos = medicos;
                          this.cargando = false;
                        });
  }

  borrarMedico( id: string ) {
    this._medicoService.deleteMedico( id )
                          .subscribe( () => {
                            Swal.fire(
                              'Deleted!',
                              'Your doctor has been deleted.',
                              'success'
                            );
                            this.cargarMedicos();
                          }  );

  }



}
