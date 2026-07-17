# Serious Cryptography, 2nd Edition (Aumasson, 2024) — TOC

> **Estado**: ⚠️ Solo TOC — el PDF que tenés es la **1ra ed (2017, 314pp)**. La 2da ed (2024, 376pp) agrega: cripto post-cuántica actualizada, blockchain/criptomonedas, ed25519.
> **Cubre**: M6 (Criptografía) — actualizado
> **Fuente**: https://nostarch.com/serious-cryptography-2nd-edition (página oficial)

## Estructura (2da edición)

**Foreword · Acknowledgments · Introduction · Abbreviations**

### Part I: Fundamentals
- **Cap 1**: Encryption
- **Cap 2**: Randomness
- **Cap 3**: Cryptographic Security

### Part II: Symmetric Crypto
- **Cap 4**: Block Ciphers
- **Cap 5**: Stream Ciphers
- **Cap 6**: Hash Functions
- **Cap 7**: Keyed Hashing
- **Cap 8**: Authenticated Encryption

### Part III: Asymmetric Crypto
- **Cap 9**: Hard Problems
- **Cap 10**: RSA
- **Cap 11**: Diffie–Hellman
- **Cap 12**: Elliptic Curves

### Part IV: Applications
- **Cap 13**: TLS (HTTPS)
- **Cap 14**: Quantum and Post-Quantum 🆕 (actualizado 2024)
- **Cap 15**: Cryptocurrency Cryptography 🆕 (nuevo en 2da ed)

## Mapeo al currículo `raíz_`

- **M6** ← todo el libro
- **M0.XOR** ← Cap 1 (dependencia cíclica: el XOR de M0 es base del Cap 1)
- **M5.TLS** ← Cap 13

## Plan de expansión web (knowledge-packs a generar)

Para los capítulos NUEVOS de la 2da ed que NO están en tu PDF de 1ra ed:
- **Cap 14 (Post-Quantum)** → fuentes: NIST PQC standards (2024), Kyber/ML-KEM, Dilithium/ML-DSA, papers recientes
- **Cap 15 (Cryptocurrency)** → fuentes: Bitcoin developer docs, Ethereum yellow paper, ZK-SNARKs papers

## Diferencia con tu PDF actual (1ra ed)

Tu PDF cubre Caps 1-12 (todas las Parts I-III) — los fundamentos son los mismos. Solo faltan los Caps 13-15 actualizados, que se rellenan con knowledge-packs.
