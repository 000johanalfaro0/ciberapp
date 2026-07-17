# Cipher XOR Lab Specification

## 1. Overview
The Cipher XOR Lab is an interactive environment for learning and experimenting with the bitwise XOR (eXclusive OR) operation. It consists of a Sandbox Mode for freeform experimentation and a CTF Challenge Mode for validating decryption.

## 2. Sandbox Mode Requirements
- The application MUST support Sandbox Mode.
- In Sandbox Mode, the application MUST provide input fields for plaintext (text input) and a key (text input).
- The application MUST calculate the XOR product of the plaintext and key, byte-by-byte.
- The calculation MUST update live as the user edits either input.
- The application MUST display the binary representation (8-bit bytes) of the plaintext, key, and resulting ciphertext.
- The application MUST allow the user to toggle individual bits of the plaintext, key, or ciphertext.
- Toggling a bit MUST update the corresponding character representation and recalculate the live XOR result immediately.

## 3. CTF Challenge Mode Requirements
- The application MUST support CTF Challenge Mode.
- In CTF Challenge Mode, the application MUST present a target text and a ciphertext input in hexadecimal format.
- The application MUST validate the decrypted output against the target text when a hex-encoded key is provided.
- If the decrypted ciphertext matches the target text exactly, the application MUST trigger a success state and display the flag.

## 4. Input Constraints and Validation
- All text inputs in Sandbox Mode MUST be constrained to printable ASCII characters.
- Plaintext and key inputs MUST have a maximum character limit of 256 characters.
- In CTF Challenge Mode, the ciphertext and key inputs MUST be validated as valid hexadecimal strings (containing only `0-9`, `a-f`, `A-F` and of even length).
- The application MUST reject invalid inputs gracefully without crashing and display a clear error message.

## 5. Scenarios

### Scenario 1: Live XOR Calculation in Sandbox Mode
```gherkin
Given the user is in Sandbox Mode
And the plaintext input is "A" (binary 01000001)
And the key input is "B" (binary 01000010)
When the XOR calculation is performed
Then the ciphertext output MUST display character value 0x03 (binary 00000011)
```

### Scenario 2: Bit Toggling in Sandbox Mode
```gherkin
Given the user is in Sandbox Mode with plaintext "A" (binary 01000001)
When the user toggles the least significant bit of the plaintext byte from 1 to 0
Then the plaintext byte MUST become 01000000
And the plaintext character representation MUST update to "@"
And the XOR output MUST recalculate immediately
```

### Scenario 3: Valid Decryption in CTF Challenge Mode
```gherkin
Given the user is in CTF Challenge Mode
And the target text is "FLAG"
And the ciphertext is "060c0107"
When the user inputs the hex key "40606040"
Then the application MUST validate the decrypted output as "FLAG"
And the success state MUST be triggered
And the flag MUST be displayed
```

### Scenario 4: Input Validation for Hex Strings
```gherkin
Given the user is in CTF Challenge Mode
When the user inputs a key containing "Z"
Then the application MUST reject the input
And the application MUST display an error message "Invalid hexadecimal character"
And the application MUST NOT crash
```
