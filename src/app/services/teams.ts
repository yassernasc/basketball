import { Injectable } from '@angular/core'
import { TeamT } from 'app/types'
import teams from 'data/teams.json'

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private get(id: number): TeamT {
    return teams.find(t => t.id === id)!
  }

  public name(id: number): string {
    return this.get(id).name
  }

  public abbr(id: number): string {
    return this.get(id).abbreviation
  }
}
