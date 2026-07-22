import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
  Badge,
} from 'understand-spanish-fast'

export const WordCard = () => (
  <Card style={{ maxWidth: 360 }}>
    <CardHeader>
      <CardTitle>entender</CardTitle>
      <CardDescription>to understand — verb, rank #142</CardDescription>
      <CardAction>
        <Badge variant="secondary">Learning</Badge>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0 }}>No entiendo lo que dices.</p>
      <p style={{ margin: '6px 0 0', opacity: 0.7 }}>I don't understand what you're saying.</p>
    </CardContent>
    <CardFooter style={{ display: 'flex', gap: 8, paddingBottom: 16 }}>
      <Button size="sm">Got it</Button>
      <Button size="sm" variant="outline">
        Review later
      </Button>
    </CardFooter>
  </Card>
)

export const Compact = () => (
  <Card size="sm" style={{ maxWidth: 320 }}>
    <CardHeader>
      <CardTitle>Daily goal</CardTitle>
      <CardDescription>12 of 20 words reviewed</CardDescription>
    </CardHeader>
    <CardContent>
      <p style={{ margin: 0 }}>You're on track to finish the top 500 this month.</p>
    </CardContent>
  </Card>
)

export const ContentOnly = () => (
  <Card style={{ maxWidth: 320 }}>
    <CardContent>
      <p style={{ margin: 0 }}>
        These 1,000 words cover roughly 74% of everyday spoken Spanish.
      </p>
    </CardContent>
  </Card>
)
