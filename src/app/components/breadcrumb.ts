import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SeasonPipe } from "app/pipes";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "breadcrumb",
  standalone: true,
  templateUrl: "./breadcrumb.html",
  imports: [NgIf, SeasonPipe],
})
export class Breadcrumb {
  @Input() season!: number | null;
}
