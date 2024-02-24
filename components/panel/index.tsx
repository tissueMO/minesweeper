'use client';

import { flex } from '@/styled-system/patterns';
import { useEffect, useState } from 'react';
import { Tile } from './tile';

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
  width?: number;
  height?: number;
  mines?: number;
  frozen?: boolean;
  onStart?: () => void;
  onEnd?: (cleared: boolean) => void;
};

/**
 * マインスイーパー盤面
 */
export const Panel = ({
  width = 7,
  height = 9,
  mines = 10,
  frozen = false,
  onStart = () => {},
  onEnd = (cleared) => {},
}: Props) => {
  // 周囲8タイルを数えるのに使うオフセット用行列
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

  const [started, setStarted] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [dead, setDead] = useState(false);
  const [tiles, setTiles] = useState<Tile[][]>([]);
  const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[]>([]);

  const start = () => {
    // this.startGame();
    // this.putMines(row, col);
    // this.applyNumbers();

    setStarted(true);
    onStart?.();
  };

  const open = (tile: Tile) => {
    if (frozen || tile.opened) {
      return;
    }

    // ゲームスタート
    if (!started) {
      start();
    }

    // TODO: タイルオープン
    // openRecursive(tile);

    // TODO: ゲームオーバー
    if (tile.hasMine) {
      // this.gameOver();
      // this.openMinesAndFlagsAll();
      onEnd?.(false);
      return;
    }

    // TODO: ゲームクリア
    if (safeCountOfRemaining() === 0) {
      // this.closedTiles.forEach((tile) => that.flag([tile.row, tile.col, true]));
      // this.clearGame();
      onEnd?.(true);
      return;
    }
  };

  /**
   * 画面上にまだ見えていない地雷ではないタイルの個数
   */
  const safeCountOfRemaining = () => {
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
   * 盤面を初期化します。
   */
  useEffect(() => {
    timers.forEach((timer) => clearTimeout(timer));
    setTimers([]);
    initTiles(width, height);
  }, []);

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

  return (
    <div>
      {tiles.map((row) => (
        <div className={flex({ direction: 'row' })}>
          {row.map((tile) => (
            <Tile number={tile.number} hasMine={tile.hasMine} onOpen={() => open(tile)} />
          ))}
        </div>
      ))}
      <div className={flex({ direction: 'column' })}></div>
    </div>
  );
};
