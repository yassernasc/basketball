import { Component } from '@angular/core'
import { AsyncPipe, NgForOf, NgIf } from '@angular/common'
import { injectActivatedRoute } from '@analogjs/router'
import { combineLatestWith, map, Subject, tap } from 'rxjs'
import { Breadcrumb, PlayerComponent } from 'app/components'
import { PlayoffsService } from 'app/services'
import { PlayoffT } from 'app/types'
import { TeamNamePipe } from 'app/pipes'

/*
const minimumGames = (gamesNumber: number): number =>
  Math.ceil(gamesNumber / 2);
 */

@Component({
  standalone: true,
  templateUrl: './season.[id].[teams].html',
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    TeamNamePipe,
    PlayerComponent,
    Breadcrumb,
  ],
})
export default class PlayoffPage {
  private readonly route = injectActivatedRoute()
  private gameIndex$: Subject<number> = new Subject()

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

  public bestOf$ = this.playoff$.pipe(map(p => this.playoffs.bestOf(p)))

  public vhs$ = this.playoff$.pipe(
    combineLatestWith(this.gameIndex$),
    map(([playoff, gameIndex]) => playoff.games[gameIndex].vhs)
  )

  public index$ = this.gameIndex$.asObservable()

  constructor(private playoffs: PlayoffsService) {}

  public setGame(index: number): void {
    this.gameIndex$.next(index)
  }
}
