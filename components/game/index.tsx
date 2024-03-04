'use client';

import { border3d, center, flex } from '@/styled-system/patterns';
import { useRef, useState } from 'react';
import { Level, State } from '@/types';
import { css, cx } from '@/styled-system/css';
import { Digits } from '../digits';
import { NikoChanButton } from '../buttons';
import { Panel } from './panel';

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

type Props = {};

/**
 * マインスイーパー
 */
export const Game = ({}: Props) => {
  const [gameId, setGameId] = useState(new Date().getTime());
  const [selectedLevel, setSelectedLevel] = useState({ ...LEVELS[0] });
  const [seconds, setSeconds] = useState(0);
  const [state, setState] = useState(State.Initialized);
  const timer = useRef<ReturnType<typeof setTimeout> | null>();

  /**
   * (イベント) ゲーム開始
   */
  const onStart = () => {
    setState(State.Playing);
    stopTimer();

    setSeconds(0);
    timer.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  /**
   * (イベント) ゲーム終了
   */
  const onEnd = (completed: boolean) => {
    setState(completed ? State.Completed : State.Dead);
    stopTimer();
  };

  /**
   * (イベント) ゲームリセット
   */
  const onReset = () => {
    resetGame();
  };

  /**
   * (イベント) ゲーム難易度変更
   */
  const onLevelSelect = (index: number) => {
    setSelectedLevel({ ...LEVELS[index] });

    resetGame();
  };

  /**
   * タイマーを停止します。
   */
  const stopTimer = () => {
    clearInterval(timer?.current ?? undefined);
    timer.current = null;
  };

  /**
   * ゲームをリセットします。
   */
  const resetGame = () => {
    // タイマー停止
    stopTimer();
    setSeconds(0);

    // 盤面リセット
    setState(State.Initialized);
    setGameId(new Date().getTime());
  };

  /**
   * ゲーム状態に応じたニコちゃんボタンの表情を返します。
   * @param state
   */
  const emotion = (state: State) => {
    switch (state) {
      case State.Completed:
        return 'laugh-beam';
      case State.Dead:
        return 'dizzy';
      default:
        return 'smile';
    }
  };

  return (
    <div className={wrapperStyle}>
      <div className={controllersStyle}>
        <label className={labelStyle}>難易度:</label>
        <select className={comboBoxStyle} onChange={(e) => onLevelSelect(Number.parseInt(e.target.value))}>
          {Object.entries(LEVELS).map(([index, { caption }]) => (
            <option value={index}>{caption}</option>
          ))}
        </select>
      </div>

      <div className={center()}>
        <div className={panelWrapperStyle}>
          <div className={panelHeaderStyle}>
            <Digits value={selectedLevel.mines} />
            <NikoChanButton emotion={emotion(state)} size="3x" onClick={onReset} />
            <Digits value={seconds} />
          </div>
          <Panel
            key={gameId}
            width={selectedLevel.width}
            height={selectedLevel.height}
            mines={selectedLevel.mines}
            onStart={onStart}
            onEnd={onEnd}
          />
        </div>
      </div>
    </div>
  );
};

const wrapperStyle = css({ margin: '2rem' });

const labelStyle = css({ marginRight: '0.5rem' });

const comboBoxStyle = css({
  width: '5rem',
  fontSize: '85%',
  borderWidth: '1px',
  borderColor: 'rgb(118, 118, 118)',
});

const controllersStyle = cx(center(), css({ marginBottom: '2rem' }), flex({ align: 'center' }));

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
