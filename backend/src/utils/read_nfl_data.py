import pandas as pd
import os

# load weekly stats - https://github.com/nflverse/nflverse-data/releases/tag/stats_player
def load_weekly_stats(seasons: list[int], cache_dir: str = "./data") -> pd.DataFrame:
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


# read file
def read_weekly_stats(season: int, columns: list[str], data_path: str = "./data"):

    path = f'{data_path}/stats_player_reg_{season}.parquet'

    if not os.path.exists(path):
        print(f"{season} is not valid.")

    df = pd.read_parquet(path)

    df["fantasy_points_hppr"] = (df['fantasy_points'] + df['fantasy_points_ppr']) / 2
    df["hppr_pts_per_game"] = df['fantasy_points_hppr'] / df['games']

    # print(df.columns.to_list())
    sorted_total = df.sort_values(by=['hppr_pts_per_game'], ascending=False)
    wr_fantasy_point_leaders = sorted[["player_display_name", "position", "fantasy_points_hppr", "hppr_pts_per_game"]].query("position == 'WR'")
    print(wr_fantasy_point_leaders.head(12))

if __name__ == "__main__":

    spec_columns = [
        'player_name', 'player_display_name', 'position', 'season', 'recent_team', 
        'games', 'completions', 'attempts', 'passing_yards', 'passing_tds', 'passing_interceptions', 'sack_fumbles_lost', 'passing_epa',
        'passing_cpoe', 'pacr', 'carries', 'rushing_yards', 'rushing_tds', 'rushing_fumbles_lost', 'rushing_epa',
        'receptions', 'targets', 'receiving_yards', 'receiving_tds', 'receiving_fumbles_lost', 'receiving_epa',
        'racr', 'target_share', 'air_yards_share', 'wopr', 'fantasy_points', 'fantasy_points_ppr'
        ]
    
    read_weekly_stats(2025, columns=spec_columns)