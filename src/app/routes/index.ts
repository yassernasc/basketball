import { Component } from '@angular/core'
import { NgForOf, SlicePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { range } from 'remeda'
import { SeasonPipe } from 'app/pipes'
import { PlayoffsService } from 'app/services'
import { PlayoffShowcaseComponent } from 'app/components'

@Component({
  imports: [
    NgForOf,
    PlayoffShowcaseComponent,
    RouterLink,
    SeasonPipe,
    SlicePipe,
  ],
  standalone: true,
  templateUrl: './index.html',
})
export default class HomePage {
  constructor(public playoffs: PlayoffsService) {}

  public readonly seasons = range(1980, 2000)

  get half(): number {
    return this.seasons.length / 2
  }

  get featured() {
    return this.playoffs.featured()
  }
}
