
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';

const AboutUs = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <SectionHeader 
            title="Sobre Nós"
            description="Conheça nossa história e missão"
            className="mb-10"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
              <p className="text-gray-600 mb-4">
                Fundada em 2020, a ShopMaster nasceu com o objetivo de revolucionar a experiência de compra online no Brasil, 
                oferecendo uma plataforma intuitiva e segura para conectar consumidores e lojistas.
              </p>
              <p className="text-gray-600 mb-4">
                Com foco em tecnologia e experiência do usuário, crescemos rapidamente para nos tornarmos uma referência 
                no comércio eletrônico nacional, sempre priorizando a satisfação de nossos clientes e parceiros.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1618160702438-9b02ab6515c9" 
                alt="Nossa equipe" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 md:flex-row-reverse">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-4">Nossa Missão</h2>
              <p className="text-gray-600 mb-4">
                Na ShopMaster, nossa missão é facilitar o comércio digital, oferecendo a melhor experiência de compra 
                e venda online com foco em segurança, usabilidade e satisfação.
              </p>
              <p className="text-gray-600 mb-4">
                Buscamos constantemente inovar e aperfeiçoar nossa plataforma, disponibilizando ferramentas e recursos 
                que impulsionem o sucesso de nossos parceiros lojistas e proporcionem aos consumidores uma jornada de 
                compra agradável e confiável.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg order-first md:order-last">
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" 
                alt="Nossa missão" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl font-bold mb-4">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Transparência</h3>
                <p className="text-gray-600">
                  Cultivamos relações honestas e abertas com clientes, parceiros e colaboradores.
                </p>
              </div>
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Inovação</h3>
                <p className="text-gray-600">
                  Buscamos constantemente novas soluções e tecnologias para melhorar nossa plataforma.
                </p>
              </div>
              <div className="p-6 border rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-2">Excelência</h3>
                <p className="text-gray-600">
                  Comprometidos com a qualidade em cada detalhe de nossos serviços e produtos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
