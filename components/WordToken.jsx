'use client'

import { useState } from 'react'

const STATUS_STYLES = {
  known: {
    color: '#2D7A5C',
    borderBottom: '2px solid #4D8D74',
    background: 'rgba(77,141,116,0.08)',
  },
  learning: {
    color: '#A0660A',
    borderBottom: '2px solid #E8A838',
    background: 'rgba(232,168,56,0.10)',
  },
  unseen: {
    color: 'var(--deep-mind)',
    borderBottom: '2px solid transparent',
    background: 'transparent',
  },
  null: {
    color: 'var(--deep-mind)',
    borderBottom: 'none',
    background: 'transparent',
  },
}

export default function WordToken({ es, en, status }) {
  const [open, setOpen] = useState(false)
  const styles = STATUS_STYLES[status] ?? STATUS_STYLES.unseen

  return (
    <span style={{ position: 'relative', display: 'inline' }}>
      <span
        onClick={() => setOpen(o => !o)}
        style={{
          cursor: 'pointer',
          borderRadius: '3px',
          padding: '0 2px',
          ...styles,
          fontSize: 'inherit',
          lineHeight: 'inherit',
          userSelect: 'none',
        }}
      >
        {es}
      </span>
      {open && (
        <>
          <span
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 10 }}
          />
          <span style={{
            position: 'absolute',
            bottom: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--deep-mind)',
            color: '#fff',
            fontSize: '12px',
            padding: '5px 10px',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            zIndex: 20,
            pointerEvents: 'none',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}>
            {en}
          </span>
        </>
      )}
    </span>
  )
}
