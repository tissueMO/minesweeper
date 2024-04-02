'use client';

import { css, cx } from '@/styled-system/css';

type Props = {
  value: number;
};

/**
 * 7セグメントデジタル数字 (1桁)
 */
export const Digit = ({ value = 0 }: Readonly<Props>) => {
  return (
    <div className={cx(styles.display, styles.digit[value])} />
  );
};

const SIZE_RATE = 0.5;
const FOREGROUND_COLOR = '#f00';
const BACKGROUND_COLOR = '#511';

const styles = {
  display: css({
    width: `${60 * SIZE_RATE}px`,
    height: `${100 * SIZE_RATE}px`,
    border: `solid ${4 * SIZE_RATE}px #111`,
    bgColor: '#111',
    boxSizing: 'border-box',
    position: 'relative',
    overflow: 'hidden',

    _before: {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: `${28 * SIZE_RATE}px`,
      height: `${28 * SIZE_RATE}px`,
      transform: 'translate(-50%, -50%) rotate(45deg)',
    },
    _after: {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: `${30 * SIZE_RATE}px`,
      height: `${72 * SIZE_RATE}px`,
      borderTop: `solid ${30 * SIZE_RATE}px #111`,
      borderBottom: `solid ${30 * SIZE_RATE}px #111`,
      transform: 'translate(-50%, -50%)',
    },
  }),

  digit: {
    0: css({
      _before: {
        bgColor: BACKGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
        ].join(','),
      },
    }),
    1: css({
      _before: {
        bgColor: BACKGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
        ].join(','),
      },
    }),
    2: css({
      _before: {
        bgColor: FOREGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
        ].join(','),
      },
    }),
    3: css({
      _before: {
        bgColor: FOREGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
        ].join(','),
      },
    }),
    4: css({
      _before: {
        bgColor: FOREGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
        ].join(','),
      },
    }),
    5: css({
      _before: {
        bgColor: FOREGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
        ].join(','),
      },
    }),
    6: css({
      _before: {
        bgColor: FOREGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
        ].join(','),
      },
    }),
    7: css({
      _before: {
        bgColor: BACKGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
        ].join(','),
      },
    }),
    8: css({
      _before: {
        bgColor: FOREGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
        ].join(','),
      },
    }),
    9: css({
      _before: {
        bgColor: FOREGROUND_COLOR,
        boxShadow: [
          `${-30 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${-30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${-30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${0 * SIZE_RATE}px ${30 * SIZE_RATE}px ${BACKGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${0 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
          `${30 * SIZE_RATE}px ${30 * SIZE_RATE}px ${FOREGROUND_COLOR}`,
        ].join(','),
      },
    }),
  } as Record<number, string>,
};
