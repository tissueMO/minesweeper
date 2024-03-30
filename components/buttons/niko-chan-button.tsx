'use client';

import { css, cx } from '@/styled-system/css';
import { button, flex } from '@/styled-system/patterns';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faFaceDizzy, faFaceLaughBeam, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  className?: string;
  emotion: string;
  size: SizeProp;
  onClick: () => void;
};

/**
 * ニコちゃんボタン
 */
export function NikoChanButton({ className, emotion, size, onClick = () => {} }: Readonly<Props>) {
  const icon =
    {
      dizzy: faFaceDizzy,
      'laugh-beam': faFaceLaughBeam,
    }[emotion] ?? faFaceSmile;

  return (
    <button className={cx(buttonStyle, className)} onClick={onClick}>
      <span className={buttonInnerStyle}>
        <FontAwesomeIcon icon={icon} size={size} className={iconStyle} />
      </span>
    </button>
  );
}

const buttonStyle = cx(
  button(),
  css({
    minWidth: '0',
    minHeight: '0',
    padding: '0.25rem',
    margin: '0 0.5rem',
  }),
);
const buttonInnerStyle = cx(
  flex({ justifyContent: 'center', alignItems: 'center' }),
  css({
    margin: '0 auto',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    position: 'relative',
    bgColor: '#000',
  }),
);
const iconStyle = css({
  width: '2.9rem',
  height: '2.9rem',
  margin: '0',
  color: 'yellow',
});
