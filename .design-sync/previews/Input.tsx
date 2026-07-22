import { Input } from 'understand-spanish-fast'

export const Default = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320 }}>
    <Input placeholder="Search a Spanish word…" />
    <Input defaultValue="entender" />
  </div>
)

export const Types = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320 }}>
    <Input type="email" placeholder="you@example.com" />
    <Input type="password" defaultValue="password" />
    <Input type="number" defaultValue={1500} />
  </div>
)

export const States = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320 }}>
    <Input placeholder="Disabled" disabled />
    <Input defaultValue="entiendo" aria-invalid="true" />
  </div>
)
