'use client';

import { IconButton } from '@/components/buttons';
import { Game } from '@/components/game';
import { Logo } from '@/components/logo';
import { css, cx } from '@/styled-system/css';
import { center, flex } from '@/styled-system/patterns';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';

export default function Home() {
  const [games, setGames] = useState<number[]>([new Date().getTime()]);

  const onAddGame = () => {
    setGames([new Date().getTime(), ...games]);
  };

  return (
    <main className={mainStyle}>
      <div className={headerStyle}>
        <Logo />
        <span className={titleStyle}>マインスイーパー</span>
        <Logo />
      </div>

      <Flipper flipKey={games.join()}>
        <div className={gameWrapperStyle}>
          {games.map((g) => (
            <Flipped flipId={g}>
              <Game />
            </Flipped>
          ))}
        </div>
      </Flipper>

      <div className={addGameButtonWrapperStyle}>
        <IconButton icon={faPlus} size="3x" onClick={onAddGame} />
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

const gameWrapperStyle = flex({ wrap: 'wrap', justifyContent: 'center' });

const addGameButtonWrapperStyle = cx(
  center(),
  css({
    marginBottom: '3rem',
  }),
);
