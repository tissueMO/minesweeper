'use client';

import { border3d, flex } from '@/styled-system/patterns';
import { useEffect, useState } from 'react';
import { Tile } from './tile';
import { css } from '@/styled-system/css';

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
  onEnd?: (cleared: boolean) => void;
};

/**
 * マインスイーパー盤面
 */
export const Panel = ({ width, height, mines, frozen = false, onStart = () => {}, onEnd = (cleared) => {} }: Props) => {
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
    console.log('Panel.start');
    setStarted(true);
    onStart?.();
  };

  const end = (cleared: boolean) => {
    if (cleared) {
      // ゲームクリア
      setCleared(true);

      // this.closedTiles.forEach((tile) => that.flag([tile.row, tile.col, true]));
      // this.clearGame();
    } else {
      // ゲームオーバー
      setDead(true);

      // this.gameOver();
      // this.openMinesAndFlagsAll();
    }

    onEnd?.(cleared);
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

    // ゲーム終了
    if (tile.hasMine) {
      end(false);
    } else if (remainingSafeTiles() === 0) {
      end(true);
    }
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

const panelStyle = border3d({
  borderWidth: '5px',
  leftTopColor: '#808080',
  rightBottomColor: '#dfdfdf',
  backgroundColor: '#d3d3d3',
});
