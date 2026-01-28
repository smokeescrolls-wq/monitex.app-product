export type ServiceInvestigationConfig = {
  key: string
  title: string
  howItWorksTitle: string
  howItWorksBody: string
  placeholder: string
  examplesTitle: string
  examples: string[]
  costCredits: number
  steps: string[]
}

export const SERVICE_INVESTIGATION: Record<string, ServiceInvestigationConfig> = {
  facebook: {
    key: "facebook",
    title: "Investigação de perfil do Facebook",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Cole a URL completa do perfil que deseja analisar. A análise é uma simulação de fluxo e deve ser usada apenas com dados autorizados (ex.: links públicos, relatórios exportados).",
    placeholder: "Cole a URL do perfil (facebook.com/username)",
    examplesTitle: "Exemplos válidos:",
    examples: [
      "facebook.com/username",
      "https://www.facebook.com/username",
      "fb.com/username",
      "m.facebook.com/username",
    ],
    costCredits: 45,
    steps: [
      "Conectando ao servidor seguro...",
      "Validando link e permissões...",
      "Coletando dados públicos e metadados...",
      "Indexando informações e relações...",
      "Gerando relatório final...",
    ],
  },

  whatsapp: {
    key: "whatsapp",
    title: "Investigando WhatsApp",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Informe um identificador (ex.: número) para iniciar a simulação do processo. Use apenas informações autorizadas.",
    placeholder: "(47) 99999-9999",
    examplesTitle: "Exemplos válidos:",
    examples: ["(47) 99999-9999", "+55 47 99999-9999"],
    costCredits: 40,
    steps: [
      "Conectando ao servidor seguro...",
      "Preparando pipeline de análise...",
      "Sincronizando histórico autorizado...",
      "Processando mídias (quando aplicável)...",
      "Gerando relatório final...",
    ],
  },

  instagram: {
    key: "instagram",
    title: "Investigação de perfil do Instagram",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Digite um username para iniciar a simulação do fluxo. Use apenas dados públicos/autorizados.",
    placeholder: "@username",
    examplesTitle: "Exemplos válidos:",
    examples: ["@username", "username"],
    costCredits: 0,
    steps: [
      "Conectando ao servidor seguro...",
      "Validando usuário...",
      "Carregando dados públicos...",
      "Processando insights...",
      "Gerando relatório final...",
    ],
  },

  location: {
    key: "location",
    title: "Investigação de localização",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Informe um ponto (ex.: link/coords) para simular o pipeline de análise. Use somente dados autorizados.",
    placeholder: "Link/coords (ex.: -26.3044,-48.8487)",
    examplesTitle: "Exemplos válidos:",
    examples: ["-26.3044,-48.8487", "https://maps.app.goo.gl/..."],
    costCredits: 60,
    steps: [
      "Conectando ao servidor seguro...",
      "Validando entrada...",
      "Normalizando coordenadas/rotas...",
      "Analisando padrões...",
      "Gerando relatório final...",
    ],
  },

  sms: {
    key: "sms",
    title: "Investigação de SMS",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Informe um identificador para simular o fluxo. Use apenas dados autorizados.",
    placeholder: "Identificador",
    examplesTitle: "Exemplos válidos:",
    examples: ["device_01", "session_abc123"],
    costCredits: 30,
    steps: [
      "Conectando ao servidor seguro...",
      "Validando sessão...",
      "Carregando mensagens autorizadas...",
      "Classificando conteúdo...",
      "Gerando relatório final...",
    ],
  },

  calls: {
    key: "calls",
    title: "Investigação de Chamadas",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Informe um identificador para simular o fluxo. Use apenas dados autorizados.",
    placeholder: "Identificador",
    examplesTitle: "Exemplos válidos:",
    examples: ["device_01", "session_abc123"],
    costCredits: 25,
    steps: [
      "Conectando ao servidor seguro...",
      "Validando sessão...",
      "Carregando registros autorizados...",
      "Calculando métricas...",
      "Gerando relatório final...",
    ],
  },

  camera: {
    key: "camera",
    title: "Investigação de Câmera",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Informe um identificador para simular o fluxo. Use apenas dados autorizados.",
    placeholder: "Identificador",
    examplesTitle: "Exemplos válidos:",
    examples: ["device_01", "session_abc123"],
    costCredits: 55,
    steps: [
      "Conectando ao servidor seguro...",
      "Validando sessão...",
      "Carregando mídias autorizadas...",
      "Processando arquivos...",
      "Gerando relatório final...",
    ],
  },

  others: {
    key: "others",
    title: "Investigação de Outras Redes",
    howItWorksTitle: "Como funciona:",
    howItWorksBody:
      "Informe um termo/URL para simular o fluxo. Use apenas dados públicos/autorizados.",
    placeholder: "Termo/URL",
    examplesTitle: "Exemplos válidos:",
    examples: ["https://site.com/perfil", "username"],
    costCredits: 70,
    steps: [
      "Conectando ao servidor seguro...",
      "Validando entrada...",
      "Indexando fontes públicas...",
      "Correlacionando resultados...",
      "Gerando relatório final...",
    ],
  },
}
