# ReferralSync AI
> **"AI-assisted Referral Coordination"**

ReferralSync AI is a professional healthcare referral coordination system built for regional clinical networks. When a patient at Hospital A requires specialists, specialized diagnostic equipment, or intensive care facilities not available on site, ReferralSync AI extracts structured clinical requirements from free-text physician input, matches them against verified receiving hospital capabilities, transparently ranks viable receiving facilities, and enables physician authorization and end-to-end transfer tracking.

---

## 🏥 Clinical Safety Mandate
* **No Medical Diagnosis**: The AI engine strictly does **not** diagnose patients.
* **No Automated Decision-Making**: The AI engine strictly does **not** make the final medical or transfer decision.
* **Physician Authorization Enforced**: All receiving facility recommendations require physician review and formal sign-off.
* **Prototype Ranking Scores**: Match scores (0–100%) represent explainable capability rankings based on verified hospital resources, not medically validated scores.
* **Synthetic Data Mode**: Uses realistic, synthetic hospital and patient datasets for regional demonstration.

---

## 📱 Complete Pages & Modules

1. **Dashboard** (`/` or `dashboard`):
   - Clinical greeting to attending doctor (**Dr. Ananya Rao**)
   - Real-time search across patients, hospitals, and referral IDs
   - 4 live overview metric cards: *Active Patients (24)*, *Pending Referrals (08)*, *AI Recommendations (15)*, *Completed Referrals (32)*
   - Filterable **Recent Referrals** table with color-coded status badges
   - **Recent AI Referral Activity** stream with one-click case inspection
   - Prominent `+ Create New Referral` primary action

2. **Patients Page** (`patients`):
   - Clinical registry of admitted patients across departments
   - Filterable by clinical status and urgency level (*Emergency*, *Urgent*, *Routine*)
   - Quick "Details" inspection or immediate "Refer" trigger

3. **Patient Details Page** (`patient-details`):
   - Comprehensive profile: ID, Age, Gender, Blood Group, Contact, Attending Doctor
   - Clinical bedside status, current care, and required receiving capabilities
   - `Create Referral` direct intake trigger

4. **New Referral Intake** (`new-referral`):
   - Multi-section referral form: Patient selector, Origin facility, Required specialty, Equipment, Facility tier, Services, Urgency, Doctor notes
   - **Free-Text NLP Requirement Field**: Allows doctors to type or dictate natural language referral requirements (with quick presets)
   - `Analyze Referral Requirements` trigger

5. **AI Referral Requirement Analysis** (`ai-analysis`):
   - Structured capability breakdown: *Specialty*, *Equipment*, *Facility*, *Service*, *Urgency*
   - Transparent, explainable *"Why this recommendation?"* checklist
   - Clear AI-assisted recommendation disclaimers

6. **Hospital Matching & Ranking** (`hospital-matching`):
   - Ranked receiving hospital cards with prototype match scores (e.g., *96%*, *94%*, *91%*)
   - Estimated ambulance transit times (e.g., *17 mins*, *6.2 km*)
   - Side-by-side facility comparison modal
   - `Select Hospital` trigger to proceed to doctor review

7. **Doctor Review & Approval** (`doctor-review`):
   - Attending physician sign-off console
   - Review patient needs vs. receiving facility capability concordance
   - Actions: *Approve Recommendation & Transmit*, *Choose Another Hospital*, *Edit Referral*, *Reject Recommendation*
   - Attending doctor digital authorization note field

8. **Referrals Directory** (`referrals`):
   - Cross-facility audit log of all active and historical patient transfers
   - Status filters: *All*, *Pending*, *Approved*, *Accepted*, *In Transfer*, *Completed*, *Rejected*

9. **Referral Tracking & Audit Timeline** (`referral-details`):
   - Visual 8-stage lifecycle timeline:
     $$\text{Created} \rightarrow \text{AI Analyzed} \rightarrow \text{Hospital Recommended} \rightarrow \text{Doctor Approved} \rightarrow \text{Referral Sent} \rightarrow \text{Hospital Accepted} \rightarrow \text{In Transfer} \rightarrow \text{Completed}$$
   - Live interactive simulation buttons to advance transfer states during demo presentations

10. **Hospital Directory** (`hospitals`):
    - Verified network facility directory with capability filters (City, Specialty, Equipment, Bed Availability)
    - Detailed facility modal with triage contact coordinator numbers and direct referral triggers

11. **Clinical Referral AI Assistant** (`ai-assistant`):
    - Specialized clinical coordination chat interface
    - Pre-configured queries for neurology, cardiology, missing capabilities, and hospital comparison
    - Restricted specifically to referral coordination logic (no open-domain chat or medical diagnoses)

12. **Analytics** (`analytics`):
    - Real-time referral velocity KPIs: Total Referrals, Completed, Pending, Avg Coordination Time (18 mins), Approval Rate (96.4%)
    - CSS-based visualizations for *Monthly Referral Trends* and *Referral Status Distribution*
    - Hospital destination utilization table

13. **Settings & Preferences** (`settings`):
    - Physician Profile for **Dr. Ananya Rao**
    - Referral radius configuration, default urgency, alert preferences, and HIPAA synthetic data mode verification

---

## 🛠️ Tech Stack & Architecture

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide React** (Clinical Iconography)
- **Context API** (`AppContext.tsx`): Reactive state allowing new referrals created during live demonstrations to immediately persist across tables, metrics, and tracking timelines.
- **AI Matcher Engine** (`src/services/aiMatcher.ts`): Transparent local deterministic matching engine with configurable weights for specialty, equipment, facility, emergency capability, bed availability, and transit distance.

---

## 🏃 Running the Application

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production (TypeScript check + Vite production bundle)
npm run build
```

Local development server URL: **`http://localhost:5173/`**
