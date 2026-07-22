import { Button } from 'understand-spanish-fast'

export const Variants = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
    <Button>Start learning</Button>
    <Button variant="secondary">Review deck</Button>
    <Button variant="outline">Skip word</Button>
    <Button variant="ghost">Show translation</Button>
    <Button variant="destructive">Reset progress</Button>
    <Button variant="link">What is this?</Button>
  </div>
)

export const Sizes = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
    <Button size="xs">Again</Button>
    <Button size="sm">Hard</Button>
    <Button size="default">Good</Button>
    <Button size="lg">Easy</Button>
  </div>
)

export const Disabled = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
    <Button disabled>Next word</Button>
    <Button variant="outline" disabled>
      Previous
    </Button>
  </div>
)
