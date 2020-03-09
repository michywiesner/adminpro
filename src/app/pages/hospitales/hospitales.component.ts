import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ModalUploadsService } from '../../components/modal-uploads/modal-uploads.service';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public _hospitalService: HospitalService, public _modalUploadService: ModalUploadsService) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion
                          .subscribe( res => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    const limit = 5;
    this._hospitalService.cargarHospital(this.desde, limit)
                        .subscribe( (res: any) => {
                          this.totalRegistros = res.total;
                          this.hospitales = res.hospitales;

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
    this.cargarHospitales();
  }

  crearHospital () {
    Swal.fire({
      title: 'Crear nuevo hospital',
      text: 'ingrese nombre de hospital',
      input: 'text',
      icon: 'info',
      inputValue: '',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value.length === 0) {
          return 'You need to write something!';
        }

        this._hospitalService.crearHospital(value)
                              .subscribe( () => {
                                Swal.fire(`El hospital ${ value } ha sido creado`);
                                this.cargarHospitales();
                              });

      }
    });

  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }
    console.log( termino );

    this.cargando = true;
    this._hospitalService.busquedaHospitales( termino )
                        .subscribe( (hospitales: Hospital[]) => {
                          this.hospitales = hospitales;
                          this.cargando = false;
                        });
  }

  saveChanges( hospital: Hospital ) {
    this._hospitalService.updateHospital( hospital ).subscribe();
  }

  borrarHospital( hospital: Hospital ) {
    this._hospitalService.deleteHospital( hospital._id )
                          .subscribe( () => this.cargarHospitales() );
  }

}
