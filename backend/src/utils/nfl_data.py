import pandas as pd
import os

# load weekly stats - https://github.com/nflverse/nflverse-data/releases/tag/stats_player
def write_weekly_stats(seasons: list[int], cache_dir: str = "./data") -> pd.DataFrame:
    os.makedirs(cache_dir, exist_ok=True)
    frames = []

    for szn in seasons:
        cache_path = f"{cache_dir}/stats_player_reg_{szn}.parquet"

        if os.path.exists(cache_path):
            print(f"Loading {szn} from cache...")
            df = pd.read_parquet(cache_path, engine="pyarrow")
        else:
            print(f"Downloading {szn}...")
            try:
                url = f"https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_reg_{szn}.parquet"
                df = pd.read_parquet(url, engine="pyarrow")
                df.to_parquet(cache_path, engine="pyarrow")
            except Exception as e:
                print(f"{szn} failed: {e}")
                continue

        frames.append(df)

    return pd.concat(frames, ignore_index=True)


# add new columns for rankings by position group
def return_positional_dfs(df: pd.DataFrame) -> dict:
    
    if df is None:
        return "There was no df uploaded"
    
    df["fantasy_points_hppr"] = (df["fantasy_points"] + df["fantasy_points_ppr"]) / 2
    df["hppr_points_per_game"] = df["fantasy_points_hppr"] / df["games"]

    position_dfs = []

    for pos in ["QB", "RB", "WR", "TE"]:
        pos_df = df[df["position"] == pos]

        pos_df["turnovers"] = pos_df["rushing_fumbles_lost"] + pos_df["receiving_fumbles_lost"] + pos_df["sack_fumbles_lost"] + pos_df["passing_interceptions"]
        pos_df["rank_ppg"] = pos_df["hppr_points_per_game"].rank(ascending=False, method="min")
        pos_df["rank_total"] = pos_df["fantasy_points_hppr"].rank(ascending=False, method="min")
        pos_df["position_tier"] = (pos_df["rank_ppg"] - 1) // 12 + 1

        position_dfs.append(pos_df)

    unified_positional_df = pd.concat(position_dfs, ignore_index=True)

    return unified_positional_df



if __name__ == "__main__":
    pass