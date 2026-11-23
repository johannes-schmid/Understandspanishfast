# Deck 1,501–3,000: samples

Generated 2026-11-23. Content: `claude-opus-5-5` (structured outputs). Audio: ElevenLabs `eleven_v4`, `language_code: es`, mp3 44.1 kHz / 128 kbps (same format as `public/audio`).

**How "rank" works here.** Our `data/words.json` is not a raw frequency list: it leaves out the top function words (de, que, no, y, el, la, en, se, me, por, para, mi, su …), many very frequent cognates and greetings, and counts sólo/solo twice. So rank 1,501 below means "the first content word, in OpenSubtitles frequency order, that is not already in our 1,500", not rank 1,501 of any raw frequency list. Method: `scripts/deck3000/README.md`.

**Heads-up for positioning.** Because of those gaps, the start of this band is very basic (sí, gracias, hola, problema, momento). 18 of these 30 are tagged `cognate` (an English speaker recognises them without study). The band gets more intermediate further down (candidates around pool position 150: hospital, información, decisión, situación, testigo, crimen).

## Voices (audio for the first 5 words, every voice)

| Key | Voice | Voice ID | Accent |
|---|---|---|---|
| isabel | Isabel - Neutral, Balanced and Calm | `rixsIpPlTphvsJd2mI03` | Latin American (es-MX), female |
| enrique | Enrique M. Nieto - Credible and Rich | `gbTn1bmCvNgk0QEAVyfM` | Latin American (es-MX), male |
| javier | Javier Rojas - Learning & Storytelling | `eHAEFkimnYz57pupUMcq` | Spain (es-ES), male |

Files are in this folder: `<word>_<voice>.mp3` (word) and `<word>_<voice>_<md5(sentence)[0:8]>.mp3` (sentence), the same naming as `public/audio`.

## Words 1,501–1,530

| # | Word | POS | Meaning | Sentence | Translation | Cognate | Audio |
|---|---|---|---|---|---|---|---|
| 1501 | **sí** | adv. | yes; indeed, really | Sí, claro, mañana te llamo después del trabajo. | Yes, of course, I'll call you tomorrow after work. |  | `sí_isabel.mp3`, `sí_isabel_ce1b820e.mp3`<br>`sí_enrique.mp3`, `sí_enrique_ce1b820e.mp3`<br>`sí_javier.mp3`, `sí_javier_ce1b820e.mp3` |
| 1502 | **gracias** | intj. | thank you; thanks | Muchas gracias por ayudarme con la casa. | Thank you so much for helping me with the house. |  | `gracias_isabel.mp3`, `gracias_isabel_8d8a7a57.mp3`<br>`gracias_enrique.mp3`, `gracias_enrique_8d8a7a57.mp3`<br>`gracias_javier.mp3`, `gracias_javier_8d8a7a57.mp3` |
| 1503 | **hola** | intj. | hello; hi | Hola, ¿qué tal? Hace mucho tiempo que no te veo. | Hi, how are you? I haven't seen you in a long time. |  | `hola_isabel.mp3`, `hola_isabel_5c86e5e1.mp3`<br>`hola_enrique.mp3`, `hola_enrique_5c86e5e1.mp3`<br>`hola_javier.mp3`, `hola_javier_5c86e5e1.mp3` |
| 1504 | **tan** | adv. | so; such; as (in comparisons) | ¿Por qué estás tan cansado hoy? | Why are you so tired today? |  | `tan_isabel.mp3`, `tan_isabel_92b84d75.mp3`<br>`tan_enrique.mp3`, `tan_enrique_92b84d75.mp3`<br>`tan_javier.mp3`, `tan_javier_92b84d75.mp3` |
| 1505 | **favor** | n.m. | favor; please (in por favor) | ¿Me haces un favor? Cierra la puerta, por favor. | Can you do me a favor? Close the door, please. | yes | `favor_isabel.mp3`, `favor_isabel_e5dc005f.mp3`<br>`favor_enrique.mp3`, `favor_enrique_e5dc005f.mp3`<br>`favor_javier.mp3`, `favor_javier_e5dc005f.mp3` |
| 1506 | **acuerdo** | n.m. | agreement; deal | Llegamos a un acuerdo con el jefe sobre el dinero. | We reached an agreement with the boss about the money. |  | — |
| 1507 | **momento** | n.m. | moment; time | Espera un momento, ahora vuelvo. | Wait a moment, I'll be right back. | yes | — |
| 1508 | **problema** | n.m. | problem; trouble | No hay problema, yo puedo pagar la cena. | No problem, I can pay for dinner. | yes | — |
| 1509 | **vale** | intj. | okay; all right | Vale, nos vemos mañana en la oficina. | Okay, see you tomorrow at the office. |  | — |
| 1510 | **persona** | n.f. | person; people (plural) | Es una buena persona, puedes confiar en ella. | She's a good person, you can trust her. | yes | — |
| 1511 | **parte** | n.f. | part; place, somewhere (in alguna parte) | Dejé las llaves en alguna parte de la casa. | I left the keys somewhere in the house. | yes | — |
| 1512 | **idea** | n.f. | idea; clue (in no tengo idea) | No tengo ni idea de dónde está mi teléfono. | I have no idea where my phone is. | yes | — |
| 1513 | **forma** | n.f. | way; shape, form | No hay otra forma de pagar el alquiler este mes. | There's no other way to pay the rent this month. | yes | — |
| 1514 | **maldito** | adj. | damn, damned; cursed | ¡Este maldito coche no funciona otra vez! | This damn car isn't working again! |  | — |
| 1515 | **por supuesto** | expr. | of course; certainly | Por supuesto que puedes quedarte en mi casa esta noche. | Of course you can stay at my place tonight. |  | — |
| 1516 | **adiós** | intj. | goodbye; bye | Me voy a casa, adiós a todos. | I'm going home, bye everyone. |  | — |
| 1517 | **importante** | adj. | important | Tengo una reunión importante mañana en el trabajo. | I have an important meeting at work tomorrow. | yes | — |
| 1518 | **doctor** | n.m. | doctor | La doctora dice que necesito descansar una semana. | The doctor says I need to rest for a week. | yes | — |
| 1519 | **coche** | n.m. | car | Mi coche no funciona otra vez, tengo que llevarlo a arreglar. | My car isn't working again, I have to take it to get fixed. |  | — |
| 1520 | **final** | n.m. | end; ending | No me gustó el final de la película. | I didn't like the ending of the movie. | yes | — |
| 1521 | **posible** | adj. | possible | ¿Es posible cambiar la cita para el viernes? | Is it possible to change the appointment to Friday? | yes | — |
| 1522 | **coger** | v. | to take; to grab; to catch | Voy a coger el autobús de las ocho. | I'm going to take the eight o'clock bus. |  | — |
| 1523 | **plan** | n.m. | plan | ¿Tienes algún plan para este fin de semana? | Do you have any plans for this weekend? | yes | — |
| 1524 | **capitán** | n.m. | captain | El capitán dice que el barco sale en una hora. | The captain says the ship leaves in an hour. | yes | — |
| 1525 | **exactamente** | adv. | exactly | Eso es exactamente lo que quería decir. | That's exactly what I wanted to say. | yes | — |
| 1526 | **correcto** | adj. | correct; right | Creo que tomaste la decisión correcta. | I think you made the right decision. | yes | — |
| 1527 | **par** | n.m. | pair; couple; a few | Solo necesito un par de días para terminar. | I just need a couple of days to finish. |  | — |
| 1528 | **idiota** | n. | idiot | Fui un idiota, perdóname por lo de anoche. | I was an idiot, forgive me for last night. | yes | — |
| 1529 | **perfecto** | adj. | perfect | La casa es perfecta para nuestra familia. | The house is perfect for our family. | yes | — |
| 1530 | **probablemente** | adv. | probably | Probablemente llegue tarde, hay mucho tráfico. | I'll probably be late, there's a lot of traffic. | yes | — |

## Dropped while screening the first 80 candidates

- **function_word** (17): de→de, que→que, la→la, a→a, y→y, en→en, por→por, me→me, se→se, mi→mi, su→su, del→del, al→al, donde→donde, vosotros→vosotros, quien→quien, cuanto→cuanto
- **sound_interjection** (3): oh→oh, eh→eh, ah→ah
- **duplicate** (15): mira→mirar, debe→deber, pasa→pasar, gran→grande, hacerlo→hacer, jefe→jefe, escucha→escuchar, déjame→dejar, 1→primero, vetar→ir, trata→tratar, queda→quedar, dame→dar, amo→amar, dime→decir
- **profanity** (3): mierda→mierda, puta→puta, joder→joder
- **foreign** (2): hey→hey, ok→ok
- **not_a_word** (1): mas→más
