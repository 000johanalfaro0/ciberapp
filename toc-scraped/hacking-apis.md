# Hacking APIs (Corey Ball, 2022, 368pp) — TOC

> **Estado**: ⚠️ Solo TOC — NO descargado todavía.
> **Cubre**: Especialización Cloud/API Security (Fase 5)
> **ISBN**: 9781718502444
> **Premio**: SANS Difference Makers Award Cybersecurity Book of the Year 2022
> **Fuente**: https://nostarch.com/hacking-apis
> **Sample Cap 7**: https://nostarch.com/download/samples/HackingAPIs_sampleCh7.pdf

## Estructura

**Foreword · Acknowledgments · Introduction**

### Part I: How Web API Security Works
- **Cap 0**: Preparing for Your Security Tests
- **Cap 1**: How Web Applications Work
- **Cap 2**: The Anatomy of Web APIs
- **Cap 3**: Common API Vulnerabilities

### Part II: Building an API Testing Lab
- **Cap 4**: Your API Hacking System
- **Cap 5**: Setting Up Vulnerable API Targets

### Part III: Attacking APIs
- **Cap 6**: Discovery
- **Cap 7**: Endpoint Analysis
- **Cap 8**: Attacking Authentication
- **Cap 9**: Fuzzing
- **Cap 10**: Exploiting Authorization (BOLA/IDOR)
- **Cap 11**: Mass Assignment
- **Cap 12**: Injection

### Part IV: Real-World API Hacking
- **Cap 13**: Applying Evasive Techniques and Rate Limit Testing
- **Cap 14**: Attacking GraphQL
- **Cap 15**: Data Breaches and Bug Bounties

**Conclusion · Appendix A**: API Hacking Checklist · Appendix B: Additional Resources

## Mapeo al currículo `raíz_` (Especialización Cloud/API Security)

| Cap | Lección Cloud-API | Conceptos clave |
|---|---|---|
| 0-1 | CL-API-01 Setup + Web refresher | API, REST, SOAP, GraphQL |
| 2 | CL-API-02 Anatomía de Web APIs | endpoints, auth, headers |
| 3 | CL-API-03 OWASP API Top 10 | BOLA, broken auth, mass assignment |
| 4-5 | CL-API-04 Lab vulnerable | crAPI, VAmPI, DVWA |
| 6 | CL-API-05 Discovery | fuzzing endpoints, wordlists, Postman |
| 7 | CL-API-06 Endpoint analysis | Burp, parameter mining |
| 8 | CL-API-07 Ataques a auth | JWT attacks, OAuth flaws |
| 9 | CL-API-08 Fuzzing | ffuf, Wfuzz, automation |
| 10 | CL-API-09 BOLA / IDOR | broken object level auth |
| 11 | CL-API-10 Mass assignment | object property injection |
| 12 | CL-API-11 Injection en APIs | SQLi, NoSQLi, command |
| 13 | CL-API-12 Evasión + rate limits | IP rotation, WAF bypass |
| 14 | CL-API-13 GraphQL hacking | introspection, batching attacks |
| 15 | CL-API-14 Bug bounty real | disclosure, CVSS |

## Conexión con el currículo principal

- **Depende de**: M5 (Web), M12 (OWASP Top 10)
- **Conecta con**: AI/LLM (APIs son la interfaz de los LLMs)
