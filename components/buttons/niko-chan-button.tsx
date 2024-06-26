'use client';

import { css, cx } from '@/styled-system/css';
import { button, flex } from '@/styled-system/patterns';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { faFaceDizzy, faFaceLaughBeam, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  className?: string;
  size?: SizeProp;
  emotion: string;
  onClick: () => void;
};

/**
 * ニコちゃんボタン
 */
export function NikoChanButton({ className, emotion, size, onClick = () => {} }: Readonly<Props>) {
  const icon = {
    dizzy: faFaceDizzy,
    'laugh-beam': faFaceLaughBeam,
  }[emotion] ?? faFaceSmile;

  return (
    <button className={cx(styles.button, className)} onClick={onClick}>
      <span className={styles.buttonInner}>
        <FontAwesomeIcon icon={icon} size={size} className={styles.icon} />
      </span>
    </button>
  );
}

const styles = {
  button: cx(
    button(),
    css({
      minWidth: '0',
      minHeight: '0',
      padding: '0.25rem',
      margin: '0 0.5rem',
    }),
  ),

  buttonInner: cx(
    flex({
      justifyContent: 'center',
      alignItems: 'center',
    }),
    css({
      margin: '0 auto',
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      position: 'relative',
      bgColor: '#000',
    }),
  ),

  icon: css({
    width: '2.9rem',
    height: '2.9rem',
    margin: '0',
    color: 'yellow',
  }),
};
