import { Component } from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { injectActivatedRoute } from "@analogjs/router";
import {
  BehaviorSubject,
  combineLatestWith,
  map,
  startWith,
  Subject,
  tap,
} from "rxjs";
import { PlayerComponent } from "app/components";
import { PlayoffsService } from "app/services";
import { PlayoffT } from "app/types";
import { TeamNamePipe } from "app/pipes";

/*
const minimumGames = (gamesNumber: number): number =>
  Math.ceil(gamesNumber / 2);
 */

@Component({
  standalone: true,
  templateUrl: "./playoff.html",
  imports: [AsyncPipe, NgIf, NgForOf, TeamNamePipe, PlayerComponent],
})
export default class PlayoffPage {
  private readonly route = injectActivatedRoute();
  private gameIndex$: Subject<number> = new Subject();

  private playoffId$ = this.route.paramMap.pipe(
    map((params) => params.get("id")!)
  );

  public playoff$ = this.playoffId$.pipe(map((id) => this.playoffs.byId(id)));

  public games$ = this.playoff$.pipe(
    map((p: PlayoffT) => p.games.map((g) => g.vhs.length > 0)),
    tap((games) => {
      const firstAvailable = games.findIndex((g) => g);
      setTimeout(() => this.gameIndex$.next(firstAvailable));
    })
  );

  public bestOf$ = this.playoff$.pipe(map((p) => this.playoffs.bestOf(p)));

  public vhs$ = this.playoff$.pipe(
    combineLatestWith(this.gameIndex$),
    map(([playoff, gameIndex]) => playoff.games[gameIndex].vhs)
  );

  public index$ = this.gameIndex$.asObservable();

  constructor(private playoffs: PlayoffsService) {}

  public setGame(index: number): void {
    this.gameIndex$.next(index);
  }
}
