
import React from 'react';
import { PageContent } from '@/types/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from './RichTextEditor';

interface PageSettingsProps {
  settings: PageContent;
  onChange: (settings: PageContent) => void;
}

export const PageSettings: React.FC<PageSettingsProps> = ({ settings, onChange }) => {
  const handlePageContentChange = (page: keyof PageContent, content: string) => {
    onChange({
      ...settings,
      [page]: content
    });
  };

  const resetPageContent = (page: keyof PageContent) => {
    let defaultContent = '';
    
    switch(page) {
      case 'aboutUs':
        defaultContent = `
<div class="page-content">
  <h2 class="text-2xl font-bold mb-4">Sobre Nossa Empresa</h2>
  
  <p class="mb-4">Fundada em 2010, a ShopMaster nasceu da paixão por oferecer produtos de qualidade com a melhor experiência de compra online.</p>
  
  <h3 class="text-xl font-semibold mb-2">Nossa História</h3>
  <p class="mb-4">O que começou como uma pequena loja em São Paulo, hoje se tornou uma referência nacional em e-commerce. Nossa jornada foi marcada por inovação constante e compromisso com a satisfação dos clientes.</p>
  
  <h3 class="text-xl font-semibold mb-2">Nossa Missão</h3>
  <p class="mb-4">Proporcionar a melhor experiência de compra online, com produtos de qualidade, preços justos e atendimento excepcional.</p>
  
  <h3 class="text-xl font-semibold mb-2">Nossos Valores</h3>
  <ul class="list-disc pl-5 mb-4">
    <li>Transparência em todas as nossas relações</li>
    <li>Excelência no atendimento ao cliente</li>
    <li>Compromisso com a qualidade dos produtos</li>
    <li>Responsabilidade socioambiental</li>
    <li>Inovação constante</li>
  </ul>
  
  <h3 class="text-xl font-semibold mb-2">Nossa Equipe</h3>
  <p class="mb-4">Contamos com uma equipe de profissionais apaixonados e dedicados, que trabalham diariamente para oferecer a melhor experiência de compra para você.</p>
  
  <div class="bg-gray-100 p-4 rounded-md mt-6">
    <p class="italic">"Nosso compromisso é superar suas expectativas em cada detalhe."</p>
  </div>
</div>`;
        break;
      case 'contact':
        defaultContent = `
<div class="page-content">
  <h2 class="text-2xl font-bold mb-4">Entre em Contato</h2>
  
  <p class="mb-6">Estamos sempre disponíveis para atender você. Utilize os canais abaixo ou preencha o formulário de contato.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
    <div>
      <h3 class="text-xl font-semibold mb-3">Informações de Contato</h3>
      <ul class="space-y-2">
        <li><strong>E-mail:</strong> contato@shopmaster.com</li>
        <li><strong>Telefone:</strong> (11) 99999-9999</li>
        <li><strong>Endereço:</strong> Rua Exemplo, 123 - Centro</li>
      </ul>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Horário de Atendimento</h3>
      <p>Segunda a Sexta: 9h às 18h<br>Sábado: 9h às 13h</p>
      
      <h3 class="text-xl font-semibold mt-6 mb-3">Redes Sociais</h3>
      <p class="flex gap-3">
        <a href="https://facebook.com/shopmaster" class="text-blue-600 hover:underline">Facebook</a>
        <a href="https://instagram.com/shopmaster" class="text-purple-600 hover:underline">Instagram</a>
        <a href="https://twitter.com/shopmaster" class="text-blue-400 hover:underline">Twitter</a>
      </p>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold mb-3">Formulário de Contato</h3>
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Nome</label>
          <input type="text" placeholder="Seu nome" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">E-mail</label>
          <input type="email" placeholder="Seu e-mail" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Assunto</label>
          <input type="text" placeholder="Assunto da mensagem" class="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Mensagem</label>
          <textarea placeholder="Sua mensagem" rows="4" class="w-full px-3 py-2 border rounded-md"></textarea>
        </div>
        <button class="px-4 py-2 bg-primary text-white rounded-md">Enviar Mensagem</button>
      </form>
    </div>
  </div>
  
  <div class="mt-8">
    <h3 class="text-xl font-semibold mb-3">Nossa Localização</h3>
    <div class="bg-gray-100 p-4 h-64 flex items-center justify-center rounded-md">
      <p class="text-center">Aqui você pode inserir um mapa da localização da sua loja.</p>
    </div>
  </div>
</div>`;
        break;
      case 'privacyPolicy':
        defaultContent = `
<div class="page-content">
  <h2 class="text-2xl font-bold mb-4">Política de Privacidade</h2>
  <p class="mb-4">Última atualização: 20 de Maio de 2023</p>
  
  <p class="mb-4">A ShopMaster valoriza a privacidade dos seus usuários e está comprometida em proteger as informações pessoais que você compartilha conosco. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações.</p>
  
  <h3 class="text-xl font-semibold mb-2">1. Informações que Coletamos</h3>
  <p class="mb-4">Coletamos informações quando você cria uma conta, faz uma compra, assina nossa newsletter, participa de promoções ou interage com nosso site. Essas informações podem incluir:</p>
  <ul class="list-disc pl-5 mb-4">
    <li>Nome, endereço, e-mail e número de telefone</li>
    <li>Informações de pagamento (processadas de forma segura por nossos parceiros de pagamento)</li>
    <li>Histórico de compras e produtos visualizados</li>
    <li>Dados de uso do site e preferências</li>
  </ul>
  
  <h3 class="text-xl font-semibold mb-2">2. Como Usamos suas Informações</h3>
  <p class="mb-4">Utilizamos suas informações para:</p>
  <ul class="list-disc pl-5 mb-4">
    <li>Processar pedidos e fornecer os produtos solicitados</li>
    <li>Melhorar nossos produtos e serviços</li>
    <li>Personalizar sua experiência de compra</li>
    <li>Enviar comunicações sobre promoções, novos produtos ou alterações em nossos termos</li>
    <li>Prevenir fraudes e garantir a segurança do site</li>
  </ul>
  
  <h3 class="text-xl font-semibold mb-2">3. Compartilhamento de Informações</h3>
  <p class="mb-4">Podemos compartilhar suas informações com:</p>
  <ul class="list-disc pl-5 mb-4">
    <li>Parceiros de entrega para garantir que seus produtos cheguem até você</li>
    <li>Processadores de pagamento para finalizar suas compras</li>
    <li>Fornecedores de serviços que nos ajudam a operar nosso negócio</li>
    <li>Autoridades governamentais quando exigido por lei</li>
  </ul>
  
  <h3 class="text-xl font-semibold mb-2">4. Seus Direitos</h3>
  <p class="mb-4">Você tem o direito de:</p>
  <ul class="list-disc pl-5 mb-4">
    <li>Acessar e corrigir seus dados pessoais</li>
    <li>Solicitar a exclusão de seus dados</li>
    <li>Opor-se ao processamento de seus dados</li>
    <li>Retirar seu consentimento a qualquer momento</li>
  </ul>
  
  <h3 class="text-xl font-semibold mb-2">5. Segurança de Dados</h3>
  <p class="mb-4">Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, perda ou alteração.</p>
  
  <h3 class="text-xl font-semibold mb-2">6. Cookies e Tecnologias Semelhantes</h3>
  <p class="mb-4">Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência em nosso site, analisar o tráfego e personalizar conteúdo e anúncios.</p>
  
  <h3 class="text-xl font-semibold mb-2">7. Alterações nesta Política</h3>
  <p class="mb-4">Podemos atualizar esta política periodicamente. Recomendamos verificar regularmente para estar ciente de quaisquer alterações.</p>
  
  <h3 class="text-xl font-semibold mb-2">8. Contato</h3>
  <p class="mb-4">Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco pelo e-mail: privacidade@shopmaster.com</p>
</div>`;
        break;
      case 'termsOfService':
        defaultContent = `
<div class="page-content">
  <h2 class="text-2xl font-bold mb-4">Termos de Uso</h2>
  <p class="mb-4">Última atualização: 20 de Maio de 2023</p>
  
  <p class="mb-4">Bem-vindo à ShopMaster! Ao acessar e utilizar nosso site, você concorda com os seguintes termos e condições. Por favor, leia-os atentamente.</p>
  
  <h3 class="text-xl font-semibold mb-2">1. Aceitação dos Termos</h3>
  <p class="mb-4">Ao acessar ou usar nosso site, você concorda em ficar vinculado a estes Termos de Uso. Se você não concordar com algum dos termos, não poderá acessar ou utilizar nossos serviços.</p>
  
  <h3 class="text-xl font-semibold mb-2">2. Conta do Usuário</h3>
  <p class="mb-4">Para realizar compras em nossa loja, pode ser necessário criar uma conta. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta.</p>
  
  <h3 class="text-xl font-semibold mb-2">3. Conduta do Usuário</h3>
  <p class="mb-4">Você concorda em usar nosso site apenas para fins legais e de maneira que não infrinja os direitos de terceiros. É proibido:</p>
  <ul class="list-disc pl-5 mb-4">
    <li>Usar nosso site de forma fraudulenta ou ilegal</li>
    <li>Violar direitos de propriedade intelectual</li>
    <li>Tentar acessar áreas restritas sem autorização</li>
    <li>Introduzir vírus ou código malicioso</li>
    <li>Realizar ações que possam sobrecarregar nossa infraestrutura</li>
  </ul>
  
  <h3 class="text-xl font-semibold mb-2">4. Produtos e Preços</h3>
  <p class="mb-4">Nos esforçamos para fornecer informações precisas sobre nossos produtos e preços. No entanto, reservamo-nos o direito de corrigir quaisquer erros e alterar preços sem aviso prévio.</p>
  
  <h3 class="text-xl font-semibold mb-2">5. Pedidos e Pagamentos</h3>
  <p class="mb-4">Ao fazer um pedido, você oferece comprar o produto sujeito a estes Termos. Reservamo-nos o direito de recusar ou cancelar qualquer pedido por motivos como indisponibilidade do produto, erros nos preços ou informações de produtos, ou suspeita de fraude.</p>
  
  <h3 class="text-xl font-semibold mb-2">6. Entrega e Devolução</h3>
  <p class="mb-4">Os prazos de entrega são estimativos e podem variar. Nossa política de devolução permite que você devolva produtos em até 7 dias do recebimento, desde que estejam em perfeitas condições.</p>
  
  <h3 class="text-xl font-semibold mb-2">7. Propriedade Intelectual</h3>
  <p class="mb-4">Todo o conteúdo do site, incluindo textos, gráficos, logos, ícones e imagens, é propriedade da ShopMaster e está protegido por leis de direitos autorais.</p>
  
  <h3 class="text-xl font-semibold mb-2">8. Limitação de Responsabilidade</h3>
  <p class="mb-4">Em nenhuma circunstância a ShopMaster será responsável por quaisquer danos indiretos, incidentais ou consequentes resultantes do uso ou incapacidade de usar nosso site ou produtos.</p>
  
  <h3 class="text-xl font-semibold mb-2">9. Lei Aplicável</h3>
  <p class="mb-4">Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes de São Paulo.</p>
  
  <h3 class="text-xl font-semibold mb-2">10. Alterações nos Termos</h3>
  <p class="mb-4">Podemos atualizar estes termos periodicamente. As alterações entrarão em vigor assim que forem publicadas em nosso site.</p>
  
  <h3 class="text-xl font-semibold mb-2">11. Contato</h3>
  <p class="mb-4">Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail: termos@shopmaster.com</p>
</div>`;
        break;
      case 'faq':
        defaultContent = `
<div class="page-content">
  <h2 class="text-2xl font-bold mb-4">Perguntas Frequentes</h2>
  
  <div class="space-y-6">
    <div>
      <h3 class="text-xl font-semibold mb-2">1. Pedidos e Pagamentos</h3>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-medium">Como faço para realizar um pedido?</h4>
          <p>Para realizar um pedido, basta adicionar os produtos desejados ao carrinho de compras e seguir o processo de checkout, preenchendo as informações necessárias.</p>
        </div>
        
        <div>
          <h4 class="font-medium">Quais formas de pagamento são aceitas?</h4>
          <p>Aceitamos cartões de crédito (Visa, Mastercard, American Express), boleto bancário, PIX e transferência bancária.</p>
        </div>
        
        <div>
          <h4 class="font-medium">É seguro comprar no site?</h4>
          <p>Sim, nosso site utiliza criptografia SSL e seguimos as melhores práticas de segurança para proteger suas informações pessoais e financeiras.</p>
        </div>
        
        <div>
          <h4 class="font-medium">Posso alterar ou cancelar meu pedido?</h4>
          <p>Pedidos podem ser alterados ou cancelados em até 1 hora após a confirmação, desde que ainda não tenham sido enviados para entrega. Entre em contato com nosso atendimento.</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold mb-2">2. Entregas</h3>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-medium">Qual o prazo de entrega?</h4>
          <p>O prazo de entrega varia conforme a região e o método de envio escolhido. Geralmente, as entregas são realizadas entre 3 a 10 dias úteis após a confirmação do pagamento.</p>
        </div>
        
        <div>
          <h4 class="font-medium">Como posso rastrear meu pedido?</h4>
          <p>Você receberá um e-mail com o código de rastreamento assim que seu pedido for enviado. Também é possível acompanhar o status na área "Meus Pedidos" do site.</p>
        </div>
        
        <div>
          <h4 class="font-medium">Vocês entregam em todo o Brasil?</h4>
          <p>Sim, realizamos entregas para todo o território nacional. Para algumas regiões remotas, pode haver taxas adicionais de frete.</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold mb-2">3. Trocas e Devoluções</h3>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-medium">Qual é a política de trocas e devoluções?</h4>
          <p>Você pode solicitar a troca ou devolução em até 7 dias após o recebimento do produto, desde que ele esteja em perfeitas condições, com embalagem original e acompanhado da nota fiscal.</p>
        </div>
        
        <div>
          <h4 class="font-medium">Como solicitar uma troca ou devolução?</h4>
          <p>Entre em contato com nossa Central de Atendimento por telefone ou e-mail para iniciar o processo de troca ou devolução.</p>
        </div>
        
        <div>
          <h4 class="font-medium">Quem paga o frete de devolução?</h4>
          <p>Se o motivo da devolução for um defeito de fabricação ou erro no envio, nós cobrimos os custos de frete. Em caso de arrependimento de compra, o cliente arca com os custos de envio.</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold mb-2">4. Produtos</h3>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-medium">Os produtos têm garantia?</h4>
          <p>Sim, todos os nossos produtos possuem garantia legal de 90 dias. Alguns itens contam com garantia adicional do fabricante, conforme especificado na descrição.</p>
        </div>
        
        <div>
          <h4 class="font-medium">As cores dos produtos são exatamente como aparecem nas fotos?</h4>
          <p>Nos esforçamos para exibir as cores com a maior precisão possível, mas podem ocorrer pequenas variações devido às configurações de tela do dispositivo usado.</p>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold mb-2">5. Conta e Cadastro</h3>
      
      <div class="space-y-4">
        <div>
          <h4 class="font-medium">Como criar uma conta?</h4>
          <p>Clique em "Minha Conta" no topo do site e selecione "Criar Conta". Preencha seus dados e siga as instruções.</p>
        </div>
        
        <div>
          <h4 class="font-medium">Esqueci minha senha. O que faço?</h4>
          <p>Na página de login, clique em "Esqueci minha senha" e siga as instruções para redefinir sua senha.</p>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-100 p-4 rounded-md">
      <p>Não encontrou o que procurava? Entre em contato com nosso suporte através do e-mail <a href="mailto:suporte@shopmaster.com" class="text-blue-600 hover:underline">suporte@shopmaster.com</a> ou pelo telefone (11) 99999-9999.</p>
    </div>
  </div>
</div>`;
        break;
    }
    
    handlePageContentChange(page, defaultContent);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Conteúdo das Páginas</h3>
        <p className="text-sm text-muted-foreground">
          Edite o conteúdo das páginas institucionais da sua loja.
        </p>
      </div>
      
      <Tabs defaultValue="about">
        <TabsList className="w-full mb-4 grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="terms">Termos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Página Sobre Nós</h4>
            <button 
              onClick={() => resetPageContent('aboutUs')} 
              className="text-xs text-blue-600 hover:underline"
            >
              Restaurar Conteúdo Padrão
            </button>
          </div>
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.aboutUs}
              onChange={(content) => handlePageContentChange('aboutUs', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Página de Contato</h4>
            <button 
              onClick={() => resetPageContent('contact')} 
              className="text-xs text-blue-600 hover:underline"
            >
              Restaurar Conteúdo Padrão
            </button>
          </div>
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.contact}
              onChange={(content) => handlePageContentChange('contact', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="privacy">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Política de Privacidade</h4>
            <button 
              onClick={() => resetPageContent('privacyPolicy')} 
              className="text-xs text-blue-600 hover:underline"
            >
              Restaurar Conteúdo Padrão
            </button>
          </div>
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.privacyPolicy}
              onChange={(content) => handlePageContentChange('privacyPolicy', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="terms">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Termos de Uso</h4>
            <button 
              onClick={() => resetPageContent('termsOfService')} 
              className="text-xs text-blue-600 hover:underline"
            >
              Restaurar Conteúdo Padrão
            </button>
          </div>
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.termsOfService}
              onChange={(content) => handlePageContentChange('termsOfService', content)}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Perguntas Frequentes</h4>
            <button 
              onClick={() => resetPageContent('faq')} 
              className="text-xs text-blue-600 hover:underline"
            >
              Restaurar Conteúdo Padrão
            </button>
          </div>
          <div className="border p-4 rounded-md">
            <RichTextEditor
              value={settings.faq}
              onChange={(content) => handlePageContentChange('faq', content)}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
