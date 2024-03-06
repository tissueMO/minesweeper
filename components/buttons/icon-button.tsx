'use client';

import { css, cx } from '@/styled-system/css';
import { button } from '@/styled-system/patterns';
import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  icon: IconDefinition;
  size?: SizeProp;
  onClick?: () => void;
};

/**
 * アイコンボタン
 */
export const IconButton = ({ icon, size, onClick = () => {} }: Props) => {
  return (
    <button className={buttonStyle} onClick={onClick}>
      <span className={buttoninnerStyle}>
        <FontAwesomeIcon icon={icon} size={size} className={iconStyle} />
      </span>
    </button>
  );
};

const buttonStyle = cx(
  button(),
  css({
    minWidth: '0',
    minHeight: '0',
    padding: '0.25rem',
    margin: '0 0.5rem',
    width: '3.5rem',
    height: '3.5rem',
  }),
);

const buttoninnerStyle = css({
  position: 'relative',
});

const iconStyle = css({
  width: '3.1rem',
  height: '3.1rem',
  margin: '0',
  color: '#444',
});
