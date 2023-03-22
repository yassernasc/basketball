import { Pipe, PipeTransform } from '@angular/core'
import { TeamsService } from 'app/services'

@Pipe({ name: 'teamName', standalone: true })
export class TeamNamePipe implements PipeTransform {
  constructor(public teams: TeamsService) {}

  transform(id: number): string {
    return this.teams.name(id)
  }
}
