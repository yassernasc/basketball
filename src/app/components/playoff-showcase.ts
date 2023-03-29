import { NgForOf, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { SeasonPipe, StagePipe, TeamLogoPipe } from 'app/pipes'
import { PlayoffsService } from 'app/services'
import { PlayoffT } from 'app/types'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgForOf, RouterLink, TeamLogoPipe, SeasonPipe, StagePipe],
  selector: 'playoff-showcase',
  standalone: true,
  templateUrl: './playoff-showcase.html',
})
export class PlayoffShowcaseComponent {
  @Input() playoff!: PlayoffT

  constructor(private playoffs: PlayoffsService) {}

  get link() {
    return `/season/${this.playoff.season}/${this.playoffs.match(this.playoff)}`
  }
}
