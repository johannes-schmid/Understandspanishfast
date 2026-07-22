import { WordToken } from 'understand-spanish-fast'

export const InSentence = () => (
  <p style={{ fontSize: 18, lineHeight: 1.9, maxWidth: 460, margin: 0 }}>
    <WordToken es="Ayer" en="Yesterday" status="known" />{' '}
    <WordToken es="fuimos" en="we went" status="known" />{' '}
    <WordToken es="al" en="to the" status="known" />{' '}
    <WordToken es="mercado" en="market" status="learning" />{' '}
    <WordToken es="para" en="in order to" status="known" />{' '}
    <WordToken es="comprar" en="to buy" status="learning" />{' '}
    <WordToken es="verduras" en="vegetables" status="unseen" />{' '}
    <WordToken es="frescas" en="fresh" status="unseen" />.
  </p>
)

export const Statuses = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 18 }}>
    <div>
      <WordToken es="entender" en="to understand" status="known" />
      <span style={{ marginLeft: 10, fontSize: 13, opacity: 0.6 }}>known</span>
    </div>
    <div>
      <WordToken es="conseguir" en="to get / obtain" status="learning" />
      <span style={{ marginLeft: 10, fontSize: 13, opacity: 0.6 }}>learning</span>
    </div>
    <div>
      <WordToken es="atardecer" en="dusk" status="unseen" />
      <span style={{ marginLeft: 10, fontSize: 13, opacity: 0.6 }}>unseen</span>
    </div>
  </div>
)
