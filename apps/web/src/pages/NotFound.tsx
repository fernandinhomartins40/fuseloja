
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Erro: Usuário tentou acessar uma rota inexistente:",
      location.pathname
    );
    console.log("Estado da localização:", location.state);
    console.log("Query params:", location.search);
  }, [location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Ops! Página não encontrada</p>
        <p className="text-sm text-gray-500 mb-4">
          Você tentou acessar: <code className="bg-gray-200 px-2 py-1 rounded">{location.pathname}</code>
        </p>
        <div className="space-y-2">
          <a 
            href="/" 
            className="block text-blue-500 hover:text-blue-700 underline"
          >
            Voltar para o Início
          </a>
          <a 
            href="/admin" 
            className="block text-green-500 hover:text-green-700 underline"
          >
            Ir para o painel do lojista
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
