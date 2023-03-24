import { Pipe, PipeTransform } from '@angular/core'
import { range } from 'remeda'

@Pipe({ name: 'range', standalone: true })
export class RangePipe implements PipeTransform {
  transform(value: number = 0): number[] {
    return range(0, value)
  }
}
