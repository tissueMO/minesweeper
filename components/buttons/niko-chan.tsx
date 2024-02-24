'use client';

import { css, cx } from '@/styled-system/css';
import { button, flex } from '@/styled-system/patterns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

type Props = {
  size: SizeProp;
  onClick: () => void;
};

/**
 * ニコちゃんボタン
 */
export const NikoChanButton = ({ size, onClick = () => {} }: Props) => {
  return (
    <div className={buttonStyle} onClick={onClick}>
      <div className={buttonInnerStyle}>
        <FontAwesomeIcon icon={faFaceSmile} size={size} className={iconStyle} />
      </div>
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
