/*
 * Conteúdo das lições.
 *
 * Cada linha de diálogo tem:
 *   s   — quem fala (A é sempre "Você")
 *   en  — inglês correto (é isso que a voz lê)
 *   pr  — pronúncia escrita para brasileiros (sílaba forte em MAIÚSCULAS)
 *   nat — (opcional) como soa na fala rápida do dia a dia
 *   pt  — tradução natural
 *   noDict — (opcional) fica fora do ditado (ex.: soletração)
 *
 * As regras da pronúncia estão em SOUND_GUIDE, mais abaixo.
 */
window.LESSONS = [
  {
    id: "l1",
    title: "Não entendi, pode repetir?",
    en: "Could you say that again?",
    ctx: "A lição mais útil de todas: o que dizer quando você não entende. Você puxa conversa com uma pessoa na rua.",
    speakers: { A: "Você", B: "Emma" },
    lines: [
      { s: "A", en: "Excuse me, do you speak Portuguese?", pr: "ik-SKIUUZ mii, dâ iâ SPIIK PÓR-tchâ-guiiz?", pt: "Com licença, você fala português?" },
      { s: "B", en: "No, sorry. Just English.", pr: "NOU, SÁ-ri. DJÂST ING-glish.", pt: "Não, desculpa. Só inglês." },
      { s: "A", en: "Okay. My English isn't very good, but I'm trying.", pr: "ou-KEI. mai ING-glish IZ-ânt VÉ-ri GUD, bât aim TRAI-ing.", pt: "Tá bom. Meu inglês não é muito bom, mas estou tentando." },
      { s: "B", en: "That's okay! Where are you from?", pr: "dhéts ou-KEI! UÉR âr iâ FRÂM?", nat: "UÉ-râr-iâ FRÂM?", pt: "Tudo bem! De onde você é?" },
      { s: "A", en: "Sorry, I didn't understand. Could you say that again?", pr: "SÁ-ri, ai DI-dânt ân-dâr-STÉND. KUD-jâ SEI dhét â-GUÉN?", pt: "Desculpa, não entendi. Pode repetir?" },
      { s: "B", en: "Sure. Where... are... you... from?", pr: "SHUR. UÉR... ÁR... IUU... FRÂM?", pt: "Claro. De... onde... você... é?" },
      { s: "A", en: "Oh, got it! I'm from Brazil.", pr: "ou, GÁ-dit! aim frâm brâ-ZIL.", pt: "Ah, entendi! Sou do Brasil." },
      { s: "B", en: "Cool! I'm Emma, by the way.", pr: "KUUL! aim É-mâ, BAI dhâ UEI.", pt: "Legal! Eu sou a Emma, aliás." },
      { s: "A", en: "Nice to meet you, Emma. How do you spell that?", pr: "NAIS tâ MII-tchâ, É-mâ. hau dâ iâ SPÉL dhét?", pt: "Prazer, Emma. Como se escreve?" },
      { s: "B", en: "E-M-M-A.", pr: "II, ÉM, ÉM, EI.", pt: "E-M-M-A.", noDict: true },
      { s: "A", en: "Thanks. Sorry, what does 'by the way' mean?", pr: "thénks. SÁ-ri, uát dâz BAI dhâ UEI MIIN?", pt: "Obrigado. Desculpa, o que significa 'by the way'?" },
      { s: "B", en: "It means 'also', or 'just so you know'.", pr: "it MIINZ ÓL-sou, âr DJÂST sou iâ NOU.", pt: "Significa 'aliás', ou 'só pra você saber'." }
    ],
    phrases: [
      { en: "Could you speak more slowly, please?", pr: "KUD-jâ spiik MÓR SLOU-li, pliiz?", pt: "Pode falar mais devagar, por favor?" },
      { en: "What does that mean?", pr: "uát dâz DHÉT miin?", pt: "O que isso significa?" },
      { en: "How do you say 'saudade' in English?", pr: "hau dâ iâ SEI sau-DÁ-dji in ING-glish?", pt: "Como se diz 'saudade' em inglês?" },
      { en: "Can you write it down?", pr: "kân iâ RAI-dit DAUN?", pt: "Pode escrever pra mim?" },
      { en: "I'm still learning.", pr: "aim STIL LÂR-ning.", pt: "Ainda estou aprendendo." },
      { en: "Never mind.", pr: "NÉ-vâr MAIND.", pt: "Deixa pra lá." }
    ],
    notes: [
      "\"Could you...?\" é o jeito educado de pedir qualquer coisa. Decore o som KUD-jâ: ele aparece o tempo todo.",
      "\"Got it\" soa GÁ-dit. O t no meio de duas vogais vira um d rapidinho. Isso é o inglês americano.",
      "Compare as linhas 4 e 6. Falando devagar, as palavras pequenas ficam fortes (ÁR, IUU). Na velocidade normal elas encolhem para âr, iâ. É por isso que você \"não escuta\" essas palavras: elas estão lá, só que fracas."
    ]
  },
  {
    id: "l2",
    title: "E aí, tudo bem?",
    en: "How's it going?",
    ctx: "Você encontra um conhecido no corredor. Conversa rápida, do jeito que acontece todo dia.",
    speakers: { A: "Você", B: "Chris" },
    lines: [
      { s: "A", en: "Hey! How's it going?", pr: "HEI! HAU-zit GOU-ing?", nat: "hau-zi-GOU-in?", pt: "E aí! Como vão as coisas?" },
      { s: "B", en: "Pretty good, thanks. How about you?", pr: "PRI-di GUD, thénks. hau â-BAUT IUU?", pt: "Tudo certo, valeu. E você?" },
      { s: "A", en: "Not bad. Just a little tired.", pr: "NÁT BÉD. djâst â LI-dâl TAI-ârd.", pt: "Nada mal. Só um pouco cansado." },
      { s: "B", en: "Yeah? Long week?", pr: "IÉ? LÓNG UIIK?", pt: "É? Semana longa?" },
      { s: "A", en: "Yeah, super busy at work. What have you been up to?", pr: "IÉ, SUU-pâr BI-zi ât UÂRK. uát âv iâ bin ÂP tuu?", nat: "UÁ-dâ-viâ bi-NÂP-tuu?", pt: "É, muito corrido no trabalho. E você, o que tem feito?" },
      { s: "B", en: "Not much. I just got back from a trip.", pr: "nát MÂTCH. ai djâst gát BÉK frâm â TRIP.", pt: "Nada demais. Acabei de voltar de uma viagem." },
      { s: "A", en: "Oh, nice! Where did you go?", pr: "ou, NAIS! UÉR did-jâ GOU?", nat: "uér-djâ-GOU?", pt: "Ah, legal! Pra onde você foi?" },
      { s: "B", en: "Portugal. It was amazing.", pr: "PÓR-tchâ-gâl. it uâz â-MEI-zing.", pt: "Portugal. Foi incrível." },
      { s: "A", en: "Lucky you! Well, I gotta run. Good to see you!", pr: "LÂ-ki IUU! uél, ai GÁ-dâ RÂN. GUD tâ SII iâ!", pt: "Sortudo! Bom, preciso ir. Bom te ver!" },
      { s: "B", en: "You too! See you around.", pr: "IUU TUU! SII iâ â-RAUND.", pt: "Você também! A gente se vê por aí." }
    ],
    phrases: [
      { en: "What's up?", pr: "uáts ÂP?", pt: "E aí? Qual é a boa?" },
      { en: "Not much. You?", pr: "nát MÂTCH. IUU?", pt: "Nada demais. E você?" },
      { en: "How have you been?", pr: "hau âv iâ BIN?", pt: "Como você tem passado?" },
      { en: "Take care!", pr: "TEIK KÉR!", pt: "Se cuida!" },
      { en: "Catch you later.", pr: "KÉ-tchâ LEI-dâr.", pt: "Até mais." },
      { en: "Have a good one!", pr: "HÉ-vâ GUD uân!", pt: "Tenha um bom dia!" }
    ],
    notes: [
      "\"How's it going?\" não é uma pergunta de verdade. Responda curto (\"Good, you?\") e devolva a pergunta.",
      "\"Gotta\" = got to (tenho que). Você vai ouvir muito: \"I gotta go\".",
      "\"Pretty good\": aqui \"pretty\" significa \"bem, bastante\", não \"bonito\". O t vira d: PRI-di."
    ]
  },
  {
    id: "l3",
    title: "Se apresentando",
    en: "What do you do?",
    ctx: "Numa festa, você conhece alguém novo. As perguntas que sempre aparecem: de onde você é, com o que trabalha, há quanto tempo mora aqui.",
    speakers: { A: "Você", B: "Jake" },
    lines: [
      { s: "A", en: "Hi, I don't think we've met. I'm Lucas.", pr: "hai, ai DOUNT THINK uiiv MÉT. aim LUU-kâs.", pt: "Oi, acho que a gente ainda não se conhece. Sou o Lucas." },
      { s: "B", en: "Nice to meet you, Lucas. I'm Jake.", pr: "NAIS tâ MII-tchâ, LUU-kâs. aim DJEIK.", pt: "Prazer, Lucas. Eu sou o Jake." },
      { s: "A", en: "Nice to meet you too. So, how do you know Mark?", pr: "NAIS tâ MIIT iuu TUU. sou, hau dâ iâ NOU MÁRK?", pt: "Prazer também. E aí, de onde você conhece o Mark?" },
      { s: "B", en: "We work together. What about you?", pr: "uii UÂRK tâ-GUÉ-dhâr. uát â-BAUT IUU?", pt: "A gente trabalha junto. E você?" },
      { s: "A", en: "We went to college together.", pr: "uii UÉNT tâ KÁ-lidj tâ-GUÉ-dhâr.", pt: "A gente fez faculdade junto." },
      { s: "B", en: "Cool. So, what do you do?", pr: "KUUL. sou, UÁT dâ iâ DUU?", nat: "uá-djâ-DUU?", pt: "Legal. E você trabalha com quê?" },
      { s: "A", en: "I'm a software developer. And you?", pr: "aim â SÓFT-uér di-VÉ-lâ-pâr. ând IUU?", pt: "Sou desenvolvedor de software. E você?" },
      { s: "B", en: "I'm in marketing. How long have you lived here?", pr: "aim in MÁR-ki-ding. hau LÓNG âv iâ LIVD HIR?", pt: "Trabalho com marketing. Há quanto tempo você mora aqui?" },
      { s: "A", en: "About two years. I'm originally from Brazil.", pr: "â-BAUT tuu IIRZ. aim â-RI-djâ-nâ-li frâm brâ-ZIL.", pt: "Uns dois anos. Sou do Brasil, originalmente." },
      { s: "B", en: "Oh, really? I've always wanted to go there.", pr: "ou, RII-li? aiv ÓL-ueiz UÁN-tid tâ GOU dhér.", nat: "aiv ÓL-ueiz UÁ-ni-dâ GOU dhér.", pt: "Sério? Sempre quis ir pra lá." },
      { s: "A", en: "You should! Here, let me give you my number.", pr: "iuu SHUD! hir, LÉ-mii GUI-viâ mai NÂM-bâr.", pt: "Deveria! Olha, deixa eu te passar meu número." },
      { s: "B", en: "Great. Let's keep in touch.", pr: "GREIT. léts KII-pin TÂTCH.", pt: "Ótimo. Vamos manter contato." }
    ],
    phrases: [
      { en: "What do you do for a living?", pr: "uát dâ iâ DUU fâr â LI-ving?", pt: "Você trabalha com o quê?" },
      { en: "Where are you from?", pr: "UÉR âr iâ FRÂM?", pt: "De onde você é?" },
      { en: "How long have you been here?", pr: "hau LÓNG âv iâ bin HIR?", pt: "Há quanto tempo você está aqui?" },
      { en: "What brings you here?", pr: "uát BRINGZ iâ HIR?", pt: "O que te traz aqui?" },
      { en: "I work in IT.", pr: "ai UÂRK in ai-TII.", pt: "Trabalho com TI." }
    ],
    notes: [
      "\"What do you do?\" pergunta a sua profissão. Responda com \"I'm a...\" ou \"I work in...\".",
      "\"College\" nos EUA é faculdade, não colégio.",
      "\"Nice to meet you\" só na primeira vez. Nas próximas, é \"Nice to see you\".",
      "\"Let me\" vira LÉ-mii e \"give you\" vira GUI-viâ. No inglês falado as palavras grudam umas nas outras."
    ]
  },
  {
    id: "l4",
    title: "No café",
    en: "Can I get a latte?",
    ctx: "Pedindo no balcão de uma cafeteria. O barista fala rápido e sempre faz as mesmas perguntas.",
    speakers: { A: "Você", B: "Barista" },
    lines: [
      { s: "B", en: "Hi there! What can I get for you?", pr: "HAI dhér! uát kân ai GUÉT fâr iâ?", nat: "uát-kâ-nai-GUÉT-fâr-iâ?", pt: "Oi! O que vai ser?" },
      { s: "A", en: "Hi! Can I get a medium latte, please?", pr: "hai! kân ai GUÉ-dâ MII-di-âm LÁ-tei, pliiz?", pt: "Oi! Me vê um latte médio, por favor?" },
      { s: "B", en: "Sure. Hot or iced?", pr: "SHUR. HÁT âr AIST?", nat: "HÁ-dâr-AIST?", pt: "Claro. Quente ou gelado?" },
      { s: "A", en: "Iced, please. With oat milk.", pr: "AIST, pliiz. uidh OUT MILK.", pt: "Gelado, por favor. Com leite de aveia." },
      { s: "B", en: "Anything else?", pr: "É-ni-thing ÉLS?", pt: "Mais alguma coisa?" },
      { s: "A", en: "Yeah, one of those blueberry muffins.", pr: "IÉ, UÂN âv dhouz BLUU-bé-ri MÂ-finz.", pt: "Sim, um daqueles muffins de mirtilo." },
      { s: "B", en: "For here or to go?", pr: "fâr HIR âr tâ GOU?", pt: "Pra comer aqui ou pra viagem?" },
      { s: "A", en: "To go, please.", pr: "tâ GOU, pliiz.", pt: "Pra viagem, por favor." },
      { s: "B", en: "Can I get a name for the order?", pr: "kân ai GUÉ-dâ NEIM fâr dhii ÓR-dâr?", pt: "Qual o nome pro pedido?" },
      { s: "A", en: "Lucas. L-U-C-A-S.", pr: "LUU-kâs. ÉL, IUU, SII, EI, ÉS.", pt: "Lucas. L-U-C-A-S.", noDict: true },
      { s: "B", en: "Okay, that'll be seven fifty.", pr: "ou-KEI, DHÉ-dâl bii SÉ-vân FIF-ti.", pt: "Ok, vai dar sete e cinquenta." },
      { s: "A", en: "Can I pay by card?", pr: "kân ai PEI bai KÁRD?", pt: "Posso pagar no cartão?" },
      { s: "B", en: "Of course. Just tap it right here.", pr: "âv KÓRS. djâst TÉ-pit RAIT hir.", pt: "Claro. É só aproximar aqui." }
    ],
    phrases: [
      { en: "Can I get a coffee, please?", pr: "kân ai GUÉ-dâ KÓ-fi, pliiz?", pt: "Me vê um café, por favor?" },
      { en: "Could I have the receipt?", pr: "KUD ai HÉV dhâ ri-SIIT?", pt: "Pode me dar o recibo?" },
      { en: "Keep the change.", pr: "KIIP dhâ TCHEINDJ.", pt: "Pode ficar com o troco." },
      { en: "Sorry, what was that?", pr: "SÁ-ri, UÁT uâz DHÉT?", pt: "Desculpa, o que você disse?" },
      { en: "Can I have it without sugar?", pr: "kân ai HÉ-vit ui-DHAUT SHU-gâr?", pt: "Pode ser sem açúcar?" }
    ],
    notes: [
      "\"Can I get...?\" é o jeito mais comum de pedir nos EUA. \"I want\" soa grosseiro.",
      "Preço: $7.50 se diz \"seven fifty\". Ninguém fala \"seven dollars and fifty cents\" no balcão.",
      "\"The\" vira dhii antes de vogal: dhii ÓR-dâr. Antes de consoante é dhâ."
    ]
  },
  {
    id: "l5",
    title: "No restaurante",
    en: "Could we get the check?",
    ctx: "Do momento em que você chega até pedir a conta. O garçom vai te perguntar as mesmas coisas em quase todo restaurante.",
    speakers: { A: "Você", B: "Garçom" },
    lines: [
      { s: "B", en: "Hi, how many?", pr: "HAI, hau MÉ-ni?", pt: "Oi, quantas pessoas?" },
      { s: "A", en: "Table for two, please.", pr: "TEI-bâl fâr TUU, pliiz.", pt: "Mesa pra dois, por favor." },
      { s: "B", en: "Right this way. Can I start you off with something to drink?", pr: "RAIT dhis UEI. kân ai STÁR-tchâ ÓF uidh SÂM-thing tâ DRINK?", pt: "Por aqui. Posso trazer algo pra beber pra começar?" },
      { s: "A", en: "Just water for now, thanks.", pr: "DJÂST UÁ-dâr fâr NAU, thénks.", pt: "Só água por enquanto, obrigado." },
      { s: "B", en: "Are you ready to order?", pr: "âr iâ RÉ-di tâ ÓR-dâr?", nat: "âr-iâ RÉ-di-dâ ÓR-dâr?", pt: "Já querem pedir?" },
      { s: "A", en: "Almost. What do you recommend?", pr: "ÓL-moust. uát dâ iâ ré-kâ-MÉND?", nat: "uá-djâ ré-kâ-MÉND?", pt: "Quase. O que você recomenda?" },
      { s: "B", en: "The salmon is really popular.", pr: "dhâ SÉ-mân iz RII-li PÁ-piâ-lâr.", pt: "O salmão sai bastante." },
      { s: "A", en: "Okay, I'll have the salmon. Does it come with a side?", pr: "ou-KEI, ail HÉV dhâ SÉ-mân. DÂ-zit KÂM uidh â SAID?", pt: "Ok, vou querer o salmão. Vem com acompanhamento?" },
      { s: "B", en: "Yes, fries or a salad.", pr: "IÉS, FRAIZ âr â SÉ-lâd.", pt: "Sim, fritas ou salada." },
      { s: "A", en: "Salad, please. And could I get a Coke?", pr: "SÉ-lâd, pliiz. ând KUD ai GUÉ-dâ KOUK?", pt: "Salada, por favor. E pode me trazer uma Coca?" },
      { s: "B", en: "How is everything?", pr: "HAU iz ÉV-ri-thing?", pt: "Está tudo bem com a comida?" },
      { s: "A", en: "Great, thanks. Could we get the check, please?", pr: "GREIT, thénks. kud uii GUÉT dhâ TCHÉK, pliiz?", pt: "Ótimo, obrigado. Pode trazer a conta, por favor?" }
    ],
    phrases: [
      { en: "I'll have the chicken.", pr: "ail HÉV dhâ TCHI-kin.", pt: "Vou querer o frango." },
      { en: "Can we split it?", pr: "kân uii SPLI-dit?", pt: "Dá pra dividir a conta?" },
      { en: "I'm allergic to nuts.", pr: "aim â-LÂR-djik tâ NÂTS.", pt: "Tenho alergia a castanhas." },
      { en: "Is the tip included?", pr: "iz dhâ TIP in-KLUU-did?", pt: "A gorjeta está incluída?" },
      { en: "Could I get a box for this?", pr: "KUD ai GUÉ-dâ BÁKS fâr dhis?", pt: "Pode embalar isso pra viagem?" }
    ],
    notes: [
      "\"Salmon\" tem o L mudo: SÉ-mân. Igual \"walk\" (uók) e \"talk\" (tók).",
      "Nos EUA a conta é \"the check\". \"The bill\" é mais britânico, mas todo mundo entende.",
      "\"I'll have...\" (vou querer) é a forma padrão de pedir o prato.",
      "Gorjeta nos EUA é de 15% a 20% e quase nunca vem incluída."
    ]
  },
  {
    id: "l6",
    title: "Pedindo direções",
    en: "How do I get to...?",
    ctx: "Você está perdido e precisa achar o metrô. O difícil aqui é entender a resposta, que vem cheia de direções.",
    speakers: { A: "Você", B: "Pedestre" },
    lines: [
      { s: "A", en: "Excuse me, could you help me? I'm looking for the subway.", pr: "ik-SKIUUZ mii, KUD-jâ HÉLP mii? aim LU-king fâr dhâ SÂB-uei.", pt: "Com licença, pode me ajudar? Estou procurando o metrô." },
      { s: "B", en: "Sure. Which line do you need?", pr: "SHUR. UITCH LAIN dâ iâ NIID?", pt: "Claro. Qual linha você precisa?" },
      { s: "A", en: "The red line, to downtown.", pr: "dhâ RÉD LAIN, tâ daun-TAUN.", pt: "A linha vermelha, sentido centro." },
      { s: "B", en: "Okay, go straight down this street for two blocks.", pr: "ou-KEI, gou STREIT daun dhis STRIIT fâr tuu BLÁKS.", pt: "Ok, siga reto nesta rua por dois quarteirões." },
      { s: "B", en: "Then turn left at the light.", pr: "dhén târn LÉFT ât dhâ LAIT.", nat: "dhén târn LÉF-dât-dhâ LAIT.", pt: "Depois vire à esquerda no semáforo." },
      { s: "B", en: "The station is on your right, next to the bank.", pr: "dhâ STEI-shân iz án iâr RAIT, NÉKS tâ dhâ BÉNK.", pt: "A estação fica à sua direita, do lado do banco." },
      { s: "A", en: "Is it far from here?", pr: "IZ it FÁR frâm hir?", nat: "I-zit-FÁR-frâm-hir?", pt: "É longe daqui?" },
      { s: "B", en: "Not really. It's about a five-minute walk.", pr: "NÁT RII-li. its â-BAU-dâ FAIV-mi-nit UÓK.", pt: "Não muito. Uns cinco minutos a pé." },
      { s: "A", en: "Great. So, straight, then left at the light?", pr: "GREIT. sou, STREIT, dhén LÉFT ât dhâ LAIT?", pt: "Ótimo. Então, reto e depois à esquerda no semáforo?" },
      { s: "B", en: "Exactly. You can't miss it.", pr: "ig-ZÉKT-li. iâ KÉNT MI-sit.", pt: "Isso. Não tem erro." },
      { s: "A", en: "Thank you so much!", pr: "THÉNK iuu sou MÂTCH!", nat: "THÉN-kiâ-sou-MÂTCH!", pt: "Muito obrigado!" },
      { s: "B", en: "No problem. Have a good one!", pr: "nou PRÁ-blâm. HÉ-vâ GUD uân!", pt: "De nada. Tenha um bom dia!" }
    ],
    phrases: [
      { en: "How do I get to the airport?", pr: "HAU dâ ai GUÉT tâ dhii ÉR-pórt?", pt: "Como eu chego ao aeroporto?" },
      { en: "Is there a pharmacy around here?", pr: "iz dhér â FÁR-mâ-si â-RAUND hir?", pt: "Tem uma farmácia por aqui?" },
      { en: "Could you show me on the map?", pr: "KUD-jâ SHOU mii án dhâ MÉP?", pt: "Pode me mostrar no mapa?" },
      { en: "I'm lost.", pr: "aim LÓST.", pt: "Estou perdido." },
      { en: "Is it within walking distance?", pr: "IZ it ui-DHIN UÓ-king DIS-tâns?", pt: "Dá pra ir a pé?" }
    ],
    notes: [
      "CAN x CAN'T: \"can\" quase some (kân), \"can't\" é forte e aberto (KÉNT). Se a palavra soou forte, provavelmente é can't.",
      "\"Straight\" (STREIT, reto) e \"street\" (STRIIT, rua) aparecem juntos o tempo todo. Preste atenção na vogal.",
      "\"Block\" é quarteirão. \"Two blocks\" = dois quarteirões.",
      "\"You can't miss it\" = não tem erro, você vai ver."
    ]
  },
  {
    id: "l7",
    title: "Imigração e aeroporto",
    en: "What's the purpose of your visit?",
    ctx: "No guichê da imigração. As perguntas são sempre as mesmas, e respostas curtas e diretas são as melhores.",
    speakers: { A: "Você", B: "Oficial" },
    lines: [
      { s: "B", en: "Next! Passport, please.", pr: "NÉKST! PÉS-pórt, pliiz.", pt: "Próximo! Passaporte, por favor." },
      { s: "A", en: "Here you go.", pr: "HIR iâ GOU.", pt: "Aqui está." },
      { s: "B", en: "What's the purpose of your visit?", pr: "uáts dhâ PÂR-pâs âv iâr VI-zit?", pt: "Qual o motivo da sua visita?" },
      { s: "A", en: "Tourism. I'm here on vacation.", pr: "TU-ri-zâm. aim HIR án vei-KEI-shân.", pt: "Turismo. Estou de férias." },
      { s: "B", en: "How long are you staying?", pr: "hau LÓNG âr iâ STEI-ing?", pt: "Quanto tempo vai ficar?" },
      { s: "A", en: "Two weeks.", pr: "tuu UIIKS.", pt: "Duas semanas." },
      { s: "B", en: "Where are you staying?", pr: "UÉR âr iâ STEI-ing?", pt: "Onde vai ficar hospedado?" },
      { s: "A", en: "At a hotel in Manhattan.", pr: "ât â hou-TÉL in mén-HÉ-tân.", pt: "Num hotel em Manhattan." },
      { s: "B", en: "Are you traveling alone?", pr: "âr iâ TRÉ-vâ-ling â-LOUN?", pt: "Está viajando sozinho?" },
      { s: "A", en: "No, with my wife. She's right behind me.", pr: "NOU, uidh mai UAIF. shiiz RAIT bi-HAIND mii.", pt: "Não, com a minha esposa. Ela está logo atrás de mim." },
      { s: "B", en: "Do you have anything to declare?", pr: "dâ iâ HÉV É-ni-thing tâ di-KLÉR?", pt: "Tem algo a declarar?" },
      { s: "A", en: "No, nothing.", pr: "NOU, NÂ-thing.", pt: "Não, nada." },
      { s: "B", en: "Alright. Enjoy your stay.", pr: "ól-RAIT. in-DJÓI iâr STEI.", pt: "Certo. Aproveite a estadia." }
    ],
    phrases: [
      { en: "Where is baggage claim?", pr: "UÉR iz BÉ-guidj kleim?", pt: "Onde fica a esteira de bagagens?" },
      { en: "My flight was delayed.", pr: "mai FLAIT uâz di-LEID.", pt: "Meu voo atrasou." },
      { en: "I missed my connection.", pr: "ai MIST mai kâ-NÉK-shân.", pt: "Perdi minha conexão." },
      { en: "Which gate is it?", pr: "UITCH GUEIT iz it?", pt: "Qual é o portão?" },
      { en: "Window or aisle?", pr: "UIN-dou âr AIL?", pt: "Janela ou corredor?" }
    ],
    notes: [
      "\"Hotel\" tem a força no final: hou-TÉL. Falar \"RÔ-tel\" é um dos erros mais comuns de brasileiro.",
      "\"Aisle\" (corredor do avião) tem o S mudo: AIL.",
      "Na imigração, responda só o que foi perguntado. Frases curtas são normais e esperadas."
    ]
  },
  {
    id: "l8",
    title: "Check-in no hotel",
    en: "I have a reservation.",
    ctx: "Chegando na recepção do hotel. Reserva, documento, horários e senha do Wi-Fi.",
    speakers: { A: "Você", B: "Recepção" },
    lines: [
      { s: "B", en: "Good evening. Checking in?", pr: "gud IIV-ning. TCHÉ-king IN?", pt: "Boa noite. Fazendo check-in?" },
      { s: "A", en: "Yes. I have a reservation under Silva.", pr: "IÉS. ai HÉ-vâ ré-zâr-VEI-shân ÂN-dâr SIL-vâ.", pt: "Sim. Tenho uma reserva no nome de Silva." },
      { s: "B", en: "Let me see... Yes, three nights, a king room.", pr: "LÉ-mii SII... IÉS, thrii NAITS, â KING ruum.", pt: "Deixa eu ver... Sim, três noites, quarto com cama king." },
      { s: "B", en: "Can I see your ID and a credit card?", pr: "kân ai SII iâr ai-DII ând â KRÉ-dit kárd?", pt: "Posso ver seu documento e um cartão de crédito?" },
      { s: "A", en: "Sure, here you go. What time is checkout?", pr: "SHUR, HIR iâ GOU. uát TAIM iz TCHÉK-aut?", pt: "Claro, aqui está. Que horas é o checkout?" },
      { s: "B", en: "Checkout is at eleven. Breakfast is from seven to ten.", pr: "TCHÉK-aut iz ât i-LÉ-vân. BRÉK-fâst iz frâm SÉ-vân tâ TÉN.", pt: "O checkout é às onze. O café da manhã é das sete às dez." },
      { s: "A", en: "Great. And what's the Wi-Fi password?", pr: "GREIT. ând uáts dhâ UAI-fai PÉS-uârd?", pt: "Ótimo. E qual a senha do Wi-Fi?" },
      { s: "B", en: "It's on the card with your key.", pr: "its án dhâ KÁRD uidh iâr KII.", pt: "Está no cartão junto com a sua chave." },
      { s: "B", en: "You're in room four twelve. The elevators are on your left.", pr: "iur in ruum FÓR TUÉLV. dhii É-lâ-vei-dârz âr án iâr LÉFT.", pt: "Você está no quarto 412. Os elevadores ficam à sua esquerda." },
      { s: "A", en: "Thanks. Oh, one more thing. Could I get a late checkout?", pr: "thénks. ou, UÂN mór THING. KUD ai GUÉ-dâ LEIT TCHÉK-aut?", pt: "Obrigado. Ah, mais uma coisa. Consigo um checkout mais tarde?" },
      { s: "B", en: "I can give you until one.", pr: "ai kân GUI-viâ ân-TIL UÂN.", pt: "Posso te dar até a uma." },
      { s: "A", en: "Perfect. Thank you!", pr: "PÂR-fikt. THÉNK iuu!", pt: "Perfeito. Obrigado!" }
    ],
    phrases: [
      { en: "The AC isn't working.", pr: "dhii ei-SII IZ-ânt UÂR-king.", pt: "O ar-condicionado não está funcionando." },
      { en: "Could I get some extra towels?", pr: "KUD ai GUÉT sâm ÉKS-trâ TAU-âlz?", pt: "Pode me dar mais algumas toalhas?" },
      { en: "Can you call me a taxi?", pr: "kân iâ KÓL mii â TÉK-si?", pt: "Pode chamar um táxi pra mim?" },
      { en: "I'd like to check out.", pr: "aid LAIK tâ tchék AUT.", pt: "Gostaria de fazer o checkout." },
      { en: "Can I leave my bags here?", pr: "kân ai LIIV mai BÉGZ hir?", pt: "Posso deixar minhas malas aqui?" }
    ],
    notes: [
      "\"A reservation under Silva\": \"under\" aqui significa \"no nome de\".",
      "Número de quarto se fala em pares: 412 = \"four twelve\", 1508 = \"fifteen oh eight\".",
      "\"Hours\" e \"honest\" têm o H mudo, mas \"hotel\" e \"house\" não. Na dúvida, escute o áudio."
    ]
  },
  {
    id: "l9",
    title: "Fazendo compras",
    en: "How much is it?",
    ctx: "Numa loja de roupas. O vendedor puxa conversa, você procura um tamanho, pergunta o preço e a política de troca.",
    speakers: { A: "Você", B: "Vendedora" },
    lines: [
      { s: "B", en: "Hi! Can I help you find anything?", pr: "HAI! kân ai HÉLP iâ FAIND É-ni-thing?", pt: "Oi! Posso te ajudar a encontrar alguma coisa?" },
      { s: "A", en: "I'm just looking, thanks.", pr: "aim DJÂST LU-king, thénks.", pt: "Só estou olhando, obrigado." },
      { s: "A", en: "Excuse me, do you have this in a medium?", pr: "ik-SKIUUZ mii, dâ iâ HÉV dhis in â MII-di-âm?", nat: "dâ-iâ HÉV dhi-si-nâ MII-di-âm?", pt: "Com licença, tem essa no tamanho M?" },
      { s: "B", en: "Let me check. What color?", pr: "LÉ-mii TCHÉK. uát KÂ-lâr?", pt: "Deixa eu ver. Qual cor?" },
      { s: "A", en: "Black, if you have it.", pr: "BLÉK, if iâ HÉ-vit.", pt: "Preta, se tiver." },
      { s: "B", en: "Here you go. The fitting rooms are right over there.", pr: "HIR iâ GOU. dhâ FI-ding ruumz âr RAIT OU-vâr dhér.", pt: "Aqui está. Os provadores ficam logo ali." },
      { s: "A", en: "It fits! How much is it?", pr: "it FITS! hau MÂTCH IZ it?", nat: "hau-MÂTCH-i-zit?", pt: "Serviu! Quanto custa?" },
      { s: "B", en: "It's forty-nine ninety-nine, but it's twenty percent off today.", pr: "its FÓR-di NAIN NAIN-ti NAIN, bât its TUÉ-ni pâr-SÉNT ÓF tâ-DEI.", pt: "Custa 49,99, mas está com 20% de desconto hoje." },
      { s: "A", en: "Nice! I'll take it.", pr: "NAIS! ail TEI-kit.", pt: "Legal! Vou levar." },
      { s: "B", en: "Great. Cash or card?", pr: "GREIT. KÉSH âr KÁRD?", pt: "Ótimo. Dinheiro ou cartão?" },
      { s: "A", en: "Card. What's your return policy?", pr: "KÁRD. uáts iâr ri-TÂRN PÁ-lâ-si?", pt: "Cartão. Qual a política de troca?" },
      { s: "B", en: "You have thirty days with the receipt.", pr: "iuu HÉV THÂR-di DEIZ uidh dhâ ri-SIIT.", pt: "Você tem trinta dias com a nota." }
    ],
    phrases: [
      { en: "Do you have this in a smaller size?", pr: "dâ iâ HÉV dhis in â SMÓ-lâr SAIZ?", pt: "Tem num tamanho menor?" },
      { en: "Can I try this on?", pr: "kân ai TRAI dhi-sán?", pt: "Posso experimentar?" },
      { en: "It's too big.", pr: "its TUU BIG.", pt: "Está grande demais." },
      { en: "Is this on sale?", pr: "IZ dhis án SEIL?", pt: "Isso está em promoção?" },
      { en: "Can I get a bag?", pr: "kân ai GUÉ-dâ BÉG?", pt: "Pode me dar uma sacola?" }
    ],
    notes: [
      "$49.99 se diz \"forty-nine ninety-nine\": dois números separados.",
      "FIF-TIIN (15) x FIF-ti (50): nos \"-teen\" a força vai no final, nas dezenas vai no começo. Vale para 13/30, 14/40...",
      "\"Twenty\" na fala rápida perde o t: TUÉ-ni.",
      "\"On sale\" = em promoção. \"For sale\" = à venda."
    ]
  },
  {
    id: "l10",
    title: "Reunião online",
    en: "You're on mute.",
    ctx: "Uma call de trabalho: microfone mudo, conexão caindo, atualização de projeto. Tudo que acontece em toda reunião.",
    speakers: { A: "Você", B: "Mia", C: "Sam" },
    lines: [
      { s: "B", en: "Hi everyone. Can you hear me okay?", pr: "HAI ÉV-ri-uân. kân iâ HIR mii ou-KEI?", pt: "Oi, pessoal. Vocês estão me ouvindo bem?" },
      { s: "C", en: "Yes, loud and clear.", pr: "IÉS, LAUD ân KLIR.", pt: "Sim, alto e claro." },
      { s: "B", en: "Lucas, I think you're on mute.", pr: "LUU-kâs, ai THINK iur án MIUUT.", pt: "Lucas, acho que você está no mudo." },
      { s: "A", en: "Sorry about that! Can you hear me now?", pr: "SÁ-ri â-BAUT DHÉT! kân iâ HIR mii NAU?", pt: "Desculpa! Estão me ouvindo agora?" },
      { s: "B", en: "Yep, we can hear you. Let's get started.", pr: "IÉP, uii kân HIR iâ. léts guét STÁR-did.", pt: "Sim, estamos te ouvindo. Vamos começar." },
      { s: "B", en: "Lucas, can you give us a quick update on the project?", pr: "LUU-kâs, kân iâ GUI-vâs â KUIK ÂP-deit án dhâ PRÁ-djékt?", pt: "Lucas, pode dar uma atualização rápida do projeto?" },
      { s: "A", en: "Sure. We're almost done with the first phase.", pr: "SHUR. uir ÓL-moust DÂN uidh dhâ FÂRST FEIZ.", pt: "Claro. Estamos quase terminando a primeira fase." },
      { s: "A", en: "There's one issue, though. We need more time for testing.", pr: "dhérz UÂN I-shuu, DHOU. uii NIID mór TAIM fâr TÉS-ting.", pt: "Tem um problema, porém. Precisamos de mais tempo para testes." },
      { s: "B", en: "How much more time do you need?", pr: "HAU mâtch MÓR taim dâ iâ NIID?", pt: "De quanto tempo a mais vocês precisam?" },
      { s: "A", en: "About a week.", pr: "â-BAU-dâ UIIK.", pt: "Mais ou menos uma semana." },
      { s: "B", en: "Okay, that works. Can you send me an email with the details?", pr: "ou-KEI, DHÉT uârks. kân iâ SÉND mii ân II-meil uidh dhâ DII-teilz?", pt: "Ok, pode ser. Pode me mandar um e-mail com os detalhes?" },
      { s: "C", en: "Sorry, you're breaking up. Could you repeat that?", pr: "SÁ-ri, iur BREI-king ÂP. KUD-jâ ri-PIIT dhét?", pt: "Desculpa, você está cortando. Pode repetir?" },
      { s: "A", en: "I said I'll send the details by email today.", pr: "ai SÉD ail SÉND dhâ DII-teilz bai II-meil tâ-DEI.", pt: "Eu disse que vou mandar os detalhes por e-mail hoje." }
    ],
    phrases: [
      { en: "Can you see my screen?", pr: "kân iâ SII mai SKRIIN?", pt: "Vocês estão vendo minha tela?" },
      { en: "Let me share my screen.", pr: "LÉ-mii SHÉR mai SKRIIN.", pt: "Deixa eu compartilhar minha tela." },
      { en: "Sorry, go ahead.", pr: "SÁ-ri, gou â-HÉD.", pt: "Desculpa, pode falar." },
      { en: "Let's circle back to that.", pr: "léts SÂR-kâl BÉK tâ dhét.", pt: "Vamos voltar nesse assunto depois." },
      { en: "I'll follow up by email.", pr: "ail FÁ-lou ÂP bai II-meil.", pt: "Eu retomo isso por e-mail." }
    ],
    notes: [
      "\"Said\" se pronuncia SÉD, não \"seid\".",
      "\"You're breaking up\" = você está cortando (conexão ruim).",
      "Quando duas pessoas começam a falar juntas: \"Sorry, go ahead\" (desculpa, pode falar).",
      "\"Though\" no fim da frase significa \"porém\": There's one issue, though."
    ]
  },
  {
    id: "l11",
    title: "Combinando com amigos",
    en: "Wanna come?",
    ctx: "Chamando uma amiga pra um churrasco no sábado. Inglês bem informal, cheio de gonna e wanna.",
    speakers: { A: "Você", B: "Sarah" },
    lines: [
      { s: "A", en: "Hey, are you free this Saturday?", pr: "HEI, âr iâ FRII dhis SÉ-dâr-dei?", pt: "Oi, você está livre neste sábado?" },
      { s: "B", en: "I think so. Why?", pr: "ai THINK sou. UAI?", pt: "Acho que sim. Por quê?" },
      { s: "A", en: "A few of us are going to a barbecue. Wanna come?", pr: "â FIUU âv âs âr GOU-ing tuu â BÁR-bi-kiuu. UÁ-nâ KÂM?", pt: "Uma galera vai num churrasco. Quer vir?" },
      { s: "B", en: "Sounds fun! What time?", pr: "SAUNDZ FÂN! uát TAIM?", pt: "Parece legal! Que horas?" },
      { s: "A", en: "Around two. It's at Mike's place.", pr: "â-RAUND TUU. its ât MAIKS PLEIS.", pt: "Lá pelas duas. É na casa do Mike." },
      { s: "B", en: "Should I bring anything?", pr: "SHUD ai BRING É-ni-thing?", pt: "Levo alguma coisa?" },
      { s: "A", en: "Maybe some drinks?", pr: "MEI-bii sâm DRINKS?", pt: "Talvez umas bebidas?" },
      { s: "B", en: "Sure. Can I bring a friend?", pr: "SHUR. kân ai BRING â FRÉND?", pt: "Claro. Posso levar uma amiga?" },
      { s: "A", en: "Of course! The more, the merrier.", pr: "âv KÓRS! dhâ MÓR, dhâ MÉ-ri-âr.", pt: "Claro! Quanto mais gente, melhor." },
      { s: "B", en: "Awesome. Text me the address.", pr: "Ó-sâm. TÉKS mii dhii É-drés.", pt: "Show. Me manda o endereço por mensagem." },
      { s: "A", en: "Will do. See you Saturday!", pr: "uil DUU. SII iâ SÉ-dâr-dei!", pt: "Pode deixar. Te vejo no sábado!" },
      { s: "B", en: "Can't wait!", pr: "KÉNT UEIT!", pt: "Mal posso esperar!" }
    ],
    phrases: [
      { en: "What are you up to this weekend?", pr: "uát âr iâ ÂP tuu dhis UIIK-énd?", nat: "UÁ-dâr-iâ ÂP-tâ dhis UIIK-énd?", pt: "O que você vai fazer no fim de semana?" },
      { en: "I'm down!", pr: "aim DAUN!", pt: "Tô dentro!" },
      { en: "I can't make it.", pr: "ai KÉNT MEI-kit.", pt: "Não vou conseguir ir." },
      { en: "Rain check?", pr: "REIN tchék?", pt: "Fica pra próxima?" },
      { en: "I'm running late.", pr: "aim RÂ-ning LEIT.", pt: "Estou atrasado." },
      { en: "I'm gonna be there at eight.", pr: "aim GÂ-nâ bii DHÉR ât EIT.", pt: "Vou estar lá às oito." }
    ],
    notes: [
      "\"Wanna\" = want to. \"Gonna\" = going to. \"Gotta\" = got to. Escreva do jeito normal, mas saiba reconhecer no áudio.",
      "\"I'm down\" = tô dentro. \"Rain check?\" = deixa pra outra vez?",
      "\"Mike's place\" = a casa do Mike. \"Place\" é usado para casa/apartamento de alguém."
    ]
  },
  {
    id: "l12",
    title: "Na farmácia",
    en: "I have a sore throat.",
    ctx: "Você acordou mal e vai à farmácia. Sintomas, alergias e como tomar o remédio.",
    speakers: { A: "Você", B: "Farmacêutico" },
    lines: [
      { s: "B", en: "Hi, how can I help you?", pr: "HAI, hau kân ai HÉLP iâ?", pt: "Oi, como posso ajudar?" },
      { s: "A", en: "Hi. I have a sore throat and a headache.", pr: "HAI. ai HÉ-vâ SÓR THROUT ând â HÉ-deik.", pt: "Oi. Estou com dor de garganta e dor de cabeça." },
      { s: "B", en: "How long have you had these symptoms?", pr: "hau LÓNG âv iâ HÉD dhiiz SIMP-tâmz?", pt: "Há quanto tempo você tem esses sintomas?" },
      { s: "A", en: "Since yesterday.", pr: "sins IÉS-târ-dei.", pt: "Desde ontem." },
      { s: "B", en: "Do you have a fever?", pr: "dâ iâ HÉ-vâ FII-vâr?", pt: "Está com febre?" },
      { s: "A", en: "I don't think so.", pr: "ai DOUNT THINK sou.", pt: "Acho que não." },
      { s: "B", en: "Are you allergic to any medication?", pr: "âr iâ â-LÂR-djik tâ É-ni mé-di-KEI-shân?", pt: "Tem alergia a algum medicamento?" },
      { s: "A", en: "No, I'm not.", pr: "NOU, aim NÁT.", pt: "Não, não tenho." },
      { s: "B", en: "Okay. Take one of these every six hours.", pr: "ou-KEI. TEIK UÂN âv dhiiz ÉV-ri SIKS AU-ârz.", pt: "Ok. Tome um destes a cada seis horas." },
      { s: "A", en: "Should I take it with food?", pr: "SHUD ai TEI-kit uidh FUUD?", pt: "Devo tomar junto com comida?" },
      { s: "B", en: "Yes, it's better on a full stomach.", pr: "IÉS, its BÉ-dâr án â FUL STÂ-mâk.", pt: "Sim, é melhor de estômago cheio." },
      { s: "B", en: "If you don't feel better in three days, see a doctor.", pr: "if iâ DOUNT FIIL BÉ-dâr in THRII DEIZ, SII â DÁK-târ.", pt: "Se não melhorar em três dias, procure um médico." },
      { s: "A", en: "Got it. Thanks a lot.", pr: "GÁ-dit. THÉNK-sâ LÁT.", pt: "Entendi. Muito obrigado." }
    ],
    phrases: [
      { en: "I need something for a cold.", pr: "ai NIID SÂM-thing fâr â KOULD.", pt: "Preciso de algo para resfriado." },
      { en: "I feel sick.", pr: "ai fiil SIK.", pt: "Estou me sentindo mal." },
      { en: "It hurts here.", pr: "it HÂRTS HIR.", pt: "Dói aqui." },
      { en: "Do I need a prescription?", pr: "dâ ai NIID â pri-SKRIP-shân?", pt: "Preciso de receita?" },
      { en: "I need to see a doctor.", pr: "ai NIID tâ SII â DÁK-târ.", pt: "Preciso ver um médico." }
    ],
    notes: [
      "\"Hour\" tem o H mudo: AU-âr. \"Every six hours\" = a cada seis horas.",
      "FIIL (feel, sentir) x FIL (fill, encher): o \"ii\" é longo, o \"i\" é curto e relaxado.",
      "\"Stomach\" se pronuncia STÂ-mâk. O \"ch\" aqui tem som de k."
    ]
  }
];

/* Guia do sistema de pronúncia. `ex` é lido pela voz; `pr` é como escrevemos. */
window.SOUND_GUIDE = {
  vowels: [
    { sym: "ii", ex: "see", pr: "sii", tip: "I longo. Estique e sorria um pouco." },
    { sym: "i", ex: "sit", pr: "sit", tip: "I curto e relaxado, quase um ê. Nunca estique." },
    { sym: "é", ex: "bed, cat", pr: "béd, két", tip: "É aberto. Em \"cat\" abra a boca ainda mais que em \"bed\"." },
    { sym: "á", ex: "hot, what", pr: "hát, uát", tip: "Á de \"pá\", boca bem aberta." },
    { sym: "ó", ex: "talk, more", pr: "tók, mór", tip: "Ó de \"avó\"." },
    { sym: "â", ex: "cup, about", pr: "kâp, â-BAUT", tip: "Som neutro, boca relaxada, como o \"a\" de \"cama\". É o som mais comum do inglês." },
    { sym: "u", ex: "book, good", pr: "buk, gud", tip: "U curto e relaxado." },
    { sym: "uu", ex: "food, you", pr: "fuud, iuu", tip: "U longo, lábios em bico." },
    { sym: "âr", ex: "work, water", pr: "uârk, UÁ-dâr", tip: "O â com R americano. É o som de \"er\", \"ir\", \"ur\", \"or\" átono." },
    { sym: "ei", ex: "day, name", pr: "dei, neim", tip: "Como em \"lei\"." },
    { sym: "ai", ex: "my, time", pr: "mai, taim", tip: "Como em \"pai\"." },
    { sym: "ói", ex: "boy", pr: "bói", tip: "Como em \"herói\"." },
    { sym: "ou", ex: "go, no", pr: "gou, nou", tip: "Como em \"vou\", falado inteiro. Nunca \"gô\"." },
    { sym: "au", ex: "now, how", pr: "nau, hau", tip: "Como em \"mau\"." }
  ],
  consonants: [
    { sym: "th", ex: "think, three", pr: "think, thrii", tip: "Ponta da língua entre os dentes e sopre. Não é t, f nem s." },
    { sym: "dh", ex: "the, this", pr: "dhâ, dhis", tip: "Mesma posição do th, mas com voz (a garganta vibra). Não é d." },
    { sym: "r", ex: "red, car", pr: "réd, kár", tip: "Sempre o R americano: enrole a língua pra trás sem tocar em nada. Nunca o r de \"rato\"." },
    { sym: "h", ex: "house, how", pr: "haus, hau", tip: "Só ar saindo, como o r de \"rato\" bem suave." },
    { sym: "s / ss", ex: "yes, city", pr: "iés, SI-di", tip: "Sempre o s de \"sapo\", mesmo entre vogais." },
    { sym: "z", ex: "is, please", pr: "iz, pliiz", tip: "Som de z. Muito s escrito em inglês soa z." },
    { sym: "sh", ex: "she, sure", pr: "shii, shur", tip: "Como o ch de \"chuva\"." },
    { sym: "tch", ex: "check, much", pr: "tchék, mâtch", tip: "Como em \"tchau\"." },
    { sym: "dj", ex: "job, just", pr: "djáb, djâst", tip: "Como o di de \"dia\" no Rio." },
    { sym: "ng", ex: "sing, going", pr: "sing, GOU-ing", tip: "Nasal no fundo da boca. Não pronuncie um g separado e não diga \"singui\"." },
    { sym: "l final", ex: "feel, well", pr: "fiil, uél", tip: "A língua encosta atrás dos dentes de cima. Não vira u: é fiil, não \"fiu\"." },
    { sym: "t / d", ex: "tea, day", pr: "tii, dei", tip: "Sempre secos. \"ti\" aqui é t + i, nunca \"tchi\". \"di\" nunca é \"dji\"." },
    { sym: "d (do t)", ex: "water, got it", pr: "UÁ-dâr, GÁ-dit", tip: "No inglês americano, o t entre vogais vira um d rapidinho." },
    { sym: "gu", ex: "get, give", pr: "guét, guiv", tip: "G de \"gato\". Escrevemos gu antes de e/i, igual no português." },
    { sym: "u + vogal", ex: "we, what", pr: "uii, uát", tip: "Soa como w: um u rápido que emenda na vogal." },
    { sym: "i + vogal", ex: "yes, you", pr: "iés, iuu", tip: "Soa como y: um i rápido que emenda na vogal." }
  ],
  pairs: [
    [{ ex: "ship", pr: "ship" }, { ex: "sheep", pr: "shiip" }],
    [{ ex: "live", pr: "liv" }, { ex: "leave", pr: "liiv" }],
    [{ ex: "full", pr: "ful" }, { ex: "fool", pr: "fuul" }],
    [{ ex: "I can go.", pr: "ai kân GOU." }, { ex: "I can't go.", pr: "ai KÉNT GOU." }],
    [{ ex: "fifteen", pr: "fif-TIIN" }, { ex: "fifty", pr: "FIF-ti" }],
    [{ ex: "three", pr: "thrii" }, { ex: "tree", pr: "trii" }],
    [{ ex: "walk", pr: "uók" }, { ex: "work", pr: "uârk" }],
    [{ ex: "street", pr: "striit" }, { ex: "straight", pr: "streit" }]
  ],
  weak: [
    { w: "to", strong: "tuu", weak: "tâ" },
    { w: "for", strong: "fór", weak: "fâr" },
    { w: "and", strong: "énd", weak: "ând / ân" },
    { w: "can", strong: "kén", weak: "kân" },
    { w: "you", strong: "iuu", weak: "iâ" },
    { w: "your", strong: "iór", weak: "iâr" },
    { w: "of", strong: "âv", weak: "âv / â" },
    { w: "the", strong: "dhii", weak: "dhâ" },
    { w: "was", strong: "uáz", weak: "uâz" },
    { w: "do", strong: "duu", weak: "dâ" },
    { w: "have", strong: "hév", weak: "âv" },
    { w: "at", strong: "ét", weak: "ât" }
  ],
  chunks: [
    { en: "going to", sounds: "gonna", pr: "GÂ-nâ" },
    { en: "want to", sounds: "wanna", pr: "UÁ-nâ" },
    { en: "got to", sounds: "gotta", pr: "GÁ-dâ" },
    { en: "let me", sounds: "lemme", pr: "LÉ-mii" },
    { en: "did you", sounds: "didja", pr: "DI-djâ" },
    { en: "could you", sounds: "couldja", pr: "KUD-jâ" },
    { en: "what do you", sounds: "whaddaya", pr: "UÁ-dâ-iâ" },
    { en: "kind of", sounds: "kinda", pr: "KAIN-dâ" }
  ]
};
