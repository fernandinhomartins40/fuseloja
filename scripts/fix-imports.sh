#!/bin/bash

# Script para atualizar imports para usar pacotes compartilhados
# Fases 3 do plano de implementação

echo "🔄 Atualizando imports para usar @fuseloja/types..."

# Contar arquivos antes
TOTAL_FILES=$(find apps/web/src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l)
echo "📊 Total de arquivos TypeScript: $TOTAL_FILES"

# Substituir imports de types específicos
find apps/web/src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i \
  -e "s|from ['\"]\.\.\/types\/api['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/types\/api['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/\.\.\/types\/api['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]@\/types\/api['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/types\/product['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/types\/product['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/\.\.\/types\/product['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]@\/types\/product['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/types\/user['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/types\/user['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/\.\.\/types\/user['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]@\/types\/user['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/types\/category['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/types\/category['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/\.\.\/types\/category['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]@\/types\/category['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/types\/settings['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/types\/settings['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]\.\.\/\.\.\/\.\.\/types\/settings['\"]|from '@fuseloja/types'|g" \
  -e "s|from ['\"]@\/types\/settings['\"]|from '@fuseloja/types'|g" \
  {} \;

echo "✅ Imports atualizados com sucesso!"
echo "📝 Próximo passo: Executar 'npm run type-check' para verificar erros"
