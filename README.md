# Eterna Safe – React prototype

A responsive front-end demonstration for the Eterna Safe hackathon concept.

## Run locally
1. Install Node.js (LTS).
2. Extract this folder.
3. In this folder run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL shown by Vite.

## Included demo screens
- Overview dashboard
- Asset registry (add assets)
- Secure vault (expand folders and view sample files)
- Guardians and folder permissions
- Emergency access request simulation
- Legacy access with a mock registrar event
- Activity log

## Important prototype notes
- This is a front-end demonstration using sample data and local React state.
- No real authentication, encryption, document upload, registrar integration, bank connection, email, or push notifications are connected.
- The encryption and verification descriptions are intended design concepts, not claims that this prototype currently performs those security operations.
- Do not enter real personal, banking, medical, or identity information.
- For a production build, add Firebase Authentication, Firestore, Storage, Cloud Functions, server-side authorisation checks, and properly reviewed client-side key management/encryption.
