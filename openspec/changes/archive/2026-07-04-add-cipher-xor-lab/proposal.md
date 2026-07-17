# Proposal: Add XOR Cipher Lab

## 1. Intent
Provide an interactive laboratory for students to learn the fundamentals of XOR encryption and decryption. The lab features a Sandbox Mode for real-time bit toggling and a CTF Challenge Mode for decrypting hexadecimal ciphertexts by identifying the correct key.

## 2. Scope
* Define schema extensions in `content.config.ts` for XOR configuration parameters (e.g., custom keys, ciphertexts, and hints).
* Design and implement `CipherXor.astro` using clean vanilla JavaScript for client-side interactivity.
* Integrate the new component into the lesson route resolver.

## 3. Capabilities

### New Capabilities
* **`cipher-xor-lab`**: The capability to render interactive XOR encoding/decoding sandboxes and challenges.

### Modified Capabilities
* None.

## 4. Technical Approach
* **Schema Updates**: Enhance the `lab` object schema in `content.config.ts` to include optional configuration fields for CTF mode (`key`, `ciphertext`, `hint`).
* **Interactivity**: Use an optimized, self-contained `<script>` tag within `CipherXor.astro`. Ensure real-time DOM updates representing active binary states and bitwise calculations (`A ^ B = C`).
* **CTF Verification**: Implement hex validation, key-matching logic, and success callbacks directly in the browser runtime.

## 5. Affected Areas

| Affected Area / File | Change Type | Description |
| :--- | :--- | :--- |
| `app/src/content.config.ts` | Modified | Update Zod schema to support `cipher_xor` parameters (key, ciphertext, hint). |
| `app/src/pages/l/[leccion].astro` | Modified | Import and conditionally render `<CipherXor />` when `lab.tipo === 'cipher_xor'`. |
| `app/src/components/CipherXor.astro` | Created | Implement interface for sandbox bit toggling and CTF challenge forms. |

## 6. Risks & Mitigations
* **Input Parsing Errors**: Invalid hex inputs in CTF mode could crash the client script.
  * *Mitigation*: Sanitize key entries using strict regular expressions (`^[0-9a-fA-F]*$`) and gracefully handle invalid inputs.
* **Layout Shifts**: Dynamically toggled sections could cause layout instability.
  * *Mitigation*: Apply fixed-height placeholders for responsive state containers.

## 7. Rollback Plan
1. Revert changes to modified files using Git: `git checkout HEAD -- app/src/content.config.ts app/src/pages/l/[leccion].astro`.
2. Delete the created component: `rm app/src/components/CipherXor.astro`.
3. Clear Astro build cache and redeploy to restore the previous static production state.

## 8. Success Criteria
* Astro project compiles successfully with zero type errors.
* Sandbox mode allows toggling inputs and shows correctly updated XOR bits instantaneously.
* CTF challenge mode detects correct keys and transitions to a solved state.
* UI adheres to the site's brutalist minimal styling palette.

## 9. External Dependencies
* None. No external npm packages or external APIs are introduced.
