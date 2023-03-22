import { Injectable } from '@angular/core'
import { TeamsService } from 'app/services'
import { PlayoffT, GameT } from 'app/types'
import playoffs from 'data/playoffs.json'

type AvailabilityT = 'gold' | 'good' | 'ok' | 'bad' | 'none'

@Injectable({ providedIn: 'root' })
export class PlayoffsService {
  private readonly teamSeparator = '-vs-'

  private getTeamsName(playoff: PlayoffT): string[] {
    return playoff.teams.map(id => this.teams.name(id).toLowerCase())
  }

  constructor(private teams: TeamsService) {}

  public bySeason(season: number): PlayoffT[] {
    return playoffs.filter(p => p.season === season)
  }

  public byId(id: string): PlayoffT {
    return playoffs.find(p => p.id === id)!
  }

  public byInfo(season: number, teams: string): PlayoffT {
    const names = teams.split(this.teamSeparator)

    return playoffs
      .filter(p => p.season === season)
      .find(p => this.getTeamsName(p).every(t => names.includes(t)))!
  }

  public availability(games: GameT[]): AvailabilityT {
    const hasVhs = (g: GameT): boolean => g.vhs.length > 0
    const valid = games.filter(hasVhs).length
    const total = games.length
    const percentage = valid / total

    if (percentage === 1) return 'gold'
    if (percentage >= 0.7) return 'good'
    if (percentage >= 0.5) return 'ok'
    if (percentage === 0) return 'none'
    return 'bad'
  }

  public bestOf(playoff: PlayoffT): number {
    const { stage, season } = playoff
    if (stage.includes('First Round')) {
      return season < 1984 ? 3 : 5
    }
    return 7
  }

  public conf(playoff: PlayoffT): 'east' | 'west' | null {
    const { stage } = playoff

    if (stage.includes('Eastern')) return 'east'
    if (stage.includes('Western')) return 'west'
    return null
  }

  public sortByAvailability(playoffs: PlayoffT[]): PlayoffT[] {
    const relevanceMap = { gold: 4, good: 3, ok: 2, bad: 1, none: 0 }

    return playoffs.sort((a, b) => {
      return (
        relevanceMap[this.availability(b.games)] -
        relevanceMap[this.availability(a.games)]
      )
    })
  }

  public match(playoff: PlayoffT) {
    return this.getTeamsName(playoff).join(this.teamSeparator)
  }
}
