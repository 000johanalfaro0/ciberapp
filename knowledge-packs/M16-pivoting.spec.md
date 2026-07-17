# M16 · Pivoting, Túneles y Movimiento Lateral — Knowledge Pack Spec

> **Estado**: 🟡 Material parcial (Hacker Playbook 3 Part 8 cubre intro). Se complementa con fuentes abiertas.
> **Cubre**: M16 — 8 lecciones estimadas.
> **Depende de**: M4 (redes), M10 (arsenal), M15 (privesc).

## Plan de lecciones + fuentes por lección

| # | Lección | Fuentes primarias (gratis) |
|---|---|---|
| M16-L01 | Concepto de pivot: por qué y cuándo | https://book.hacktricks.xyz/generic-methodologies-and-resources/pivoting/port-forwarding + HackerPlaybook-3 Part 8 |
| M16-L02 | SSH tunneling: local, remote, dynamic (-L/-R/-D) | https://www.ssh.com/academy/ssh/tunneling-example + Ssh man page |
| M16-L03 | SOCKS proxy con SSH + proxychains | proxychains-ng README + https://github.com/rofl0r/proxychains-ng |
| M16-L04 | Chisel: HTTP tunneling moderno | https://github.com/jpillora/chisel + HTB Chisel guide |
| M16-L05 | Ligolo-ng: el estándar 2025-2026 | https://github.com/nicocha30/ligolo-ng + TryHackMe Wreath |
| M16-L06 | Double pivoting (pivot sobre pivot) | https://book.hacktricks.xyz/generic-methodologies-and-resources/tunneling-and-port-forwarding |
| M16-L07 | Port forwarding con socat, rinetd | https://github.com/cyberark/kubeletctl + socat examples |
| M16-L08 | Detección defensiva del pivoting | MITRE ATT&CK TA0008 (Lateral Movement) |

## Labs sugeridos (navegador con simulación)

- **Visualizador de túneles**: un grafo cytoscape.js con máquina atacante → pivot → target interno. Animación del paquete viajando por el túnel.
- **Config builder SSH**: el alumno arma el comando `ssh -L 8080:internal:80 user@pivot` y ve qué pasa en una red simulada.

## Conceptos que INTRODUCE (para el glosario)

`pivoting`, `port_forwarding`, `SSH_local_tunnel`, `SSH_remote_tunnel`, `SSH_dynamic_tunnel`, `SOCKS_proxy`, `proxychains`, `chisel`, `ligolo-ng`, `double_pivot`, `lateral_movement`, `pass_the_hash`, `internal_subnet`

## Validación (regla "no asumir")

Antes de M16-L01 el alumno debe conocer:
- ✅ `TCP_UDP`, `puertos`, `IP`, `enrutamiento` (M4)
- ✅ `reverse_shell`, `bind_shell` (M10)
- ✅ `privesc` (M15, asume que ya estás dentro y con root/admin)

## Estado de material

- HackerPlaybook-3-DEC Part 8 → intro (~30 páginas)
- HackTricks → detalle técnico actualizado
- THM Wreath → laboratorio real (gratis) con pivot de 3 máquinas
