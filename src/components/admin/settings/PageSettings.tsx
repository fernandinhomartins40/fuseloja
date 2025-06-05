
import React, { useState } from 'react';
import { PageContent } from '@/types/settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from './RichTextEditor';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

interface PageSettingsProps {
  settings: PageContent;
  onChange: (settings: PageContent) => void;
}

type PageContentKey = keyof PageContent;

const pageConfigs = {
  aboutUs: { title: 'Sobre Nós', route: '/sobre' },
  contact: { title: 'Contato', route: '/contato' },
  privacyPolicy: { title: 'Política de Privacidade', route: '/privacidade' },
  termsOfService: { title: 'Termos de Uso', route: '/termos' },
  faq: { title: 'FAQ', route: '/faq' }
};

export const PageSettings: React.FC<PageSettingsProps> = ({ settings, onChange }) => {
  const [activeTab, setActiveTab] = useState<PageContentKey>('aboutUs');

  const handleTabChange = (value: string) => {
    const tabToContentKey: Record<string, PageContentKey> = {
      'about': 'aboutUs',
      'contact': 'contact',
      'privacy': 'privacyPolicy',
      'terms': 'termsOfService',
      'faq': 'faq'
    };
    
    setActiveTab(tabToContentKey[value] as PageContentKey);
  };

  const handlePageContentChange = (content: string) => {
    onChange({
      ...settings,
      [activeTab]: content
    });
  };

  const resetPageContent = (page: keyof PageContent) => {
    let defaultContent = '';
    
    switch(page) {
      case 'aboutUs':
        defaultContent = `
<div class="page-content">
  <h1 class="text-3xl font-bold mb-6 text-gray-800">Sobre Nossa Empresa</h1>
  
  <div class="mb-8">
    <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800" alt="Nossa equipe" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 20px;" />
  </div>
  
  <p class="text-lg mb-6 text-gray-600 leading-relaxed">Fundada em 2010, a ShopMaster nasceu da paixão por oferecer produtos de qualidade com a melhor experiência de compra online. Nossa jornada começou como uma pequena loja e hoje somos referência nacional em e-commerce.</p>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
    <div>
      <h3 class="text-xl font-semibold mb-3 text-gray-800">Nossa Missão</h3>
      <p class="text-gray-600 leading-relaxed">Proporcionar a melhor experiência de compra online, com produtos de qualidade, preços justos e atendimento excepcional.</p>
    </div>
    <div>
      <h3 class="text-xl font-semibold mb-3 text-gray-800">Nossa Visão</h3>
      <p class="text-gray-600 leading-relaxed">Ser a loja online mais confiável e inovadora do Brasil, sempre superando as expectativas dos nossos clientes.</p>
    </div>
  </div>
  
  <h3 class="text-xl font-semibold mb-4 text-gray-800">Nossos Valores</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="text-center p-6 bg-blue-50 rounded-lg">
      <div class="text-3xl mb-3">🎯</div>
      <h4 class="font-semibold mb-2">Excelência</h4>
      <p class="text-sm text-gray-600">Compromisso com a qualidade em tudo que fazemos</p>
    </div>
    <div class="text-center p-6 bg-green-50 rounded-lg">
      <div class="text-3xl mb-3">🤝</div>
      <h4 class="font-semibold mb-2">Confiança</h4>
      <p class="text-sm text-gray-600">Transparência em todas as nossas relações</p>
    </div>
    <div class="text-center p-6 bg-purple-50 rounded-lg">
      <div class="text-3xl mb-3">🚀</div>
      <h4 class="font-semibold mb-2">Inovação</h4>
      <p class="text-sm text-gray-600">Sempre buscando novas maneiras de servir melhor</p>
    </div>
  </div>
  
  <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl text-center">
    <h3 class="text-2xl font-bold mb-4">Junte-se à Nossa História</h3>
    <p class="mb-6">Mais de 50.000 clientes já confiam em nós. Faça parte dessa jornada!</p>
    <button class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Conheça Nossos Produtos</button>
  </div>
</div>`;
        break;
      case 'contact':
        defaultContent = `
<div class="page-content">
  <h1 class="text-3xl font-bold mb-6 text-gray-800">Entre em Contato</h1>
  
  <p class="text-lg mb-8 text-gray-600">Estamos sempre disponíveis para atender você. Utilize os canais abaixo ou preencha o formulário de contato.</p>
  
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
    <div>
      <h3 class="text-xl font-semibold mb-6 text-gray-800">Informações de Contato</h3>
      
      <div class="space-y-4 mb-8">
        <div class="flex items-center p-4 bg-blue-50 rounded-lg">
          <div class="text-blue-600 text-xl mr-4">📧</div>
          <div>
            <h4 class="font-medium text-gray-800">E-mail</h4>
            <p class="text-gray-600">contato@shopmaster.com</p>
          </div>
        </div>
        
        <div class="flex items-center p-4 bg-green-50 rounded-lg">
          <div class="text-green-600 text-xl mr-4">📱</div>
          <div>
            <h4 class="font-medium text-gray-800">Telefone</h4>
            <p class="text-gray-600">(11) 99999-9999</p>
          </div>
        </div>
        
        <div class="flex items-center p-4 bg-purple-50 rounded-lg">
          <div class="text-purple-600 text-xl mr-4">📍</div>
          <div>
            <h4 class="font-medium text-gray-800">Endereço</h4>
            <p class="text-gray-600">Rua Exemplo, 123 - Centro<br>São Paulo, SP - 01234-567</p>
          </div>
        </div>
      </div>
      
      <div class="mb-8">
        <h4 class="font-semibold mb-3 text-gray-800">Horário de Atendimento</h4>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="text-gray-600">
            <strong>Segunda a Sexta:</strong> 9h às 18h<br>
            <strong>Sábado:</strong> 9h às 13h<br>
            <strong>Domingo:</strong> Fechado
          </p>
        </div>
      </div>
      
      <div>
        <h4 class="font-semibold mb-3 text-gray-800">Redes Sociais</h4>
        <div class="flex gap-4">
          <a href="https://facebook.com/shopmaster" class="text-blue-600 hover:text-blue-800 transition-colors">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">📘</div>
          </a>
          <a href="https://instagram.com/shopmaster" class="text-purple-600 hover:text-purple-800 transition-colors">
            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">📸</div>
          </a>
          <a href="https://twitter.com/shopmaster" class="text-blue-400 hover:text-blue-600 transition-colors">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">🐦</div>
          </a>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-semibold mb-6 text-gray-800">Formulário de Contato</h3>
      <div class="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <form class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700">Nome *</label>
              <input type="text" placeholder="Seu nome" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2 text-gray-700">Telefone</label>
              <input type="tel" placeholder="(11) 99999-9999" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">E-mail *</label>
            <input type="email" placeholder="Seu e-mail" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">Assunto *</label>
            <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
              <option value="">Selecione um assunto</option>
              <option value="duvida">Dúvida sobre produto</option>
              <option value="pedido">Problemas com pedido</option>
              <option value="sugestao">Sugestão</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2 text-gray-700">Mensagem *</label>
            <textarea placeholder="Descreva sua mensagem..." rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
          </div>
          <button type="submit" class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">Enviar Mensagem</button>
        </form>
      </div>
    </div>
  </div>
  
  <div class="mt-12">
    <h3 class="text-xl font-semibold mb-4 text-gray-800">Nossa Localização</h3>
    <div class="bg-gray-100 p-8 h-80 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
      <div class="text-center">
        <div class="text-4xl mb-4">🗺️</div>
        <p class="text-gray-600">Aqui você pode inserir um mapa da localização da sua loja.</p>
        <p class="text-sm text-gray-500 mt-2">Integre com Google Maps ou outro serviço de mapas.</p>
      </div>
    </div>
  </div>
</div>`;
        break;
      case 'privacyPolicy':
        defaultContent = `
<div class="page-content">
  <h1 class="text-3xl font-bold mb-4 text-gray-800">Política de Privacidade</h1>
  <p class="text-sm text-gray-500 mb-8">Última atualização: ${new Date().toLocaleDateString('pt-BR')}</p>
  
  <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
    <p class="text-blue-800">A ShopMaster valoriza a privacidade dos seus usuários e está comprometida em proteger as informações pessoais que você compartilha conosco.</p>
  </div>
  
  <div class="space-y-8">
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">1. Informações que Coletamos</h2>
      <p class="text-gray-600 mb-4 leading-relaxed">Coletamos informações quando você cria uma conta, faz uma compra, assina nossa newsletter, participa de promoções ou interage com nosso site.</p>
      
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="font-semibold mb-3 text-gray-800">Tipos de informações coletadas:</h3>
        <ul class="list-disc pl-6 space-y-2 text-gray-600">
          <li>Nome, endereço, e-mail e número de telefone</li>
          <li>Informações de pagamento (processadas de forma segura)</li>
          <li>Histórico de compras e produtos visualizados</li>
          <li>Dados de uso do site e preferências</li>
          <li>Informações de localização (quando permitido)</li>
        </ul>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">2. Como Usamos suas Informações</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border border-gray-200 p-4 rounded-lg">
          <h4 class="font-semibold mb-2 text-gray-800">🛒 Processamento de Pedidos</h4>
          <p class="text-sm text-gray-600">Para processar seus pedidos e fornecer os produtos solicitados</p>
        </div>
        <div class="border border-gray-200 p-4 rounded-lg">
          <h4 class="font-semibold mb-2 text-gray-800">📈 Melhoria de Serviços</h4>
          <p class="text-sm text-gray-600">Para melhorar nossos produtos e serviços continuamente</p>
        </div>
        <div class="border border-gray-200 p-4 rounded-lg">
          <h4 class="font-semibold mb-2 text-gray-800">🎯 Personalização</h4>
          <p class="text-sm text-gray-600">Para personalizar sua experiência de compra</p>
        </div>
        <div class="border border-gray-200 p-4 rounded-lg">
          <h4 class="font-semibold mb-2 text-gray-800">🔒 Segurança</h4>
          <p class="text-sm text-gray-600">Para prevenir fraudes e garantir a segurança do site</p>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">3. Seus Direitos</h2>
      <div class="bg-green-50 border border-green-200 p-6 rounded-lg">
        <h3 class="font-semibold mb-4 text-green-800">Você tem o direito de:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span class="text-green-700">Acessar e corrigir seus dados pessoais</span>
          </div>
          <div class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span class="text-green-700">Solicitar a exclusão de seus dados</span>
          </div>
          <div class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span class="text-green-700">Opor-se ao processamento de seus dados</span>
          </div>
          <div class="flex items-start">
            <span class="text-green-600 mr-2">✓</span>
            <span class="text-green-700">Retirar seu consentimento a qualquer momento</span>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">4. Segurança de Dados</h2>
      <p class="text-gray-600 mb-4 leading-relaxed">Implementamos medidas de segurança técnicas e organizacionais robustas para proteger suas informações pessoais.</p>
      <div class="bg-gray-50 p-4 rounded-lg">
        <p class="text-sm text-gray-600">Utilizamos criptografia SSL, firewalls avançados e monitoramento 24/7 para garantir a segurança dos seus dados.</p>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">5. Contato</h2>
      <div class="bg-blue-50 p-6 rounded-lg">
        <p class="text-gray-700 mb-2">Para questões sobre esta política de privacidade, entre em contato:</p>
        <p class="text-blue-600 font-medium">📧 privacidade@shopmaster.com</p>
        <p class="text-blue-600 font-medium">📱 (11) 99999-9999</p>
      </div>
    </section>
  </div>
</div>`;
        break;
      case 'termsOfService':
        defaultContent = `
<div class="page-content">
  <h1 class="text-3xl font-bold mb-4 text-gray-800">Termos de Uso</h1>
  <p class="text-sm text-gray-500 mb-8">Última atualização: ${new Date().toLocaleDateString('pt-BR')}</p>
  
  <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8">
    <p class="text-amber-800">Ao acessar e utilizar nosso site, você concorda com os seguintes termos e condições. Por favor, leia-os atentamente.</p>
  </div>
  
  <div class="space-y-8">
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">1. Aceitação dos Termos</h2>
      <p class="text-gray-600 leading-relaxed">Ao acessar ou usar nosso site, você concorda em ficar vinculado a estes Termos de Uso. Se você não concordar com algum dos termos, não poderá acessar ou utilizar nossos serviços.</p>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">2. Conta do Usuário</h2>
      <div class="bg-gray-50 p-6 rounded-lg">
        <p class="text-gray-600 mb-4">Para realizar compras, você deve criar uma conta com informações precisas e atualizadas.</p>
        <div class="space-y-2">
          <div class="flex items-center">
            <span class="text-blue-600 mr-2">•</span>
            <span class="text-gray-600">Mantenha a confidencialidade de sua senha</span>
          </div>
          <div class="flex items-center">
            <span class="text-blue-600 mr-2">•</span>
            <span class="text-gray-600">Você é responsável por todas as atividades em sua conta</span>
          </div>
          <div class="flex items-center">
            <span class="text-blue-600 mr-2">•</span>
            <span class="text-gray-600">Notifique-nos imediatamente sobre uso não autorizado</span>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">3. Conduta do Usuário</h2>
      <p class="text-gray-600 mb-4">Você concorda em usar nosso site apenas para fins legais e de maneira que não infrinja os direitos de terceiros.</p>
      
      <div class="bg-red-50 border border-red-200 p-6 rounded-lg">
        <h3 class="font-semibold mb-3 text-red-800">É estritamente proibido:</h3>
        <ul class="space-y-2 text-red-700">
          <li class="flex items-start">
            <span class="text-red-500 mr-2 mt-1">✗</span>
            <span>Usar nosso site de forma fraudulenta ou ilegal</span>
          </li>
          <li class="flex items-start">
            <span class="text-red-500 mr-2 mt-1">✗</span>
            <span>Violar direitos de propriedade intelectual</span>
          </li>
          <li class="flex items-start">
            <span class="text-red-500 mr-2 mt-1">✗</span>
            <span>Tentar acessar áreas restritas sem autorização</span>
          </li>
          <li class="flex items-start">
            <span class="text-red-500 mr-2 mt-1">✗</span>
            <span>Introduzir vírus ou código malicioso</span>
          </li>
        </ul>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">4. Produtos e Preços</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border border-gray-200 p-4 rounded-lg">
          <h4 class="font-semibold mb-2 text-gray-800">📦 Disponibilidade</h4>
          <p class="text-sm text-gray-600">Produtos sujeitos à disponibilidade de estoque</p>
        </div>
        <div class="border border-gray-200 p-4 rounded-lg">
          <h4 class="font-semibold mb-2 text-gray-800">💰 Preços</h4>
          <p class="text-sm text-gray-600">Preços podem ser alterados sem aviso prévio</p>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">5. Entrega e Devolução</h2>
      <div class="bg-blue-50 p-6 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold mb-2 text-blue-800">🚚 Entrega</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Prazos são estimativos</li>
              <li>• Podem variar por região</li>
              <li>• Rastreamento disponível</li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-2 text-blue-800">↩️ Devolução</h4>
            <ul class="text-sm text-blue-700 space-y-1">
              <li>• Até 7 dias após recebimento</li>
              <li>• Produto em perfeitas condições</li>
              <li>• Embalagem original</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">6. Contato</h2>
      <div class="bg-gray-50 p-6 rounded-lg">
        <p class="text-gray-700 mb-2">Para questões sobre estes Termos de Uso:</p>
        <p class="text-blue-600 font-medium">📧 termos@shopmaster.com</p>
        <p class="text-blue-600 font-medium">📱 (11) 99999-9999</p>
      </div>
    </section>
  </div>
</div>`;
        break;
      case 'faq':
        defaultContent = `
<div class="page-content">
  <h1 class="text-3xl font-bold mb-6 text-gray-800">Perguntas Frequentes</h1>
  
  <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
    <p class="text-gray-700">Encontre respostas rápidas para as dúvidas mais comuns sobre nossa loja e serviços.</p>
  </div>
  
  <div class="space-y-8">
    <section>
      <h2 class="text-2xl font-semibold mb-6 text-blue-600 border-b border-blue-200 pb-2">🛒 Pedidos e Pagamentos</h2>
      
      <div class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Como faço para realizar um pedido?</h3>
          <p class="text-gray-600 leading-relaxed">Para realizar um pedido, navegue pelos nossos produtos, adicione os itens desejados ao carrinho e siga o processo de checkout. É simples e seguro!</p>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Quais formas de pagamento são aceitas?</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <div class="text-2xl mb-2">💳</div>
              <p class="text-xs font-medium">Cartão de Crédito</p>
            </div>
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <div class="text-2xl mb-2">📱</div>
              <p class="text-xs font-medium">PIX</p>
            </div>
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <div class="text-2xl mb-2">📄</div>
              <p class="text-xs font-medium">Boleto</p>
            </div>
            <div class="text-center p-3 bg-purple-50 rounded-lg">
              <div class="text-2xl mb-2">🏦</div>
              <p class="text-xs font-medium">Transferência</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">É seguro comprar no site?</h3>
          <div class="flex items-start">
            <span class="text-green-500 text-xl mr-3 mt-1">🔒</span>
            <p class="text-gray-600 leading-relaxed">Sim! Nosso site utiliza criptografia SSL e seguimos as melhores práticas de segurança para proteger suas informações pessoais e financeiras.</p>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-6 text-green-600 border-b border-green-200 pb-2">🚚 Entregas</h2>
      
      <div class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Qual o prazo de entrega?</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div class="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 class="font-semibold text-green-800">Região Sudeste</h4>
              <p class="text-green-600">3-5 dias úteis</p>
            </div>
            <div class="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 class="font-semibold text-yellow-800">Região Sul/Nordeste</h4>
              <p class="text-yellow-600">5-8 dias úteis</p>
            </div>
            <div class="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 class="font-semibold text-orange-800">Outras Regiões</h4>
              <p class="text-orange-600">8-12 dias úteis</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Como posso rastrear meu pedido?</h3>
          <div class="flex items-start">
            <span class="text-blue-500 text-xl mr-3 mt-1">📦</span>
            <div>
              <p class="text-gray-600 leading-relaxed mb-2">Você receberá um e-mail com o código de rastreamento assim que seu pedido for enviado.</p>
              <p class="text-gray-600 leading-relaxed">Também é possível acompanhar o status na área "Meus Pedidos" do site.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-6 text-purple-600 border-b border-purple-200 pb-2">↩️ Trocas e Devoluções</h2>
      
      <div class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Qual é a política de trocas e devoluções?</h3>
          <div class="bg-purple-50 p-4 rounded-lg">
            <div class="flex items-center mb-3">
              <span class="text-purple-600 text-xl mr-2">⏰</span>
              <span class="font-semibold text-purple-800">7 dias para solicitar</span>
            </div>
            <ul class="text-purple-700 space-y-1 text-sm">
              <li>• Produto em perfeitas condições</li>
              <li>• Embalagem original</li>
              <li>• Acompanhado da nota fiscal</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Quem paga o frete de devolução?</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 class="font-semibold text-green-800 mb-2">🆓 Grátis para nós</h4>
              <ul class="text-sm text-green-700">
                <li>• Defeito de fabricação</li>
                <li>• Produto errado enviado</li>
                <li>• Produto danificado</li>
              </ul>
            </div>
            <div class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 class="font-semibold text-orange-800 mb-2">💰 Cliente paga</h4>
              <ul class="text-sm text-orange-700">
                <li>• Arrependimento de compra</li>
                <li>• Mudança de opinião</li>
                <li>• Tamanho incorreto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <section>
      <h2 class="text-2xl font-semibold mb-6 text-red-600 border-b border-red-200 pb-2">👤 Conta e Cadastro</h2>
      
      <div class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Como criar uma conta?</h3>
          <div class="flex items-start">
            <span class="text-blue-500 text-xl mr-3 mt-1">📝</span>
            <p class="text-gray-600 leading-relaxed">Clique em "Minha Conta" no topo do site, selecione "Criar Conta" e preencha seus dados. É rápido e fácil!</p>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 class="font-semibold text-gray-800 mb-3">Esqueci minha senha. O que faço?</h3>
          <div class="flex items-start">
            <span class="text-yellow-500 text-xl mr-3 mt-1">🔑</span>
            <p class="text-gray-600 leading-relaxed">Na página de login, clique em "Esqueci minha senha" e siga as instruções para redefinir. Você receberá um e-mail com as instruções.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
  
  <div class="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 rounded-xl text-center">
    <h3 class="text-2xl font-bold mb-4">Ainda tem dúvidas?</h3>
    <p class="mb-6">Nossa equipe de suporte está sempre pronta para ajudar você!</p>
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <a href="mailto:suporte@shopmaster.com" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        📧 suporte@shopmaster.com
      </a>
      <a href="tel:11999999999" class="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        📱 (11) 99999-9999
      </a>
    </div>
  </div>
</div>`;
        break;
    }
    
    onChange({
      ...settings,
      [page]: defaultContent
    });
  };

  const contentKeyToTab: Record<PageContentKey, string> = {
    'aboutUs': 'about',
    'contact': 'contact',
    'privacyPolicy': 'privacy',
    'termsOfService': 'terms',
    'faq': 'faq'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium">Conteúdo das Páginas</h3>
          <p className="text-sm text-muted-foreground">
            Edite o conteúdo das páginas institucionais da sua loja com editor avançado.
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-gray-500">
            Página ativa: <span className="font-medium">{pageConfigs[activeTab].title}</span>
          </p>
          <p className="text-xs text-gray-400">
            Rota: {pageConfigs[activeTab].route}
          </p>
        </div>
      </div>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Use o editor visual para formatação rica ou a aba HTML para controle total. 
          Suas alterações são aplicadas automaticamente ao salvar as configurações.
        </AlertDescription>
      </Alert>
      
      <Tabs 
        defaultValue="about" 
        value={contentKeyToTab[activeTab]}
        onValueChange={handleTabChange}
      >
        <TabsList className="w-full mb-4 grid grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="about">Sobre Nós</TabsTrigger>
          <TabsTrigger value="contact">Contato</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="terms">Termos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="about">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Página Sobre Nós</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => resetPageContent('aboutUs')}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Restaurar Padrão
            </Button>
          </div>
          <div className="border rounded-lg">
            <RichTextEditor
              value={settings.aboutUs}
              onChange={handlePageContentChange}
              title="Sobre Nós"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="contact">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Página de Contato</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => resetPageContent('contact')}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Restaurar Padrão
            </Button>
          </div>
          <div className="border rounded-lg">
            <RichTextEditor
              value={settings.contact}
              onChange={handlePageContentChange}
              title="Contato"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="privacy">
          <div className="flex justify-between items-center mb-4">
            <h4 class name="text-sm font-medium">Política de Privacidade</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => resetPageContent('privacyPolicy')}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Restaurar Padrão
            </Button>
          </div>
          <div className="border rounded-lg">
            <RichTextEditor
              value={settings.privacyPolicy}
              onChange={handlePageContentChange}
              title="Política de Privacidade"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="terms">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Termos de Uso</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => resetPageContent('termsOfService')}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Restaurar Padrão
            </Button>
          </div>
          <div className="border rounded-lg">
            <RichTextEditor
              value={settings.termsOfService}
              onChange={handlePageContentChange}
              title="Termos de Uso"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="faq">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium">Perguntas Frequentes</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => resetPageContent('faq')}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Restaurar Padrão
            </Button>
          </div>
          <div className="border rounded-lg">
            <RichTextEditor
              value={settings.faq}
              onChange={handlePageContentChange}
              title="FAQ"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
