# GOLDIFI — Mobile Application Guidelines & System Rules

This is a mobile-only React Native application built with Expo SDK 57 and Expo Router.

## Core Rules

1. **Mobile Application Only**
   - Strictly mobile-first native UI patterns.
   - Never build desktop web views, responsive sidebars, or web dashboard layouts.
   - Use React Native core components (`View`, `Text`, `ScrollView`, `FlatList`, `Pressable`, `TextInput`, `Modal`, `KeyboardAvoidingView`, `SafeAreaView`).

2. **No Emojis Anywhere**
   - Strictly forbidden to use emojis in UI, buttons, tabs, status badges, empty states, or error screens.
   - Use professional vector icons from `@expo/vector-icons` (Ionicons, MaterialCommunityIcons, Feather) with consistent styling.

3. **Technology Stack & Expo SDK 57**
   - React Native 0.86+
   - Expo SDK 57
   - TypeScript
   - Expo Router (files in `src/app/`)
   - Expo Go compatible modules only.
   - Always run package installations via `npx expo install <package>`.

4. **Goldifi Theme & Tokens**
   - Primary Accent: Goldifi Orange `#EA6329`, Pressed `#C94F1F`, Light `#FCE5DA`.
   - Core Dark / Charcoal: `#323031`.
   - Surfaces: `#FFFFFF`, `#F8F8F8`, `#F3F3F3`.
   - Functional: Success `#2E7D5B`, Warning `#B7791F`, Error `#C73E3E`, Info `#356D9B`.
   - Spacing: 8-pt system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64). Screen padding: 20.
   - Currency: Format using `formatINR()` (e.g. `₹25,000`, `₹1,25,000`).

5. **Permission-Driven RBAC**
   - Organization → Branch → User → Role → Permissions → CRM features.
   - Protect views and actions using `hasPermission(permission)` and `canAccessRoute(route)`.
   - Never base UI access purely on raw role name strings in views.
   - Development Role Simulator is for testing only and marked as dev/demo functionality.

6. **Frontend Architecture & Backend Readiness**
   - Prototype with typed mock services (`mockAuthService`, `mockLoanService`, `mockCustomerService`, etc.).
   - UI components consume typed hooks/contexts, not raw static data files directly.
   - Frontend authorization controls UI visibility only; true security must be backend-enforced in production.

7. **Validation & Testing**
   - Run `npx tsc --noEmit` and check for clean compilation.
   - Maintain accessibility labels and min 44x44 touch targets.
