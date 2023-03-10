import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideFileRouter } from "@analogjs/router";
import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
})
export class Root {}

bootstrapApplication(Root, {
  providers: [provideFileRouter(), provideHttpClient()],
});
