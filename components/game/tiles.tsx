'use client';

import { css, cx } from '@/styled-system/css';
import { border3d, flex } from '@/styled-system/patterns';
import { useEffect } from 'react';
import { Tile } from './tile';
import { useMinesweeper } from './tiles.hooks';

type Props = {
  width: number;
  height: number;
  mines: number;
  frozen?: boolean;
  retry?: number;
  onStart?: () => void;
  onEnd?: (completed: boolean) => void;
};

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
  const minesweeper = useMinesweeper({ width, height, mines, frozen, onStart, onEnd });

  const rows = [...Array(height)].map((_, y) => minesweeper.tiles.slice(y * width, (y + 1) * width));

  // ゲーム中の強制シャッフル
  useEffect(() => {
    minesweeper.shuffle();
  }, [retry]);

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
              frozen={minesweeper.isEnded}
              onOpen={() => minesweeper.open(tile)}
              onFlag={() => minesweeper.flag(tile)}
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
