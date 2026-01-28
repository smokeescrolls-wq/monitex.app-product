export type LegalKind = "terms" | "privacy";

type LegalDoc = {
  title: string;
  updatedAt: string;
  content: string;
};

export const LEGAL_DOCS: Record<LegalKind, LegalDoc> = {
  terms: {
    title: "Termos de Uso — Monitex.app",
    updatedAt: "Última atualização: Janeiro de 2026",
    content: `1. NATUREZA DO SERVIÇO E ISENÇÃO DE GARANTIAS. O Monitex.app é uma plataforma de ENTRETENIMENTO e SIMULAÇÃO. O usuário reconhece e concorda expressamente que: (a) todos os resultados, dados, informações, relatórios e conteúdos exibidos na plataforma são SIMULADOS, FICTÍCIOS e gerados por algoritmos para fins exclusivos de entretenimento; (b) a plataforma NÃO possui capacidade técnica real de acessar, hackear, invadir ou obter dados privados de redes sociais, dispositivos ou contas de terceiros; (c) qualquer semelhança entre os resultados exibidos e dados reais é mera coincidência; (d) o serviço é fornecido "COMO ESTÁ" e "CONFORME DISPONÍVEL", sem garantias de qualquer natureza, expressas ou implícitas, incluindo, mas não se limitando a, garantias de precisão, confiabilidade, adequação a um propósito específico ou não violação.

2. DECLARAÇÕES DO USUÁRIO. Ao utilizar o serviço, o usuário declara e garante que: (a) possui mais de 18 anos de idade e capacidade civil plena; (b) compreende integralmente que o serviço é de entretenimento e que os resultados são simulados e não correspondem à realidade; (c) não utilizará o serviço com a expectativa de obter informações reais sobre terceiros; (d) assume integral responsabilidade por qualquer interpretação ou uso que faça dos conteúdos exibidos; (e) não responsabilizará a plataforma por qualquer decisão tomada com base nos resultados simulados.

3. LIMITAÇÃO DE RESPONSABILIDADE. Em nenhuma circunstância o Monitex.app, seus proprietários, diretores, funcionários, parceiros ou afiliados serão responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais, punitivos ou exemplares, incluindo, mas não se limitando a, danos por perda de lucros, dados, uso, goodwill ou outras perdas intangíveis, resultantes de: (a) uso ou incapacidade de uso do serviço; (b) qualquer conduta ou conteúdo de terceiros no serviço; (c) conteúdo obtido do serviço; (d) acesso não autorizado, uso ou alteração de suas transmissões ou conteúdo; (e) expectativas não atendidas quanto à funcionalidade real do serviço; (f) decisões pessoais, profissionais, relacionais ou de qualquer natureza tomadas com base nos resultados simulados.

4. INDENIZAÇÃO. O usuário concorda em defender, indenizar e isentar o Monitex.app e seus proprietários, diretores, funcionários e agentes de e contra quaisquer reivindicações, danos, obrigações, perdas, responsabilidades, custos ou dívidas e despesas (incluindo, mas não se limitando a, honorários advocatícios) decorrentes de: (a) uso e acesso ao serviço; (b) violação de qualquer termo destes Termos de Uso; (c) violação de direitos de terceiros, incluindo, mas não se limitando a, direitos de privacidade ou propriedade intelectual; (d) qualquer alegação de que o uso do serviço causou danos a terceiros.

5. AUSÊNCIA DE RELAÇÃO. O uso do serviço não cria qualquer relação de parceria, joint venture, emprego, agência ou franquia entre o usuário e o Monitex.app.

6. POLÍTICA DE REEMBOLSO. Oferecemos garantia de satisfação de 7 (sete) dias corridos a partir da data da compra. O reembolso está sujeito a análise e pode ser solicitado através dos canais de suporte.

7. MODIFICAÇÕES. Reservamo-nos o direito de modificar ou substituir estes termos a qualquer momento, a nosso exclusivo critério. O uso continuado do serviço após quaisquer alterações constitui aceitação dos novos termos.

8. LEI APLICÁVEL E FORO. Estes termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil, independentemente de conflitos de disposições legais. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer controvérsias.

9. INTEGRALIDADE. Estes Termos de Uso constituem o acordo integral entre o usuário e o Monitex.app e substituem todos os acordos anteriores, escritos ou verbais.

AO UTILIZAR O SERVIÇO, O USUÁRIO CONFIRMA QUE LEU, COMPREENDEU E CONCORDA COM TODOS OS TERMOS ACIMA, INCLUINDO A NATUREZA SIMULADA E DE ENTRETENIMENTO DO SERVIÇO.`,
  },

  privacy: {
    title: "Política de Privacidade — Monitex.app",
    updatedAt: "Última atualização: Janeiro de 2026",
    content: `1. INFORMAÇÕES COLETADAS. Coletamos informações que você nos fornece diretamente, incluindo: (a) dados de cadastro como endereço de e-mail; (b) informações de pagamento, que são processadas diretamente por nossos processadores de pagamento terceirizados e não são armazenadas em nossos servidores; (c) dados de uso e navegação coletados automaticamente através de cookies e tecnologias similares, incluindo endereço IP, tipo de navegador, páginas visitadas, tempo de permanência e dados de cliques.

2. USO DAS INFORMAÇÕES. Utilizamos as informações coletadas para: (a) fornecer, operar e manter nosso serviço de entretenimento; (b) processar transações e enviar confirmações relacionadas; (c) enviar comunicações administrativas, atualizações e informações promocionais, dos quais você pode optar por não receber a qualquer momento; (d) analisar tendências de uso para melhorar nossa plataforma; (e) detectar, prevenir e resolver problemas técnicos e de segurança; (f) cumprir obrigações legais aplicáveis.

3. COMPARTILHAMENTO DE INFORMAÇÕES. Não vendemos, alugamos ou comercializamos suas informações pessoais. Podemos compartilhar informações com: (a) processadores de pagamento para completar transações; (b) prestadores de serviços que nos auxiliam na operação da plataforma, sujeitos a obrigações de confidencialidade; (c) autoridades governamentais ou legais quando exigido por lei, ordem judicial ou processo legal; (d) terceiros em caso de fusão, aquisição ou venda de ativos, mediante notificação prévia.

4. COOKIES E TECNOLOGIAS DE RASTREAMENTO. Utilizamos cookies, web beacons e tecnologias similares para coletar informações sobre sua interação com nosso serviço. Você pode configurar seu navegador para recusar cookies, porém isso pode afetar a funcionalidade do serviço. Ao continuar usando o serviço, você consente com o uso de cookies conforme descrito nesta política.

5. SEGURANÇA DOS DADOS. Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro, e não podemos garantir segurança absoluta.

6. SEUS DIREITOS (LGPD). Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a: (a) confirmação da existência de tratamento; (b) acesso aos dados; (c) correção de dados incompletos, inexatos ou desatualizados; (d) anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos; (e) portabilidade dos dados; (f) eliminação dos dados pessoais tratados com consentimento; (g) informação sobre compartilhamento de dados; (h) revogação do consentimento. Para exercer esses direitos, entre em contato através dos canais de suporte.

7. RETENÇÃO DE DADOS. Mantemos suas informações pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei. Dados de transações financeiras são mantidos conforme exigências fiscais e contábeis aplicáveis.

8. MENORES DE IDADE. Nosso serviço é destinado exclusivamente a pessoas maiores de 18 anos. Não coletamos intencionalmente informações de menores de idade. Se tomarmos conhecimento de que coletamos dados de menor, tomaremos medidas para excluir essas informações.

9. TRANSFERÊNCIA INTERNACIONAL. Suas informações podem ser transferidas e mantidas em servidores localizados fora do seu estado, província, país ou outra jurisdição governamental, onde as leis de proteção de dados podem diferir. Ao usar nosso serviço, você consente com essa transferência.

10. ALTERAÇÕES. Podemos atualizar esta política periodicamente. Mudanças significativas serão notificadas por e-mail ou através de aviso destacado em nosso serviço. O uso continuado após alterações constitui aceitação da política revisada.

11. CONTATO. Para dúvidas sobre esta política ou para exercer seus direitos, entre em contato através dos canais de suporte disponíveis na plataforma.`,
  },
};
