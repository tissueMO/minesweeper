'use client';

import { border3d, flex } from '@/styled-system/patterns';
import { useEffect, useState } from 'react';
import { css, cx } from '@/styled-system/css';
import { Tile } from './tile';
import { State } from '@/types';

/**
 * 周囲8タイルを数えるためのオフセット用行列
 */
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

type Tile = {
  row: number;
  col: number;
  flagged: boolean;
  badFlagged: boolean;
  opened: boolean;
  number: number;
  hasMine: boolean;
};

type Props = {
  width: number;
  height: number;
  mines: number;
  frozen?: boolean;
  onStart?: () => void;
  onEnd?: (completed: boolean) => void;
};

/**
 * マインスイーパー盤面
 */
export const Panel = ({ width, height, mines, frozen = false, onStart = () => {}, onEnd = () => {} }: Props) => {
  const [state, setState] = useState(State.Initialized);
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[]>([]);

  const start = (first: Tile) => {
    console.log('Panel.start');

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

  const die = () => {
    setState(State.Dead);

    openMinesAndFlagsAll();

    onEnd?.(false);
  };

  const complete = () => {
    setState(State.Completed);

    tiles
      .flat()
      .filter((t) => !t.opened)
      .forEach((t) => flag(t, true));

    onEnd?.(true);
  };

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

  /**
   * 指定されたタイルを開き、その周囲8タイルのうち数字が 0 であるタイルを再帰的に開きます。
   */
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

  /**
   * すべての地雷タイルとフラグが立てられたタイルを開けます。
   */
  const openMinesAndFlagsAll = () => {
    // タイルの開ける順序をランダムにする
    const targets = tiles
      .flat()
      .filter((t) => t.hasMine || t.flagged)
      .toSorted(() => Math.random() - 0.5);

    // 徐々にアニメーションしながらタイルを開けていく
    targets.forEach((tile, i) => {
      timers.push(
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

  /**
   * 画面上にまだ見えていない地雷なしタイルの個数
   */
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

  /**
   * ゲームが終了したかどうかを返します。
   */
  const isEnd = (state: State) => {
    return [State.Completed, State.Dead].includes(state);
  };

  /**
   * 空の盤面を生成します。
   * @param width
   * @param height
   */
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

  /**
   * 盤面を初期化します。
   */
  useEffect(() => {
    console.log('Refresh Panel:', { width, height });
    timers.forEach((timer) => clearTimeout(timer));
    setTimers([]);
    initTiles(width, height);
  }, [width, height, mines]);

  return (
    <div className={panelStyle}>
      {tiles.map((row) => (
        <div className={rowStyle}>
          {row.map((tile) => (
            <Tile
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
};

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
