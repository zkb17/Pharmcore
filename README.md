# PharmCore 1.4 — More Challenging Distractors & Quiz Drug-List Imports

PharmCore is a static progressive web app (PWA) for clinical pharmacology learning. The same site works in a desktop browser and on an iPhone home screen. There are **no user accounts, cloud databases, servers receiving quiz history, subscriptions, or automatic cross-device synchronization**.

**Learning data is stored in your local browser on each device.** Use **Data & settings → Export my progress** and **Import a progress backup** to move it manually between devices.

## New in v1.4 — better answer choices and imported study lists

**Plausible distractors.** The question builder now prioritizes alternatives drawn from nearby **real** pharmacologic classes, receptor targets, and clinical families rather than uniformly random medical facts. For example, an amlodipine question can contrast a dihydropyridine calcium-channel blocker with a non-dihydropyridine, an ARB, or a direct vasodilator. An anti-CD20 question may contrast other B-cell biologics. The generator also tries to avoid duplicated or obviously overlapping clinical-side-effect lists. These checks are programmatic, not a medical-editor sign-off on every choice; some class-based generated items can still be ambiguous and should be interpreted as study prompts, not definitive clinical advice.

**Import a list for a targeted quiz:** Open **Quiz builder → Import JSON**. Both formats below work:

Simple names:

```json
["Metformin", "Apixaban", "Adalimumab", "Pembrolizumab"]
```

An optional richer object format:

```json
{
  "drugs": [
    "Amlodipine",
    {
      "name": "New medication name",
      "class": "Drug class from a trusted reference",
      "indications": ["Verified indication"],
      "mechanism": "Verified target and downstream biochemical effect",
      "specialties": ["im-op", "im-ip"],
      "tier": 2,
      "referenceUrl": "https://dailymed.nlm.nih.gov/dailymed/"
    }
  ]
}
```

- JSON accepts an array or an object with a `drugs` (or `medications`) array. Limit 500 distinct names or 2 MB. A starter file `quiz-drug-list-example.json` is included.
- Import preview shows matched drugs, new drugs, and new entries that need pharmacology details. Confirming saves **new custom entries** to this device's local library and activates **Imported list only** mode in Quiz Builder. *Existing* drugs are never overwritten.
- **Important:** Imported-list mode uses only those medications, overriding Specialty and Tier filters. It still respects your selected question format, learning dimensions, prioritization and length. Where possible, the quiz includes one question for each eligible imported drug before repeating drugs; choose *All* to include all eligible questions. If the list has more eligible drugs than the quiz length, it can cover only a subset in that session.
- A new **name-only** entry is deliberately marked **Needs details**. It is added to your library and selected for the quiz, but it cannot produce evidence-based pharmacology questions until you edit it in **Drug library** to add at least a drug class. A rich JSON object that provides a class (and optionally mechanisms/indications) can generate appropriate class-based questions immediately. User-supplied facts are **not independently verified**, and dosing questions are never automatically invented from user notes.
- The active list is kept on that device through reloads and is included in your progress JSON backup for transferring to your other device. Use **Clear list** to return to normal rotation filters. Importing a drug list is distinct from **Settings → Import a progress backup**.

**Upgrading:** Export your v1.3 progress first. Replace the existing GitHub Pages repository's application files with this release's files without changing the published URL. Your local data should remain at the same origin; export/import your JSON backup if necessary. Each device stores progress separately.

## What is included

- 554 built-in medications, including monoclonal antibodies, fusion proteins, immune-modulating biologics, recombinant treatments, oncology agents and medications across all nine rotations with rotation tags, priority tiers, indications and concise class-level knowledge summaries.
- Nine rotation selections: Family Medicine, Pediatrics, General Surgery, Surgical Specialties, Psychiatry, outpatient IM, inpatient IM, OB/GYN and Anesthesia.
- Twelve selectable knowledge dimensions: classification, mechanism, indications, contraindications/precautions, dosing, adverse effects, interactions, monitoring, pharmacokinetics, special populations, toxicity/reversal, and clinical decisions.
- 5,363 standard quiz prompts: many automatically assembled from structured teaching facts, **12 source-linked dosing scenarios**, and **18 separately authored clinical vignettes**. The number of prompts does **not** imply individually clinician-reviewed questions.
- Quiz options: mixed, rapid recall, clinical cases, dosing; adaptive, high-yield, new and random prioritization; 10/20/40/all questions; practice (immediate per-option explanation) or exam (feedback at end).
- Both class-to-drug and drug-to-class directions.
- **Pharmacology deep dives with each answer**: detailed receptor/molecular targets and downstream biochemical signaling, patient-centered implications and drug-name stem clues where supported. Each option (right or wrong) includes expanded reasoning. Mechanistic teaching details are more developed for selected high-yield classes and biologics; other records use their existing class summary. Not independently clinician-reviewed.
- **Tap-to-define medical terms** in quiz explanations, question stems and drug profiles, using an independent local glossary. A popover provides a short definition, a copy-term control, and a link to open AMBOSS and search there. Terms do not transmit anything to AMBOSS automatically; links require internet access. Toggle highlights in Data & settings.
- **Custom drug entry/edit/delete** in the Drug Library. Record the name, drug class, rotation tags, priority tier, indications, mechanisms, safety and pharmacokinetic details, optional dosing reference notes, and *optional name-origin notes*. Custom records generate only the recall questions supported by their entered facts.
- **Custom drug portability:** added drugs and naming notes are included in progress JSON export/import.
- The official AMBOSS *Chrome extension* can be installed separately on desktop Chrome and may independently provide official medical-term popovers on websites including this hosted app. That extension is not an iPhone integration. PharmCore neither installs the extension nor embeds AMBOSS proprietary definitions.
- Per drug × category performance tracking, adaptive review schedule, due-review queue, study streaks, bookmarks and rotation encounter notes.
- Local IndexedDB persistence (with a localStorage fallback where IndexedDB is not available) and portable JSON export/import with **merge** or **replace** modes.
- Responsive desktop/iPhone interface and PWA offline asset cache after a successful online visit.

## Easiest recommended setup: GitHub Pages

The app needs a **static host**, but it does not need a cloud database. A free GitHub Pages site works well.

1. Create or sign in to an account at https://github.com/ .
2. Create a new **public** repository named `pharmcore` (or another name you prefer). GitHub Pages sites are public, but **your personal study history is not placed in the repository**.
3. Extract the `PharmCore.zip` file to a folder on your computer.
4. In your new GitHub repository, use **Add file → Upload files**. Upload **all files from inside the extracted folder**, including `index.html`, `app.js`, `data.js`, `expanded-library.js`, `learning.js`, `styles.css`, `service-worker.js`, `manifest.webmanifest` and the two `.png` icons, so `index.html` is at the **repository root**. Commit them to the `main` branch.
5. Open your repository's **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/(root)`, then **Save**.
6. Use the published URL shown under Pages. Its typical format is `https://YOUR-GITHUB-USERNAME.github.io/pharmcore/`. Bookmark this on your computer.
7. On your iPhone, open the *same published URL* using **Safari**. Tap **Share → Add to Home Screen** and choose **Open as Web App** if prompted. Use the home-screen icon afterward.

The code and starter educational library are hosted publicly; **your browser stores your answers, bookmarks, review history and notes locally**. A host may still keep its ordinary access logs.

### Computer-only local preview

You can preview on a computer before publishing, from a terminal in the extracted folder:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. This is **not** accessible from your iPhone over the internet, and the localhost URL has different local storage from your eventual hosted site. If you build useful progress during preview, **export it before switching to the published URL**. Double-clicking `index.html` can be unreliable for persistent browser storage; a served site is recommended.

## Everyday usage

1. Open **Overview** and choose the current rotation from the sidebar.
2. Click **Quiz builder** and select any number of specialties, knowledge categories, drug priority tiers, and question settings.
3. Take a quiz. In practice mode, each answer immediately reveals whether you are right/wrong, with expanded explanations for **all four** answer choices, target/pathway teaching, clinical effects, and a drug-name family/stem cue (with class comparisons and important exceptions). Select Again / Hard / Good / Easy after each question to influence review spacing.
4. Use **Drug library** to search medications, bookmark a drug, record a personal learning note, add/edit your own drug, or mark it as **seen on rotation**.
5. Use **Due for review** to revisit scheduled drug–concept combinations.
6. Use **My progress** to view answers, accuracy, coverage and specialty performance.

## New in v1.3: attending drill and improved questions

### Questions without obvious giveaways

- All standard drug-fact mechanisms, adverse effects, interactions, monitoring, pharmacokinetics, contraindication and toxicity questions now ask about the **named drug**, without first revealing its class.
- The pre-answer quiz heading no longer exposes the related medicine in a clinical vignette or the answer to a reverse-class question.
- Tautological prompts (for example, asking which drug is in a class label that already contains that drug's name) have been excluded from the bank.
- One authored lithium/thiazide interaction vignette was rewritten to avoid giving the answer in the prompt.
- `audit-questions.cjs` (run with `node audit-questions.cjs` if you want) checks every generated standard prompt and every generated attending stage for exact-answer leaks and duplicate choices. Its result is **0 detected structural leaks across 5,363 standard and 5,632 attending-stage prompts**. Automated checking does not guarantee the absence of subtle contextual hints.

### Name-family recognition rather than speculative etymology

The explanation panel now shows a **drug-name stem or useful class-family comparison**:

- `-dipine` → dihydropyridine calcium-channel blockers (amlodipine, nifedipine).
- `-pril` → ACE inhibitors; `-sartan` → angiotensin II AT1-receptor blockers.
- `-xaban` → oral direct factor Xa inhibitors.
- `-gliflozin` → SGLT2 inhibitors; `-gliptin` → DPP-4 inhibitors.
- Legacy `-mab` antibody names can carry older structure/origin infixes, e.g. `-ximab`, `-zumab`, `-umab`. The WHO 2022 system introduced `-tug`, `-bart`, `-ment`, and `-mig` for newer antibody INNs.
- **Naming traps are explained**: tacrolimus is a calcineurin inhibitor despite ending in `-rolimus`; sirolimus/everolimus inhibit mTOR. Aripiprazole is not a proton-pump inhibitor despite an apparent `-prazole` substring.

When there is no defensible class-specific shared stem, PharmCore explains the class's name-family or gives a comparison rather than inventing a false etymology.

Primary nomenclature references: https://www.ama-assn.org/about/united-states-adopted-names-usan/united-states-adopted-names-approved-stems and https://www.who.int/publications/m/item/inn-22-542 .

### Attending drill (separate study mode)

1. Open **Attending drill** from the sidebar or Quiz builder. Search for any medicine, including a drug you added. You can choose the current rotation or all specialties.
2. Click **Start drill**. All questions remain on that drug. The drill starts with class recognition and mechanism, then proceeds toward therapeutic role, adverse effects, contraindications, interactions, monitoring, pharmacokinetics, special populations, toxicity, and an integrated follow-up decision.
3. After a **correct** answer, read the explanation, then click **Next challenge**. After your **first wrong** answer, the drill **stops immediately**, displaying all answer explanations, the pharmacology deep dive and your level reached.
4. Choose **Retry this drug**, **Full drill review**, or **Choose another drug**. Attempts and concept review scheduling save locally as usual.

Each medicine has **up to 11 levels**, depending on what information is present. Across the built-in drug set this produces 5,632 drill-stage prompts, assembled from the existing class-level educational records. These are deliberately progressive but not 5,632 independently clinician-authored patient vignettes. No unsourced dose modification questions are created.

### Updating your existing GitHub Pages installation

**Before updating**, export a JSON backup on each device you use. Replace the existing deployed files with the package contents, keeping your **same GitHub Pages URL**. Wait for GitHub Pages deployment, then close/reopen or reload the desktop site and iPhone home-screen app (you may need a second reload for the updated service worker cache). Your per-device study history is separate from the website files and should remain, provided the origin and storage context stay unchanged.

Do not copy exported progress files into a public GitHub repository; those JSON backups can include your study notes.

## Export, import and manual sync

- On the device that contains your most recent progress, open **Data & settings → Export my progress**. A file like `pharmcore-progress-2026-11-09.json` downloads.
- Transfer the file to the other device via **AirDrop**, Files/iCloud Drive, or another trusted method.
- On the other device, choose **Data & settings → Import a progress backup** and select the file.
- **Merge:** combines distinct recorded answers, bookmarks and encounters; keeps the most recently modified review state for each drug–concept pair. This is convenient if you studied separately on both devices, but does not mathematically reconcile two independently computed review schedules.
- **Replace:** copies an exact saved state from the backup, overwriting all progress on the receiving device.
- Recommend exporting regularly and before changing your browser, device, URL, or installed app.

**Important storage caveats:**
- Each device, browser and site origin has separate storage. Safari and an installed iPhone web app may also maintain separate storage. Use the installed icon consistently and export/import to transfer between contexts.
- Clearing browsing data, device resets and browser storage eviction can erase local progress. Browser persistent-storage permission, if granted, cannot replace backups.
- Export files include your notes and learning data in **plain, unencrypted JSON**. Store them privately.
- **Do not enter protected patient information** in the learning notes.

## Medical content and limitations

PharmCore is a **student-facing educational prototype, not a prescribing or point-of-care reference**. It has not undergone full clinical editorial or pharmacist peer review. Medications and clinical guidance change; confirm current primary sources, institutional protocols and patient-specific details before clinical decisions.

- Many rapid-recall prompts are generated from shared **drug-class summaries**, so they can repeat information across medications and do not establish exhaustive drug-specific evidence.
- The dosing module currently has 12 carefully contextualized questions with direct CDC or DailyMed links. This does **not** mean all 115 medications have validated dosing records.
- Authored vignettes are curated teaching examples and are not designed to substitute for formal shelf exam question banks.
- Sources include DailyMed (https://dailymed.nlm.nih.gov/dailymed/), Drugs@FDA (https://www.accessdata.fda.gov/scripts/cder/daf/), RxNorm (https://www.nlm.nih.gov/research/umls/rxnorm/) and CDC clinical guidance (https://www.cdc.gov/).
- The app does not automatically update labeling or guidelines, and it does not query an external AI or medical data API.
- **Question QA:** `audit-questions.cjs` tests the generated standard and attending questions for verbatim answer-in-stem leakage, tautological reverse-class answers, duplicate options, and class names that reveal mechanism answers. This structural audit passes. It cannot identify all conceptual hints, prove every distractor is clinically impossible, or substitute for pharmacist/clinician review.

## App files

| File | Function |
| --- | --- |
| `index.html` | Main page / app entry |
| `styles.css` | Desktop and mobile UI |
| `data.js` | Medication/class teaching data and authored clinical cases |
| `app.js` | Question construction, quiz sessions, local storage, import/export, UI |
| `service-worker.js` | Offline caching of the app assets |
| `manifest.webmanifest` | Home screen / installed PWA metadata |
| `icon-192.png`, `icon-512.png` | PWA home screen icons |
| `README.md` | Setup and usage instructions |
| `audit-questions.cjs` | Optional automated question integrity audit (requires Node.js) |

### Updating later

Edit medication data and/or application source, upload updated files to the GitHub repository, and **change `CACHE_NAME` in `service-worker.js`** so installed devices pick up the new cached assets. Keep the published URL unchanged to preserve its local storage origin. Export before any major app migration.

---

PharmCore 1.3 · Educational use only · Local-first data design.

## v1.3 update: applying to an existing installation

If you already published PharmCore to GitHub Pages, replace/update the static website files with this package **in the same repository and at the same website URL**. Add the new `expanded-library.js` and `learning.js` files along with the modified files. The service worker cache version has been incremented to `pharmcore-v13-20261109`. After publishing, reload the website (and the installed home-screen app), potentially closing and reopening it once; existing browser study data remains separate from these published assets. **Export a backup before updating**. If you change the host URL, origin, browser or iPhone installation, manually import your backup to restore progress.

## Terminology and naming caveats

PharmCore's built-in glossary is *not* AMBOSS content. The **official** AMBOSS Chrome extension is available at https://www.amboss.com/int/chrome and currently supports desktop Chromium-based browsers, not mobile. On iPhone, tap highlighted terms for PharmCore's **own** definitions, then choose **Copy term** and **Open AMBOSS** if you want to search the AMBOSS Library manually. This shortcut does not implement the AMBOSS Anki add-on or automatic AMBOSS Library search.

Drug-name stem explanations follow general USAN/INN nomenclature, not speculative derivations. In particular, **-mab** is a legacy monoclonal-antibody naming stem; WHO introduced new stems (-tug, -bart, -ment, -mig) in 2021–22. Name stems alone do not reliably identify the drug's specific molecular target. Generic strings can overlap with stems by coincidence: for example *aripiprazole* is not a proton-pump inhibitor, and *nystatin* is not a statin. PharmCore's naming helper checks such known conflicts rather than assuming every apparent suffix is meaningful.

Sources for nomenclature: https://www.ama-assn.org/about/united-states-adopted-names-usan/united-states-adopted-names-naming-guidelines and https://www.who.int/publications/m/item/inn-22-542 .

### Medical safety reminder

Even detailed pharmacology notes and multi-step rationale cannot substitute for a clinically reviewed formulary. The app's broad medication list is a **study library**, and its prompt counts are generated partly by class-fact permutations, not individually verified drug monographs. In particular, dosing scenarios remain a small separately sourced set and should not be extrapolated to other populations. Confirm current labeling, guidelines and local protocol before any real clinical decisions.
