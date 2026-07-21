/**
 * ============================================================
 * CONFIGURAÇÕES DO SITE — Luan Albuquerque Fotografia
 * Edite apenas este arquivo para mudar textos, contatos e imagens.
 * Depois de editar, publique de novo (ou atualize no GitHub) para
 * o site online refletir as mudanças.
 * ============================================================
 */
window.SITE_CONFIG = {
  siteName: "Luan Albuquerque Fotografia",
  slogan: "Fotografando seus melhores momentos.",
  tagline:
    "Ensaios, eventos e histórias reais — com olhar cuidadoso e estética atemporal.",

  whatsapp: {
    number: "5521969290654", // formato internacional, só números
    display: "(21) 96929-0654",
    message: "Olá! Gostaria de saber mais sobre um ensaio com a Luan Albuquerque Fotografia.",
  },

  instagram: {
    handle: "LUANFOTOGRAFIAOFC",
    url: "https://instagram.com/LUANFOTOGRAFIAOFC",
  },

  about: {
    title: "Sobre o olhar",
    paragraphs: [
      "Sou Luan Albuquerque, fotógrafo dedicado a registrar os momentos que merecem ficar. Cada sessão é pensada com calma, presença e respeito pela história de quem está na frente da câmera.",
      "Trabalho com ensaios externos, gestante, família, eventos, casamentos e projetos corporativos — sempre buscando imagens honestas, elegantes e cheias de sentimento.",
      "Se você busca um registro que combine técnica e sensibilidade, vamos conversar. Será um prazer fotografar o seu próximo capítulo.",
    ],
    // Deixe vazio para usar o placeholder elegante. Depois, coloque o caminho da foto:
    // image: "assets/photos/luan.jpg",
    image: "",
  },

  services: [
    {
      id: "ensaios",
      title: "Ensaios externos",
      description: "Luz natural, locais com personalidade e direção leve.",
      icon: "assets/icons/feminino.png",
    },
    {
      id: "gestante",
      title: "Gestante",
      description: "Um ensaio delicado para celebrar essa fase única.",
      icon: "assets/icons/gestante.png",
    },
    {
      id: "cha",
      title: "Chá de bebê e revelação",
      description: "Emoção, detalhes e a surpresa do grande momento.",
      icon: "assets/icons/familia.png",
    },
    {
      id: "casamento",
      title: "Casamento",
      description: "Do preparativo ao último brinde, com olhar cinematográfico.",
      icon: "assets/icons/familia.png",
    },
    {
      id: "familia",
      title: "Ensaio de família",
      description: "Conexão real entre gerações, em imagens que aquecem.",
      icon: "assets/icons/familia.png",
    },
    {
      id: "prewedding",
      title: "Pré-wedding",
      description: "A química do casal, sem pressa e com muita intenção.",
      icon: "assets/icons/feminino.png",
    },
    {
      id: "corporativo",
      title: "Corporativo",
      description: "Retratos e eventos de marca com estética profissional.",
      icon: "assets/icons/masculino.png",
    },
    {
      id: "eventos",
      title: "Eventos",
      description: "Cobertura completa com narrativa visual e presença discreta.",
      icon: "assets/icons/eventos.png",
    },
  ],

  /**
   * Portfólio — deixe image vazio para placeholder elegante.
   * Quando tiver fotos reais: image: "assets/photos/casamento-01.jpg"
   */
  portfolio: [
    { id: "portfolio_1", label: "Casamento", ratio: "9/16", image: "" },
    { id: "portfolio_2", label: "Gestante", ratio: "1/1", image: "" },
    { id: "portfolio_3", label: "Família", ratio: "16/9", image: "" },
    { id: "portfolio_4", label: "Ensaio externo", ratio: "9/16", image: "" },
    { id: "portfolio_5", label: "Eventos", ratio: "16/9", image: "" },
    { id: "portfolio_6", label: "Pré-wedding", ratio: "1/1", image: "" },
  ],
};
