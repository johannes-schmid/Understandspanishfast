import BlogPost, { SidebarCallout, ProTip } from '../BlogPost'

export default function PostHowManyWords() {
  return (
    <BlogPost
      slug="how-many-spanish-words-to-be-fluent"
      title="How Many Spanish Words Do You Need to Be Fluent?"
      description="A direct, data-backed answer to the most-asked question in language learning. Spoiler: it's probably less than you think."
      category="Research"
      readTime="7 min read"
      heroCallout={{ value: '1,500', label: 'The functional fluency threshold' }}
      sidebar={
        <>
          <SidebarCallout icon="psychology" title="Quick reference">
            <ul className="space-y-2">
              <li className="flex justify-between text-sm"><span>Tourist survival</span><b className="text-on-surface">~250</b></li>
              <li className="flex justify-between text-sm"><span>Hold a conversation</span><b className="text-on-surface">~500</b></li>
              <li className="flex justify-between text-sm"><span>Follow shows w/ subs</span><b className="text-on-surface">~1,000</b></li>
              <li className="flex justify-between text-sm"><span>Functional fluency</span><b className="text-[#FF8C00]">~1,500</b></li>
              <li className="flex justify-between text-sm"><span>Native-like reading</span><b className="text-on-surface">~5,000</b></li>
            </ul>
          </SidebarCallout>
          <ProTip>An average native speaker uses about 5,000 unique words in daily life — but the top 1,500 cover 80% of those occurrences.</ProTip>
        </>
      }
    >
      <p>
        It's the question every Spanish learner asks first: <i>how many words do I need to know to be fluent?</i>
      </p>
      <p>
        The honest answer depends on what you mean by "fluent". So let's get specific.
      </p>

      <h2>The four levels of fluency, by word count</h2>

      <h3>Tourist survival (~250 words)</h3>
      <p>
        Order food, ask for directions, book a room. You're not having conversations — you're transacting. Most travel phrasebooks cover this in a weekend.
      </p>

      <h3>Conversational (~500 words)</h3>
      <p>
        You can hold a basic 5-minute conversation about your day, your work, and your family. You'll miss jokes and complex topics, but you can keep a chat alive. Around <b>~63% lexical coverage</b> of everyday Spanish.
      </p>

      <h3>Functional fluency (~1,500 words)</h3>
      <p>
        This is the threshold most learners actually mean when they say "fluent". You understand most casual conversations, can follow shows with subtitles, and rarely feel completely lost. <b>~80% lexical coverage</b> — the magic number where comprehension flips from effortful to natural.
      </p>

      <h3>Native-like (~5,000+ words)</h3>
      <p>
        Read newspapers without a dictionary, follow technical discussions, catch wordplay. This level takes years and immersion — but only after 1,500 is the climb worth it.
      </p>

      <h2>Why does this number sound so low?</h2>
      <p>
        Because language is shaped by repetition, not variety. The most-frequent 100 words make up 50% of all Spanish you'll ever hear. The next 400 (taking you to 500) bring you up to 63%. The curve is steep at the start and flattens fast.
      </p>
      <p>
        It's the opposite of how schools teach. Curricula introduce vocabulary alphabetically or thematically — by topic, not by usefulness. So you spend equal time memorising "<i>jirafa</i>" (giraffe) and "<i>pero</i>" (but), even though one of those appears in nearly every Spanish sentence and the other almost never.
      </p>

      <blockquote>
        A native Spanish speaker uses around 5,000 distinct words across an average week. But the top 1,500 of those account for 80% of every word they utter.
      </blockquote>

      <h2>The two numbers that matter</h2>
      <p>
        When researchers measure vocabulary needs, they usually quote two numbers:
      </p>
      <ul>
        <li><b>Lexical coverage:</b> the percentage of running text or speech your vocabulary covers.</li>
        <li><b>Comprehension threshold:</b> the lexical coverage at which a learner can understand content without constantly translating.</li>
      </ul>
      <p>
        The widely-cited threshold for spoken comprehension is <b>~80% lexical coverage</b>. Below that, every unfamiliar word disrupts the flow. Above it, your brain fills the gaps from context.
      </p>
      <p>
        80% coverage corresponds to roughly the top 1,500 most-frequent words in Spanish. That's the number.
      </p>

      <h2>So why does it feel like so much more?</h2>
      <p>
        Because not all words are equal. Spanish has multiple verb conjugations per verb (<i>hablo, hablas, habla, hablamos…</i>), gendered articles, and frequent pronouns that English speakers don't naturally track. Knowing "<i>tener</i>" doesn't mean you instantly recognise "<i>tuvieron</i>".
      </p>
      <p>
        That's why we count <b>headwords</b> (root words) — not every conjugated form. 1,500 headwords gives you access to perhaps 8,000–10,000 forms in real text.
      </p>

      <h2>The fastest path to 1,500</h2>
      <ul>
        <li><b>Use a frequency list.</b> Don't let an app decide your order. The top 100 → 500 → 1,500 is a non-negotiable sequence if you want comprehension to climb fastest per hour studied.</li>
        <li><b>Spaced repetition.</b> Review at increasing intervals so words cement permanently.</li>
        <li><b>Listen daily.</b> 10 minutes of Spanish audio (slow news, podcasts) reinforces the pattern recognition no flashcard can.</li>
        <li><b>Track your count.</b> Vague feelings of progress don't motivate — concrete numbers do. "I know 627 of the top 1,500" beats "I'm getting better".</li>
      </ul>

      <h2>The bottom line</h2>
      <p>
        You need <b>~1,500 high-frequency Spanish words</b> for functional fluency. With 15–20 minutes of focused daily practice, that's a 4 to 8 month journey for most adults.
      </p>
      <p>
        It's not a small effort — but it's a specific, measurable, finite one. And on the other side of it is the version of yourself that watches Spanish TV for fun, not for practice.
      </p>
    </BlogPost>
  )
}
