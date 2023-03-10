import { Injectable } from "@angular/core";
import { PlayoffT, GameT } from "app/types";
import playoffs from "data/playoffs.json";

type AvailabilityT = "gold" | "good" | "ok" | "bad" | "none";

@Injectable({ providedIn: "root" })
export class PlayoffsService {
  public bySeason(season: number): PlayoffT[] {
    return playoffs.filter((p) => p.season === season);
  }

  public byId(id: string): PlayoffT {
    return playoffs.find((p) => p.id === id)!;
  }

  public availability(games: GameT[]): AvailabilityT {
    const hasVhs = (g: GameT): boolean => g.vhs.length > 0;
    const valid = games.filter(hasVhs).length;
    const total = games.length;
    const percentage = valid / total;

    if (percentage === 1) return "gold";
    if (percentage >= 0.7) return "good";
    if (percentage >= 0.5) return "ok";
    if (percentage === 0) return "none";
    return "bad";
  }

  public bestOf(playoff: PlayoffT): number {
    const { stage, season } = playoff;
    if (stage.includes("First Round")) {
      return season < 1984 ? 3 : 5;
    }
    return 7;
  }
}
