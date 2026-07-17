# Practical AI Security (Farlow, Jun 2026, 392pp) — TOC

> **Estado**: ⚠️ Solo TOC — **NO descargado**. Reemplaza al "Practical AI for Cybersecurity" (Das) que estaba corrupto.
> **Cubre**: Especialización AI/LLM Security (Fase 5)
> **ISBN**: 9781718504660
> **Fuente**: https://nostarch.com/practical-ai-security

## Por qué este libro y no el de Ravi Das

El "Practical AI for Cybersecurity" (Ravi Das) que tenías descargado estaba **roto** (page size 84×126pts, solo extraía el título). "Practical AI Security" (Farlow, Jun 2026) es **más actual** y específicamente sobre AI/ML offensive+defensive, no solo "usar IA para ciberseguridad". Cubre MAESTRO framework, MITRE ATLAS, OWASP LLM Top 10.

## Estructura

**Foreword · Acknowledgments · Introduction**

### Part I: AI and Security Fundamentals
- **Cap 1**: What Is AI?
- **Cap 2**: Working with Models
- **Cap 3**: AI Threats *(chapter 3 disponible como sample gratis: nostarch.com/download/samples/practical-ai-security_chapter3.pdf)*

### Part II: Attacking and Defending AI
- **Cap 4**: Attacks and Weaknesses *(data poisoning, model theft, prompt injection)*
- **Cap 5**: Defenses, Controls, and Mitigations

### Part III: The AI Security Ecosystem
- **Cap 6**: Red Teaming AI
- **Cap 7**: Attacking and Defending with AI
- **Cap 8**: AI Safety
- **Cap 9**: AI Governance
- **Cap 10**: What's Next for AI Security?

**Conclusion**: A New Kind of Hacker

## Mapeo al currículo `raíz_` (Especialización AI/LLM)

Cada capítulo mapea a una lección de la rama AI/LLM Security:

| Cap | Lección AI/LLM | Conceptos clave |
|---|---|---|
| 1 | AI-LLM-01 ¿Qué es un modelo? | modelo ML, entrenamiento, inferencia |
| 2 | AI-LLM-02 Trabajando con modelos | weights, fine-tuning, RAG, agents |
| 3 | AI-LLM-03 Amenazas a AI | MITRE ATLAS, taxonomía de amenazas |
| 4 | AI-LLM-04 Ataques (poisoning/theft/prompt-injection) | OWASP LLM Top 10, prompt injection |
| 5 | AI-LLM-05 Defensas | robustez adversarial, guardrails |
| 6 | AI-LLM-06 Red Teaming AI | MAESTRO framework, AI red team |
| 7 | AI-LLM-07 AI como arma y escudo | LLM ofensivo, LLM defensivo |
| 8 | AI-LLM-08 AI Safety | alineación, bias, guardrails |
| 9 | AI-LLM-09 AI Governance | ISO 42001, EU AI Act |
| 10 | AI-LLM-10 El futuro | AGI risks, autonomous agents |

## Recursos adicionales (gratis, para expandir cada capítulo)

- **Cap 3 sample**: https://nostarch.com/download/samples/practical-ai-security_chapter3.pdf
- **Colab notebooks**: https://nostarch.com/download/code/PracticalAISecurity_ColabNotebooks.zip
- **GitHub**: https://github.com/harriethacks/aisecurityhandbook
- **OWASP LLM Top 10**: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- **MITRE ATLAS**: https://atlas.mitre.org/
- **MAESTRO framework**: https://makemobilitymatter.org/maestro/
