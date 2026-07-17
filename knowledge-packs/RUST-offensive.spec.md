# RUST · Rust Ofensivo — Knowledge Pack Spec

> **Estado**: 🟡 Especialización sin libro descargado.
> **Cubre**: Especialización Rust ofensivo — 8 lecciones.
> **Depende de**: M3 (C, asm), M10 (arsenal).

## Por qué Rust para ciberseguridad en 2026

Rust es la alternativa **memory-safe** a C para escribir implantes y herramientas ofensivas. En 2024-2026 muchas herramientas modernas (HuskyC, Sliver alternativas, BPF tools) se escriben en Rust. Cobalt Strike ya tiene plugins Rust.

## Libro ancla (referencia, NO descargado)

- **Black Hat Rust** (Simoons, 2021) — el canónico para Rust ofensivo. ~480pp.
- **The Rust Programming Language 3e** (No Starch, 2025) — base del lenguaje.

## Plan de lecciones + fuentes

| # | Lección | Fuentes primarias (gratis) |
|---|---|---|
| RUST-L01 | Rust basics: ownership, borrow checker, cargo | https://doc.rust-lang.org/book/ + https://rustlings.cool/ |
| RUST-L02 | Manejo de memoria sin GC | https://doc.rust-lang.org/nomicon/ + https://github.com/rust-lang/unsafe-code-guidelines |
| RUST-L03 | `unsafe` Rust y FFI (cuándo romper la seguridad) | https://doc.rust-lang.org/nomicon/ + https://doc.rust-lang.org/book/ch19-01-unsafe-rust.html |
| RUST-L04 | Shellcoding en Rust | https://github.com/Vourhey/shellcode-rs + https://docs.rs/shellwork/ |
| RUST-L05 | Implant Rust: estructura base | https://github.com/mullvad/mullvadvpn-app (referencia arquitectónica) + Sliver (github.com/BishopFox/sliver, escrito en Go pero arquitectura portable) |
| RUST-L06 | Network comms ofensivas en Rust | https://docs.rs/tokio/ + https://github.com/hyperium/hyper |
| RUST-L07 | Cryptografía ofensiva en Rust | https://docs.rs/rustcrypto/ + https://github.com/RustCrypto |
| RUST-L08 | OPSEC: anti-debug, anti-VM en Rust | https://github.com/rust-fuzz/ + RustSec advisory DB |

## Conceptos que INTRODUCE (glosario)

`Rust`, `ownership`, `borrow_checker`, `cargo`, `crate`, `unsafe`, `FFI`, `tokio`, `async_await`, `implant`, `RustSec`

## Recursos clave (todos gratis)

- **The Rust Book (online)**: https://doc.rust-lang.org/book/
- **Rustlings (ejercicios)**: https://github.com/rust-lang/rustlings
- **RustSec Advisory DB**: https://rustsec.org/advisories/
- **Black Hat Rust repo (código)**: https://github.com/skerkour/black_hat_rust (open source, el libro es de paga pero el código es libre)
- **Crates de seguridad**: https://crates.io/categories/cryptography

## Por qué NO meter Rust antes de M14

Rust ofensivo SOLO tiene sentido después de:
- M3 (C y memoria, para contrastar)
- M10 (arsenal, para entender qué construye un implante)
- Idealmente M14 (evasión, contexto real)

Antes sería ruido.
