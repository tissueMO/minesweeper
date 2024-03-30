'use client';

import { css, cx } from '@/styled-system/css';
import { border3d, flex } from '@/styled-system/patterns';
import { State } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { Tile } from './tile';

type Props = {
  width: number;
  height: number;
  mines: number;
  frozen?: boolean;
  retry?: number;
  onStart?: () => void;
  onEnd?: (completed: boolean) => void;
};

type Tile = {
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
 * マインスイーパー盤面
 */
export function Tiles({
  width,
  height,
  mines,
  frozen = false,
  retry = 0,
  onStart = () => {},
  onEnd = () => {},
}: Readonly<Props>) {
  const [state, setState] = useState(State.Initialized);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const isEnded = [State.Completed, State.Dead].includes(state);

  const tile = (x: number, y: number, t = tiles) => t[x + y * width];
  const rows = [...Array(height)].map((_, y) => tiles.slice(y * width, (y + 1) * width));

  // 画面上にまだ見えていない地雷のないタイルの個数
  const remainingSafeTiles = tiles.reduce((sum, tile) => sum + (!tile.opened && !tile.hasMine ? 1 : 0), 0);

  // 盤面を初期化
  useEffect(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
    init(width, height);
  }, [width, height, mines]);

  // 現在のオープン状態を保ちながら盤面を再シャッフル
  useEffect(() => {
    if (state === State.Playing) {
      changeTiles();
    }
  }, [retry]);

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
    // 地雷を配置
    // TODO: 無駄なループなので効率化したい
    let count = mines;
    while (count > 0) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!tile(x, y).hasMine && (first.col !== x || first.row !== y)) {
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

    setState(State.Playing);
    onStart?.();
  };

  // ゲームオーバー
  const die = () => {
    setState(State.Dead);

    openMinesAndFlagsAll();

    onEnd?.(false);
  };

  // ゲームクリア
  const complete = () => {
    setState(State.Completed);

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

  // すべての地雷タイルとフラグが立てられたタイルを開ける ※ランダムな順序でアニメーションしながらタイルを開けていく
  const openMinesAndFlagsAll = () => {
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
  };

  // 既に開いているタイルの数字を含めタイルの地雷配置を変更
  const changeTiles = () => {
    if (frozen) {
      return;
    }

    // 地雷とフラグをクリア
    tiles.forEach((t) => {
      t.hasMine = false;
      t.flagged = false;
    });

    // TODO: start と重複してるのでまとめる
    // 地雷を配置
    let counter = mines;
    while (counter > 0) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!tile(x, y).hasMine && !tile(x, y).opened) {
        tile(x, y).hasMine = true;
        counter--;
      }
    }

    // TODO: start と重複してるのでまとめる
    // 全タイルの数字を決定
    tiles.forEach((t) => {
      let number = 0;

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
  };

  return (
    <div className={panelStyle}>
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className={rowStyle}>
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              number={tile.number}
              hasMine={tile.hasMine}
              opened={tile.opened}
              flagged={tile.flagged}
              frozen={isEnded}
              onOpen={() => open(tile)}
              onFlag={() => flag(tile)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

const panelStyle = border3d({
  borderWidth: '5px',
  leftTopColor: '#808080',
  rightBottomColor: '#dfdfdf',
  backgroundColor: '#d3d3d3',
});
const rowStyle = cx(
  flex({ direction: 'row' }),
  css({
    _first: {
      '& label': {
        borderTop: 'none',
      },
    },
    _last: {
      '& label': {
        borderBottom: 'none',
      },
    },
    '& div': {
      _first: {
        '& label': {
          borderLeft: 'none',
        },
      },
      _last: {
        '& label': {
          borderRight: 'none',
        },
      },
    },
  }),
);
