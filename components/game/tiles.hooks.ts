import { State } from '@/types';
import { createArray, getRandomInt } from '@/utils';
import { useEffect, useRef, useState } from 'react';

type Props = {
  width: number;
  height: number;
  mines: number;
  frozen?: boolean;
  onStart?: () => void;
  onEnd?: (abort: boolean) => void;
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

  const isStarted = state !== State.Initialized;
  const isEnded = [State.Completed, State.Dead].includes(state);

  const tile = (x: number, y: number, t = tiles) => t[x + y * width];
  const canAction = (t: Tile) => !t.opened && !frozen;
  const getRemainingSafeCount = () => tiles
    .filter((t) => !t.opened && !t.hasMine)
    .length;

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
    const tiles = createArray(width * height)
      .map((_, i) => ({
        x: convertXY(i).x,
        y: convertXY(i).y,
        flagged: false,
        badFlagged: false,
        opened: false,
        number: 0,
        hasMine: false,
      }));

    setTiles(tiles);
    setState(State.Initialized);
  };

  // 最初のタイルをオープン
  const start = (first: Tile) => {
    // 最初のタイルが地雷とならないようにシャッフルする
    shuffle(first);

    setState(State.Playing);
    onStart?.();
  };

  // ゲームオーバー
  const die = () => {
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

    setState(State.Dead);
    onEnd?.(true);
  };

  // ゲームクリア
  const complete = () => {
    // 残ったタイルにフラグを付ける
    tiles
      .filter((t) => !t.opened)
      .forEach((t) => flag(t, true));

    setState(State.Completed);
    onEnd?.(false);
  };

  // タイルオープン
  const open = (t: Tile) => {
    if (canAction(t)) {
      // 初回判定
      if (state === State.Initialized) {
        start(t);
      }

      // タイルを開く
      openRecursive(t);

      // 終了判定
      if (t.hasMine) {
        die();
      } else if (getRemainingSafeCount() === 0) {
        complete();
      }
    }
  };

  // 指定されたタイルを再帰的に開く
  const openRecursive = (t: Tile) => {
    if (canAction(t)) {
      t.opened = true;
      t.flagged = false;

      // 周囲に地雷がなければさらに周囲のタイルを開く
      if (!t.hasMine && t.number === 0) {
        for (const aroundTile of aroundTiles(t)) {
          openRecursive(aroundTile);
        }
      }

      setTiles([...tiles]);
    }
  };

  // 指定されたタイルのフラグを切り替える
  const flag = (t: Tile, value?: boolean) => {
    if (canAction(t)) {
      t.flagged = value !== undefined ? value : !t.flagged;

      setTiles([...tiles]);
    }
  };

  // 既に開いているタイルの数字を含めタイルの地雷配置を変更  ※最初のタイルが地雷にならないようにする
  const shuffle = (first?: Tile) => {
    if (first || state === State.Playing) {
      // 地雷をクリア
      for (const t of tiles) {
        t.hasMine = false;
        t.flagged = false;
      }

      // 地雷を配置
      let count = mines;
      while (count > 0) {
        const { x, y } = convertXY(getRandomInt(width * height));
        const t = tile(x, y);
        const isFirst = first && first.x === x && first.y === y;

        if (!t.opened && !t.hasMine && !isFirst) {
          t.hasMine = true;
          count--;
        }
      }

      // すべてのタイルに数字を埋め込む
      for (const t of tiles) {
        t.number = aroundTiles(t)
          .filter((aroundTile) => aroundTile.hasMine)
          .length;
      }

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

    return OFFSETS
      // 周囲の座標に変換
      .map(([offsetX, offsetY]) => [t.x + offsetX, t.y + offsetY])
      // 範囲外の座標を除去
      .filter(([x, y]) => 0 <= x && x < width && 0 <= y && y < height)
      // 周囲のタイルを取得
      .map(([x, y]) => tile(x, y, tiles));
  };

  // 二次元座標に変換
  const convertXY = (i: number) => ({
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
