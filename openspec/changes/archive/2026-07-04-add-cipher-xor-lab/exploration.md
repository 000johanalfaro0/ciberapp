# Exploration: Implementing `cipher_xor` Lab Component

Exploration of implementing the `cipher_xor` interactive lab component for ciberapp, focusing on the integration with the lesson renderer, CSS variables mapping, and content schema.

## Current State

The platform has a single interactive lab type implemented: `toggle` (via `Toggle.astro`). It represents a basic binary switch that simulates current state. 

Labs are configured in markdown files within the `content` directory (e.g., `content/M0/M0-L01.md` has `lab.tipo: "toggle"`). 

The lesson page `/home/jojan/AppsWebs/ciberapp/app/src/pages/l/[leccion].astro` is the lesson renderer. It checks the frontmatter fields of the loaded lesson, rendering the corresponding lab component if `leccion.data.lab.tipo` matches.

The Zod content schema in `app/src/content.config.ts` currently defines:
```typescript
lab: z.object({
  tipo: z.enum(['toggle', 'terminal_sim', 'cipher_xor', 'subnetting', 'packet_visualizer', 'none']).default('none'),
  descripcion: z.string().optional(),
}).default({ tipo: 'none' })
```

The app's design system uses a brutalist, minimalist aesthetic. The global theme is defined via CSS variables in `app/src/layouts/Base.astro`.

## Affected Areas

1. **`app/src/content.config.ts`**:
   - Extend the schema to optionally accept default `texto_plano` and `clave` values for the cipher lab.
2. **`app/src/pages/l/[leccion].astro`**:
   - Import the new `CipherXor` component.
   - Render the `<CipherXor />` component when `leccion.data.lab.tipo === 'cipher_xor'`.
3. **`app/src/components/CipherXor.astro`** (New File):
   - Contains the template, styling, and interactive client-side script for the XOR encryption simulator.

---

## Approaches

### Approach A: Basic Binary Input XOR (Single Byte)
- **Concept**: A simple interface that lets the user manipulate one single byte of plaintext (8 bits) and one byte of key (8 bits) and see the XOR output instantly.
- **Pros**: Very lightweight, low code complexity, easy to fit in mobile screens.
- **Cons**: Does not illustrate how XOR repeating-key cipher works on real text/strings (such as repeating a short key over a longer plaintext).

### Approach B: Repeatable Key & Multi-Character Matrix + Interactive Bit Inspector
- **Concept**: A complete lab showing:
  - Input field for Plaintext (up to 12 chars).
  - Input field for Key (up to 12 chars).
  - A dynamic, interactive matrix/table matching characters: `Plaintext Char [Binary] ^ Key Char [Binary] = Ciphertext Char [Binary] (Hex)`.
  - An interactive "Bit Inspector" detailing the first or selected character's exact bits, where clicking on bits in Plaintext or Key live-updates the inputs and the entire matrix.
- **Pros**: Highly educational, matches the "raíz_" philosophy of deep hands-on learning, and naturally demonstrates key repetition/modulo pattern.
- **Cons**: Higher code complexity, requires careful CSS design to ensure tables don't overflow on small mobile devices.

---

## Recommendation

**Approach B** is strongly recommended. The educational value of showing repeating key logic alongside bit-level interactivity perfectly aligns with ciberapp's design principles ("CONCEPTS > CODE"). The layout will use CSS media queries and horizontal scrolling for tables to prevent mobile overflow.

---

## Technical Blueprint

### 1. Schema Extensions in `app/src/content.config.ts`
```typescript
lab: z.object({
  tipo: z.enum(['toggle', 'terminal_sim', 'cipher_xor', 'subnetting', 'packet_visualizer', 'none']).default('none'),
  descripcion: z.string().optional(),
  texto_plano: z.string().optional(),
  clave: z.string().optional(),
}).default({ tipo: 'none' })
```

### 2. Integration in `app/src/pages/l/[leccion].astro`
```astro
---
// Import at top
import CipherXor from '../../components/CipherXor.astro';
...
---

// In the HTML body:
{leccion?.data?.lab?.tipo === 'toggle' && (
  <Toggle pregunta={leccion.data.lab.descripcion} />
)}

{leccion?.data?.lab?.tipo === 'cipher_xor' && (
  <CipherXor 
    descripcion={leccion.data.lab.descripcion}
    textoPlano={leccion.data.lab.texto_plano}
    clave={leccion.data.lab.clave}
  />
)}
```

### 3. Astro Component `app/src/components/CipherXor.astro`
```astro
---
interface Props {
  descripcion?: string;
  textoPlano?: string;
  clave?: string;
}

const {
  descripcion = "Probá cómo funciona el cifrado XOR. Cambiá el texto o la clave y observá el resultado a nivel de bits.",
  textoPlano = "A",
  clave = "K"
} = Astro.props;
---

<div class="lab cipher-xor-lab">
  <div class="lab-k">Práctica: Cifrado XOR</div>
  <p class="lab-q">{descripcion}</p>

  <div class="lab-workspace">
    <!-- Inputs Grid -->
    <div class="inputs-grid">
      <div class="input-field">
        <label for="xor-plaintext">Texto Plano (Plaintext)</label>
        <input
          type="text"
          id="xor-plaintext"
          value={textoPlano}
          maxlength="12"
          placeholder="Ej: A"
          autocomplete="off"
        />
        <div class="helper-text">Max 12 caracteres (ASCII)</div>
      </div>

      <div class="input-field">
        <label for="xor-key">Clave (Key)</label>
        <input
          type="text"
          id="xor-key"
          value={clave}
          maxlength="12"
          placeholder="Ej: K"
          autocomplete="off"
        />
        <div class="helper-text">Se repite si es más corta</div>
      </div>
    </div>

    <!-- Matrix View -->
    <div class="matrix-container">
      <table class="xor-table mono">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Plaintext</th>
            <th></th>
            <th>Key</th>
            <th></th>
            <th>Ciphertext</th>
            <th>Hex</th>
          </tr>
        </thead>
        <tbody id="xor-matrix-body">
          <!-- Rows inserted by client-side JS -->
        </tbody>
      </table>
    </div>

    <!-- Interactive Bit-by-Bit breakdown for selected/first byte -->
    <div class="bit-inspector">
      <div class="inspector-header">
        <span class="inspector-title">Inspección de Bits: Byte en Posición <span id="selected-byte-index">0</span></span>
      </div>
      <div class="bit-grid-container mono">
        <!-- Plaintext Bits -->
        <div class="bit-row" data-type="plaintext">
          <span class="bit-row-label">P: '<span id="p-char">A</span>'</span>
          <div class="bits">
            {Array.from({ length: 8 }).map((_, i) => (
              <button class="bit-btn" data-bit={7 - i} aria-label={`Plaintext bit ${7 - i}`}>0</button>
            ))}
          </div>
          <span class="byte-val-dec" id="p-dec">65</span>
        </div>

        <div class="op-row">
          <span></span>
          <div class="xor-op-symbol">^ (XOR)</div>
          <span></span>
        </div>

        <!-- Key Bits -->
        <div class="bit-row" data-type="key">
          <span class="bit-row-label">K: '<span id="k-char">K</span>'</span>
          <div class="bits">
            {Array.from({ length: 8 }).map((_, i) => (
              <button class="bit-btn" data-bit={7 - i} aria-label={`Key bit ${7 - i}`}>0</button>
            ))}
          </div>
          <span class="byte-val-dec" id="k-dec">75</span>
        </div>

        <div class="bit-divider"></div>

        <!-- Result Bits -->
        <div class="bit-row result-row" data-type="result">
          <span class="bit-row-label">C: '<span id="c-char">*</span>'</span>
          <div class="bits">
            {Array.from({ length: 8 }).map((_, i) => (
              <div class="bit-display" data-bit={7 - i}>0</div>
            ))}
          </div>
          <span class="byte-val-dec" id="c-dec">10</span>
        </div>
      </div>
      <div class="inspector-hint">Hacé clic en los bits de Plaintext o Key para alternarlos (0/1).</div>
    </div>
  </div>
</div>

<style>
  .cipher-xor-lab {
    background: var(--bg);
    border: 1px solid var(--line-2);
    border-radius: 18px;
    padding: 24px;
    margin: 28px 0;
  }
  .lab-workspace {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 16px;
  }
  .inputs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 600px) {
    .inputs-grid {
      grid-template-columns: 1fr;
    }
  }
  .input-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .input-field label {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  .input-field input {
    background: var(--paper);
    border: 1px solid var(--line-2);
    border-radius: 8px;
    padding: 10px 12px;
    font-family: ui-monospace, Menlo, monospace;
    font-size: 15px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s ease;
  }
  .input-field input:focus {
    border-color: var(--accent);
  }
  .helper-text {
    font-size: 11px;
    color: var(--faint);
  }
  .matrix-container {
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper);
  }
  .xor-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    text-align: left;
  }
  .xor-table th, .xor-table td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--line);
  }
  .xor-table th {
    background: rgba(24, 24, 27, 0.02);
    font-weight: 600;
    color: var(--muted);
  }
  .xor-table tbody tr {
    cursor: pointer;
    transition: background 0.15s ease;
  }
  .xor-table tbody tr:hover {
    background: rgba(91, 91, 214, 0.04);
  }
  .xor-table tr.active-row {
    background: var(--accent-soft);
  }
  .bit-inspector {
    border: 1px solid var(--line-2);
    border-radius: 12px;
    padding: 18px;
    background: var(--paper);
  }
  .inspector-header {
    margin-bottom: 16px;
    border-bottom: 1px solid var(--line);
    padding-bottom: 8px;
  }
  .inspector-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--ink);
  }
  .bit-grid-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .bit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .bit-row-label {
    width: 80px;
    font-size: 13px;
    color: var(--muted);
    font-weight: 500;
  }
  .bits {
    display: flex;
    gap: 4px;
  }
  .bit-btn, .bit-display {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    border-radius: 4px;
    border: 1px solid var(--line-2);
  }
  .bit-btn {
    background: var(--bg);
    cursor: pointer;
    color: var(--ink);
    transition: all 0.1s ease;
  }
  .bit-btn:hover {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .bit-btn[data-value="1"] {
    background: var(--accent);
    color: #fff;
    border-color: var(--accent);
  }
  .bit-display {
    background: rgba(24, 24, 27, 0.04);
    color: var(--muted);
  }
  .result-row .bit-display[data-value="1"] {
    background: var(--ink);
    color: #fff;
    border-color: var(--ink);
  }
  .op-row {
    display: flex;
    justify-content: center;
    margin: 2px 0;
  }
  .xor-op-symbol {
    font-size: 11px;
    font-weight: bold;
    color: var(--faint);
    background: var(--bg);
    border: 1px solid var(--line);
    padding: 2px 8px;
    border-radius: 99px;
  }
  .bit-divider {
    height: 1px;
    background: var(--line-2);
    margin: 6px 0;
  }
  .byte-val-dec {
    width: 32px;
    font-size: 12px;
    text-align: right;
    color: var(--faint);
  }
  .inspector-hint {
    margin-top: 14px;
    font-size: 11px;
    color: var(--muted);
    text-align: center;
    font-style: italic;
  }
</style>

<script>
  let plaintext = "A";
  let key = "K";
  let selectedIndex = 0;

  const plaintextInput = document.getElementById('xor-plaintext') as HTMLInputElement;
  const keyInput = document.getElementById('xor-key') as HTMLInputElement;
  const matrixBody = document.getElementById('xor-matrix-body');
  const selectedByteIndexSpan = document.getElementById('selected-byte-index');
  const pCharSpan = document.getElementById('p-char');
  const kCharSpan = document.getElementById('k-char');
  const cCharSpan = document.getElementById('c-char');
  const pDecSpan = document.getElementById('p-dec');
  const kDecSpan = document.getElementById('k-dec');
  const cDecSpan = document.getElementById('c-dec');

  function toBinary8(val: number): string {
    return val.toString(2).padStart(8, '0');
  }

  function getPrintableChar(code: number): string {
    if (code >= 32 && code <= 126) return String.fromCharCode(code);
    if (code === 10) return '\\n';
    if (code === 13) return '\\r';
    if (code === 9) return '\\t';
    return '.';
  }

  function updateXorMatrix() {
    if (!matrixBody) return;
    plaintext = plaintextInput.value || " ";
    key = keyInput.value || " ";

    let html = '';
    const length = plaintext.length;

    for (let i = 0; i < length; i++) {
      const pCode = plaintext.charCodeAt(i) || 0;
      const kCode = key.charCodeAt(i % key.length) || 0;
      const cCode = pCode ^ kCode;

      const isActive = i === selectedIndex ? 'class="active-row"' : '';

      html += `
        <tr ${isActive} data-index="${i}">
          <td>${i}</td>
          <td>'${plaintext[i] || ' '}' (${toBinary8(pCode)})</td>
          <td style="color: var(--faint);">^</td>
          <td>'${key[i % key.length] || ' '}' (${toBinary8(kCode)})</td>
          <td style="color: var(--faint);">=</td>
          <td>'${getPrintableChar(cCode)}' (${toBinary8(cCode)})</td>
          <td class="mono">0x${cCode.toString(16).padStart(2, '0').toUpperCase()}</td>
        </tr>
      `;
    }

    matrixBody.innerHTML = html;

    matrixBody.querySelectorAll('tr').forEach(row => {
      row.addEventListener('click', () => {
        selectedIndex = parseInt(row.getAttribute('data-index') || '0', 10);
        updateXorMatrix();
        updateInspector();
      });
    });

    updateInspector();
  }

  function updateInspector() {
    if (selectedIndex >= plaintext.length) {
      selectedIndex = 0;
    }
    if (selectedByteIndexSpan) selectedByteIndexSpan.textContent = selectedIndex.toString();

    const pCode = plaintext.charCodeAt(selectedIndex) || 0;
    const kCode = key.charCodeAt(selectedIndex % key.length) || 0;
    const cCode = pCode ^ kCode;

    if (pCharSpan) pCharSpan.textContent = plaintext[selectedIndex] || ' ';
    if (kCharSpan) kCharSpan.textContent = key[selectedIndex % key.length] || ' ';
    if (cCharSpan) cCharSpan.textContent = getPrintableChar(cCode);

    if (pDecSpan) pDecSpan.textContent = pCode.toString();
    if (kDecSpan) kDecSpan.textContent = kCode.toString();
    if (cDecSpan) cDecSpan.textContent = cCode.toString();

    const pBin = toBinary8(pCode);
    document.querySelectorAll('[data-type="plaintext"] .bit-btn').forEach(btn => {
      const bitIndex = parseInt(btn.getAttribute('data-bit') || '0', 10);
      const bitValue = pBin[7 - bitIndex];
      btn.textContent = bitValue;
      btn.setAttribute('data-value', bitValue);
    });

    const kBin = toBinary8(kCode);
    document.querySelectorAll('[data-type="key"] .bit-btn').forEach(btn => {
      const bitIndex = parseInt(btn.getAttribute('data-bit') || '0', 10);
      const bitValue = kBin[7 - bitIndex];
      btn.textContent = bitValue;
      btn.setAttribute('data-value', bitValue);
    });

    const cBin = toBinary8(cCode);
    document.querySelectorAll('[data-type="result"] .bit-display').forEach(display => {
      const bitIndex = parseInt(display.getAttribute('data-bit') || '0', 10);
      const bitValue = cBin[7 - bitIndex];
      display.textContent = bitValue;
      display.setAttribute('data-value', bitValue);
    });
  }

  document.querySelectorAll('.bit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const bitIndex = parseInt(btn.getAttribute('data-bit') || '0', 10);
      const rowType = btn.closest('.bit-row')?.getAttribute('data-type');

      if (rowType === 'plaintext') {
        let pCode = plaintext.charCodeAt(selectedIndex) || 0;
        pCode ^= (1 << bitIndex);
        
        const pArr = plaintext.split('');
        pArr[selectedIndex] = String.fromCharCode(pCode);
        plaintext = pArr.join('');
        plaintextInput.value = plaintext;
      } else if (rowType === 'key') {
        const kIndex = selectedIndex % key.length;
        let kCode = key.charCodeAt(kIndex) || 0;
        kCode ^= (1 << bitIndex);

        const kArr = key.split('');
        kArr[kIndex] = String.fromCharCode(kCode);
        key = kArr.join('');
        keyInput.value = key;
      }

      updateXorMatrix();
      navigator.vibrate?.(8);
    });
  });

  plaintextInput?.addEventListener('input', () => {
    updateXorMatrix();
  });

  keyInput?.addEventListener('input', () => {
    updateXorMatrix();
  });

  updateXorMatrix();
</script>
