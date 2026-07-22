import { Badge } from 'understand-spanish-fast'

export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
    <Badge>Known</Badge>
    <Badge variant="secondary">Learning</Badge>
    <Badge variant="outline">Unseen</Badge>
    <Badge variant="destructive">Forgotten</Badge>
    <Badge variant="ghost">Skipped</Badge>
    <Badge variant="link">Details</Badge>
  </div>
)

export const WordStatus = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
    <Badge variant="secondary">Top 100</Badge>
    <Badge variant="secondary">Top 500</Badge>
    <Badge variant="outline">Verb</Badge>
    <Badge variant="outline">Noun</Badge>
    <Badge>74% coverage</Badge>
  </div>
)
