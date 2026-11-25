#!/usr/bin/env bash
# Teste do verificador de frames (check-frames.sh). Monta casos bons e ruins a
# partir da própria lista esperada, sem depender do Figma.
# Uso: test-check-frames.sh   (sai com 0 se todos os casos se comportam como esperado)
set -uo pipefail
export LC_ALL=C

dir="$(cd "$(dirname "$0")" && pwd)"
check="$dir/check-frames.sh"

# Modo interno: roda um caso. Argumentos: --caso descricao codigo-esperado trecho arquivo
if [ "$#" -gt 0 ] && [ "$1" = "--caso" ]; then
  desc="$2"; codigo="$3"; trecho="$4"; arq="$5"
  saida="$("$check" "$arq" 2>&1)"; rc=$?
  if [ "$rc" -eq "$codigo" ] && printf '%s' "$saida" | grep -qF -- "$trecho"; then
    echo "ok   - $desc"
    exit 0
  fi
  echo "FALHA - $desc (codigo $rc, esperado $codigo, trecho '$trecho')"
  printf '%s\n' "$saida" | sed 's/^/       /'
  exit 1
fi

csv="$dir/frames-esperados.csv"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
falhas=0
self="$dir/test-check-frames.sh"

tail -n +2 "$csv" | cut -d';' -f1 > "$tmp/bom.txt"
bash "$self" --caso "lista completa (96 + 14) confere" 0 "RESULTADO: confere" "$tmp/bom.txt" || falhas=$((falhas + 1))

# Cenario que originou a divergencia: so as 8 telas com Vazio aplicavel na F24.
grep -v ' / Vazio$' "$tmp/bom.txt" > "$tmp/sem-vazio.txt"
grep -E '^(03|09|10|13|17|21|22|24) .* / Vazio$' "$tmp/bom.txt" >> "$tmp/sem-vazio.txt"
bash "$self" --caso "so 8 de 24 Vazio (matriz antiga) reprova com 16 faltando" 1 "faltando: 16" "$tmp/sem-vazio.txt" || falhas=$((falhas + 1))

grep -v '^05 Clientes · criar / Preenchido$' "$tmp/bom.txt" > "$tmp/falta-um.txt"
bash "$self" --caso "um canonico faltando reprova" 1 "canonicos presentes: 95 de 96" "$tmp/falta-um.txt" || falhas=$((falhas + 1))

grep -v ' / Erro · validação$' "$tmp/bom.txt" > "$tmp/sem-variante.txt"
bash "$self" --caso "variantes de validacao faltando reprova" 1 "variantes presentes: 1 de 14" "$tmp/sem-variante.txt" || falhas=$((falhas + 1))

cp "$tmp/bom.txt" "$tmp/duplicado.txt"
echo "01 Login / Vazio" >> "$tmp/duplicado.txt"
bash "$self" --caso "frame duplicado reprova" 1 "duplicado: 1" "$tmp/duplicado.txt" || falhas=$((falhas + 1))

cp "$tmp/bom.txt" "$tmp/extra.txt"
echo "25 Tela fora do inventário / Preenchido" >> "$tmp/extra.txt"
bash "$self" --caso "tela fora do inventario reprova" 1 "extra: 1" "$tmp/extra.txt" || falhas=$((falhas + 1))

sed 's#^03 Clientes · lista / Erro$#03 Clientes · lista / Erro de rede#' "$tmp/bom.txt" > "$tmp/nome-antigo.txt"
bash "$self" --caso "nome antigo (Erro de rede) reprova" 1 "faltando: 1" "$tmp/nome-antigo.txt" || falhas=$((falhas + 1))

: > "$tmp/vazio.txt"
bash "$self" --caso "lista vazia reprova" 1 "faltando: 110" "$tmp/vazio.txt" || falhas=$((falhas + 1))

"$check" > /dev/null 2>&1; rc=$?
if [ "$rc" -eq 2 ]; then echo "ok   - sem argumento retorna 2"; else echo "FALHA - sem argumento retornou $rc"; falhas=$((falhas + 1)); fi

echo "falhas: $falhas"
[ "$falhas" -eq 0 ]
