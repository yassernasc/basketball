import { Component } from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { injectActivatedRoute } from "@analogjs/router";
import { BehaviorSubject, combineLatestWith, map } from "rxjs";
import { PlayoffCardComponent } from "app/components";
import { PlayoffsService } from "app/services";
import { SeasonPipe } from "app/pipes";

const stageSuffixes = [
  "Conference First Round",
  "Conference Semifinals",
  "Conference Finals",
  "Finals",
];

const stageLabels = [
  "First Round",
  "Conf. Semifinals",
  "Conf. Finals",
  "Finals",
];

const addConferences = (stageSuffix: string): string[] => {
  const conferences = ["Western", "Eastern"];
  return conferences.map((c) => `${c} ${stageSuffix}`);
};

@Component({
  standalone: true,
  templateUrl: "./season.html",
  imports: [AsyncPipe, NgIf, NgForOf, PlayoffCardComponent, SeasonPipe],
})
export default class SeasonPage {
  private readonly route = injectActivatedRoute();

  public season$ = this.route.paramMap.pipe(
    map((params) => +params.get("id")!)
  );

  private stageIndex$ = new BehaviorSubject<number>(0);

  private seasonPlayoffs$ = this.season$.pipe(
    map((season) => this.playoffs.bySeason(+season!))
  );

  // list of stage following the database format
  private stages$ = this.stageIndex$.pipe(
    map((index) => {
      const suffix = stageSuffixes[index];
      return suffix === "Finals" ? ["Finals"] : addConferences(suffix);
    })
  );

  public stage$ = this.stageIndex$.pipe(map((index) => stageLabels[index]));

  public playoffs$ = this.seasonPlayoffs$.pipe(
    combineLatestWith(this.stages$),
    map(([playoffs, stages]) =>
      playoffs.filter((p) => stages.includes(p.stage))
    )
  );

  constructor(private playoffs: PlayoffsService) {}

  public nextStage(): void {
    const { value: index } = this.stageIndex$;
    if (index < stageSuffixes.length - 1) {
      this.stageIndex$.next(index + 1);
    }
  }

  public prevStage(): void {
    const { value: index } = this.stageIndex$;
    if (index > 0) {
      this.stageIndex$.next(index - 1);
    }
  }
}
