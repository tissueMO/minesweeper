'use client';

import { flex } from '@/styled-system/patterns';
import { useEffect, useState } from 'react';
import { Tile } from '../tile/tile';

type Props = {
  width?: number;
  height?: number;
  mines?: number;
};

/**
 * マインスイーパー盤面
 */
export const Panel = ({ width = 7, height = 9, mines = 10 }: Props) => {
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

  const [tiles, setTiles] = useState<Record<string, any>[][]>([]);
  const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[]>([]);

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
        [...Array(width)].map((_, colIndex) => ({
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
    console.log(tiles);
  };

  return (
    <div>
      {tiles.map((row) => (
        <div className={flex({ direction: 'row' })}>
          {row.map((col) => (
            <Tile number={col.number} hasMine={col.hasMine} />
          ))}
        </div>
      ))}
      <div className={flex({ direction: 'column' })}></div>
    </div>
  );
};
