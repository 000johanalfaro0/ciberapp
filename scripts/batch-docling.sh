#!/bin/bash
set -u
VENV=/home/jojan/AppsWebs/ciberapp/.venv/bin
INPUT="/home/jojan/AppsWebs/ciberapp/raw-pdfs"
OUTPUT=/home/jojan/AppsWebs/ciberapp/libros-md
LOG=/home/jojan/AppsWebs/ciberapp/logs/batch.log

mkdir -p "$OUTPUT" "$(dirname "$LOG")"

# slug|archivo_original
BOOKS=(
  "BugBountyBootcamp|Bug Bounty Bootcamp The Guide to Finding and Reporting Web Vulnerabilities by Vickie Li.pdf"
  "Kurose-Networking-TopDown-8e|Computer Networking A Top-Down Approach, 8th Edition by James F. Kurose, Keith W. Ross-Pearson-9780136681557.pdf"
  "CSAPP-3e|Computer Systems A Programmers Perspective (3rd).pdf"
  "Hacking-ArtExploit-2e|Hacking - The Art of Exploitation, 2nd Edition by Jon Erickson.pdf"
  "nand2tetris|l_1786_50871291.pdf"
  "Metasploit-Cookbook|Metasploit Penetration Testing Cookbook.pdf"
  "Nessus-10-12|Nessus_10_12.pdf"
  "OSTEP|Operating Systems - Three Easy Pieces.pdf"
  "Pentest-Weidman|Penetration Testing - A hands-on introduction to Hacking.pdf"
  "Practical-Malware-Analysis|Practical Malware Analysis_ The Hands-On Guide to Dissecting Malicious Software ( PDFDrive ).pdf"
  "RTFM-RedTeam-v2|RTFM Red Team Field Manual v2 -- Ben Clark & Nick Downer.pdf"
  "Serious-Crypto-1e|seriouscrytography.pdf"
  "TWAHH-2e|The Web Application Hacker's Handbook - Finding and Exploiting Security Flaws, 2nd Edition by Dafydd Stuttard, Marcus Pinto.pdf"
  "HackerPlaybook-3-DEC|The Hacker Playbook 3 - DECRYPTED.pdf"
  "Windows-Internals-7e-Part1|Windows System Internals 7e Part 1.pdf"
  "LinuxBasics-ForHackers|linuxbasicsforhackers.pdf"
)

echo "[$(date +%F\ %T)] === BATCH START ===" | tee -a "$LOG"

for entry in "${BOOKS[@]}"; do
  slug="${entry%%|*}"
  src_name="${entry##*|}"
  src="$INPUT/$src_name"
  out="$OUTPUT/$slug.md"

  if [ ! -f "$src" ]; then
    echo "[$(date +%T)] SKIP  $slug  (no existe)" | tee -a "$LOG"
    continue
  fi
  if [ -f "$out" ] && [ "$(stat -c%s "$out")" -gt 1000 ]; then
    echo "[$(date +%T)] SKIP  $slug  (ya procesado)" | tee -a "$LOG"
    continue
  fi

  start=$(date +%s)
  pages=$(pdfinfo "$src" 2>/dev/null | awk '/^Pages:/{print $2}')
  echo "[$(date +%T)] >>>>  $slug  (${pages}p)" | tee -a "$LOG"

  # docling genera <basename>.md; renombramos al slug
  $VENV/docling "$src" --output "$OUTPUT/" --image-export-mode placeholder >>"$LOG" 2>&1

  # docling nombra el output igual que el input base; renombrar a slug
  gen="$OUTPUT/$(basename "$src_name" .pdf).md"
  if [ -f "$gen" ] && [ "$gen" != "$out" ]; then
    mv "$gen" "$out"
  fi

  end=$(date +%s)
  size=$(stat -c%s "$out" 2>/dev/null || echo 0)
  echo "[$(date +%T)] <<<<  $slug  done $((end-start))s  ${size}B" | tee -a "$LOG"
done

echo "[$(date +%F\ %T)] === BATCH END ===" | tee -a "$LOG"
