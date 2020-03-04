import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ModalUploadsService } from './modal-uploads.service';

@Component({
  selector: 'app-modal-uploads',
  templateUrl: './modal-uploads.component.html',
  styles: []
})
export class ModalUploadsComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;
  tipo: 'usuarios';

  constructor(public _cargaArchivo: SubirArchivoService, public _modalUpload: ModalUploadsService) { }

  ngOnInit() {
  }

  seleccionImagen( archivo: File ) {
    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( archivo.type.indexOf('image') < 0 ) {
      this.imagenSubir = null;
      this.imagenTemp = '';
      Swal.fire({
        icon: 'warning',
        title: 'Solo imagenes',
        text: 'El archivo seleccionado no es imagen'
      });
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  borrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this._modalUpload.cerrarModal();
  }

  subirImagen() {
    this._cargaArchivo.subirArchivo(this.imagenSubir, 'usuarios' , this._modalUpload.id)
                      .then( res => {
                        this._modalUpload.notificacion.emit( res );
                        Swal.fire({
                          icon: 'success',
                          title: 'Great',
                          text: 'The image has been changed'
                        });
                      }).catch ( err => {
                        console.error(err);
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: err.message
                        });
                      });
  }


}
