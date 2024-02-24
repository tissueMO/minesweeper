'use client';

import { css, cx } from '@/styled-system/css';
import { button } from '@/styled-system/patterns';
import { MouseEvent, useRef, useState } from 'react';

type Props = {
  number: number;
  hasMine?: boolean;
  badFlagged?: boolean;
  frozen?: boolean;
  onFlag?: () => void;
  onOpen?: () => void;
};

/**
 * マインスイーパー盤面上のタイル
 */
export const Tile = ({ number = 0, hasMine = false, badFlagged = false, frozen = false, onFlag, onOpen }: Props) => {
  const [opened, setOpened] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  const canOpen = () => {
    return !opened && !flagged && !frozen;
  };
  const open = () => {
    if (canOpen()) {
      setOpened(true);
      onOpen?.();
    }
  };
  const flag = (e: MouseEvent | null) => {
    if (!e || e.button === 2) {
      setFlagged(true);
      onFlag?.();
    }
  };

  // スマホ向けに長押しタップに対応
  const onTouchStart = () => {
    timer.current = setTimeout(() => {
      flag(null);
      timer.current = null;
    }, 1000);
  };
  const onTouchEnd = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  return (
    <div className={tileStyle}>
      <input type="checkbox" disabled={!canOpen()} checked={opened} className={checkboxStyle} />
      <label
        onClick={open}
        onMouseUp={flag}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={labelStyle}
      />
      {/* TODO: 地雷: transition要素をどうするか */}
      {/* TODO: フラグ */}
      {/* TODO: スカフラグ */}
    </div>
  );
};

const tileStyle = cx(
  button(),
  css({
    position: 'relative',
    userSelect: 'none',

    '& .fa': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%) scale(1)',

      // 地雷爆発トランジション
      '&.transition-bomb': {
        '&-enter-active': {
          animation: 'bounceIn 0.5s',
        },
      },

      // 各種アイコンの色
      '&.fa-flag': {
        color: 'red',
      },
      '&.fa-bomb': {
        color: 'black',
      },
      '&.fa-times': {
        color: 'red',
      },
    },
  }),
);

const size = 32;

const numberStyleBase = {
  fontSize: `${size - 8}px`,
  lineHeight: size,
};

const checkboxStyle = css({
  display: 'none',
});

const labelStyle = css({
  width: `${size}px`,
  height: `${size}px`,
  display: 'block',
  textAlign: 'center',

  // 右クリック抑制
  userSelect: 'none',

  '&.opened': {
    background: 'lightgray',
    border: 'dotted 1px #333',
    boxSizing: 'border-box',

    '&.mine': {
      bgColor: 'red',

      '&.flagged': {
        bgColor: 'yellow',
      },
    },

    // 開けた後に見える数字
    '&.number-1:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '1',
        color: 'blue',
      },
    },
    '&.number-2:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '2',
        color: 'green',
      },
    },
    '&.number-3:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '3',
        color: 'red',
      },
    },
    '&.number-4:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '4',
        color: 'darkblue',
      },
    },
    '&.number-5:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '5',
        color: 'darkred',
      },
    },
    '&.number-6:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '6',
        color: 'darkturquoise',
      },
    },
    '&.number-7:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '7',
        color: 'black',
      },
    },
    '&.number-8:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '8',
        color: 'dimgray',
      },
    },
  },
});
