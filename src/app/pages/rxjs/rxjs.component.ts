import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;
 
 
  constructor() {

   this.subscription = this.regresaObservable()
    .subscribe(
      numero => console.log('subs', numero),
      error => console.error('Error en el obs', error),
      () => console.log('El observador termino')
      );
   }

  ngOnInit() {
  }

  ngOnDestroy () {
  this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<number | string> {

    return new Observable( observer => {

      let contador = 0;
      const intervalo = setInterval( () => {
        contador += 1;

        const salida = {
          valor: contador
        }
        observer.next( salida );

       // if ( contador === 3) {

       //   clearInterval( intervalo );
       //   observer.complete();
       // }

      }, 1000 );
    }).pipe( map( resp => resp.valor),
      filter( ( valor, index) => {
        if (( valor % 2 ) === 1 ) {
          // impar
          return true;
        } else {
          // par
          return false;
        }
      })
     );

  }

}
