# Tasks - add-cipher-xor-lab

## Forecast
Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

## Phase 1: Schema & Config
- [x] Update `app/src/content.config.ts` to define schema validation for the `cipher_xor` lab.
- [x] Add properties (e.g., ciphertext, key, hints, solution) to content configuration for XOR operations.

## Phase 2: Component Implementation
- [x] Create `app/src/components/CipherXor.astro` to serve as the user interface for the XOR cipher interactive lab.
- [x] Implement input controls for decryption attempts, keys, and display of XOR feedback/results.
- [x] Handle client-side XOR validation logic or interactive state (e.g., feedback styling, correct solution state).

## Phase 3: Page Integration
- [x] Modify `app/src/pages/l/[leccion].astro` to dynamically import and render the `CipherXor` component when `cipher_xor` type is encountered.
- [x] Pass the structured laboratory content configuration properties as props to `CipherXor.astro`.

## Phase 4: Validation & Testing
- [x] Create a test lesson markdown file at `content/M0/M0-L06-test.md` using the `cipher_xor` lab schema.
- [x] Add dummy laboratory data to verify correct schema parse of cipher fields.
- [x] Run `npm run build` to compile the application and verify Astro schema validation and production build success.
