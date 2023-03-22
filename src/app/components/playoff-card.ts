import { NgForOf, NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TeamLogoPipe } from 'app/pipes'
import { PlayoffsService } from 'app/services'
import { PlayoffT } from 'app/types'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, NgForOf, RouterLink, TeamLogoPipe],
  selector: 'playoff-card',
  standalone: true,
  templateUrl: './playoff-card.html',
})
export class PlayoffCardComponent {
  @Input() playoff!: PlayoffT
  @Input() season!: number

  constructor(private playoffs: PlayoffsService) {}

  get availability() {
    return this.playoffs.availability(this.playoff.games)
  }

  get link() {
    return this.playoffs.match(this.playoff)
  }
}
