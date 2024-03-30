'use client';

import { css, cx } from '@/styled-system/css';
import { border3d, center, flex } from '@/styled-system/patterns';
import { Level, State } from '@/types';
import { useRef, useState } from 'react';
import { NikoChanButton } from '../buttons';
import { Digits } from '../digits/digits';
import { Tiles } from './tiles';

// 難易度マスター
const LEVELS: Level[] = [
  {
    caption: '簡単',
    width: 9,
    height: 9,
    mines: 10,
  },
  {
    caption: '普通',
    width: 16,
    height: 16,
    mines: 40,
  },
  {
    caption: '難しい',
    width: 30,
    height: 16,
    mines: 99,
  },
];

/**
 * マインスイーパー
 */
export function Game() {
  const [gameId, setGameId] = useState(new Date().getTime());
  const [selectedLevel, setSelectedLevel] = useState({ ...LEVELS[0] });
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState(State.Initialized);
  const [retry, setRetry] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  const isStarted = state !== State.Initialized;
  const isEnded = [State.Completed, State.Dead].includes(state);

  const emotion = {
    [State.Playing]: 'smile',
    [State.Initialized]: 'smile',
    [State.Completed]: 'laugh-beam',
    [State.Dead]: 'dizzy',
  }[state];

  const onStart = () => {
    setState(State.Playing);
    stop();
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const onEnd = (completed: boolean) => {
    setState(completed ? State.Completed : State.Dead);
    stop();
  };

  const onLevelChange = (index: number) => {
    setSelectedLevel({ ...LEVELS[index] });
    reset();
  };

  const onShuffle = () => {
    if (state === State.Playing) {
      setRetry((prev) => prev + 1);
    }
  };

  const stop = () => {
    clearInterval(timer?.current ?? undefined);
    timer.current = null;
  };

  const reset = () => {
    setState(State.Initialized);
    setSeconds(0);
    setRetry(0);
    stop();

    // 盤面リセット
    setGameId(new Date().getTime());
  };

  return (
    <div className={wrapperStyle}>
      <div className={controllersStyle}>
        <label className={labelStyle}>難易度:</label>
        {!isStarted ? (
          // ゲーム開始前までは難易度変更OK
          <select className={comboBoxStyle} onChange={(e) => onLevelChange(Number.parseInt(e.target.value))}>
            {Object.entries(LEVELS).map(([index, { caption }]) => (
              <option key={index} value={index}>
                {caption}
              </option>
            ))}
          </select>
        ) : (
          // ゲーム開始後は難易度変更NG
          <span>{selectedLevel.caption}</span>
        )}
      </div>

      <div className={center()}>
        <div className={panelWrapperStyle}>
          <div className={panelHeaderStyle}>
            <Digits value={selectedLevel.mines} />
            <NikoChanButton emotion={emotion} size="3x" onClick={onShuffle} className={isEnded ? 'disabled' : ''} />
            <Digits value={seconds} />
          </div>
          <Tiles
            key={gameId}
            width={selectedLevel.width}
            height={selectedLevel.height}
            mines={selectedLevel.mines}
            retry={retry}
            onStart={onStart}
            onEnd={onEnd}
          />
        </div>
      </div>
    </div>
  );
}

const wrapperStyle = css({ margin: '2rem' });
const labelStyle = css({ marginRight: '0.5rem' });
const comboBoxStyle = css({
  width: '5rem',
  fontSize: '85%',
  borderWidth: '1px',
  borderColor: 'rgb(118, 118, 118)',
});
const controllersStyle = cx(center(), css({ marginBottom: '1rem' }), flex({ align: 'center' }));
const panelWrapperStyle = cx(
  flex({ direction: 'column', justifyContent: 'center' }),
  css({ padding: '12px' }),
  border3d({
    borderWidth: '8px',
    leftTopColor: '#eeeeee',
    rightBottomColor: '#808080',
    backgroundColor: 'lightgray',
  }),
);
const panelHeaderStyle = cx(
  flex({ wrap: 'nowrap', alignItems: 'center' }),
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
