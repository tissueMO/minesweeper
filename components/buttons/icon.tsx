'use client';

import { css, cx } from '@/styled-system/css';
import { button } from '@/styled-system/patterns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core';

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
    <div className={buttonStyle} onClick={onClick}>
      <FontAwesomeIcon icon={icon} size={size} className={iconStyle} />
    </div>
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

const iconStyle = css({
  width: '3.1rem',
  height: '3.1rem',
  margin: '0',
  color: '#333',
});
