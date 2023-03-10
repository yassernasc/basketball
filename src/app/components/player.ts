import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { BehaviorSubject, combineLatestWith, map } from "rxjs";
import { ObservableInputs } from "neo-observable-input";
import { VhsT } from "app/types";

const getYoutubeUrl = (id: string): string => {
  const baseUrl = "https://www.youtube.com/embed/";

  // is playlist
  if (id.length > 12 && id.startsWith("PL")) {
    return `${baseUrl}?listType=playlist&list=${id}`;
  }

  return baseUrl + id;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "player",
  standalone: true,
  templateUrl: "./player.html",
  imports: [AsyncPipe, NgIf, NgForOf],
})
export class PlayerComponent implements OnChanges {
  private readonly inputs = new ObservableInputs();

  @Input() vhs!: VhsT;
  vhs$ = this.inputs.observe(() => this.vhs);

  public vhsIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
  public url$ = this.vhs$.pipe(
    combineLatestWith(this.vhsIndex$),
    map(([vhs, index]) => {
      const url = getYoutubeUrl(vhs[index]);
      return this.sanatizer.bypassSecurityTrustResourceUrl(url);
    })
  );

  constructor(private sanatizer: DomSanitizer) {}

  ngOnChanges(): void {
    this.vhsIndex$.next(0);
    this.inputs.onChanges();
  }
}
