import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'stage', standalone: true })
export class StagePipe implements PipeTransform {
  transform(stage: string): string {
    if (stage.includes('First Round')) {
      return 'First Round'
    } else if (stage.includes('Semifinals')) {
      return 'Conf. Semifinals'
    } else if (stage.includes('Conference Finals')) {
      return 'Conf. Finals'
    } else if (stage.includes('Finals')) {
      return 'Finals'
    }

    return ''
  }
}
