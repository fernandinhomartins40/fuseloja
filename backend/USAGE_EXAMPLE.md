# Backend API Usage Examples

Este documento mostra como usar a API do backend através de exemplos práticos.

## Configuração Inicial

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
```bash
cp .env.example .env
# Editar as variáveis conforme necessário
```

3. **Executar o servidor:**
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## Endpoints da API

### 1. Autenticação

#### Registrar novo usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123",
    "firstName": "João",
    "lastName": "Silva"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "senha123"
  }'
```

#### Logout
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 2. Upload de Arquivos

#### Upload de arquivo
```bash
curl -X POST http://localhost:3000/api/files/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "files=@/path/to/file.jpg" \
  -F "folder=profile"
```

### 3. Verificação de Saúde

#### Health Check
```bash
curl http://localhost:3000/health
```

## Exemplos de Uso com JavaScript

### 1. Cliente JavaScript/TypeScript

```typescript
class BackendClient {
  private baseURL = 'http://localhost:3000';
  private token: string | null = null;

  // Autenticação
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const response = await fetch(`${this.baseURL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (data.success) {
      this.token = data.data.accessToken;
    }
    return data;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      this.token = data.data.accessToken;
    }
    return data;
  }

  // Upload de arquivo
  async uploadFile(file: File, folder?: string) {
    const formData = new FormData();
    formData.append('files', file);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await fetch(`${this.baseURL}/api/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    return await response.json();
  }

  // Verificar saúde da API
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    return await response.json();
  }
}

// Exemplo de uso
const client = new BackendClient();

// Registrar usuário
await client.register({
  email: 'test@example.com',
  password: 'senha123',
  firstName: 'Test',
  lastName: 'User'
});

// Fazer upload de arquivo
const fileInput = document.getElementById('fileInput') as HTMLInputElement;
const file = fileInput.files?.[0];
if (file) {
  await client.uploadFile(file, 'documents');
}
```

### 2. Exemplo com React

```tsx
import React, { useState } from 'react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('token', data.data.accessToken);
        console.log('Login successful!');
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

## WebSocket (Socket.IO)

### Cliente JavaScript para WebSocket

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_ACCESS_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('notification', (data) => {
  console.log('Notification received:', data);
});

socket.on('user-activity', (data) => {
  console.log('User activity:', data);
});

// Enviar mensagem
socket.emit('message', {
  type: 'chat',
  message: 'Hello from client!'
});
```

## Testes

### Executar testes
```bash
# Todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

### Exemplo de teste
```typescript
import request from 'supertest';
import { App } from '../src/app';

describe('Auth API', () => {
  let app: App;

  beforeAll(() => {
    app = new App();
  });

  afterAll(() => {
    app.server.close();
  });

  it('should register a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'senha123',
      firstName: 'Test',
      lastName: 'User'
    };

    const response = await request(app.getApp())
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
  });
});
```

## Recursos Disponíveis

### 1. Autenticação JWT
- Registro e login de usuários
- Refresh tokens
- Recuperação de senha
- Verificação de email

### 2. Upload de Arquivos
- Upload múltiplo
- Redimensionamento de imagens
- Organização por pastas
- Verificação de tipos

### 3. Notificações
- WebSocket em tempo real
- Emails transacionais
- Sistema de notificações

### 4. Auditoria e Logs
- Logs estruturados
- Auditoria de ações
- Métricas de performance

### 5. Rate Limiting
- Limitação por IP
- Limitação por usuário
- Rate limiting progressivo

### 6. Segurança
- Validação de dados
- Sanitização de inputs
- Headers de segurança
- Prevenção de ataques

## Documentação da API

A documentação completa da API está disponível em:
- **Swagger UI**: http://localhost:3000/api-docs
- **JSON Schema**: http://localhost:3000/swagger.json

## Monitoramento

### Métricas e Saúde
- Health check: `GET /health`
- Métricas: `GET /metrics`
- Status: `GET /status`

### Logs
Os logs são salvos em `./logs/` e incluem:
- `app.log` - Logs da aplicação
- `error.log` - Logs de erro
- `access.log` - Logs de acesso HTTP 