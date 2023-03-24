import { Component } from '@angular/core'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { injectActivatedRoute } from '@analogjs/router'
import { combineLatestWith, map, scan, startWith, Subject, tap } from 'rxjs'
import { Breadcrumb, PlayerComponent } from 'app/components'
import { PlayoffsService } from 'app/services'
import { PlayoffT } from 'app/types'
import { ObservablePipe, RangePipe, TeamNamePipe } from 'app/pipes'

const minimumGames = (gamesNumber: number): number => Math.ceil(gamesNumber / 2)

@Component({
  standalone: true,
  templateUrl: './season.[id].[teams].html',
  imports: [
    AsyncPipe,
    Breadcrumb,
    NgForOf,
    NgIf,
    ObservablePipe,
    PlayerComponent,
    RangePipe,
    TeamNamePipe,
  ],
})
export default class PlayoffPage {
  private readonly route = injectActivatedRoute()

  public gameIndex$: Subject<number> = new Subject()
  public unlockClick$: Subject<void> = new Subject()
  public disableBtn = false

  public playoff$ = this.route.paramMap.pipe(
    map(params => {
      const season = params.get('id')!
      const teams = params.get('teams')!
      return this.playoffs.byInfo(+season, teams)
    })
  )

  public season$ = this.playoff$.pipe(map(p => p.season))

  public games$ = this.playoff$.pipe(
    map((p: PlayoffT) => p.games.map(g => g.vhs.length > 0)),
    tap(games => {
      const firstAvailable = games.findIndex(g => g)
      setTimeout(() => this.gameIndex$.next(firstAvailable))
    })
  )

  public maxGamesNumber$ = this.playoff$.pipe(map(p => this.playoffs.bestOf(p)))

  public vhs$ = this.playoff$.pipe(
    combineLatestWith(this.gameIndex$),
    map(([playoff, gameIndex]) => playoff.games[gameIndex].vhs)
  )

  public gamesVisible$ = this.games$.pipe(
    map(games => games.length),
    combineLatestWith(this.maxGamesNumber$),
    combineLatestWith(this.unlockClick$.pipe(startWith(null))),
    scan((gamesVisible, [[total, max]]) => {
      if (gamesVisible === 0) {
        return minimumGames(max)
      }

      if (gamesVisible === total) {
        this.disableBtn = true
        return gamesVisible
      }

      return gamesVisible + 1
    }, 0)
  )

  constructor(private playoffs: PlayoffsService) {}
}
