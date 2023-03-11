import { Injectable } from "@angular/core";

type VhsStatus = "valid" | "unauthorized" | "invalid";

@Injectable({ providedIn: "root" })
export class YoutubeService {
  public url(id: string): string {
    const baseUrl = "https://www.youtube.com/embed/";

    if (this.isPlaylist(id)) {
      return `${baseUrl}?listType=playlist&list=${id}`;
    }

    return baseUrl + id;
  }

  public async status(id: string): Promise<VhsStatus> {
    const url = "https://www.youtube.com/oembed?url=" + this.external(id);
    const { status } = await fetch(url);

    if (status === 200) return "valid";
    if (status === 401) return "unauthorized";
    return "invalid";
  }

  public external(id: string): string {
    const path = this.isPlaylist(id) ? "playlist?list" : "watch?v";
    return `https://www.youtube.com/${path}=${id}`;
  }

  private isPlaylist(id: string): boolean {
    return id.length > 12 && id.startsWith("PL");
  }
}
