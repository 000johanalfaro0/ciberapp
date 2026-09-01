---
id: "M0-L06"
modulo: "M0"
titulo: "Desafío Criptográfico: Rompiendo XOR"
crumb: "MÓDULO 0 · CIMIENTOS DE HIERRO · LECCIÓN 06"
numero: 6
depende_de: ["M0-L05"]
introduce: []
libros_fuente: ["CSAPP-3e"]
lab:
  tipo: "cipher_xor"
  descripcion: "Descifrá la transmisión interceptada usando la longitud de clave indicada."
  texto_plano: "HACK"
  clave: "KEY"
  cifrado: "03041a00"
generado_por: "manual"
generado_en: "2026-07-04T22:32:00Z"
status: "publicado"
---

# Desafío Criptográfico: Rompiendo XOR

El cifrado XOR es uno de los bloques fundamentales en el diseño de algoritmos simétricos más complejos. Aunque es extremadamente simple de implementar, su seguridad depende por completo de la clave utilizada.

## Funcionamiento del XOR repetitivo

Cuando la clave es más corta que el mensaje original (texto plano), la clave se repite secuencialmente sobre todo el texto. Por ejemplo, si ciframos el mensaje `HACK` con la clave `KEY`:

- `H` (0x48) XOR `K` (0x4B) = 0x03
- `A` (0x41) XOR `E` (0x45) = 0x04
- `C` (0x43) XOR `Y` (0x59) = 0x1A
- `K` (0x4B) XOR `K` (0x4B) = 0x00

Por lo tanto, la cadena cifrada resultante en hexadecimal es `03041a00`.

En este laboratorio interactivo puedes experimentar con los bits del mensaje y la clave para ver el cifrado XOR en tiempo real (modo sandbox) o intentar romper el mensaje cifrado (desafío CTF).
