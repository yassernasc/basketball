import { Pipe, PipeTransform } from '@angular/core'
import { Observable, Subject } from 'rxjs'

@Pipe({ name: 'obs', standalone: true })
export class ObservablePipe implements PipeTransform {
  transform<T>(subject: Subject<T>): Observable<T> {
    return subject.asObservable()
  }
}
