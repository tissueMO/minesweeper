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
  onOpen?: () => void;
  onFlag?: () => void;
};

/**
 * マインスイーパー盤面上のタイル
 */
export function Tile({
  number = 0,
  hasMine = false,
  opened = false,
  flagged = false,
  frozen = false,
  onOpen,
  onFlag,
}: Readonly<Props>) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  const canOpen = !opened && !flagged && !frozen;
  const canFlag = !opened && !frozen;
  const badFlagged = opened && flagged && !hasMine;

  const open = () => {
    if (canOpen) {
      onOpen?.();
    }
  };
  const flag = () => {
    if (canFlag) {
      onFlag?.();
    }
  };

  // PC向け: 右クリックでフラグ切替
  const onMouseUp = (e: MouseEvent) => {
    if (e.button === 2 && !opened) {
      flag();
    }
  };

  // スマホ向け: 長押しタップでフラグ切替
  const onTouchStart = () => {
    timer.current = setTimeout(() => {
      flag();
      timer.current = null;
    }, 1000);
  };
  const onTouchEnd = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  // 数字以外のアイコン
  let icon = null;
  if (opened && hasMine) {
    // 地雷
    icon = (
      <FontAwesomeIcon
        icon={faBomb}
        size="xl"
        className={cx(styles.tileIcon, styles.mine, css({ color: 'black' }))}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  } else if (!opened && flagged) {
    // フラグ
    icon = (
      <FontAwesomeIcon
        icon={faFlag}
        size="xl"
        className={cx(styles.tileIcon, css({ color: 'red' }))}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  } else if (badFlagged) {
    // スカフラグ
    icon = (
      <FontAwesomeIcon
        icon={faTimes}
        size="xl"
        className={cx(styles.tileIcon, css({ color: 'red' }))}
        onContextMenu={(e) => e.preventDefault()}
      />
    );
  }

  return (
    <div className={[styles.tile, flagged || frozen ? 'disabled' : ''].join(' ')}>
      <label
        onClick={open}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onContextMenu={(e) => e.preventDefault()}
        className={[
          styles.label,
          flagged ? 'flagged' : '',
          opened ? 'opened' : '',
          opened && !hasMine ? `number-${number}` : '',
          opened && hasMine ? 'mine' : '',
          badFlagged ? 'flagged-bad' : '',
        ].join(' ')}
      >
        {icon}
      </label>
    </div>
  );
}

const BASE_SIZE = 32;

const numberStyleBase = {
  fontSize: `${BASE_SIZE - 8}px`,
  lineHeight: `${BASE_SIZE}px`,
  fontWeight: '900',
};

const styles = {
  tile: cx(
    button(),
    css({
      position: 'relative',
      userSelect: 'none',
    }),
  ),

  tileIcon: css({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) scale(1)',
    userSelect: 'none',
  }),

  mine: css({
    animation: 'bounceIn 0.5s',
  }),

  label: css({
    width: `${BASE_SIZE}px`,
    height: `${BASE_SIZE}px`,
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
          color: 'blue',
        },
      },
      '&.number-2:not(.flagged-bad)': {
        _after: {
          ...numberStyleBase,
          content: '"2"',
          color: 'green',
        },
      },
      '&.number-3:not(.flagged-bad)': {
        _after: {
          ...numberStyleBase,
          content: '"3"',
          color: 'red',
        },
      },
      '&.number-4:not(.flagged-bad)': {
        _after: {
          ...numberStyleBase,
          content: '"4"',
          color: 'darkblue',
        },
      },
      '&.number-5:not(.flagged-bad)': {
        _after: {
          ...numberStyleBase,
          content: '"5"',
          color: 'darkred',
        },
      },
      '&.number-6:not(.flagged-bad)': {
        _after: {
          ...numberStyleBase,
          content: '"6"',
          color: 'darkturquoise',
        },
      },
      '&.number-7:not(.flagged-bad)': {
        _after: {
          ...numberStyleBase,
          content: '"7"',
          color: 'black',
        },
      },
      '&.number-8:not(.flagged-bad)': {
        _after: {
          ...numberStyleBase,
          content: '"8"',
          color: 'dimgray',
        },
      },
    },
  }),
};
