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
  row: number;
  col: number;
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
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 盤面を初期化
  useEffect(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
    initTiles(width, height);
  }, [width, height, mines]);

  // 現在のオープン状態を保ちながら盤面を再シャッフル
  useEffect(() => {
    if (state === State.Playing) {
      changeTiles();
    }
  }, [retry]);

  // TODO: 関数コメント
  const start = (first: Tile) => {
    // 地雷を配置
    let counter = mines;
    while (counter > 0) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!tiles[y][x].hasMine && (first.col !== x || first.row !== y)) {
        tiles[y][x].hasMine = true;
        counter--;
      }
    }

    // 全タイルの数字を決定
    tiles.forEach((row, rowIndex) =>
      row.forEach((tile, colIndex) => {
        let number = 0;

        OFFSET_MATRIX.forEach((r, subRowIndex) =>
          r.forEach((c, subColIndex) => {
            const [tx, ty] = OFFSET_MATRIX[subRowIndex][subColIndex];
            if (
              colIndex + tx >= 0 &&
              width > colIndex + tx &&
              rowIndex + ty >= 0 &&
              height > rowIndex + ty &&
              tiles[rowIndex + ty][colIndex + tx].hasMine
            ) {
              number++;
            }
          }),
        );

        tile.number = number;
      }),
    );

    setState(State.Playing);
    onStart?.();
  };

  // TODO: 関数コメント
  const die = () => {
    setState(State.Dead);

    openMinesAndFlagsAll();

    onEnd?.(false);
  };

  // TODO: 関数コメント
  const complete = () => {
    setState(State.Completed);

    tiles
      .flat()
      .filter((t) => !t.opened)
      .forEach((t) => flag(t, true));

    onEnd?.(true);
  };

  // TODO: 関数コメント
  const open = (tile: Tile) => {
    if (frozen || tile.opened) {
      return;
    }

    if (state === State.Initialized) {
      start(tile);
    }

    openRecursive(tile);

    if (tile.hasMine) {
      die();
    } else if (remainingSafeTiles() === 0) {
      complete();
    }
  };

  // 指定されたタイルを再帰的に開く
  const openRecursive = (tile: Tile) => {
    if (tile.opened) {
      return;
    }

    // 指定されたタイルを開く
    tiles[tile.row][tile.col] = {
      ...tile,
      opened: true,
      flagged: false,
    };

    // 再帰的に周囲のタイルを開ける
    if (!tile.hasMine && tile.number === 0) {
      OFFSET_MATRIX.forEach((r, subRowIndex) =>
        r.forEach((_, subColIndex) => {
          const [tx, ty] = OFFSET_MATRIX[subRowIndex][subColIndex];
          if (tile.col + tx >= 0 && width > tile.col + tx && tile.row + ty >= 0 && height > tile.row + ty) {
            openRecursive(tiles[tile.row + ty][tile.col + tx]);
          }
        }),
      );
    }

    setTiles([...tiles]);
  };

  // TODO: 関数コメント
  const flag = (tile: Tile, value?: boolean) => {
    if (!frozen && !tile.opened) {
      setTiles((tiles) => {
        tiles[tile.row][tile.col] = {
          ...tile,
          flagged: value !== undefined ? value : !tile.flagged,
        };
        return [...tiles];
      });
    }
  };

  // すべての地雷タイルとフラグが立てられたタイルを開ける
  const openMinesAndFlagsAll = () => {
    // タイルの開ける順序をランダムにする
    const targets = tiles
      .flat()
      .filter((t) => t.hasMine || t.flagged)
      .toSorted(() => Math.random() - 0.5);

    // 徐々にアニメーションしながらタイルを開けていく
    targets.forEach((tile, i) => {
      timers.current.push(
        setTimeout(() => {
          setTiles((tiles) => {
            tiles[tile.row][tile.col] = {
              ...tile,
              opened: true,
            };
            return [...tiles];
          });
        }, 50 * (i + 1)),
      );
    });
  };

  // 画面上にまだ見えていない地雷なしタイルの個数
  const remainingSafeTiles = () => {
    return tiles.reduce((sum, tiles) => {
      return (
        sum +
        tiles.reduce((sum, tile) => {
          return sum + (!tile.opened && !tile.hasMine ? 1 : 0);
        }, 0)
      );
    }, 0);
  };

  // ゲームが終了したかどうか
  const isEnd = (state: State) => {
    return [State.Completed, State.Dead].includes(state);
  };

  // 空の盤面を生成
  const initTiles = (width: number, height: number) => {
    setTiles(
      [...Array(height)].map((_, rowIndex) =>
        [...Array(width)].map<Tile>((_, colIndex) => ({
          row: rowIndex,
          col: colIndex,
          flagged: false,
          badFlagged: false,
          opened: false,
          number: 0,
          hasMine: false,
        })),
      ),
    );
  };

  // 既に開いているタイルの数字を含めタイルの地雷配置を変更
  const changeTiles = () => {
    if (frozen) {
      return;
    }

    // 地雷とフラグをクリア
    tiles.forEach((row) =>
      row.forEach((tile) => {
        tile.hasMine = false;
        tile.flagged = false;
      }),
    );

    // 地雷を配置
    let counter = mines;
    while (counter > 0) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      if (!tiles[y][x].hasMine && !tiles[y][x].opened) {
        tiles[y][x].hasMine = true;
        counter--;
      }
    }

    // 全タイルの数字を決定
    tiles.forEach((row, rowIndex) =>
      row.forEach((tile, colIndex) => {
        let number = 0;

        OFFSET_MATRIX.forEach((r, subRowIndex) =>
          r.forEach((c, subColIndex) => {
            const [tx, ty] = OFFSET_MATRIX[subRowIndex][subColIndex];
            if (
              colIndex + tx >= 0 &&
              width > colIndex + tx &&
              rowIndex + ty >= 0 &&
              height > rowIndex + ty &&
              tiles[rowIndex + ty][colIndex + tx].hasMine
            ) {
              number++;
            }
          }),
        );

        tile.number = number;
      }),
    );

    setTiles([...tiles]);
  };

  return (
    <div className={panelStyle}>
      {tiles.map((row, rowIndex) => (
        <div key={rowIndex} className={rowStyle}>
          {row.map((tile, colIndex) => (
            <Tile
              key={colIndex}
              number={tile.number}
              hasMine={tile.hasMine}
              opened={tile.opened}
              flagged={tile.flagged}
              frozen={isEnd(state)}
              onOpen={() => open(tile)}
              onFlag={() => flag(tile)}
            />
          ))}
        </div>
      ))}
      <div className={flex({ direction: 'column' })}></div>
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
