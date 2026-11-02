<div align="center">

# LectureNow

**Know your current lecture, room, and next class in seconds.**

A native Android timetable app for Computer Engineering Semester 3 at GEC Palanpur, built around a live home-screen widget, batch-aware schedules, timely reminders, and NFC room routing.

![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=white)
![Kotlin](https://img.shields.io/badge/Kotlin-2.0+-7F52FF?logo=kotlin&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack_Compose-Material_3-4285F4?logo=jetpackcompose&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![HACK10](https://img.shields.io/badge/HACK10-2nd_Place-F5A623)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Technical Highlights](#technical-highlights)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Recognition](#recognition)
- [Roadmap](#roadmap)
- [Creator](#creator)

---

## Overview

Students lose time working out which lecture is running, which room it is in, and who is teaching it, especially when batches (CP1, CP2, CP3) follow different schedules and rooms change at short notice. **LectureNow** answers those questions instantly.

A student signs in once with their GTU enrollment number. The app configures their profile and batch schedule automatically, then shows the current lecture (subject, room, faculty, time), a live countdown, and what comes next. A home-screen widget keeps this visible without opening the app, and reminders arrive 10 minutes before every lecture.

## Screenshots

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/sign-in.png" alt="Student sign-in" width="200" /><br /><sub><b>Student sign-in</b></sub></td>
    <td align="center"><img src="docs/screenshots/live-today.png" alt="Live Today" width="200" /><br /><sub><b>Live Today</b></sub></td>
    <td align="center"><img src="docs/screenshots/timetable.png" alt="Timetable" width="200" /><br /><sub><b>Timetable</b></sub></td>
    <td align="center"><img src="docs/screenshots/widget.png" alt="Home-screen widget" width="200" /><br /><sub><b>Home-screen widget</b></sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/notifications.png" alt="Lecture reminders" width="200" /><br /><sub><b>Lecture reminders</b></sub></td>
    <td align="center"><img src="docs/screenshots/admin-login.png" alt="Admin login" width="200" /><br /><sub><b>Admin and faculty login</b></sub></td>
    <td align="center"><img src="docs/screenshots/admin-overrides.png" alt="Admin overrides" width="200" /><br /><sub><b>Notices and overrides</b></sub></td>
    <td></td>
  </tr>
</table>

## Key Features

| Feature | Description |
| --- | --- |
| **Live Today view** | Current lecture with subject, room, faculty, and time, plus an "Up next" card and a countdown to the next class |
| **Home-screen widget** | Shows your batch, the current or next lecture, its room, and a live ticking clock, with no need to open the app |
| **Lecture reminders** | Notification 10 minutes before each lecture with its room, plus recess and lunch break notices; tapping opens the timetable with room navigation |
| **Batch-aware timetable** | Table and Day views, filters for All Batches, CP1, CP2, and CP3, and search by subject, faculty, or room |
| **One-time enrollment sign-in** | Enter your GTU enrollment number once; your profile and batch are configured automatically and remembered |
| **NFC room routing** | Tap an NFC tag to get room-specific information |
| **Admin and faculty portal** | Authenticated portal to post notices and overrides (room changes, faculty substitutions), toggle them on or off, and delete them |
| **Real-time updates** | Overrides posted by admins are reflected for students through background sync |

## Tech Stack

### Mobile (Android)

| Concern | Technology |
| --- | --- |
| Language | Kotlin 2.0+ (100% native) |
| UI | Jetpack Compose with Material Design 3 |
| Navigation | `HorizontalPager` (gesture-based page swiping) |
| Security | `EncryptedSharedPreferences` backed by Android Keystore (AES-256 GCM) |
| Networking | Retrofit 2 and OkHttp 4 |
| Background work | Jetpack `WorkManager` (periodic sync) |
| Exact-time alarms | `AlarmManager` with `setExactAndAllowWhileIdle()` |
| Widget | `AppWidgetProvider`, `RemoteViews`, and `Chronometer` |

### Backend

| Concern | Technology |
| --- | --- |
| Framework | Next.js 16 (React 19, Node.js) |
| ORM | Prisma Client |
| Database | SQLite (`dev.db`) locally, PostgreSQL in the cloud |
| Styling | Tailwind CSS |

## Technical Highlights

- **Reliable reminders.** Lecture reminders are scheduled with exact alarms (`setExactAndAllowWhileIdle()`), so they fire on time even when the device is in Doze mode.
- **Battery-friendly live widget.** The countdown uses a `Chronometer` inside `RemoteViews`, so the clock ticks on screen without waking the app every second.
- **Fresh data without manual refresh.** `WorkManager` syncs the timetable and admin overrides periodically in the background.
- **Private by default.** The student's enrollment number and profile are stored locally in encrypted storage, protected by the Android Keystore.

## Project Structure

```text
lecture-now/
├── app/                  # Native Android application (Kotlin, Jetpack Compose)
├── backend/              # Next.js + Prisma backend
├── docs/screenshots/     # README screenshots
├── gradle/               # Gradle wrapper files
├── public/assets/        # Static assets (including the creator photo)
├── build.gradle.kts      # Root Gradle build script
├── settings.gradle.kts   # Gradle settings
├── metadata.json         # App metadata
└── .env.example          # Example environment variables
```

## Getting Started

### Prerequisites

- [Android Studio](https://developer.android.com/studio) (latest stable)
- [Node.js](https://nodejs.org/) 18 or later and npm (for the backend)

### Clone the repository

```bash
git clone https://github.com/shrimali-dev/lecture-now.git
cd lecture-now
```

### Run the backend

```bash
cd backend
npm install
npm run dev
```

Locally the backend uses a single SQLite file (`dev.db`), so no separate database server is needed.

### Run the Android app

1. Open Android Studio, select **Open**, and choose the project directory.
2. Let Gradle sync and resolve dependencies.
3. If you use environment variables, copy `.env.example` to `.env` and fill in the values.
4. Run the app on an emulator or a physical device.

> NFC room routing requires a physical device with NFC support.

## Recognition

**Second Place, HACK10** (internal college hackathon, September 2026). Built by a team of three.

## Roadmap

- [ ] AI-powered chatbot for timetable questions
- [ ] Support for additional semesters and departments

## Creator

<table>
  <tr>
    <td align="center" width="180">
      <img src="public/assets/creator.jpg" alt="Dev Shrimali" width="140" style="border-radius: 50%;" />
    </td>
    <td>
      <h3>Dev Shrimali</h3>
      <p>Computer Engineering student at Government Engineering College (GEC) Palanpur, Gujarat Technological University (GTU), and freelance web developer. Works with JavaScript, Next.js, React, Flask, and Python, with a focus on cybersecurity and AI/ML.</p>
      <p>
        <a href="https://github.com/shrimali-dev">GitHub</a> ·
        <a href="https://www.linkedin.com/in/dev-shrimali-393973379/">LinkedIn</a>
      </p>
    </td>
  </tr>
</table>

---

<div align="center">

Built with care.

</div>
