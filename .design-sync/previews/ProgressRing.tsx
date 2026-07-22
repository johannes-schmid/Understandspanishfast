import { ProgressRing } from 'understand-spanish-fast'

export const EarlyProgress = () => <ProgressRing learned={180} learning={45} />

export const Halfway = () => <ProgressRing learned={760} learning={120} />

export const NearComplete = () => <ProgressRing learned={1380} learning={90} />
