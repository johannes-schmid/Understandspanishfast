export default function WorkbookCover({ size }) {
  return (
    <div className={`cover${size === 'sm' ? ' sm' : ''}`} role="img" aria-label="Cover of The Top 1,500 Spanish Words workbook">
      <span className="mono">{size === 'sm' ? 'MCS' : 'MOST COMMON SPANISH'}</span>
      <div className="cover-bars" aria-hidden="true"><i style={{ height: '50%' }} /><i style={{ height: '67%' }} /><i style={{ height: '74%' }} /><i style={{ height: '100%' }} /></div>
      <div className="cover-num tab">1,500</div>
      <div className="cover-t">The Top 1,500 Spanish Words{size !== 'sm' && <><br /><span style={{ opacity: 0.7, fontWeight: 500 }}>Printable workbook · 80% coverage</span></>}</div>
    </div>
  )
}
