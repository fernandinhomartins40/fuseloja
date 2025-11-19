
import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          <SectionHeader 
            title="Entre em Contato"
            description="Estamos aqui para ajudar. Entre em contato conosco por qualquer meio abaixo."
            className="mb-10"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-[#D90429]/10 rounded-full flex items-center justify-center mb-4">
                  <Phone className="text-[#D90429]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Telefone</h3>
                <p className="text-gray-600 mb-2">(11) 99999-9999</p>
                <p className="text-gray-600">Segunda a Sexta, 9h às 18h</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-[#D90429]/10 rounded-full flex items-center justify-center mb-4">
                  <Mail className="text-[#D90429]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <p className="text-gray-600 mb-2">contato@shopmaster.com</p>
                <p className="text-gray-600">Respondemos em até 24 horas</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-[#D90429]/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="text-[#D90429]" />
                </div>
                <h3 className="text-lg font-medium mb-2">Endereço</h3>
                <p className="text-gray-600 mb-2">Rua Exemplo, 123 - Centro</p>
                <p className="text-gray-600">São Paulo, SP - 01001-000</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-6">Envie sua Mensagem</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D90429]"
                      placeholder="Seu nome"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D90429]"
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Assunto
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D90429]"
                      placeholder="Assunto da mensagem"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D90429]"
                      placeholder="Sua mensagem aqui..."
                    ></textarea>
                  </div>
                  
                  <Button className="bg-[#D90429] hover:bg-[#b8031f] text-white w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Mensagem
                  </Button>
                </form>
              </div>
              
              <div className="bg-gray-200 h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.3673067929546!2d-46.65499262554416!3d-23.554904061376377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da34a843%3A0xc51d87ac76771a9!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1716507547809!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da ShopMaster"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
