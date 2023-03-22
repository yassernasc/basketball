import { Component } from '@angular/core'
import { NgForOf, SlicePipe } from '@angular/common'
import { RouterLink } from '@angular/router'
import { range } from 'remeda'
import { SeasonPipe } from 'app/pipes'

@Component({
  imports: [NgForOf, RouterLink, SeasonPipe, SlicePipe],
  standalone: true,
  templateUrl: './index.html',
})
export default class HomePage {
  public readonly seasons = range(1980, 2000)

  get half(): number {
    return this.seasons.length / 2
  }
}
