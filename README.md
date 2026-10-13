# GOLDIFI — Mobile Pawnshop CRM

> **Mobile-First Native Application** built with **React Native**, **Expo SDK 57**, and **Expo Router**.
> Engineered exclusively for pawnshop operations, collateral gold loan origination, vault inventory custody, cashier collections, and multi-role RBAC security.

---

## 1. Project Overview

**GOLDIFI** is a professional pawnshop CRM application designed from the ground up for mobile devices. It supports both solo-operator single-branch pawnshops and multi-branch pawnshop enterprises with differentiated roles, strict chain-of-custody tracking, and Indian financial conventions (₹ INR formatting, 22K/24K gold appraisals, LTV risk meters).

### Core Functional Modules
- **Dashboard**: Real-time operational ledger, active loan portfolio value, daily disbursement & collection pulse, overdue risk exposure alerts.
- **Customers**: Borrower dossiers with Aadhaar/PAN KYC tracking, active loans, outstanding amounts, and historical transaction logs.
- **Pawn Loans**: Loan origination with live LTV (Loan-to-Value) calculation, 22K/24K benchmark purity appraisal, maturity tracking, and lifecycle timelines.
- **Payments & Receipts**: Instant payment collection (Interest, Principal, Closure, Renewal), receipt preview with tax information and cashier stamps.
- **Vault & Inventory**: Custodial tracking of pledged jewelry, bullion coins, storage locker placement, and item relocation logs.
- **Staff & Roles**: Branch employee directory, role assignments, and live interactive **RBAC Permission Matrix**.
- **Reports & Analytics**: Mobile-first portfolio summaries, revenue collections, overdue delinquency analysis, and vault asset segregation.
- **Settings & Security**: Shop registration, multi-branch overview, two-factor authentication (2FA), 15-minute inactive session lock, and compliance audit trail.
- **Development Role Simulator**: 1-tap role switcher allowing instant testing of all permission levels.

---

## 2. Technology Stack & Expo SDK 57

- **Framework**: React Native `0.86.3`
- **Platform**: Expo SDK `57.0.26` (Expo Go compatible)
- **Routing**: Expo Router `57.0.24`
- **Language**: TypeScript `6.0.3` (Strict Mode — Clean `tsc` compilation)
- **Icons**: `@expo/vector-icons` (Ionicons) — **Strict zero-emoji compliance**
- **State & Context**: Typed React Context (`AuthContext` with mock service layer)

---

## 3. Brand Identity & Design Tokens

The application follows the official Goldifi brand specification:

| Token | Hex Value | Purpose |
|---|---|---|
| **Primary Accent** | `#EA6329` | Goldifi Orange — Primary buttons, active tabs, accents |
| **Primary Pressed** | `#C94F1F` | Touch feedback state |
| **Primary Light** | `#FCE5DA` | Subtle badges, active tags, icon backgrounds |
| **Charcoal** | `#323031` | Dark neutral, headers, brand cards, high contrast |
| **Text Primary** | `#323031` | High contrast screen typography |
| **Text Secondary**| `#6B696A` | Subtitles, labels, metadata |
| **Text Muted** | `#929091` | Placeholders, inactive captions |
| **Surface** | `#F8F8F8` | Light secondary containers and cards |
| **Surface Secondary** | `#F3F3F3` | Input fields, inactive filter pills |
| **Border / Divider** | `#E4E2E2` / `#ECEAEA` | Thin clean boundaries |
| **Success** | `#2E7D5B` (`#E7F4EE`) | Cleared receipts, active loans, verified KYC |
| **Warning** | `#B7791F` (`#FFF4DC`) | Approaching maturity (Due Soon), pending KYC |
| **Error** | `#C73E3E` (`#FCE8E8`) | Overdue loans, authentication failures, risk alerts |
| **Info** | `#356D9B` (`#E8F1F8`) | Vault locker status, organizational notices |

- **Spacing**: 8-point system (4, 8, 12, 16, 20, 24, 32, 40, 48, 64) with 20px horizontal screen padding.
- **Corner Radii**: 8 (sm), 12 (md), 16 (lg), 999 (pill).
- **Currency**: Standard Indian numbering system (`₹25,000`, `₹1,25,000`, `₹4,82,000`).

---

## 4. Role-Based Access Control (RBAC) & Scope

The application implements a strict hierarchical authorization flow:

$$\text{Organization} \longrightarrow \text{Branch} \longrightarrow \text{User} \longrightarrow \text{Role} \longrightarrow \text{Permissions} \longrightarrow \text{Accessible CRM Features}$$

### Supported Roles

| Role | Default Scope | Key Capabilities |
|---|---|---|
| **OWNER** | `ALL_BRANCHES` | Full unrestricted access across all branches, policy settings, audit trail. |
| **MANAGER** | `SINGLE_BRANCH` | Branch operations, staff permissions, loan approval, reports, and audit logs. |
| **PAWN_OFFICER** | `SINGLE_BRANCH` | Collateral appraisal, loan origination, customer KYC onboarding. |
| **CASHIER** | `SINGLE_BRANCH` | Payment collection, receipt issuance, customer lookup, cash ledger. |
| **INVENTORY_STAFF** | `SINGLE_BRANCH` | Vault safe custody, locker assignments, item tracking and releases. |

### Development Role Simulator
A development-only switcher widget is visible on all primary headers. Tap the **SIMULATOR** pill at any time to switch active accounts in 1 tap and observe how the bottom tabs, action shortcuts, and screens adapt dynamically.

---

## 5. Demo Accounts

| Role | Email | Password | Scope |
|---|---|---|---|
| **Owner** | `demo-owner@goldifi.test` | `goldifi123` | All Branches (Consolidated HQ) |
| **Manager** | `demo-manager@goldifi.test` | `goldifi123` | Main Branch (T. Nagar) |
| **Pawn Officer** | `demo-pawnofficer@goldifi.test` | `goldifi123` | Main Branch (T. Nagar) |
| **Cashier** | `demo-cashier@goldifi.test` | `goldifi123` | Main Branch (T. Nagar) |
| **Inventory Staff** | `demo-inventory@goldifi.test` | `goldifi123` | Main Branch (T. Nagar) |

*Demo Shop Identifier: `KUMAR-TN`*

---

## 6. Project Architecture

```
goldifi/
├── src/
│   ├── app/                                 # Expo Router File-Based Routing
│   │   ├── _layout.tsx                      # Root SafeArea & AuthProvider stack
│   │   ├── index.tsx                        # Splash redirector
│   │   ├── (auth)/                          # Authentication flow
│   │   │   ├── _layout.tsx
│   │   │   ├── welcome.tsx                  # Brand welcome & demo launchers
│   │   │   ├── shop-code.tsx                # Organization identifier validation
│   │   │   ├── login.tsx                    # Employee login with quick role pills
│   │   │   ├── verification.tsx             # 2FA / OTP verification
│   │   │   ├── forgot-password.tsx          # Account recovery
│   │   │   ├── session-expired.tsx          # 15-minute inactive session lock
│   │   │   └── error.tsx                    # Authentication failure screen
│   │   └── (app)/                           # Authenticated CRM Shell
│   │       ├── _layout.tsx                  # Bottom tabs & subroute registration
│   │       ├── dashboard.tsx                # Operational ledger & KPIs
│   │       ├── more.tsx                     # Secondary modules navigation hub
│   │       ├── customers/                   # Customer dossiers & KYC
│   │       │   ├── index.tsx
│   │       │   ├── [id].tsx
│   │       │   └── create.tsx
│   │       ├── loans/                       # Pawn loan origination & LTV
│   │       │   ├── index.tsx
│   │       │   ├── [id].tsx
│   │       │   └── create.tsx
│   │       ├── payments/                    # Payment receipts & collections
│   │       │   ├── index.tsx
│   │       │   ├── [id].tsx
│   │       │   └── create.tsx
│   │       ├── inventory/                   # Vault storage & safe custody
│   │       │   ├── index.tsx
│   │       │   └── [id].tsx
│   │       ├── employees/                   # Staff directory & permission matrix
│   │       │   ├── index.tsx
│   │       │   ├── [id].tsx
│   │       │   └── permissions.tsx
│   │       ├── reports/                     # Mobile financial reports
│   │       │   ├── index.tsx
│   │       │   └── [report].tsx
│   │       └── settings/                    # Shop, security & audit logs
│   │           ├── index.tsx
│   │           ├── shop.tsx
│   │           ├── security.tsx
│   │           ├── access.tsx
│   │           └── audit.tsx
│   ├── components/                          # Reusable UI Design System
│   │   ├── ui/                              # Buttons, Inputs, Badges, Headers, MetricCards
│   │   ├── cards/                           # CustomerCard, LoanCard, PaymentCard, InventoryCard
│   │   ├── lists/                           # GoldifiListItem
│   │   ├── navigation/                      # RoleSimulatorWidget, TabBarIcon
│   │   └── feedback/                        # GoldifiLoadingState, EmptyState, AccessDenied, Modal
│   ├── theme/                               # Colors, Typography, Spacing, Radius, Shadows
│   ├── permissions/                         # Roles, Permission groups, Route access checks
│   ├── mock/                                # Realistic Indian mock data (loans, customers, receipts)
│   ├── services/                            # Backend-ready typed services (Auth, Loan, Customer, etc.)
│   ├── context/                             # AuthContext & Session management
│   ├── hooks/                               # useAuth, usePermissions
│   ├── types/                               # TypeScript domain & UI interfaces
│   └── utils/                               # Indian currency (formatINR), dates, ID sequence generators
├── AGENTS.md                                # System rules & coding guidelines
├── package.json
├── app.json
└── tsconfig.json
```

---

## 7. How to Run the Application

### Prerequisites
Node.js 20+ installed on your system.

### Starting Development Server
```bash
npx expo start
```

### Running on Physical Device with Expo Go
1. Install **Expo Go** from the Google Play Store (Android) or Apple App Store (iOS).
2. Start the project:
   ```bash
   npx expo start
   ```
3. Scan the QR code displayed in the terminal with the Expo Go app (Android) or Camera app (iOS).
4. The application will load immediately with fast refresh enabled.

### Validating Code Quality
To verify TypeScript compilation:
```bash
npx tsc --noEmit
```

---

## 8. Backend-Ready Boundaries & Architecture

While this is a frontend prototype, all application components consume typed services rather than static data files:
- `mockAuthService`: Readies JWT token storage, refresh flows, and login endpoints.
- `mockCustomerService`: Standard CRUD boundary for borrower KYC.
- `mockLoanService`: Disbursal requests, collateral valuations, and loan closures.
- `mockPaymentService`: Receipt generation, ledger posting, and reconciliation.
- `mockInventoryService`: Locker assignments and release authorization.
- `mockAuditService`: Immutable compliance event logging.

> **Important Security Architecture Note**:
> All permission checks in this frontend prototype (`hasPermission()`, `canAccessRoute()`) control **UI presentation only**. In a production deployment, true security and data access control must be strictly enforced server-side on every API request.
