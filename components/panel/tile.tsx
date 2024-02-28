'use client';

import { css, cx } from '@/styled-system/css';
import { button } from '@/styled-system/patterns';
import { faBomb, faFlag, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEvent, useRef } from 'react';

type Props = {
  number: number;
  hasMine?: boolean;
  opened?: boolean;
  flagged?: boolean;
  frozen?: boolean;
  onFlag?: () => void;
  onOpen?: () => void;
};

/**
 * マインスイーパー盤面上のタイル
 */
export const Tile = ({
  number = 0,
  hasMine = false,
  opened = false,
  flagged = false,
  frozen = false,
  onFlag,
  onOpen,
}: Props) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  const canOpen = () => !opened && !flagged && !frozen;
  const canFlag = () => !opened && !frozen;
  const badFlagged = () => opened && flagged && !hasMine;

  const open = () => {
    if (canOpen()) {
      onOpen?.();
    }
  };
  const flag = (e: MouseEvent | null) => {
    if (canFlag() && (!e || e.button === 2)) {
      onFlag?.();
    }
  };

  // スマホ向け: 長押しタップでフラグ切り替え
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
    <div className={[tileStyle, flagged || frozen ? 'disabled' : ''].join(' ')}>
      <label
        onClick={open}
        onMouseUp={flag}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={[
          labelStyle,
          flagged ? 'flagged' : '',
          opened ? 'opened' : '',
          opened && !hasMine ? `number-${number}` : '',
          opened && hasMine ? 'mine' : '',
          badFlagged() ? 'flagged-bad' : '',
        ].join(' ')}
      >
        {
          /* 地雷 */
          opened && hasMine ? (
            <FontAwesomeIcon
              icon={faBomb}
              size="xl"
              className={cx(tileIconStyle, mineTransition, css({ color: 'black' }))}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : null
        }
        {
          /* フラグ */
          !opened && flagged ? (
            <FontAwesomeIcon
              icon={faFlag}
              size="xl"
              className={cx(tileIconStyle, css({ color: 'red' }))}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : null
        }
        {
          /* スカフラグ */
          badFlagged() ? (
            <FontAwesomeIcon
              icon={faTimes}
              size="xl"
              className={cx(tileIconStyle, css({ color: 'red' }))}
              onContextMenu={(e) => e.preventDefault()}
            />
          ) : null
        }
      </label>
    </div>
  );
};

const tileStyle = cx(
  button(),
  css({
    position: 'relative',
    userSelect: 'none',
  }),
);

const tileIconStyle = css({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) scale(1)',
  userSelect: 'none',
});

const mineTransition = css({
  animation: 'bounceIn 0.5s',
});

const size = 32;
const numberColorMap: Record<number, string> = {
  1: 'blue',
  2: 'green',
  3: 'red',
  4: 'darkblue',
  5: 'darkred',
  6: 'darkturquoise',
  7: 'black',
  8: 'dimgray',
};

const numberStyleBase = {
  fontSize: `${size - 8}px`,
  lineHeight: `${size}px`,
  fontWeight: '900',
};

const labelStyle = css({
  width: `${size}px`,
  height: `${size}px`,
  display: 'block',
  textAlign: 'center',
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

    '&.number-1:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"1"',
        color: numberColorMap[1],
      },
    },
    '&.number-2:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"2"',
        color: numberColorMap[2],
      },
    },
    '&.number-3:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"3"',
        color: numberColorMap[3],
      },
    },
    '&.number-4:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"4"',
        color: numberColorMap[4],
      },
    },
    '&.number-5:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"5"',
        color: numberColorMap[5],
      },
    },
    '&.number-6:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"6"',
        color: numberColorMap[6],
      },
    },
    '&.number-7:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"7"',
        color: numberColorMap[7],
      },
    },
    '&.number-8:not(.flagged-bad)': {
      _after: {
        ...numberStyleBase,
        content: '"8"',
        color: numberColorMap[8],
      },
    },
  },
});
