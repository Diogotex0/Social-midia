export interface CommercialDate {
  month: number;
  day: number;
  title: string;
  emoji: string;
  type: "holiday" | "commemorative" | "commercial";
  niches: string[];
  ideas: string[];
  hooks: string[];
}

export const COMMERCIAL_DATES: CommercialDate[] = [
  // JANEIRO
  {
    month: 1, day: 1,
    title: "Ano Novo",
    emoji: "🎆",
    type: "holiday",
    niches: ["Todos os nichos", "Motivação", "Lifestyle", "Negócios"],
    ideas: [
      "Reflexão sobre o ano que passou e metas para o novo ano",
      "Publique suas metas de 2026 e convide seguidores a compartilhar as delas",
      "Post motivacional: o que você vai conquistar esse ano?",
      "Promoção especial de Ano Novo para seus produtos/serviços",
      "Retrospectiva do ano com os melhores momentos da sua marca",
    ],
    hooks: [
      "Um novo ano começa com uma escolha. Qual a sua?",
      "2026 chegou. E você, está pronto?",
      "Ano novo, versão nova. Veja o que mudou aqui.",
    ],
  },
  {
    month: 1, day: 25,
    title: "Dia do Turismo",
    emoji: "✈️",
    type: "commemorative",
    niches: ["Turismo", "Lifestyle", "Fotografia", "Gastronomia"],
    ideas: [
      "Mostre os destinos que você recomenda para viajar",
      "Dicas de viagem com baixo orçamento",
      "Lugares incríveis para visitar no Brasil",
      "Post interativo: qual o próximo destino dos seus seguidores?",
    ],
    hooks: [
      "Você sabia que viajar pode mudar sua vida?",
      "O mundo é grande demais para ficar parado.",
    ],
  },

  // FEVEREIRO
  {
    month: 2, day: 16,
    title: "Carnaval",
    emoji: "🎭",
    type: "commemorative",
    niches: ["Todos os nichos", "Moda", "Gastronomia", "Entretenimento", "Turismo"],
    ideas: [
      "Post temático de carnaval com as cores da sua marca",
      "Promoção especial de carnaval",
      "Conteúdo leve e divertido para engajar no feriado",
      "Os bastidores do carnaval da equipe",
      "Post interativo: você vai curtir o carnaval ou descansar?",
    ],
    hooks: [
      "É carnaval! Mas a gente não para.",
      "Enquanto o Brasil desfila, a gente tem uma surpresa pra você.",
      "Carnaval chegou. E veio com tudo.",
    ],
  },
  {
    month: 2, day: 2,
    title: "Dia de Iemanjá",
    emoji: "🌊",
    type: "commemorative",
    niches: ["Cultura", "Religião", "Turismo", "Gastronomia"],
    ideas: [
      "Conte a história e significado desta data",
      "Mostre as festividades na sua cidade",
      "Post sobre diversidade religiosa e respeito",
    ],
    hooks: [
      "Uma das datas mais bonitas da cultura brasileira.",
      "Você conhece a história por trás desta celebração?",
    ],
  },
  {
    month: 2, day: 14,
    title: "Dia dos Namorados (Internacional)",
    emoji: "💝",
    type: "commercial",
    niches: ["Todos os nichos", "Moda", "Gastronomia", "Beleza", "Presentes"],
    ideas: [
      "Sugestões de presentes para o Dia dos Namorados",
      "Post de casal com produtos do seu nicho",
      "Promoção especial para casais",
      "Ideias de programas românticos",
      "Post engajador: como você vai comemorar?",
    ],
    hooks: [
      "O amor merece ser comemorado. Veja nossas sugestões.",
      "Surpreenda quem você ama com isso.",
    ],
  },

  // MARÇO
  {
    month: 3, day: 8,
    title: "Dia Internacional da Mulher",
    emoji: "👩",
    type: "commemorative",
    niches: ["Todos os nichos", "Moda", "Beleza", "Saúde", "Empoderamento"],
    ideas: [
      "Homenagem às mulheres que inspiram o seu negócio",
      "Post sobre conquistas femininas na sua área",
      "Depoimentos de mulheres incríveis da sua audiência",
      "Promoção especial para mulheres",
      "Conteúdo educativo sobre igualdade de gênero",
    ],
    hooks: [
      "Para todas as mulheres que constroem o mundo todos os dias.",
      "Hoje e sempre: obrigado por tudo que vocês representam.",
    ],
  },
  {
    month: 3, day: 15,
    title: "Dia do Consumidor",
    emoji: "🛒",
    type: "commercial",
    niches: ["E-commerce", "Varejo", "Serviços", "Todos os nichos"],
    ideas: [
      "Promoção especial de Dia do Consumidor",
      "Mostre o que torna sua empresa focada no cliente",
      "Depoimentos de clientes satisfeitos",
      "Oferta relâmpago nas redes sociais",
      "Post sobre seus valores de atendimento ao cliente",
    ],
    hooks: [
      "Hoje é o seu dia! E temos uma surpresa especial.",
      "Você merece o melhor. É por isso que preparamos isso.",
    ],
  },
  {
    month: 3, day: 19,
    title: "Dia do Pai (em alguns estados) / São José",
    emoji: "👨",
    type: "commemorative",
    niches: ["Família", "Gastronomia", "Presentes", "Moda"],
    ideas: [
      "Homenagem especial aos pais",
      "Sugestões de presentes para o pai",
    ],
    hooks: [
      "Para quem é tudo na vida de alguém.",
    ],
  },
  {
    month: 3, day: 20,
    title: "Início do Outono",
    emoji: "🍂",
    type: "commemorative",
    niches: ["Moda", "Decoração", "Gastronomia", "Beleza"],
    ideas: [
      "Tendências de moda para o outono",
      "Receitas quentinhas da estação",
      "Cuidados com a pele no outono",
      "Decoração de casa para a estação",
    ],
    hooks: [
      "O outono chegou! E com ele, novidades incríveis.",
      "Estação nova, visual novo. Vem ver.",
    ],
  },
  {
    month: 3, day: 25,
    title: "Dia do Evangelista",
    emoji: "✝️",
    type: "commemorative",
    niches: ["Religião", "Espiritualidade"],
    ideas: [
      "Post de fé e reflexão",
      "Versículo do dia com design bonito",
    ],
    hooks: [
      "A fé move montanhas. Qual a sua hoje?",
    ],
  },

  // ABRIL
  {
    month: 4, day: 1,
    title: "Dia da Mentira",
    emoji: "🤥",
    type: "commemorative",
    niches: ["Todos os nichos", "Humor", "Marketing", "Entretenimento"],
    ideas: [
      "Fake news engraçada sobre seu negócio (depois revela a verdade)",
      "As 5 mentiras que todo empreendedor conta pra si mesmo",
      "Post interativo: verdade ou mentira sobre seu produto",
      "Mitos e verdades sobre seu nicho",
      "Anúncio falso de produto impossível (conteúdo viral)",
    ],
    hooks: [
      "Hoje é dia da mentira. Mas isso aqui é 100% verdade.",
      "Prometemos não mentir. Quase.",
      "Você acredita em tudo que vê nas redes sociais?",
    ],
  },
  {
    month: 4, day: 7,
    title: "Dia Mundial da Saúde",
    emoji: "🏥",
    type: "commemorative",
    niches: ["Saúde", "Fitness", "Nutrição", "Bem-estar", "Medicina"],
    ideas: [
      "Dicas de hábitos saudáveis para o dia a dia",
      "Post sobre prevenção de doenças",
      "A importância do check-up anual",
      "Saúde mental: como cuidar no dia a dia",
      "Alimentação saudável para iniciantes",
    ],
    hooks: [
      "Saúde não é tudo, mas sem ela, nada é possível.",
      "Um pequeno hábito pode mudar tudo. Qual o seu hoje?",
    ],
  },
  {
    month: 4, day: 3,
    title: "Sexta-Feira Santa",
    emoji: "✝️",
    type: "holiday",
    niches: ["Gastronomia", "Religião", "Família"],
    ideas: [
      "Receitas de Páscoa e Sexta-feira Santa",
      "Post reflexivo e espiritual",
      "Cardápio especial sem carne",
    ],
    hooks: [
      "Uma data de reflexão, fé e gratidão.",
    ],
  },
  {
    month: 4, day: 5,
    title: "Páscoa",
    emoji: "🐣",
    type: "holiday",
    niches: ["Todos os nichos", "Gastronomia", "Chocolate", "Família", "Varejo"],
    ideas: [
      "Promoção de Páscoa com tema de ovos e chocolate",
      "Receitas de Páscoa criativas",
      "Post de família e união",
      "Caça ao ovo virtual nos stories",
      "Presente de Páscoa: sugestões para todos os gostos",
    ],
    hooks: [
      "A Páscoa chegou cheia de surpresas aqui!",
      "Feliz Páscoa! E não, não é a cesta que você está pensando.",
    ],
  },
  {
    month: 4, day: 22,
    title: "Dia da Terra",
    emoji: "🌍",
    type: "commemorative",
    niches: ["Sustentabilidade", "Eco-friendly", "Educação", "Todos os nichos"],
    ideas: [
      "Ações sustentáveis que sua empresa adota",
      "Dicas de como ser mais sustentável no dia a dia",
      "Post sobre o impacto do consumo consciente",
      "Mostre o lado verde do seu negócio",
    ],
    hooks: [
      "A Terra precisa de nós. O que você está fazendo?",
      "Pequenas ações fazem uma grande diferença.",
    ],
  },
  {
    month: 4, day: 23,
    title: "Dia do Livro",
    emoji: "📚",
    type: "commemorative",
    niches: ["Educação", "Literatura", "Cultura", "Todos os nichos"],
    ideas: [
      "Recomendação dos 5 livros que mudaram sua vida",
      "Cite um livro que todo profissional do seu nicho deve ler",
      "Post interativo: qual livro você está lendo?",
      "Trecho de livro inspirador com design bonito",
    ],
    hooks: [
      "Um livro pode mudar uma vida. Qual mudou a sua?",
      "Me conta: qual foi o último livro que você leu?",
    ],
  },

  // MAIO
  {
    month: 5, day: 1,
    title: "Dia do Trabalho",
    emoji: "⚒️",
    type: "holiday",
    niches: ["Todos os nichos", "RH", "Empreendedorismo", "Carreira"],
    ideas: [
      "Homenagem aos trabalhadores da sua área",
      "Post sobre a importância do trabalho com propósito",
      "Bastidores: mostre sua equipe trabalhando",
      "Reflexão sobre equilíbrio entre trabalho e vida pessoal",
    ],
    hooks: [
      "Hoje é o dia de quem faz acontecer.",
      "Por trás de todo grande negócio, existe um time incrível.",
    ],
  },
  {
    month: 5, day: 10,
    title: "Dia das Mães",
    emoji: "💐",
    type: "commercial",
    niches: ["Todos os nichos", "Flores", "Gastronomia", "Moda", "Beleza", "Presentes"],
    ideas: [
      "Promoção especial de Dia das Mães",
      "Homenagem emocionante para as mães",
      "Sugestões de presentes para todos os orçamentos",
      "Post interativo: marque sua mãe aqui",
      "Depoimento de mães clientes da sua marca",
      "Kit especial para presentear",
    ],
    hooks: [
      "Ela merece muito mais do que um dia.",
      "Para a mulher que é tudo: feliz dia das mães!",
      "O maior amor do mundo merece o melhor presente.",
    ],
  },
  {
    month: 5, day: 18,
    title: "Dia do Sushi / Dia Nacional da Gastronomia",
    emoji: "🍣",
    type: "commemorative",
    niches: ["Gastronomia", "Restaurantes", "Delivery", "Lifestyle"],
    ideas: [
      "Post mostrando o prato mais pedido do seu restaurante",
      "Receita especial do dia",
      "Promoção relâmpago de delivery",
    ],
    hooks: [
      "Hoje é motivo suficiente para pedir comida.",
    ],
  },

  // JUNHO
  {
    month: 6, day: 5,
    title: "Dia do Meio Ambiente",
    emoji: "🌿",
    type: "commemorative",
    niches: ["Sustentabilidade", "Educação", "Todos os nichos"],
    ideas: [
      "Ações ambientais da sua empresa",
      "Dicas de consumo consciente",
      "Post sobre reciclagem e sustentabilidade",
    ],
    hooks: [
      "O planeta não pode esperar. Nem nós.",
    ],
  },
  {
    month: 6, day: 12,
    title: "Dia dos Namorados (Brasil)",
    emoji: "💑",
    type: "commercial",
    niches: ["Todos os nichos", "Moda", "Gastronomia", "Beleza", "Presentes", "Turismo"],
    ideas: [
      "Promoção especial para casais",
      "Sugestões de presentes para ele e para ela",
      "Post de casal com produtos da sua marca",
      "Ideias de programas românticos na cidade",
      "Campanha 'compre junto' com desconto para duplas",
      "Stories interativo: como vocês se conheceram?",
    ],
    hooks: [
      "Amor se demonstra também em pequenos gestos.",
      "Surpreenda quem faz seu coração acelerar.",
      "Dia dos Namorados chegou. E nós preparamos algo especial.",
    ],
  },
  {
    month: 6, day: 13,
    title: "Santo Antônio",
    emoji: "💒",
    type: "holiday",
    niches: ["Gastronomia", "Cultura", "Religião"],
    ideas: [
      "Post sobre o início das festas juninas",
      "Receitas típicas juninas",
    ],
    hooks: [
      "Arraiá chegou! Bora festejar?",
    ],
  },
  {
    month: 6, day: 24,
    title: "Festa Junina / São João",
    emoji: "🎉",
    type: "commemorative",
    niches: ["Gastronomia", "Moda", "Cultura", "Eventos", "Todos os nichos"],
    ideas: [
      "Receitas típicas juninas: canjica, pamonha, bolo de milho",
      "Moda junina: looks criativos para arraial",
      "Promoção com tema de festa junina",
      "Post decorado com tema de arraial",
      "Quiz junino nos stories",
    ],
    hooks: [
      "Arraiá do [nome da marca] chegou!",
      "É festa! E você está convidado.",
    ],
  },

  // JULHO
  {
    month: 7, day: 20,
    title: "Dia do Amigo",
    emoji: "🤝",
    type: "commemorative",
    niches: ["Todos os nichos", "Alimentação", "Entretenimento", "Lifestyle"],
    ideas: [
      "Post para marcar o melhor amigo",
      "Promoção: traga um amigo e ganhe desconto",
      "Conteúdo sobre amizade verdadeira",
      "Post interativo: marque aquele amigo que...",
    ],
    hooks: [
      "Todo mundo tem aquele amigo. Marca ele aqui.",
      "Amigo bom é aquele que te manda esse post.",
    ],
  },
  {
    month: 7, day: 25,
    title: "Dia do Motorista",
    emoji: "🚗",
    type: "commemorative",
    niches: ["Automotivo", "Tecnologia", "Serviços", "Seguros"],
    ideas: [
      "Homenagem aos motoristas",
      "Dicas de segurança no trânsito",
      "Promoção especial para o segmento automotivo",
    ],
    hooks: [
      "Para quem coloca todo mundo no lugar certo.",
    ],
  },

  // AGOSTO
  {
    month: 8, day: 11,
    title: "Dia do Estudante",
    emoji: "🎓",
    type: "commemorative",
    niches: ["Educação", "Tecnologia", "Cursos", "Livros"],
    ideas: [
      "Promoção especial para estudantes",
      "Dicas de produtividade nos estudos",
      "Post motivacional para quem está estudando",
      "Lançamento de curso ou conteúdo educativo",
    ],
    hooks: [
      "Estudar é o melhor investimento que existe.",
      "Para quem não desiste mesmo quando é difícil.",
    ],
  },
  {
    month: 8, day: 9,
    title: "Dia dos Pais",
    emoji: "👨‍👦",
    type: "commercial",
    niches: ["Todos os nichos", "Moda", "Gastronomia", "Tecnologia", "Presentes"],
    ideas: [
      "Promoção especial de Dia dos Pais",
      "Sugestões de presentes para o pai",
      "Homenagem emocionante para os pais",
      "Post interativo: o que você aprendeu com seu pai?",
      "Campanha 'presente ideal' para diferentes perfis de pai",
    ],
    hooks: [
      "Para o herói que nem capa usa.",
      "Ele merece o melhor. E nós temos.",
      "Como agradecer alguém que deu tudo?",
    ],
  },
  {
    month: 8, day: 15,
    title: "Dia de Nossa Senhora / Assunção",
    emoji: "🙏",
    type: "holiday",
    niches: ["Religião", "Espiritualidade", "Família"],
    ideas: [
      "Post de fé e reflexão",
      "Mensagem de esperança e gratidão",
    ],
    hooks: [
      "Fé que move e transforma.",
    ],
  },
  {
    month: 8, day: 25,
    title: "Dia do Fotógrafo",
    emoji: "📸",
    type: "commemorative",
    niches: ["Fotografia", "Arte", "Marketing", "Moda"],
    ideas: [
      "Mostre os bastidores das fotos do seu perfil",
      "Homenagem ao fotógrafo da sua equipe",
      "Post sobre a importância de fotos de qualidade para marcas",
      "Before e after de uma produção fotográfica",
    ],
    hooks: [
      "Uma boa foto vale mais que mil palavras.",
      "Por trás de toda boa imagem, há um profissional incrível.",
    ],
  },

  // SETEMBRO
  {
    month: 9, day: 7,
    title: "Independência do Brasil",
    emoji: "🇧🇷",
    type: "holiday",
    niches: ["Todos os nichos", "Cultura", "Gastronomia"],
    ideas: [
      "Post patriótico com as cores do Brasil",
      "Curiosidades sobre a história do Brasil",
      "Promoção especial com tema brasileiro",
      "O orgulho de ser brasileiro na sua área",
    ],
    hooks: [
      "Independência, liberdade e muito orgulho.",
      "Brasil: um país de gente incrível.",
    ],
  },
  {
    month: 9, day: 8,
    title: "Dia da Alfabetização",
    emoji: "📖",
    type: "commemorative",
    niches: ["Educação", "Cultura", "ONGs", "Tecnologia"],
    ideas: [
      "Post sobre a importância da leitura e educação",
      "Indicação de livros para iniciantes",
      "Como sua empresa contribui com a educação",
    ],
    hooks: [
      "Ler transforma. Educar liberta.",
    ],
  },
  {
    month: 9, day: 15,
    title: "Dia do Cliente",
    emoji: "🤩",
    type: "commercial",
    niches: ["Todos os nichos", "E-commerce", "Serviços", "Varejo"],
    ideas: [
      "Promoção especial para clientes fiéis",
      "Mostre depoimentos reais de clientes",
      "Sorteio exclusivo para a comunidade",
      "Post de agradecimento sincero aos clientes",
      "Desconto surpresa nos stories",
    ],
    hooks: [
      "Sem você, nada disso faria sentido. Obrigado!",
      "Hoje é o SEU dia. E temos uma surpresa.",
    ],
  },
  {
    month: 9, day: 21,
    title: "Dia da Árvore / Início da Primavera",
    emoji: "🌸",
    type: "commemorative",
    niches: ["Sustentabilidade", "Moda", "Beleza", "Decoração"],
    ideas: [
      "Post sobre sustentabilidade e natureza",
      "Tendências de primavera no seu nicho",
      "Lançamento de coleção primavera-verão",
      "Dicas de plantas para decorar ambientes",
    ],
    hooks: [
      "A primavera chegou. E com ela, novidades florescendo.",
    ],
  },

  // OUTUBRO
  {
    month: 10, day: 2,
    title: "Dia da Música",
    emoji: "🎵",
    type: "commemorative",
    niches: ["Entretenimento", "Cultura", "Todos os nichos"],
    ideas: [
      "Post com música que representa sua marca",
      "Playlist de trabalho nos stories",
      "Qual música define o seu negócio?",
    ],
    hooks: [
      "A vida seria muito monótona sem música.",
    ],
  },
  {
    month: 10, day: 5,
    title: "Dia do Professor",
    emoji: "🏫",
    type: "commemorative",
    niches: ["Educação", "Cursos", "Tecnologia", "Todos os nichos"],
    ideas: [
      "Homenagem emocionante aos professores",
      "Post sobre alguém que te ensinou algo importante",
      "Promoção especial para professores",
      "Conteúdo: o que você aprendeu que nunca esqueceu?",
    ],
    hooks: [
      "Para quem molda o futuro todos os dias.",
      "Existem profissões que mudam o mundo. Essa é uma delas.",
    ],
  },
  {
    month: 10, day: 12,
    title: "Dia das Crianças / Nossa Senhora Aparecida",
    emoji: "🧸",
    type: "holiday",
    niches: ["Todos os nichos", "Brinquedos", "Educação", "Gastronomia", "Entretenimento"],
    ideas: [
      "Promoção especial de Dia das Crianças",
      "Post nostálgico: como era sua infância",
      "Produto/serviço voltado para o público infantil",
      "Post interativo: qual era seu brinquedo favorito?",
      "Conteúdo leve e divertido para toda a família",
    ],
    hooks: [
      "Toda criança merece um dia especial!",
      "Quem disse que brincar é só para crianças?",
    ],
  },
  {
    month: 10, day: 15,
    title: "Dia do Médico",
    emoji: "👨‍⚕️",
    type: "commemorative",
    niches: ["Saúde", "Medicina", "Bem-estar", "Planos de saúde"],
    ideas: [
      "Homenagem aos profissionais de saúde",
      "Dicas de saúde preventiva",
      "Post sobre a importância de consultas regulares",
    ],
    hooks: [
      "Para quem cuida da vida todos os dias.",
    ],
  },
  {
    month: 10, day: 16,
    title: "Dia Mundial da Alimentação",
    emoji: "🥗",
    type: "commemorative",
    niches: ["Gastronomia", "Nutrição", "Saúde", "Sustentabilidade"],
    ideas: [
      "Post sobre alimentação saudável e consciente",
      "Receitas nutritivas e fáceis",
      "Combate ao desperdício de alimentos",
    ],
    hooks: [
      "Você é o que você come. Literalmente.",
    ],
  },
  {
    month: 10, day: 31,
    title: "Halloween",
    emoji: "🎃",
    type: "commemorative",
    niches: ["Entretenimento", "Gastronomia", "Moda", "Varejo", "Todos os nichos"],
    ideas: [
      "Post temático de Halloween com sua marca",
      "Fantasia criativa com produto ou serviço",
      "Os 5 medos que todo empreendedor tem",
      "Promoção 'assustadora' de Halloween",
      "Post interativo: qual fantasia você usaria?",
    ],
    hooks: [
      "Prepare-se. Algo assustador está chegando.",
      "Os monstros do mercado que você precisa evitar.",
    ],
  },

  // NOVEMBRO
  {
    month: 11, day: 2,
    title: "Dia de Finados",
    emoji: "🕯️",
    type: "holiday",
    niches: ["Reflexão", "Espiritualidade"],
    ideas: [
      "Post reflexivo sobre legado e memória",
      "Mensagem de consolo e esperança",
    ],
    hooks: [
      "Quem vive no coração, nunca parte.",
    ],
  },
  {
    month: 11, day: 15,
    title: "Proclamação da República",
    emoji: "🏛️",
    type: "holiday",
    niches: ["Cultura", "Educação", "Todos os nichos"],
    ideas: [
      "Curiosidades sobre a história do Brasil",
      "Post patriótico",
    ],
    hooks: [
      "135 anos de República. E a história continua.",
    ],
  },
  {
    month: 11, day: 20,
    title: "Dia da Consciência Negra",
    emoji: "✊",
    type: "holiday",
    niches: ["Cultura", "Diversidade", "Educação", "Todos os nichos"],
    ideas: [
      "Post educativo sobre a cultura afro-brasileira",
      "Homenagem a personalidades negras que mudaram o mundo",
      "Ações de diversidade e inclusão da sua empresa",
      "Conteúdo sobre a importância da representatividade",
    ],
    hooks: [
      "Consciência negra é responsabilidade de todos.",
      "Representatividade importa. Sempre.",
    ],
  },
  {
    month: 11, day: 27,
    title: "Black Friday",
    emoji: "🛍️",
    type: "commercial",
    niches: ["Todos os nichos", "E-commerce", "Varejo", "Serviços"],
    ideas: [
      "Promoção de Black Friday com desconto real",
      "Contagem regressiva para a Black Friday",
      "Lista de desejos: o que seus seguidores querem?",
      "Bastidores da preparação para a Black Friday",
      "Post educativo: como não cair em armadilhas da Black Friday",
      "Oferta relâmpago nos stories",
    ],
    hooks: [
      "A maior promoção do ano chegou.",
      "Black Friday de verdade. Sem blá blá blá.",
      "Espera que vem coisa grande por aí...",
    ],
  },

  // DEZEMBRO
  {
    month: 12, day: 1,
    title: "Dia Mundial de Combate à AIDS",
    emoji: "🎗️",
    type: "commemorative",
    niches: ["Saúde", "Educação", "ONGs", "Todos os nichos"],
    ideas: [
      "Post educativo sobre prevenção",
      "Quebre tabus com informação de qualidade",
      "Parceria com causas sociais",
    ],
    hooks: [
      "Informação salva vidas.",
    ],
  },
  {
    month: 12, day: 8,
    title: "Dia de Nossa Senhora da Conceição",
    emoji: "🙏",
    type: "holiday",
    niches: ["Religião", "Família", "Espiritualidade"],
    ideas: [
      "Post de fé e gratidão",
      "Mensagem de esperança para o fim do ano",
    ],
    hooks: [
      "Gratidão por tudo que foi vivido.",
    ],
  },
  {
    month: 12, day: 25,
    title: "Natal",
    emoji: "🎄",
    type: "holiday",
    niches: ["Todos os nichos", "Varejo", "Gastronomia", "Família", "Presentes"],
    ideas: [
      "Mensagem de Natal emocionante e autêntica",
      "Promoção especial de Natal",
      "Sugestões de presentes para todos os perfis",
      "Retrospectiva do ano da sua marca",
      "Post de agradecimento aos clientes pelo ano",
      "Receitas e dicas para a ceia de Natal",
    ],
    hooks: [
      "O presente mais bonito é estar com quem ama.",
      "Feliz Natal! E obrigado por estar com a gente esse ano.",
      "Natal chegou. E nós preparamos algo especial para você.",
    ],
  },
  {
    month: 12, day: 31,
    title: "Réveillon / Véspera de Ano Novo",
    emoji: "🥂",
    type: "commemorative",
    niches: ["Todos os nichos", "Gastronomia", "Moda", "Lifestyle"],
    ideas: [
      "Retrospectiva do ano com os melhores momentos",
      "Post de agradecimento e despedida do ano",
      "Teaser do que vem em 2027",
      "Dicas de looks para a virada",
      "Metas e palavra do ano novo",
    ],
    hooks: [
      "2026 foi incrível. Mas 2027 vai ser melhor.",
      "Obrigado por cada curtida, comentário e mensagem esse ano.",
      "A última postagem do ano. Mas é especial.",
    ],
  },
];

export function getDateEvents(month: number, day: number): CommercialDate[] {
  return COMMERCIAL_DATES.filter(d => d.month === month && d.day === day);
}

export function getMonthEvents(month: number): CommercialDate[] {
  return COMMERCIAL_DATES.filter(d => d.month === month);
}
