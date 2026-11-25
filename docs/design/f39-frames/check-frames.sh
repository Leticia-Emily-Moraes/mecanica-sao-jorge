#!/usr/bin/env bash
# Confere os nomes dos frames do wireframe revisado (F39, US-WFR-01) contra
# docs/design/f39-frames/frames-esperados.csv.
#
# Uso: check-frames.sh <lista-real.txt>
#   lista-real.txt: um nome de frame por linha (frames de topo da página
#   "F24 · Wireframe baixa fidelidade", extraídos do Figma por get_metadata).
#
# Saída: contagens e, se houver problema, a lista de faltando / extra /
# duplicado. Código de saída: 0 = confere; 1 = divergência; 2 = uso incorreto.
set -euo pipefail
export LC_ALL=C

if [ "$#" -ne 1 ] || [ ! -f "$1" ]; then
  echo "uso: check-frames.sh <lista-real.txt>" >&2
  exit 2
fi

dir="$(cd "$(dirname "$0")" && pwd)"
csv="$dir/frames-esperados.csv"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

tail -n +2 "$csv" | cut -d';' -f1 | sort > "$tmp/esperado"
awk -F';' 'NR>1 && $2=="canonico" {print $1}' "$csv" | sort > "$tmp/canonico"
sed 's/\r$//' "$1" | grep -v '^[[:space:]]*$' | sort > "$tmp/real" || true

sort -u "$tmp/real" > "$tmp/real_unico"
comm -23 "$tmp/esperado" "$tmp/real_unico" > "$tmp/faltando"
comm -13 "$tmp/esperado" "$tmp/real_unico" > "$tmp/extra"
uniq -d "$tmp/real" > "$tmp/duplicado"

canonicos_ok="$(comm -12 "$tmp/canonico" "$tmp/real_unico" | wc -l | tr -d ' ')"
variantes_ok="$(( $(comm -12 "$tmp/esperado" "$tmp/real_unico" | wc -l | tr -d ' ') - canonicos_ok ))"
n_faltando="$(wc -l < "$tmp/faltando" | tr -d ' ')"
n_extra="$(wc -l < "$tmp/extra" | tr -d ' ')"
n_dup="$(wc -l < "$tmp/duplicado" | tr -d ' ')"

echo "canonicos presentes: $canonicos_ok de 96"
echo "variantes presentes: $variantes_ok de 14"
echo "faltando: $n_faltando"
echo "extra: $n_extra"
echo "duplicado: $n_dup"

if [ "$n_faltando" -eq 0 ] && [ "$n_extra" -eq 0 ] && [ "$n_dup" -eq 0 ]; then
  echo "RESULTADO: confere (96 canonicos + 14 variantes, sem extra nem duplicado)"
  exit 0
fi

for tipo in faltando extra duplicado; do
  if [ -s "$tmp/$tipo" ]; then
    echo "--- $tipo ---"
    cat "$tmp/$tipo"
  fi
done
echo "RESULTADO: diverge"
exit 1
