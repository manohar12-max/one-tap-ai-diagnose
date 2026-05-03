# 🩺 One-Tap AI Diagnosis (OTAD)
### Next-Gen Clinical Triage & Consultation Portal

Welcome to **One-Tap AI Diagnosis**, a premium healthcare platform that bridges the gap between AI-driven diagnostics and expert clinical consultation. Built with **Next.js 16**, **Tailwind CSS**, and **Google Gemini AI**, it provides an enterprise-grade experience for both patients and medical professionals.

---

## 🔐 Demo Credentials
To explore the platform immediately, use these pre-registered accounts:

### 👤 Patient Access
- **Email**: `manohar@example.com`
- **Password**: `manohar`
- *Use this to test AI Triage, Search Doctors, and Book Appointments.*

### 👨‍⚕️ Doctor Access
- **Email**: `mandy@example.com`
- **Password**: `mandy`
- *Use this to manage the Triage Queue, Chat with Patients, and Manage Schedules.*

---

## 🚀 Core Features

### 🧠 1. AI Clinical Triage (PulseInput)
Our flagship feature allows patients to describe symptoms or upload photos of affected areas. 
- **Multi-Modal Analysis**: Uses **Gemini-1.5-Flash** to analyze both text descriptions and medical imagery.
- **Instant Diagnosis**: Generates a detailed clinical report including severity scores, possible conditions, and "Red Flags" requiring emergency attention.
- **Personalized Context**: The AI automatically cross-references your medical history (allergies, chronic conditions) to provide safe, personalized advice.

### 💬 2. AI Medical Companion (Companion Chat)
After receiving a diagnosis, patients can talk to an empathetic AI companion.
- **Deep Context**: The AI remembers your diagnosis and helps you understand medical terminology.
- **Proactive Guidance**: Suggests home remedies, dietary advice, and specific questions to ask your doctor.

### ⚡ 3. Real-Time Consultations (Socket.io)
Once an appointment is confirmed, a private bidirectional chat tunnel opens between the doctor and the patient.
- **Socket.io Integration**: Powered by a custom Socket.io server for instantaneous, zero-latency messaging.
- **Optimistic UI**: Messages appear instantly even on slow connections, syncing with the database in the background.
- **Live Status**: Real-time "Presence" indicators show when your doctor is online and ready.

### 🏥 4. Professional Doctor Directory
- **Platform Partners**: Instant access to One-Tap verified specialists.
- **Local Search**: Integrated with **OpenStreetMap (OSM)** to find nearby clinics and hospitals in your specific city.
- **Smart Filtering**: Filter by specialty, rating, or distance with a premium, glassmorphic UI.

### 📅 5. Appointment Lifecycle Management
- **Request & Confirm**: Patients can request slots, and doctors can confirm or reschedule in real-time.
- **Notification Center**: Instant alerts for appointment updates, chat invitations, and medical reminders.
- **Clinical History**: A comprehensive digital vault for all past diagnoses and consultation transcripts.

---

## 🛠️ Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Vanilla CSS + Tailwind CSS (Custom Design System)
- **Database**: MongoDB (via Prisma ORM)
- **Real-time**: Socket.io + Custom Proxy Middleware
- **AI Engine**: Google Generative AI (Gemini SDK)
- **Maps**: OpenStreetMap API (Nominatim)

---

## 📦 Deployment on Vercel
1. **Push to GitHub**: `git push origin master`
2. **Environment Variables**:
   - `DATABASE_URL`: MongoDB Connection String
   - `JWT_SECRET`: Your secret key
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Gemini API Key
3. **Build**: Vercel handles the `prisma generate` and `next build` automatically via our `postinstall` script.

---

## 📄 License
This project is part of the **House of Edtech** clinical submission. All rights reserved.

---
*Developed with ❤️ for the next generation of healthcare.*
