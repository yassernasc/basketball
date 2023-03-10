import { Pipe, PipeTransform } from "@angular/core";

// converts 1980 to "1979-80"
@Pipe({ name: "season", standalone: true })
export class SeasonPipe implements PipeTransform {
  transform(value: number): string {
    return `${value - 1}-${value - 1900}`;
  }
}
