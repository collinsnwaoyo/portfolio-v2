'use client';

import { useRef, useState } from 'react';
import Player from '../Player/Player';

export default function PlayClipButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    btnRef.current?.focus();
  }

  return (
    <>
      <button type="button" ref={btnRef} className={className} onClick={() => setOpen(true)}>
        <span aria-hidden="true">&#9654;</span> Play the 30-second brief
      </button>
      <Player placement="dialog" open={open} onClose={close} />
    </>
  );
}
