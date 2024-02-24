'use client';

import { css, cx } from '@/styled-system/css';

type Props = {
  /**
   * 値
   */
  value: number;
};

/**
 * 7セグメントデジタル数字 (1桁)
 */
export const Digit = ({ value = 0 }: Props) => {
  return (
    <div>
      <div className={cx(displayStyle, digitStyles[value])}></div>
    </div>
  );
};

const size = 0.5;
const color = '#f00';
const backColor = '#511';

const displayStyle = css({
  width: `${60 * size}px`,
  height: `${100 * size}px`,
  border: `solid ${4 * size}px #111`,
  bgColor: '#111',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',

  _before: {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${28 * size}px`,
    height: `${28 * size}px`,
    transform: 'translate(-50%, -50%) rotate(45deg)',
  },

  _after: {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${30 * size}px`,
    height: `${72 * size}px`,
    borderTop: `solid ${30 * size}px #111`,
    borderBottom: `solid ${30 * size}px #111`,
    transform: 'translate(-50%, -50%)',
  },
});

const digitStyles: Record<number, string> = {
  0: css({
    _before: {
      bgColor: backColor,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${color}`,
        `${0 * size}px ${30 * size}px ${color}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${color}`,
      ].join(','),
    },
  }),
  1: css({
    _before: {
      bgColor: backColor,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${backColor}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${backColor}`,
        `${0 * size}px ${30 * size}px ${backColor}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${backColor}`,
      ].join(','),
    },
  }),
  2: css({
    _before: {
      bgColor: color,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${backColor}`,
        `${0 * size}px ${30 * size}px ${color}`,
        `${30 * size}px ${0 * size}px ${backColor}`,
        `${30 * size}px ${30 * size}px ${color}`,
      ].join(','),
    },
  }),
  3: css({
    _before: {
      bgColor: color,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${backColor}`,
        `${0 * size}px ${30 * size}px ${backColor}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${color}`,
      ].join(','),
    },
  }),
  4: css({
    _before: {
      bgColor: color,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${backColor}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${color}`,
        `${0 * size}px ${30 * size}px ${backColor}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${backColor}`,
      ].join(','),
    },
  }),
  5: css({
    _before: {
      bgColor: color,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${backColor}`,
        `${-30 * size}px ${0 * size}px ${color}`,
        `${0 * size}px ${30 * size}px ${backColor}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${color}`,
      ].join(','),
    },
  }),
  6: css({
    _before: {
      bgColor: color,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${backColor}`,
        `${-30 * size}px ${0 * size}px ${color}`,
        `${0 * size}px ${30 * size}px ${color}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${color}`,
      ].join(','),
    },
  }),
  7: css({
    _before: {
      bgColor: backColor,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${color}`,
        `${0 * size}px ${30 * size}px ${backColor}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${backColor}`,
      ].join(','),
    },
  }),
  8: css({
    _before: {
      bgColor: color,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${color}`,
        `${0 * size}px ${30 * size}px ${color}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${color}`,
      ].join(','),
    },
  }),
  9: css({
    _before: {
      bgColor: color,
      boxShadow: [
        `${-30 * size}px ${-30 * size}px ${color}`,
        `${0 * size}px ${-30 * size}px ${color}`,
        `${-30 * size}px ${0 * size}px ${color}`,
        `${0 * size}px ${30 * size}px ${backColor}`,
        `${30 * size}px ${0 * size}px ${color}`,
        `${30 * size}px ${30 * size}px ${color}`,
      ].join(','),
    },
  }),
};
