/**
 * OSHA Bloodborne Pathogens Training Content
 * Comprehensive training module for dental practices
 * Duration: 45-60 minutes
 * Sections: 15 (12 text, 3 scenarios)
 * Quiz Questions: 20
 */

export interface TrainingSection {
  id: string;
  type: 'text' | 'video' | 'scenario';
  title: string;
  content?: string;
  videoUrl?: string;
  prompt?: string;
  options?: string[];
  correct?: number;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
}

export interface TrainingContent {
  sections: TrainingSection[];
  quiz: {
    questions: QuizQuestion[];
  };
}

export const oshaBloodbornePathogensContent: TrainingContent = {
  sections: [
    {
      id: 'section-1',
      type: 'text',
      title: 'Introduction to the Bloodborne Pathogens Standard',
      content: `## OSHA 29 CFR 1910.1030

The OSHA Bloodborne Pathogens Standard was established in 1991 to protect workers from the health hazards of exposure to blood and other potentially infectious materials (OPIM). This standard applies to **all employees who may reasonably anticipate contact with blood or OPIM** as part of their job duties.

### Why This Training Matters

In dental settings, you are at increased risk of exposure to bloodborne pathogens due to:
- Regular contact with patient blood and saliva
- Use of sharp instruments and needles
- Aerosol-generating procedures
- Potential for splashes and splatters

### Key Requirements of the Standard

The Bloodborne Pathogens Standard requires employers to:

1. **Develop an Exposure Control Plan** - A written plan outlining how the practice will protect employees
2. **Provide Training** - Annual training for all employees with occupational exposure
3. **Offer Hepatitis B Vaccination** - Free vaccination within 10 days of initial assignment
4. **Implement Engineering Controls** - Safer devices, sharps containers, etc.
5. **Provide Personal Protective Equipment** - At no cost to employees
6. **Maintain Records** - Training records, medical records, and sharps injury logs

### Penalties for Non-Compliance

OSHA takes bloodborne pathogen violations seriously:

| Violation Type | Maximum Penalty |
|----------------|-----------------|
| Serious Violation | $15,625 per violation |
| Willful Violation | $156,259 per violation |
| Repeated Violation | $156,259 per violation |
| Failure to Abate | $15,625 per day |

*Penalty amounts are adjusted annually for inflation*`
    },
    {
      id: 'section-2',
      type: 'text',
      title: 'What Are Bloodborne Pathogens?',
      content: `## Bloodborne Pathogens Defined

**Bloodborne pathogens** are infectious microorganisms present in human blood that can cause disease in humans. The three primary bloodborne pathogens of concern in healthcare settings are:

### Hepatitis B Virus (HBV)

- **Transmission:** Blood, semen, vaginal fluids, and other body fluids
- **Survival outside body:** Up to 7 days on environmental surfaces
- **Risk after needlestick:** 6-30% chance of infection
- **Prevention:** Highly effective vaccine available (97% effective)
- **Symptoms:** May be asymptomatic, or cause fatigue, jaundice, abdominal pain
- **Chronic infection:** 2-6% of infected adults develop chronic infection

### Hepatitis C Virus (HCV)

- **Transmission:** Primarily blood-to-blood contact
- **Survival outside body:** Up to 3 weeks under optimal conditions
- **Risk after needlestick:** 1.8% average chance of infection
- **Prevention:** No vaccine available - prevention is critical
- **Symptoms:** Often asymptomatic for decades
- **Chronic infection:** 75-85% of infected individuals develop chronic infection

### Human Immunodeficiency Virus (HIV)

- **Transmission:** Blood, semen, vaginal fluids, breast milk
- **Survival outside body:** Minutes to hours (fragile virus)
- **Risk after needlestick:** 0.3% average chance of infection
- **Prevention:** No vaccine - post-exposure prophylaxis (PEP) available
- **Progression:** Without treatment, progresses to AIDS

### Other Potentially Infectious Materials (OPIM)

Beyond blood, OSHA's standard also covers:
- Semen and vaginal secretions
- Cerebrospinal, synovial, pleural, pericardial, peritoneal, and amniotic fluids
- Saliva in dental procedures
- Any body fluid visibly contaminated with blood
- Unfixed human tissues or organs
- Cell or tissue cultures containing HIV/HBV`
    },
    {
      id: 'section-3',
      type: 'text',
      title: 'Exposure Risks in Dental Settings',
      content: `## Understanding Your Exposure Risk

Dental healthcare workers face unique exposure risks due to the nature of dental procedures. Understanding these risks helps you protect yourself.

### High-Risk Situations in Dentistry

**Percutaneous Injuries (Needlesticks and Sharps)**
- Administering local anesthesia
- Recapping needles (NEVER do this!)
- Passing instruments
- Cleaning instruments before sterilization
- Disposing of sharps improperly

**Mucous Membrane Exposures**
- Eye splashes during procedures
- Oral splashes
- Exposure through cuts or abrasions on hands

**Aerosol Exposure**
- High-speed handpiece use
- Ultrasonic scaling
- Air/water syringe use
- Polishing procedures

### Exposure Statistics

According to CDC data:
- Dental professionals experience approximately **2 needlesticks per year** on average
- **14% of dental workers** report at least one needlestick injury
- Most injuries occur during:
  - Injection (32%)
  - Recapping needles (15%)
  - Cleaning instruments (12%)
  - Passing instruments (10%)

### Routes of Transmission

For a bloodborne pathogen infection to occur, these conditions must be met:

1. **Source** - An infected person's blood or OPIM must be present
2. **Vehicle** - The pathogen must have a way to travel (needle, splash, etc.)
3. **Portal of Entry** - The pathogen must enter your body through:
   - Broken skin (cuts, abrasions, dermatitis, acne)
   - Mucous membranes (eyes, nose, mouth)
   - Parenteral route (needlestick, cut, bite)
4. **Susceptible Host** - You must be susceptible to the infection

**Breaking any link in this chain prevents transmission!**`
    },
    {
      id: 'section-4',
      type: 'text',
      title: 'The Exposure Control Plan',
      content: `## Your Practice's Exposure Control Plan (ECP)

The Exposure Control Plan is a written document that outlines how your practice protects employees from bloodborne pathogen exposure. **Every dental practice must have an ECP**, and you need to know what it contains and where to find it.

### Where to Find Your ECP

Your practice's Exposure Control Plan is located:
- **Ask your supervisor** if you don't know where it is
- Common locations: Office manager's desk, break room, OSHA compliance binder
- It must be **accessible to all employees** during work hours

### Required Elements of an ECP

Your Exposure Control Plan must include:

**1. Exposure Determination**
- Lists all job classifications with occupational exposure
- Lists specific tasks and procedures that may result in exposure
- Made without regard to PPE use

**2. Methods of Compliance**
- Universal/Standard Precautions implementation
- Engineering controls (sharps containers, safety devices)
- Work practice controls (no recapping, hand hygiene)
- Personal protective equipment requirements
- Housekeeping schedules and procedures

**3. Hepatitis B Vaccination Program**
- Free vaccination offered within 10 days of hire
- Declination process and form
- Post-exposure vaccination options

**4. Post-Exposure Evaluation and Follow-up**
- Reporting procedures
- Medical evaluation process
- Documentation requirements

**5. Training Requirements**
- Initial and annual training
- Training content requirements
- Record-keeping

### Annual Review Requirement

The ECP must be reviewed and updated **at least annually** and whenever:
- New tasks or procedures are introduced
- New positions are created with occupational exposure
- Employee feedback indicates the plan needs revision
- After an exposure incident to evaluate if changes are needed`
    },
    {
      id: 'section-5',
      type: 'text',
      title: 'Universal/Standard Precautions',
      content: `## The Foundation of Infection Control

**Universal Precautions** (also called **Standard Precautions**) is the single most important concept in preventing bloodborne pathogen transmission. This approach treats ALL human blood and certain body fluids as if they ARE infectious.

### The Core Principle

> **Treat every patient's blood and body fluids as if they are infected with HIV, HBV, and HCV.**

Why? Because:
- You cannot tell by looking at someone if they have a bloodborne infection
- Many infected individuals don't know they're infected
- Patients may not disclose their status
- Medical histories can be incomplete or inaccurate

### What Universal Precautions Covers

Apply Universal Precautions to:

| Always Treat as Infectious | Apply Precautions When Visibly Contaminated |
|---------------------------|---------------------------------------------|
| Blood | Feces |
| Semen | Nasal secretions |
| Vaginal secretions | Saliva (non-dental) |
| Cerebrospinal fluid | Sputum |
| Synovial fluid | Sweat |
| Pleural fluid | Tears |
| Pericardial fluid | Urine |
| Peritoneal fluid | Vomitus |
| Amniotic fluid | |
| **Saliva in dental procedures** | |

### Implementing Universal Precautions

In practice, this means you should:

1. **Wear appropriate PPE** for every patient encounter
2. **Handle all sharps carefully** as if contaminated
3. **Clean and disinfect surfaces** after every patient
4. **Dispose of waste properly** following biohazard protocols
5. **Wash hands** before and after every patient contact
6. **Never assume** a patient is "low risk"

### Common Mistakes to Avoid

- Skipping PPE for "quick procedures"
- Not wearing eye protection because "I'll be careful"
- Assuming long-term patients are "safe"
- Treating new patients differently than established ones`
    },
    {
      id: 'section-6',
      type: 'text',
      title: 'Personal Protective Equipment (PPE)',
      content: `## Personal Protective Equipment in Dentistry

PPE creates a barrier between you and potentially infectious materials. Your employer must provide PPE at no cost to you, ensure it's properly maintained, and provide training on its use.

### Types of PPE in Dental Settings

**Gloves**
- **When to wear:** ALL patient contact, handling contaminated items
- **Types:** Non-sterile exam gloves for routine procedures; sterile surgical gloves for surgery
- **Material options:** Latex, nitrile, vinyl (nitrile recommended for latex sensitivities)
- **Key rules:**
  - Change between patients
  - Change if torn or punctured
  - Never wash and reuse
  - Double-glove for high-risk procedures

**Masks**
- **When to wear:** Procedures likely to generate splashes, sprays, or aerosols
- **Types:** Surgical masks, N95 respirators (for airborne precautions)
- **Key rules:**
  - Must be fluid-resistant
  - Change if wet, soiled, or after aerosol-generating procedures
  - Should fit snugly

**Eye Protection**
- **When to wear:** Any procedure that may generate splashes or spray
- **Types:** Safety glasses with side shields, goggles, face shields
- **Key rules:**
  - Prescription glasses alone are NOT adequate
  - Must have side protection
  - Clean between patients
  - Face shields provide the best protection

**Protective Clothing**
- **When to wear:** Procedures likely to generate splashes or contact with blood/OPIM
- **Types:** Gowns, lab coats, clinic jackets
- **Key rules:**
  - Remove before leaving work area
  - Change if visibly soiled
  - Employer must launder (employees cannot take home)

### PPE Selection Guidelines

| Procedure Type | Minimum PPE Required |
|----------------|---------------------|
| Patient examination | Gloves, mask, eyewear |
| Routine restorative | Gloves, mask, eyewear, protective clothing |
| Scaling/cleaning | Gloves, mask, eyewear, protective clothing |
| Oral surgery | Gloves, mask, eyewear, gown, head cover |
| Instrument cleaning | Heavy-duty utility gloves, mask, eyewear, protective clothing |`
    },
    {
      id: 'section-7',
      type: 'scenario',
      title: 'PPE Selection Scenario',
      prompt: 'You are about to perform an ultrasonic scaling procedure on a patient. Which PPE combination is MOST appropriate?',
      options: [
        'Exam gloves and surgical mask only',
        'Exam gloves, surgical mask, and regular prescription glasses',
        'Exam gloves, surgical mask, protective eyewear with side shields, and a gown/clinic jacket',
        'Sterile surgical gloves, N95 respirator, face shield, and sterile gown'
      ],
      correct: 2,
      explanation: `**Correct Answer: Exam gloves, surgical mask, protective eyewear with side shields, and a gown/clinic jacket**

Ultrasonic scaling generates significant aerosols and splatter, requiring comprehensive protection:

- **Exam gloves** - Appropriate for non-surgical procedures
- **Surgical mask** - Protects against aerosols and splatter
- **Protective eyewear with side shields** - Regular prescription glasses don't provide adequate splash protection
- **Gown/clinic jacket** - Protects clothing from splatter

The first option lacks eye protection and protective clothing. The second option doesn't include proper eye protection (regular glasses aren't adequate). The fourth option is excessive for a routine scaling procedure - N95 respirators and sterile surgical gear are reserved for surgical procedures or airborne disease precautions.`
    },
    {
      id: 'section-8',
      type: 'text',
      title: 'Hand Hygiene',
      content: `## Hand Hygiene: Your First Line of Defense

Proper hand hygiene is the single most effective way to prevent the spread of infections. In dental settings, you should clean your hands numerous times throughout the day.

### When to Perform Hand Hygiene

**Wash or sanitize your hands:**

- Before putting on gloves
- After removing gloves
- After touching contaminated surfaces
- Before and after eating
- After using the restroom
- After touching your face, hair, or body
- Before and after patient contact (even with gloves)
- When moving from contaminated to clean areas

### Handwashing vs. Hand Sanitizer

| Use Soap and Water When: | Use Alcohol-Based Sanitizer When: |
|--------------------------|-----------------------------------|
| Hands are visibly soiled | Hands are not visibly soiled |
| Before eating | Between routine patient contacts |
| After using restroom | Quick decontamination needed |
| After contact with blood/OPIM | Soap and water not immediately available |
| Beginning and end of day | |

### Proper Handwashing Technique

1. **Wet** hands with warm water
2. **Apply** soap and work into lather
3. **Scrub** all surfaces for at least 20 seconds:
   - Palms
   - Back of hands
   - Between fingers
   - Under nails
   - Wrists
4. **Rinse** thoroughly under running water
5. **Dry** with clean paper towel
6. **Use paper towel** to turn off faucet

**Tip:** Sing "Happy Birthday" twice = approximately 20 seconds

### Proper Hand Sanitizer Technique

1. Apply a quarter-sized amount to palm
2. Rub all surfaces of hands and fingers
3. Continue rubbing until completely dry (15-20 seconds)
4. Do not wipe or rinse off

**Important:** Hand sanitizer must contain at least **60% alcohol** to be effective

### Common Hand Hygiene Mistakes

- Not washing long enough
- Missing areas between fingers and under nails
- Not changing gloves between patients
- Assuming gloves replace handwashing
- Using hand sanitizer when hands are visibly soiled`
    },
    {
      id: 'section-9',
      type: 'text',
      title: 'Sharps Safety',
      content: `## Preventing Needlestick and Sharps Injuries

Sharps injuries are the most common cause of bloodborne pathogen exposure in dental settings. Most of these injuries are **preventable** through proper handling techniques and engineering controls.

### What Are Sharps?

Any object that can penetrate skin, including:
- Needles and syringes
- Scalpel blades
- Broken glass
- Orthodontic wires
- Dental burs
- Explorers and scalers
- Contaminated broken instruments

### The Cardinal Rules of Sharps Safety

**NEVER RECAP NEEDLES!**
This is the #1 cause of needlestick injuries. If recapping is absolutely necessary, use the one-handed scoop technique.

**Pass sharps safely**
- Use neutral zones for instrument passing
- Announce when passing sharps
- Hand instruments handle-first

**Dispose immediately**
- Place sharps directly into sharps container
- Never overfill containers (fill line = maximum)
- Never reach into sharps containers

### Engineering Controls for Sharps Safety

Your practice should use these safer devices:

**Self-sheathing needles** - Automatically cover needle after use
**Retractable needles** - Needle retracts into syringe
**Blunted suture needles** - Where appropriate for the procedure
**Safety scalpels** - Retractable or shielded blades
**Needleless systems** - For certain applications

### The One-Handed Scoop Technique

If you must recap a needle (only when no alternative exists):

1. Place the cap on a flat surface
2. Using one hand, "scoop" the cap onto the needle
3. Once the cap is on the needle, use your other hand to secure it
4. Never hold the cap with your fingers while recapping

### Sharps Container Requirements

- Puncture-resistant
- Leak-proof
- Labeled with biohazard symbol
- Located as close as practical to use area
- Replaced when 3/4 full (at the fill line)
- Never overfilled, reached into, or emptied`
    },
    {
      id: 'section-10',
      type: 'scenario',
      title: 'Needlestick Response Scenario',
      prompt: 'While removing a needle from a patient\'s mouth, you accidentally stick your finger through your glove. The patient\'s blood is visible on the needle. What is the FIRST thing you should do?',
      options: [
        'Immediately squeeze the puncture site to push out any contaminated blood',
        'Finish the procedure first, then report the incident to your supervisor',
        'Remove your glove and immediately wash the wound with soap and water',
        'Apply a bandage and continue treating the patient'
      ],
      correct: 2,
      explanation: `**Correct Answer: Remove your glove and immediately wash the wound with soap and water**

The immediate first step after a needlestick injury is to wash the wound:

1. **Remove the glove** and wash immediately
2. **Wash the puncture site** with soap and water for several minutes
3. **Do NOT squeeze** the wound - this does not help and may increase damage
4. **Let it bleed freely** for a short time while washing
5. **Report immediately** to your supervisor
6. **Document** the incident
7. **Seek medical evaluation** - post-exposure prophylaxis must be started within hours for maximum effectiveness

**Why the other answers are wrong:**
- **Squeezing the wound** is not recommended and may cause more trauma
- **Finishing the procedure first** delays critical treatment - time is essential for post-exposure prophylaxis
- **Just applying a bandage** fails to decontaminate the wound and delays reporting`
    },
    {
      id: 'section-11',
      type: 'text',
      title: 'Hepatitis B Vaccination',
      content: `## Your Right to the Hepatitis B Vaccine

Under the Bloodborne Pathogens Standard, your employer must offer you the Hepatitis B vaccine **at no cost** if you have occupational exposure to blood or OPIM.

### Key Vaccine Requirements

**Timing**
- Must be offered within **10 working days** of initial assignment to a job with occupational exposure
- Offered after required bloodborne pathogens training

**Cost**
- Completely FREE to employees
- Includes all doses and follow-up testing
- No deductibles, copays, or waiting periods

**Vaccination Schedule**
- Series of 3 shots over 6 months
- Dose 1: Initial
- Dose 2: 1 month after first dose
- Dose 3: 6 months after first dose
- Post-vaccination testing: 1-2 months after third dose

### Why Get Vaccinated?

The Hepatitis B vaccine is:
- **97% effective** after completing the series
- The **only vaccine** available for any bloodborne pathogen we discuss
- **Safe** with minimal side effects
- **Long-lasting** protection (possibly lifetime)

Hepatitis B is:
- **100 times more infectious** than HIV
- Capable of causing **chronic liver disease and cancer**
- **Preventable** with vaccination

### Declining the Vaccine

You have the right to decline the vaccine, but:

1. You must sign a **declination form** (specific OSHA language required)
2. The declination will be kept in your personnel file
3. You can **change your mind** and receive the vaccine later at no cost
4. Your employer must document your decision

**Sample Declination Statement:**

> "I understand that due to my occupational exposure to blood or other potentially infectious materials I may be at risk of acquiring hepatitis B virus (HBV) infection. I have been given the opportunity to be vaccinated with hepatitis B vaccine, at no charge to myself. However, I decline hepatitis B vaccination at this time. I understand that by declining this vaccine, I continue to be at risk of acquiring hepatitis B, a serious disease. If in the future I continue to have occupational exposure to blood or other potentially infectious materials and I want to be vaccinated with hepatitis B vaccine, I can receive the vaccination series at no charge to me."

### If You Were Vaccinated Elsewhere

If you've already received the HBV vaccine series:
- Provide documentation to your employer
- No need to repeat the series
- Your employer should keep this record on file`
    },
    {
      id: 'section-12',
      type: 'text',
      title: 'Exposure Incident Procedures',
      content: `## What to Do After an Exposure Incident

An **exposure incident** is a specific eye, mouth, other mucous membrane, non-intact skin, or parenteral contact with blood or other potentially infectious materials. Knowing how to respond can be critical to your health.

### Immediate Steps (Within Minutes)

**For Needlestick/Cut:**
1. Wash the wound with soap and water for several minutes
2. Allow the wound to bleed freely (do not squeeze)
3. Apply antiseptic and bandage

**For Splash to Eyes/Mucous Membranes:**
1. Flush with water or saline for at least 15 minutes
2. For eyes: Use eyewash station or clean running water
3. For mouth: Rinse repeatedly with water

**For Splash to Skin:**
1. Wash immediately with soap and water
2. If skin is intact, risk is minimal

### Reporting Requirements

**Report to your supervisor IMMEDIATELY**
- Time is critical for post-exposure prophylaxis
- For HIV exposure, PEP should start within 2 hours if possible
- Never delay reporting

**Information to document:**
- Date and time of exposure
- How the exposure occurred
- Type of potentially infectious material
- Source individual (if known)
- Your job duties at time of exposure
- PPE you were wearing
- Actions taken post-exposure

### Post-Exposure Medical Evaluation

Your employer must provide a **confidential medical evaluation** including:

1. **Documentation** of the route of exposure and circumstances
2. **Source individual testing** (with consent)
   - If source refuses or is unknown, document this
   - If source is HBV/HCV/HIV positive, you'll be notified
3. **Your blood testing**
   - Baseline and follow-up testing
   - You can decline but should consider carefully
4. **Counseling** on:
   - Risk of infection
   - Available post-exposure treatments
   - Need for follow-up testing
   - Precautions during follow-up period

### Post-Exposure Prophylaxis (PEP)

**For HIV Exposure:**
- PEP involves taking antiretroviral medications
- Most effective when started within 2 hours
- Must be started within 72 hours maximum
- Continued for 28 days
- Reduces infection risk by ~80%

**For HBV Exposure:**
- If unvaccinated: Begin vaccine series + HBIG
- If vaccinated with adequate response: Nothing needed
- If vaccinated with inadequate response: HBIG + vaccine booster

**For HCV Exposure:**
- No prophylaxis available
- Close monitoring for early detection and treatment

### Your Rights After an Exposure

- Confidential evaluation and testing
- Healthcare provider's written opinion within 15 days
- Employer cannot terminate or retaliate against you
- Right to refuse testing (though not recommended)`
    },
    {
      id: 'section-13',
      type: 'text',
      title: 'Housekeeping & Decontamination',
      content: `## Maintaining a Safe Work Environment

Proper housekeeping and decontamination prevent indirect transmission of bloodborne pathogens through contaminated surfaces and equipment.

### Work Surface Decontamination

**Clean and decontaminate work surfaces:**
- After each patient
- When visibly contaminated
- At the end of the work shift
- After any spill of blood or OPIM

**Approved disinfectants for bloodborne pathogens:**
- EPA-registered tuberculocidal disinfectants
- EPA-registered products effective against HIV and HBV
- Diluted bleach solution (1:10 to 1:100 depending on use)

**Decontamination procedure:**
1. Put on appropriate PPE (utility gloves, eyewear)
2. Remove visible organic material
3. Apply disinfectant according to manufacturer's instructions
4. Allow proper contact time (usually 1-10 minutes)
5. Wipe or allow to air dry per product instructions

### Equipment Decontamination

**Reusable equipment** must be decontaminated before servicing or reuse:
- Follow manufacturer's guidelines
- Use appropriate disinfectant or sterilization method
- Document sterilization cycles

**Equipment that cannot be decontaminated:**
- Must be labeled with biohazard warning
- State which portions are contaminated

### Contaminated Laundry

- Handle as little as possible
- Do not sort or rinse in patient care areas
- Bag at location where used
- If saturated, use leak-proof bag
- Employer must launder or contract laundering
- Employees CANNOT take contaminated laundry home

### Regulated Waste Disposal

**What is regulated waste?**
- Liquid or semi-liquid blood/OPIM
- Items caked with dried blood/OPIM that can release during handling
- Contaminated sharps
- Pathological waste containing blood/OPIM

**Disposal requirements:**
- Place in closable, leak-proof containers
- Label with biohazard symbol OR use red containers
- Dispose through licensed medical waste hauler
- Document all waste pickups

### Spill Cleanup Procedure

1. **Alert others** - Keep people away from the area
2. **Get PPE** - At minimum: utility gloves, eye protection, gown
3. **Contain the spill** - Use absorbent material around edges
4. **Remove bulk material** - Scoop up with disposable tools
5. **Disinfect** - Apply appropriate disinfectant, allow contact time
6. **Clean** - Remove disinfectant and remaining debris
7. **Dispose** - Place all materials in biohazard container
8. **Wash hands** - Even after removing gloves`
    },
    {
      id: 'section-14',
      type: 'text',
      title: 'Labels and Signs',
      content: `## Biohazard Labels and Signs

Warning labels and signs are critical for communicating the presence of bloodborne pathogen hazards. They alert employees and others to potential dangers and required precautions.

### The Biohazard Symbol

The universal biohazard symbol must appear on:

- Containers of regulated waste
- Refrigerators/freezers containing blood or OPIM
- Containers used to store, transport, or ship blood/OPIM
- Contaminated equipment being shipped or serviced
- Bags containing contaminated laundry
- Sharps disposal containers
- Entrances to HIV/HBV research laboratories

### Label Requirements

**Labels must be:**
- Fluorescent orange or orange-red
- Include the biohazard symbol
- Include the word "BIOHAZARD"
- Affixed to the container by string, wire, adhesive, or other method

**Exception - Red bags/containers:**
- Red bags or red containers can substitute for labels
- Must be recognizable as biohazardous material containers

### What Must Be Labeled

| Item | Labeling Requirement |
|------|---------------------|
| Sharps containers | Biohazard label OR red color |
| Regulated waste containers | Biohazard label OR red color |
| Specimen containers | Biohazard label (if leaving facility) |
| Contaminated equipment | Biohazard label stating contaminated portions |
| Contaminated laundry bags | Biohazard label OR red bag |
| Blood refrigerators | Biohazard label |

### Signs for Laboratory Areas

HIV/HBV research labs and production facilities require entrance signs showing:
- Biohazard symbol
- Name of infectious agent
- Special requirements for entry
- Name and phone number of responsible person

### What Does NOT Require Labels

- Individual containers of blood/specimens that remain within the facility AND use Universal Precautions AND are recognizable as blood/specimens
- Regulated waste that has been decontaminated
- Laundry processed in-facility using Universal Precautions`
    },
    {
      id: 'section-15',
      type: 'scenario',
      title: 'Contamination Cleanup Scenario',
      prompt: 'A patient accidentally knocks over a container, spilling blood on the operatory floor. What is the CORRECT sequence of steps to clean this spill?',
      options: [
        'Wipe up blood with paper towels, spray with surface cleaner, wipe dry',
        'Put on utility gloves and eyewear, contain spill, absorb blood, apply disinfectant, allow contact time, clean up, dispose in biohazard container',
        'Call housekeeping to handle the spill',
        'Immediately apply bleach directly to the spill, then wipe clean with paper towels'
      ],
      correct: 1,
      explanation: `**Correct Answer: Put on utility gloves and eyewear, contain spill, absorb blood, apply disinfectant, allow contact time, clean up, dispose in biohazard container**

The correct blood spill cleanup procedure:

1. **Don appropriate PPE** - Heavy-duty utility gloves (not exam gloves) and eye protection at minimum
2. **Contain the spill** - Prevent it from spreading
3. **Remove bulk material** - Use absorbent materials or scoop tools
4. **Apply disinfectant** - EPA-registered tuberculocidal or HIV/HBV effective product
5. **Allow proper contact time** - Usually 1-10 minutes per manufacturer instructions
6. **Clean the area** - Remove disinfectant and remaining material
7. **Dispose properly** - All contaminated materials go in biohazard container
8. **Remove PPE and wash hands**

**Why the other answers are wrong:**
- **First option** uses inadequate disinfectant (surface cleaner) and no PPE
- **Third option** delays cleanup and may not be available; you should be trained to handle this
- **Fourth option** skips PPE and doesn't allow proper contact time for disinfection`
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'Which federal agency enforces the Bloodborne Pathogens Standard (29 CFR 1910.1030)?',
        options: ['CDC', 'OSHA', 'FDA', 'EPA'],
        correct: 1
      },
      {
        id: 'q2',
        question: 'Which of the following bloodborne pathogens can survive on environmental surfaces for up to 7 days?',
        options: ['HIV', 'Hepatitis B', 'Hepatitis C', 'All of the above'],
        correct: 1
      },
      {
        id: 'q3',
        question: 'What is the risk of HIV infection after a needlestick exposure from an HIV-positive source?',
        options: ['0.3% average', '3% average', '30% average', '0.03% average'],
        correct: 0
      },
      {
        id: 'q4',
        question: 'Universal Precautions require you to treat which materials as infectious?',
        options: [
          'Only blood from patients with known HIV/HBV',
          'All blood and certain body fluids from all patients',
          'Only visibly contaminated materials',
          'Blood from emergency patients only'
        ],
        correct: 1
      },
      {
        id: 'q5',
        question: 'According to OSHA regulations, when must the Exposure Control Plan be reviewed and updated?',
        options: [
          'Every 5 years',
          'Only when requested by OSHA',
          'At least annually',
          'Every 2 years'
        ],
        correct: 2
      },
      {
        id: 'q6',
        question: 'Which type of gloves should be worn when manually cleaning instruments before sterilization?',
        options: [
          'Standard exam gloves',
          'Sterile surgical gloves',
          'Heavy-duty utility gloves',
          'No gloves if instruments are pre-soaked'
        ],
        correct: 2
      },
      {
        id: 'q7',
        question: 'How long should you wash your hands with soap and water?',
        options: ['5 seconds', '10 seconds', 'At least 20 seconds', '60 seconds'],
        correct: 2
      },
      {
        id: 'q8',
        question: 'What is the primary cause of needlestick injuries in dental settings?',
        options: [
          'Passing instruments',
          'Recapping needles',
          'Disposing of sharps',
          'Giving injections'
        ],
        correct: 1
      },
      {
        id: 'q9',
        question: 'If you must recap a needle, which technique should you use?',
        options: [
          'Two-handed technique for better control',
          'One-handed scoop technique',
          'Have a coworker hold the cap',
          'Needles should never be recapped under any circumstances'
        ],
        correct: 1
      },
      {
        id: 'q10',
        question: 'When must the Hepatitis B vaccine be offered to employees with occupational exposure?',
        options: [
          'Within 30 days of hire',
          'Within 10 working days of initial assignment',
          'Within 90 days of hire',
          'After 6 months of employment'
        ],
        correct: 1
      },
      {
        id: 'q11',
        question: 'What is the effectiveness rate of the Hepatitis B vaccine after completing the full series?',
        options: ['50%', '75%', '97%', '100%'],
        correct: 2
      },
      {
        id: 'q12',
        question: 'After a needlestick injury, what should you do FIRST?',
        options: [
          'Report to your supervisor',
          'Document the incident',
          'Wash the wound with soap and water',
          'Identify the source patient'
        ],
        correct: 2
      },
      {
        id: 'q13',
        question: 'For maximum effectiveness, HIV post-exposure prophylaxis (PEP) should ideally be started within:',
        options: ['2 hours', '24 hours', '72 hours', '1 week'],
        correct: 0
      },
      {
        id: 'q14',
        question: 'Sharps containers should be replaced when they reach what level?',
        options: ['Completely full', 'The fill line (approximately 3/4 full)', 'Half full', 'Only when they smell'],
        correct: 1
      },
      {
        id: 'q15',
        question: 'Which of the following is NOT required on a biohazard label?',
        options: [
          'The biohazard symbol',
          'Fluorescent orange or orange-red color',
          'The word "BIOHAZARD"',
          'The specific pathogen name'
        ],
        correct: 3
      },
      {
        id: 'q16',
        question: 'When using an alcohol-based hand sanitizer, what is the minimum alcohol concentration required?',
        options: ['30%', '45%', '60%', '90%'],
        correct: 2
      },
      {
        id: 'q17',
        question: 'How often should work surfaces be decontaminated at minimum?',
        options: [
          'Once per day',
          'Once per week',
          'After each patient and at end of shift',
          'Only when visibly contaminated'
        ],
        correct: 2
      },
      {
        id: 'q18',
        question: 'Who is responsible for laundering contaminated work clothing?',
        options: [
          'The employee',
          'The employer',
          'A family member',
          'The employee at their own expense'
        ],
        correct: 1
      },
      {
        id: 'q19',
        question: 'What is the maximum penalty for a willful OSHA violation of the Bloodborne Pathogens Standard?',
        options: [
          '$15,625 per violation',
          '$78,125 per violation',
          '$156,259 per violation',
          '$500,000 per violation'
        ],
        correct: 2
      },
      {
        id: 'q20',
        question: 'If an employee declines the Hepatitis B vaccine, what must they do?',
        options: [
          'Nothing - verbal refusal is sufficient',
          'Sign a specific OSHA-required declination form',
          'Provide a doctor\'s note',
          'Pay for their own medical monitoring'
        ],
        correct: 1
      }
    ]
  }
};

export default oshaBloodbornePathogensContent;
