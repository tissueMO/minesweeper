'use client';

import { NikoChanButton } from '@/components/buttons';
import { Digits } from '@/components/digits';
import { Logo } from '@/components/logo';
import { Panel } from '@/components/panel';
import { css, cx } from '@/styled-system/css';
import { border3d, center, flex } from '@/styled-system/patterns';
import { useRef, useState } from 'react';

type Level = {
  difficulity: number;
  sizeWidth: number;
  sizeHeight: number;
  mineCount: number;
};

const LEVELS: Record<string, Level> = {
  簡単: {
    difficulity: 0,
    sizeWidth: 9,
    sizeHeight: 9,
    mineCount: 10,
  },
  普通: {
    difficulity: 1,
    sizeWidth: 16,
    sizeHeight: 16,
    mineCount: 40,
  },
  難しい: {
    difficulity: 2,
    sizeWidth: 30,
    sizeHeight: 16,
    mineCount: 99,
  },
};

export default function Home() {
  const [timeSeconds, setTimeSeconds] = useState(0);
  const [selectedLevelDetail, setSelectedLevelDetail] = useState(LEVELS['簡単']);
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  const onStart = () => {
    console.log('START');
    setTimeSeconds(0);
    timer.current = setInterval(() => setTimeSeconds(timeSeconds + 1), 1000);
  };

  const onEnd = (cleared: boolean) => {
    console.log('END:', cleared);
    if (timer.current?.hasRef) {
      clearInterval(timer.current);
    }

    // TODO: ゲームの結果に応じてニコちゃんマークの表情を切り替える
    // emotion = cleared ? 'laugh-beam' : 'dizzy';
  };

  const onReset = () => {
    console.log('RESET');
  };

  return (
    <main className={mainStyle}>
      <div className={headerStyle}>
        <Logo />
        <span className={titleStyle}>マインスイーパー</span>
        <Logo />
      </div>

      <div className={controllersStyle}>
        <label htmlFor="level">難易度: </label>
        {/* TODO: 難易度コンボボックスのスタイル */}
        {/* TODO: レベル選択時に画面に反映 */}
        <select id="level">
          {Object.keys(LEVELS).map((name) => (
            <option value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className={center()}>
        <div className={panelWrapperStyle}>
          <div className={panelHeaderStyle}>
            <Digits value={selectedLevelDetail.mineCount} />
            <NikoChanButton size="3x" onClick={onReset} />
            <Digits value={timeSeconds} />
          </div>
          <Panel width={7} height={10} onStart={onStart} onEnd={onEnd} />
        </div>
      </div>
    </main>
  );
}

const mainStyle = flex({ direction: 'column' });

const titleStyle = css({ margin: '0 0.1rem', fontWeight: '900' });

const headerStyle = cx(
  center(),
  flex({ align: 'center' }),
  css({ fontSize: '3rem', marginBottom: '3rem', color: '#444' }),
);

const controllersStyle = cx(center(), css({ marginBottom: '2rem' }), flex({ align: 'center' }));

const panelWrapperStyle = cx(
  css({ padding: '12px' }),
  border3d({
    borderWidth: '8px',
    leftTopColor: '#eeeeee',
    rightBottomColor: '#808080',
    backgroundColor: 'lightgray',
  }),
);

const panelHeaderStyle = cx(
  flex({ wrap: 'nowrap' }),
  css({
    margin: '0 auto',
    marginBottom: '0.5rem',
    padding: '0.5rem 0.8rem',
  }),
  border3d({
    borderWidth: '4px',
    leftTopColor: '#808080',
    rightBottomColor: '#dfdfdf',
    backgroundColor: 'lightgray',
  }),
);
