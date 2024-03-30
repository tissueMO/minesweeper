import { State } from '@/types';
import { useEffect, useRef, useState } from 'react';

type Props = {
  width: number;
  height: number;
  mines: number;
  frozen?: boolean;
  onStart?: () => void;
  onEnd?: (completed: boolean) => void;
};

export type Tile = {
  col: number;
  row: number;
  flagged: boolean;
  badFlagged: boolean;
  opened: boolean;
  number: number;
  hasMine: boolean;
};

// 周囲8タイルを数えるためのオフセット用行列
const OFFSET_MATRIX = [
  [
    [-1, -1],
    [0, -1],
    [1, -1],
  ],
  [
    [-1, 0],
    [1, 0],
  ],
  [
    [-1, 1],
    [0, 1],
    [1, 1],
  ],
];

/**
 * マインスイーパー
 */
export function useMinesweeper({
  width,
  height,
  mines,
  frozen = false,
  onStart = () => {},
  onEnd = () => {},
}: Readonly<Props>) {
  const [state, setState] = useState(State.Initialized);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const tile = (x: number, y: number, t = tiles) => t[x + y * width];

  const isStarted = state !== State.Initialized;
  const isEnded = [State.Completed, State.Dead].includes(state);

  // 画面上にまだ見えていない地雷のないタイルの個数
  const remainingSafeTiles = tiles.reduce((sum, tile) => sum + (!tile.opened && !tile.hasMine ? 1 : 0), 0);

  // 盤面を初期化
  useEffect(() => {
    init(width, height);

    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
      timers.current = [];
    };
  }, [width, height, mines]);

  // 空の盤面を生成
  const init = (width: number, height: number) => {
    setTiles(
      [...Array(width * height)].map((_, i) => ({
        col: i % width,
        row: Math.floor(i / width),
        flagged: false,
        badFlagged: false,
        opened: false,
        number: 0,
        hasMine: false,
      })),
    );
  };

  // 最初のタイルをオープン
  const start = (first: Tile) => {
    shuffle(first);
    setState(State.Playing);
    onStart?.();
  };

  // ゲームオーバー
  const die = () => {
    setState(State.Dead);

    // ランダムな順序でアニメーションしながら地雷タイルとフラグ付きタイルを開けていく
    tiles
      .filter((t) => t.hasMine || t.flagged)
      .toSorted(() => Math.random() - 0.5)
      .forEach((t, i) => {
        timers.current.push(
          setTimeout(() => {
            setTiles((tiles) => {
              tile(t.col, t.row, tiles).opened = true;
              return [...tiles];
            });
          }, 50 * (i + 1)),
        );
      });

    onEnd?.(false);
  };

  // ゲームクリア
  const complete = () => {
    setState(State.Completed);

    // 残ったタイルにフラグを付ける
    tiles.filter((t) => !t.opened).forEach((t) => flag(t, true));

    onEnd?.(true);
  };

  // タイルオープン
  const open = (t: Tile) => {
    if (!t.opened && !frozen) {
      if (state === State.Initialized) {
        start(t);
      }

      openRecursive(t);

      if (t.hasMine) {
        die();
      } else if (remainingSafeTiles === 0) {
        complete();
      }
    }
  };

  // 指定されたタイルを再帰的に開く
  const openRecursive = (t: Tile) => {
    if (!t.opened) {
      // タイルを開く
      t.opened = true;
      t.flagged = false;

      // 再帰的に周囲のタイルを開く
      if (!t.hasMine && t.number === 0) {
        // TODO: わかりにくいのでなんとかしたい、やりたいのは要するに8方向を見ることだけ
        OFFSET_MATRIX.forEach((r, subRowIndex) =>
          r.forEach((_, subColIndex) => {
            const [tx, ty] = OFFSET_MATRIX[subRowIndex][subColIndex];
            if (t.col + tx >= 0 && width > t.col + tx && t.row + ty >= 0 && height > t.row + ty) {
              openRecursive(tile(t.col + tx, t.row + ty));
            }
          }),
        );
      }

      setTiles([...tiles]);
    }
  };

  // 指定されたタイルのフラグを切り替える
  const flag = (t: Tile, value?: boolean) => {
    if (!frozen && !t.opened) {
      t.flagged = value !== undefined ? value : !t.flagged;
      setTiles([...tiles]);
    }
  };

  // 既に開いているタイルの数字を含めタイルの地雷配置を変更
  const shuffle = (first?: Tile) => {
    if (first || isStarted) {
      // 地雷とフラグをクリア
      tiles.forEach((t) => {
        t.hasMine = false;
        t.flagged = false;
      });

      // 地雷を配置
      // TODO: 無駄なループなので効率化したい
      let count = mines;
      while (count > 0) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);

        if (!tile(x, y).hasMine && !tile(x, y).opened && (!first || first.col !== x || first.row !== y)) {
          tile(x, y).hasMine = true;
          count--;
        }
      }

      // 全タイルの数字を決定
      tiles.forEach((t) => {
        let number = 0;

        // TODO: わかりにくいのでなんとかしたい、やりたいのは要するに8方向を見ることだけ
        OFFSET_MATRIX.forEach((r, subRowIndex) =>
          r.forEach((c, subColIndex) => {
            const [tx, ty] = OFFSET_MATRIX[subRowIndex][subColIndex];
            if (
              t.col + tx >= 0 &&
              width > t.col + tx &&
              t.row + ty >= 0 &&
              height > t.row + ty &&
              tile(t.col + tx, t.row + ty).hasMine
            ) {
              number++;
            }
          }),
        );

        t.number = number;
      });

      setTiles([...tiles]);
    }
  };

  const minesweeper = {
    tiles,
    isStarted,
    isEnded,
    open,
    flag,
    shuffle,
  };

  return minesweeper;
}
