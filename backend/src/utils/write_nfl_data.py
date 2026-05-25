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


if __name__ == "__main__":

    # spec_columns = [
    #     'player_name', 'player_display_name', 'position', 'season', 'recent_team', 
    #     'games', 'completions', 'attempts', 'passing_yards', 'passing_tds', 'passing_interceptions', 'sack_fumbles_lost', 'passing_epa',
    #     'passing_cpoe', 'pacr', 'carries', 'rushing_yards', 'rushing_tds', 'rushing_fumbles_lost', 'rushing_epa',
    #     'receptions', 'targets', 'receiving_yards', 'receiving_tds', 'receiving_fumbles_lost', 'receiving_epa',
    #     'racr', 'target_share', 'air_yards_share', 'wopr', 'fantasy_points', 'fantasy_points_ppr'
    #     ]
    
    write_weekly_stats([2023, 2024, 2025])