Project Name: RevMatch

Platform: Web Application (React + Vite + Tailwind CSS)

Core Objective: To build a highly responsive, dynamic React application that allows users to select a specific vehicle and view accurately filtered aftermarket parts, handling complex relational data with a seamless UI.

1. Technology Stack

Framework: React.js

Build Tool: Vite

Styling: Tailwind CSS

State Management: React Context API & React Hooks

2. Core User Flow

User lands on the homepage.

User selects a vehicle Make -> Model -> Generation using cascading dropdowns.

The main catalog instantly populates with parts compatible only with the selected vehicle.

User can click on "Fitment Notes" on specific parts to read installation warnings.

3. Feature Requirements (The Components)

<GarageSelector/>: Three dependent dropdown menus (Make, Model, Gen).

<ActiveVehicleBanner/>: A prominent banner confirming the user's selection with a vehicle image.

<PartCard/>: A responsive card displaying Part Image, Name, Manufacturer, Category, and Price.

<FitmentBadge/>: A warning badge on the PartCard if fitment notes exist.

4. UI/UX & Design Guidelines

Aesthetic Theme: "Modern Enthusiast" — 90s/2000s automotive cinematic style.

Color Palette: Deep cinematic charcoal/black backgrounds (#0f0f11), slightly lighter dark gray for cards (#1a1a1d), and high-contrast neon accents like Racing Red (#ff3366) for active states.

Typography: Clean, geometric sans-serif (Inter).