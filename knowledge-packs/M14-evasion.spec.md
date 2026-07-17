# M14 · Evasión de AV y EDR — Knowledge Pack Spec

> **Estado**: 🟡 Material: TOC de *Evasion Engineering* (Chow & LaSalvia, 2026, 256pp) + sample Cap 2 gratis.
> **Cubre**: M14 — 10 lecciones.
> **Depende de**: M3 (C, asm), M10 (arsenal), M13 (binarios).

## Plan de lecciones + fuentes por lección

| # | Lección | Fuentes primarias |
|---|---|---|
| M14-L01 | Arquitectura de AV y EDR modernos | https://attack.mitre.org/tactics/TA0005/ + https://learn.microsoft.com/en-us/microsoft-365/security/defender-endpoint/ |
| M14-L02 | Taxonomía de evasión: signature vs behavioral | toc-scraped/evasion-engineering.md Cap 2 (sample gratis nostarch) |
| M14-L03 | API unhooking (ntdll restoration) | https://github.com/GetRektBoy721/NTDLL-unhooking + PE-sieve repo |
| M14-L04 | Direct syscalls (roturas de user-mode hooks) | SysWhispers3 repo + https://j00ru.vexillium.org/syscalls/ |
| M14-L05 | Process injection evasivo (early bird, transacted hollowing) | MITRE T1055 + https://github.com/TheD1rkMtr/Shellcode-Hide |
| M14-L06 | AMSI bypass (parcheo en memoria) | https://amsi.fail/ + Sorekin AMSI bypass repo |
| M14-L07 | Hybrid packing (custom packer en Go) | toc-scraped/evasion-engineering.md Cap 7 + https://github.com/dc401/nostarch-evasion-engineering |
| M14-L08 | LOLBins y living-off-the-land | https://lolbas-project.github.io/ (Windows) + GTFOBins (Linux) |
| M14-L09 | Covert exfiltration (DNS, ICMP) | toc-scraped/evasion-engineering.md Cap 8 + https://github.com/iagovol/pivosoquer (DNS exfil ref) |
| M14-L10 | Detection engineering (perspectiva defensor) | toc-scraped/evasion-engineering.md Cap 9-10 + Sigma rules |

## Recursos clave (todos gratis)

- **MITRE ATT&CK TA0005 (Defense Evasion)**: https://attack.mitre.org/tactics/TA0005/
- **Evasion Engineering sample Cap 2**: https://nostarch.com/download/samples/evasion-engineering_chapter-2.pdf
- **Repo GitHub del libro**: https://github.com/dc401/nostarch-evasion-engineering
- **LOLBAS / GTFOBins**: catálogo de binaries "legítimos" abusables
- **AMSI.fail**: colección viva de bypasses AMSI
- **PE-sieve**: scanner de procesos en memoria (defensivo)
- **SysWhispers3**: generador de direct syscalls

## Labs sugeridos (no navegador — necesita VM)

M14 requiere Windows VM con Defender activo. Esto es fase posterior (sandbox server-side), no en navegador.

## Conceptos que INTRODUCE (glosario)

`AV`, `EDR`, `AMSI`, `hook`, `ntdll`, `syscall`, `signature_detection`, `behavioral_detection`, `process_injection`, `API_unhooking`, `AMSI_bypass`, `direct_syscalls`, `lolbins`, `hybrid_packing`, `covert_channel`, `exfiltration`, `Sigma_rules`

## Validación (regla "no asumir")

Antes de M14-L01 el alumno debe conocer:
- ✅ `codigo_maquina`, `ensamblador`, `syscall` (M3)
- ✅ `proceso_hilo`, `memoria_virtual` (M2)
- ✅ `payload`, `Metasploit`, `reverse_shell` (M10)
- ✅ `buffer_overflow`, `shellcode` (M13)

## Por qué NO meter M14 antes de M10+M13

Sin entender payloads (M10) y shellcode (M13), la evasión es ruido. Es la consecuencia natural de "tengo un payload, ¿cómo lo hago sobrevivir?".
