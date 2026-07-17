# M11 · Ataques a Contraseñas — Knowledge Pack Spec

> **Estado**: 🟡 Sin libro ancla (no comprado). Se construye 100% con fuentes abiertas.
> **Cubre**: M11 — 8 lecciones estimadas.
> **Depende de**: M6 (hashing), M8 (metodología).

## Plan de lecciones + fuentes por lección

| # | Lección | Fuentes primarias (gratis) |
|---|---|---|
| M11-L01 | Hashing de passwords: bcrypt, scrypt, Argon2 | https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html + https://datatracker.ietf.org/doc/rfc9106/ (Argon2) |
| M11-L02 | Salt, pepper,Iterations | OWASP Password Storage CS + NIST SP 800-63B |
| M11-L03 | Diccionarios y wordlists | SecLists (GitHub) + RockYou analysis + CrackStation |
| M11-L04 | John the Ripper — modo diccionario, incremental, single | https://www.openwall.com/john/doc/ + https://github.com/openwall/john |
| M11-L05 | Hashcat — mask attack, reglas, modo hybrid | https://hashcat.net/wiki/ + https://hashcat.net/hashmode/ |
| M11-L06 | Reglas de Hashcat (OneRuleToRuleThemAll, best64) | https://github.com/NotSoSecure/password_cracking_rules + HashcatUtils |
| M11-L07 | Brute force en red: Hydra, Medusa, Ncrack | https://github.com/vanhauser-thc/thc-hydra + Ncrack Nmap docs |
| M11-L08 | Defensas: lockout, MFA, passwordless (WebAuthn) | https://webauthn.guide/ + FIDO Alliance docs |

## Labs sugeridos (navegador)

- **Hashcat en WASM**: una versión liviana para hashes simples (MD5/SHA1) corriendo en el navegador, para que el alumno experimente sin infra
- **Diccionario vs fuerza bruta**: visualización del espacio de claves (2^x) y tiempo estimado
- **Hydra simulado**: ataque a formulario web mock con credenciales de juguete

## Conceptos que INTRODUCE (para el glosario)

`hash_password`, `salt`, `pepper`, `bcrypt`, `scrypt`, `Argon2`, `PBKDF2`, `brute_force`, `diccionario`, `rainbow_table`, `mask_attack`, `rule_based_attack`, `Hydra`, `Hashcat`, `John`, `lockout`, `MFA`, `WebAuthn`, `FIDO2`, `key_derivation_function`

## Validación (regla "no asumir")

Antes de M11-L01 el alumno debe conocer:
- ✅ `hashing` (definido en M6)
- ✅ `cifrado_simetrico` (M6, para contrastar hash vs cifrado)
- ✅ `fases_pentest` (M8, contexto de dónde encaja)

Si algún término no está upstream, es bug del grafo.
