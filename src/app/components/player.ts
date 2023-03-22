import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core'
import {
  AsyncPipe,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common'
import { DomSanitizer } from '@angular/platform-browser'
import { BehaviorSubject, combineLatestWith, map, mergeMap, tap } from 'rxjs'
import { ObservableInputs } from 'neo-observable-input'
import { VhsT } from 'app/types'
import { YoutubeService } from 'app/services'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'player',
  standalone: true,
  templateUrl: './player.html',
  imports: [AsyncPipe, NgIf, NgForOf, NgSwitch, NgSwitchCase],
})
export class PlayerComponent implements OnChanges {
  private readonly inputs = new ObservableInputs()

  @Input() vhs!: VhsT
  vhs$ = this.inputs.observe(() => this.vhs)

  public vhsIndex$: BehaviorSubject<number> = new BehaviorSubject(0)

  public vhsId$ = this.vhs$.pipe(
    combineLatestWith(this.vhsIndex$),
    map(([vhs, index]) => vhs[index])
  )

  public vhsStatus$ = this.vhsId$.pipe(mergeMap(id => this.youtube.status(id)))

  public external$ = this.vhsId$.pipe(map(id => this.youtube.external(id)))

  public url$ = this.vhsId$.pipe(
    map(id => {
      const url = this.youtube.url(id)
      return this.sanatizer.bypassSecurityTrustResourceUrl(url)
    })
  )

  constructor(
    private sanatizer: DomSanitizer,
    private youtube: YoutubeService
  ) {}

  ngOnChanges(): void {
    this.inputs.onChanges()
    this.resetState()
  }

  private resetState(): void {
    this.vhsIndex$.next(0)
  }
}
