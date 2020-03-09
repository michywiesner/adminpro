import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from '../../models/hospital.model';
import { MedicoService } from '../../services/medico.service';
import { HospitalService } from '../../services/hospital/hospital.service';
import { Medico } from 'src/app/models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadsService } from '../../components/modal-uploads/modal-uploads.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');
  desde = 0;
  limit = 0;

  constructor(public _medicoService: MedicoService,
              public router: Router,
              public _hospitalService: HospitalService,
              public activatedRoute: ActivatedRoute,
              public _modalUploadService: ModalUploadsService) {
                activatedRoute.params.subscribe( params => {
                  const id = params['id'];

                  if (id !== 'nuevo') {
                    this.cargarMedico(id);
                  }
                });
               }

  ngOnInit() {

    this._hospitalService.cargarHospital(this.desde, this.limit).subscribe( (res: any) => {
                                                        this.hospitales = res.hospitales;
                                                      });
                                                      this._modalUploadService.notificacion
                                                      .subscribe( res => {
                                                        this.medico.img = res.medico.img;
                                                      });
  }

  guardarMedico( form: NgForm ) {

    if ( form.invalid ) {
      return;
    }

    this._medicoService.guardarMedico( this.medico)
                       .subscribe( medico => {
                                  this.medico._id = medico._id;
                                  this.router.navigate(['/medico', medico._id]);
                                });
  }

  cambioHospital( id ) {

    this._hospitalService.obtenerHospital(id)
                         .subscribe( res => this.hospital = res );

  }

  cargarMedico( id: string ) {
    this._medicoService.cargarMedico( id )
                       .subscribe(medico => {
                         this.medico = medico;
                         this.medico.hospital = medico.hospital._id;
                         this.cambioHospital(this.medico.hospital);
                        });
  }

}
