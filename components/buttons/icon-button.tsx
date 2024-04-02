'use client';

import { css, cx } from '@/styled-system/css';
import { button } from '@/styled-system/patterns';
import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  className?: string;
  size?: SizeProp;
  icon: IconDefinition;
  onClick?: () => void;
};

/**
 * アイコンボタン
 */
export function IconButton({ className, icon, size, onClick = () => {} }: Readonly<Props>) {
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
      width: '3.5rem',
      height: '3.5rem',
    }),
  ),

  buttonInner: css({
    position: 'relative',
  }),

  icon: css({
    width: '3.1rem',
    height: '3.1rem',
    margin: '0',
    color: '#444',
  }),
};
