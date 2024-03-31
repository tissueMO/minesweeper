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

type Tile = {
  x: Readonly<number>;
  y: Readonly<number>;
  flagged: boolean;
  badFlagged: boolean;
  opened: boolean;
  number: number;
  hasMine: boolean;
};

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
  const remainingSafeTiles = tiles.filter((t) => !t.opened && !t.hasMine).length;

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
        x: convertXY(i).x,
        y: convertXY(i).y,
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
    setState(State.Playing);

    // 最初のタイルが地雷とならないようにシャッフルする
    shuffle(first);

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
              tile(t.x, t.y, tiles).opened = true;
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
        aroundTiles(t).forEach((arroundTile) => openRecursive(arroundTile));
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
      tiles.forEach((t) => {
        t.hasMine = false;
        t.flagged = false;
      });

      // 地雷を配置
      let count = mines;
      while (count > 0) {
        const { x, y } = convertXY(Math.floor(Math.random() * width * height));

        if (!tile(x, y).hasMine && !tile(x, y).opened && (!first || first.x !== x || first.y !== y)) {
          tile(x, y).hasMine = true;
          count--;
        }
      }

      // すべてのタイルに数字を埋め込む
      tiles.forEach((t) => {
        t.number = aroundTiles(t).filter((arroundTile) => arroundTile.hasMine).length;
      });

      setTiles([...tiles]);
    }
  };

  // 周囲のタイルを取得
  const aroundTiles = (t: Tile) => {
    const OFFSETS = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    return OFFSETS.map(([offsetX, offsetY]) => [t.x + offsetX, t.y + offsetY])
      .filter(([x, y]) => 0 <= x && x < width && 0 <= y && y < height)
      .map(([x, y]) => tile(x, y, tiles));
  };

  // 二次元座標に変換
  const convertXY = (i: number) =>
    ({
      x: i % width,
      y: Math.floor(i / width),
    } as const);

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
