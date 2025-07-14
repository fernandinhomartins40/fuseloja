#!/bin/bash

echo "🧪 Testando Correções de Roteamento SPA - FuseLoja"
echo "=================================================="

BASE_URL="https://fuseloja.com.br"
API_URL="$BASE_URL/api/v1"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar HTTP status
test_http_status() {
    local url=$1
    local expected_status=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASS${NC} ($status)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_status, Got: $status)"
        return 1
    fi
}

# Função para testar se retorna HTML
test_html_response() {
    local url=$1
    local description=$2
    
    echo -n "Testing $description... "
    
    content_type=$(curl -s -I "$url" | grep -i "content-type" | head -1)
    
    if [[ $content_type == *"text/html"* ]]; then
        echo -e "${GREEN}✅ PASS${NC} (HTML returned)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Not HTML: $content_type)"
        return 1
    fi
}

# Função para testar se contém conteúdo específico
test_content_contains() {
    local url=$1
    local search_text=$2
    local description=$3
    
    echo -n "Testing $description... "
    
    if curl -s "$url" | grep -q "$search_text"; then
        echo -e "${GREEN}✅ PASS${NC} (Content found)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Content not found)"
        return 1
    fi
}

echo ""
echo "🔍 1. Testando Acesso Direto a URLs SPA"
echo "----------------------------------------"

# Teste 1: Página inicial
test_http_status "$BASE_URL/" 200 "Home page"

# Teste 2: Rota admin (deve retornar HTML mesmo sem auth)
test_html_response "$BASE_URL/admin" "Admin route returns HTML"

# Teste 3: Rota admin/produtos
test_html_response "$BASE_URL/admin/produtos" "Admin products route returns HTML"

# Teste 4: Rota sobre
test_html_response "$BASE_URL/sobre" "About page returns HTML"

# Teste 5: Rota inexistente (deve retornar HTML do SPA)
test_html_response "$BASE_URL/rota-inexistente" "Non-existent route returns HTML"

echo ""
echo "🔍 2. Testando API Routes"
echo "-------------------------"

# Teste 6: API health check
test_http_status "$BASE_URL/health" 200 "API health endpoint"

# Teste 7: API route não existente deve retornar 404 JSON
test_http_status "$API_URL/rota-inexistente" 404 "Non-existent API route returns 404"

echo ""
echo "🔍 3. Testando Conteúdo SPA"
echo "----------------------------"

# Teste 8: Verifica se o HTML contém o root div
test_content_contains "$BASE_URL/admin" '<div id="root">' "HTML contains React root div"

# Teste 9: Verifica se o HTML contém scripts do React
test_content_contains "$BASE_URL/admin" '<script' "HTML contains script tags"

# Teste 10: Verifica se o HTML contém título correto
test_content_contains "$BASE_URL/" "FuseLoja" "HTML contains site title"

echo ""
echo "🔍 4. Testando Cache Headers"
echo "-----------------------------"

# Teste 11: Verifica se HTML não está sendo cacheado
echo -n "Testing HTML cache headers... "
cache_header=$(curl -s -I "$BASE_URL/admin" | grep -i "cache-control" | head -1)
if [[ $cache_header == *"no-cache"* ]] || [[ $cache_header == *"no-store"* ]]; then
    echo -e "${GREEN}✅ PASS${NC} (HTML not cached)"
else
    echo -e "${YELLOW}⚠️ WARNING${NC} (HTML may be cached: $cache_header)"
fi

echo ""
echo "🔍 5. Testando Redirecionamento HTTPS"
echo "-------------------------------------"

# Teste 12: HTTP deve redirecionar para HTTPS
test_http_status "http://fuseloja.com.br" 301 "HTTP to HTTPS redirect"

echo ""
echo "📊 RESUMO DOS TESTES"
echo "===================="

# Contar testes
total_tests=12
passed_tests=0

# Reexecutar testes rapidamente para contar
for test_url in \
    "$BASE_URL/" \
    "$BASE_URL/admin" \
    "$BASE_URL/admin/produtos" \
    "$BASE_URL/sobre" \
    "$BASE_URL/rota-inexistente" \
    "$BASE_URL/health" \
    "$API_URL/rota-inexistente" \
    "http://fuseloja.com.br"; do
    
    status=$(curl -s -o /dev/null -w "%{http_code}" "$test_url")
    if [ "$status" -eq 200 ] || [ "$status" -eq 301 ] || [ "$status" -eq 404 ]; then
        ((passed_tests++))
    fi
done

echo "Total: $total_tests testes"
echo "Aprovados: $passed_tests testes"
echo "Falhas: $((total_tests - passed_tests)) testes"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "\n${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo "✅ Roteamento SPA funcionando corretamente"
    echo "✅ Fallback para HTML funcionando"
    echo "✅ APIs retornando códigos corretos"
else
    echo -e "\n${RED}❌ ALGUNS TESTES FALHARAM${NC}"
    echo "⚠️ Verificar configuração nginx e backend"
fi

echo ""
echo "🚀 Para aplicar as correções:"
echo "git add . && git commit -m 'fix: correções de roteamento SPA' && git push origin main"
echo ""
echo "📝 Documentação: SPA_ROUTING_FIXES.md" 