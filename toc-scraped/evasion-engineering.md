# Evasion Engineering (Chow & LaSalvia, Jul 2026, 256pp) — TOC

> **Estado**: ⚠️ Solo TOC — NO descargado todavía.
> **Cubre**: M14 (Evasión de AV/EDR) — actualizado 2026
> **ISBN**: 9781718505049
> **Fuente**: https://nostarch.com/evasion-engineering
> **Código (GitHub)**: https://github.com/dc401/nostarch-evasion-engineering
> **Sample Cap 2**: https://nostarch.com/download/samples/evasion-engineering_chapter-2.pdf

## Por qué este libro

El otro libro posible para M14 era "Evasive Malware" (Caleb Barnes) que es más viejo (2020) y centrado en técnicas específicas. Evasion Engineering (2026) enseña **a construir** tools custom en Go que evadan AV/EDR modernos — el enfoque de Red Team real 2026. Mapea cada técnica a su superficie de detección.

## Estructura

**Foreword · Acknowledgments · Introduction**

### Part I: Red Teaming Fundamentals
- **Cap 1**: Principles of Application Design and Development
- **Cap 2**: Evasion Strategies *(disponible como sample gratis)*

### Part II: Hands-On Evasive Tool Development (en Go)
- **Cap 3**: Enumerating with Traffic Redirection
- **Cap 4**: Developing Command-and-Control Implants
- **Cap 5**: Creating Lateral Exploits with Worms
- **Cap 6**: Enumerating Locally Without LOLBins
- **Cap 7**: Bypassing Detection with Hybrid Packing
- **Cap 8**: Staging and Exfiltrating Data Covertly

### Part III: Testing and Validation
- **Cap 9**: Building Detection Tools
- **Cap 10**: Executing Controlled Reveals

**Appendix**: Technical Requirements (Go 1.21+, Python 3.x) · Index

## Mapeo al currículo `raíz_` (M14)

| Cap | Lección M14 | Conceptos clave |
|---|---|---|
| 1 | M14-L01 Fundamentos de Red Team Tools | diseño de implantes, reusabilidad |
| 2 | M14-L02 Estrategias de evasión | AV/EDR bypass taxonomy |
| 3 | M14-L03 Enumeración stealth | traffic redirection |
| 4 | M14-L04 C2 custom | protocolos custom, network inspection bypass |
| 5 | M14-L05 Movement lateral autónomo | worms, lateral exploits |
| 6 | M14-L06 Enumeración local sin LOLBins | detección de LOLBins, alternativas |
| 7 | M14-L07 Hybrid Packing | packers, crypters, AV bypass |
| 8 | M14-L08 Exfiltración encubierta | covert channels, steganography |
| 9 | M14-L09 Construyendo detección | detection engineering |
| 10 | M14-L10 Controlled reveals | OPSEC del red team, validación |

## Recursos adicionales (gratis)

- **MITRE ATT&CK Defense Evasion (TA0005)**: https://attack.mitre.org/tactics/TA0005/
- **PE-bear / Detect It Easy**: herramientas de análisis de packers
- **PE-sieve**: scanner de procesos en memoria
- **Sample Cap 2**: https://nostarch.com/download/samples/evasion-engineering_chapter-2.pdf

## Stack técnico del libro

- **Go 1.21+**: el libro construye implantes en Go (no C ni Python). Para tu currículo, esto conecta con la especialización "Rust ofensivo" — alternativa moderna al C de M3.
