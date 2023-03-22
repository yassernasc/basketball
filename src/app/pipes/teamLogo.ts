import { Pipe, PipeTransform } from '@angular/core'
import { TeamsService } from 'app/services'

@Pipe({ name: 'teamLogo', standalone: true })
export class TeamLogoPipe implements PipeTransform {
  constructor(public teams: TeamsService) {}

  transform(id: number, season: number): string {
    const abbr = this.teams.abbr(id)
    return `https://cdn.ssref.net/req/202303071/tlogo/bbr/${abbr}-${season}.png`
  }
}
