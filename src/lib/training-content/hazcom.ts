/**
 * Hazard Communication (HazCom/GHS) Training Content
 * Comprehensive training module for dental practices
 * Duration: 30 minutes
 * Sections: 8 (6 text, 2 scenarios)
 * Quiz Questions: 12
 */

import type { TrainingContent } from './osha-bbp';

export const hazcomTrainingContent: TrainingContent = {
  sections: [
    {
      id: 'section-1',
      type: 'text',
      title: 'Introduction to the Hazard Communication Standard',
      content: `## OSHA's Hazard Communication Standard (HazCom)

The OSHA Hazard Communication Standard (29 CFR 1910.1200), also known as the "Right to Know" law, ensures that employees are informed about the chemical hazards they may encounter in the workplace.

### Why HazCom Matters in Dentistry

Dental practices use numerous chemicals daily, including:
- Disinfectants and surface cleaners
- Sterilization chemicals (glutaraldehyde, OPA)
- Dental materials (bonding agents, etchants, acrylics)
- X-ray processing chemicals
- Nitrous oxide
- Mercury (in amalgam)

**You have the right to know about every hazardous chemical in your workplace.**

### The Globally Harmonized System (GHS)

In 2012, OSHA aligned the HazCom Standard with the **Globally Harmonized System of Classification and Labelling of Chemicals (GHS)**. This international system provides:

- **Standardized labels** - Same format worldwide
- **Consistent hazard classification** - Universal criteria for identifying hazards
- **Uniform Safety Data Sheets** - 16-section format

### Key Requirements of HazCom

Your employer must:

1. **Maintain a written Hazard Communication Program**
2. **Keep a chemical inventory** - List of all hazardous chemicals
3. **Ensure proper labeling** - All containers must be labeled
4. **Maintain Safety Data Sheets (SDS)** - Accessible to all employees
5. **Provide training** - Initial and when new hazards are introduced

### Your Rights Under HazCom

As an employee, you have the right to:
- Know what chemicals you work with
- Access Safety Data Sheets at any time
- Receive training on chemical hazards
- Refuse to work with a chemical if proper information isn't provided`
    },
    {
      id: 'section-2',
      type: 'text',
      title: 'GHS Label Elements',
      content: `## Understanding GHS Labels

GHS labels provide critical information about chemical hazards in a standardized format. Learning to read these labels quickly could save your life.

### Required Label Elements

Every GHS-compliant label must include:

**1. Product Identifier**
- Chemical name or product name
- Must match the name on the Safety Data Sheet

**2. Signal Word**
- **DANGER** - More severe hazards
- **WARNING** - Less severe hazards
- Only one signal word per label (most severe takes precedence)

**3. Hazard Statements**
- Describe the nature of the hazard
- Examples: "Causes severe skin burns," "May cause drowsiness"

**4. Pictograms**
- Red-bordered diamond symbols
- Quickly communicate hazard types
- Must be printed in red

**5. Precautionary Statements**
- Prevention measures
- Response actions if exposure occurs
- Storage requirements
- Disposal instructions

**6. Supplier Information**
- Name, address, and phone number of manufacturer/importer

### The 9 GHS Pictograms

| Pictogram | Hazard Type |
|-----------|-------------|
| Flame | Flammable materials |
| Flame over Circle | Oxidizers |
| Exploding Bomb | Explosives |
| Skull and Crossbones | Acute toxicity (severe) |
| Corrosion | Corrosive to metals or skin |
| Exclamation Mark | Irritant, sensitizer, acute toxicity (less severe) |
| Health Hazard | Carcinogen, respiratory sensitizer, organ toxicity |
| Environment | Aquatic toxicity |
| Gas Cylinder | Gases under pressure |

### Common Pictograms in Dental Settings

You'll most frequently see:
- **Corrosion** - Etchants, some disinfectants
- **Flame** - Alcohol-based products, some solvents
- **Exclamation Mark** - Irritants, many dental materials
- **Health Hazard** - Some bonding agents, acrylics`
    },
    {
      id: 'section-3',
      type: 'text',
      title: 'Reading Safety Data Sheets (SDS)',
      content: `## Safety Data Sheets: Your Chemical Information Resource

A Safety Data Sheet (SDS) provides comprehensive information about a hazardous chemical. Under GHS, all SDSs follow a standardized 16-section format.

### The 16 Sections of an SDS

| Section | Title | What It Tells You |
|---------|-------|-------------------|
| 1 | Identification | Product name, manufacturer, emergency phone |
| 2 | Hazard(s) Identification | GHS classification, label elements, hazards |
| 3 | Composition/Ingredients | Chemical ingredients and concentrations |
| 4 | First-Aid Measures | What to do if exposed |
| 5 | Fire-Fighting Measures | How to fight fires involving this chemical |
| 6 | Accidental Release | Spill cleanup procedures |
| 7 | Handling and Storage | Safe handling practices, storage conditions |
| 8 | Exposure Controls/PPE | Exposure limits, required protective equipment |
| 9 | Physical/Chemical Properties | Appearance, odor, pH, flash point, etc. |
| 10 | Stability and Reactivity | Conditions to avoid, incompatible materials |
| 11 | Toxicological Information | Health effects, routes of exposure |
| 12 | Ecological Information | Environmental impact |
| 13 | Disposal Considerations | Safe disposal methods |
| 14 | Transport Information | Shipping requirements |
| 15 | Regulatory Information | Applicable regulations |
| 16 | Other Information | Date of preparation/revision |

### Most Important Sections for Daily Use

**Section 2 - Hazard Identification**
- Quick overview of all hazards
- Label elements you'll see on the container

**Section 4 - First-Aid Measures**
- What to do immediately after exposure
- Different procedures for different exposure routes

**Section 7 - Handling and Storage**
- How to safely use the chemical
- Storage requirements and incompatibilities

**Section 8 - Exposure Controls/PPE**
- What protective equipment to wear
- Ventilation requirements

### Accessing Safety Data Sheets

SDSs must be readily accessible during your work shift. In your practice:
- **Physical location:** ___________________
- **Electronic access:** ___________________

If you don't know where to find SDSs, ask your supervisor immediately!`
    },
    {
      id: 'section-4',
      type: 'scenario',
      title: 'Label Reading Scenario',
      prompt: 'You need to use a new surface disinfectant. The label shows a CORROSION pictogram, the signal word "DANGER," and the hazard statement "Causes severe skin burns and eye damage." What PPE should you wear at minimum?',
      options: [
        'Standard exam gloves only - the same as for patient care',
        'Chemical-resistant gloves and safety goggles or face shield',
        'No PPE needed if you are careful not to spill',
        'N95 respirator and surgical gown'
      ],
      correct: 1,
      explanation: `**Correct Answer: Chemical-resistant gloves and safety goggles or face shield**

The label tells you exactly what you need to know:

**What the label indicates:**
- **CORROSION pictogram** = Can cause severe damage to skin and eyes
- **DANGER signal word** = This is a severe hazard
- **"Causes severe skin burns and eye damage"** = Specific hazards to protect against

**Required PPE:**
- **Chemical-resistant gloves** - Standard exam gloves may not provide adequate protection against corrosive chemicals. Check the SDS Section 8 for specific glove recommendations.
- **Eye protection** - Safety goggles or face shield to prevent splashes from reaching eyes

**Why the other answers are wrong:**
- **Standard exam gloves only** - May not resist the specific chemical; doesn't protect eyes
- **No PPE** - Extremely dangerous with a corrosive chemical
- **N95 and gown** - The N95 is for airborne hazards; a gown might be appropriate for splash protection, but the key missing elements are proper gloves and eye protection

**Always check the SDS Section 8** for specific PPE recommendations for each chemical.`
    },
    {
      id: 'section-5',
      type: 'text',
      title: 'Chemical Hazards in Dental Offices',
      content: `## Common Chemical Hazards in Dentistry

Dental practices use a wide variety of chemicals. Understanding the hazards of common products helps you work safely.

### Disinfectants and Sterilants

**Glutaraldehyde (Cidex, Metricide)**
- **Hazards:** Respiratory sensitizer, skin sensitizer, eye irritant
- **Exposure routes:** Inhalation, skin contact
- **Symptoms:** Breathing difficulty, skin rash, eye irritation
- **Protection:** Use in well-ventilated area, chemical-resistant gloves, eye protection

**Sodium Hypochlorite (Bleach)**
- **Hazards:** Corrosive, respiratory irritant
- **Exposure routes:** Skin contact, eye contact, inhalation
- **NEVER mix with:** Ammonia (creates toxic chloramine gas) or acids (releases chlorine gas)
- **Protection:** Gloves, eye protection, adequate ventilation

**Quaternary Ammonium Compounds**
- **Hazards:** Skin and eye irritant
- **Generally less hazardous** than glutaraldehyde or bleach
- **Protection:** Gloves, eye protection for splashes

### Dental Materials

**Dental Etchants (Phosphoric Acid)**
- **Hazards:** Corrosive, causes severe burns
- **Protection:** Gloves, eye protection, careful handling

**Bonding Agents and Resins**
- **Hazards:** Skin sensitizers, some are flammable
- **Protection:** Gloves (methacrylates penetrate latex - use nitrile)
- **Note:** Repeated exposure can cause permanent sensitization

**Dental Acrylics (Methyl Methacrylate)**
- **Hazards:** Flammable, skin sensitizer, respiratory irritant
- **Protection:** Work in ventilated area, nitrile gloves

### Mercury in Amalgam

- **Hazards:** Neurotoxin, can accumulate in body
- **Exposure routes:** Inhalation of vapor, skin absorption
- **Protection:** Proper amalgam handling procedures, mercury spill kit
- **Never touch:** Scrap amalgam with bare hands

### Nitrous Oxide

- **Hazards:** Can cause reproductive effects with chronic exposure
- **Control measures:** Scavenging systems, adequate ventilation, leak testing
- **Symptoms of overexposure:** Dizziness, headache, nausea`
    },
    {
      id: 'section-6',
      type: 'text',
      title: 'Protective Measures and Safe Handling',
      content: `## Working Safely with Chemicals

Protecting yourself from chemical hazards involves multiple layers of controls.

### The Hierarchy of Controls

**1. Elimination/Substitution** (Most Effective)
- Can we eliminate the hazardous chemical?
- Can we substitute a less hazardous alternative?
- Example: Using hydrogen peroxide-based sterilants instead of glutaraldehyde

**2. Engineering Controls**
- Ventilation systems
- Enclosed systems
- Local exhaust ventilation
- Example: Scavenging systems for nitrous oxide

**3. Administrative Controls**
- Safe work procedures
- Rotation of workers
- Training
- Proper labeling and storage

**4. Personal Protective Equipment** (Last Line of Defense)
- Gloves appropriate for the chemical
- Eye protection
- Respiratory protection when needed
- Protective clothing

### PPE Selection for Chemicals

**Gloves:**
| Chemical Type | Recommended Glove |
|---------------|-------------------|
| Disinfectants | Nitrile or chemical-resistant |
| Methacrylates | Nitrile (NOT latex) |
| Acids/bases | Chemical-resistant (check SDS) |
| General handling | Nitrile preferred |

**Eye Protection:**
- Safety glasses with side shields for minor splash risk
- Chemical splash goggles for moderate risk
- Face shield for high splash risk

### Safe Storage Practices

- Store chemicals in original containers with labels intact
- Keep incompatible chemicals separated
- Store flammables in approved cabinets
- Keep chemicals away from heat sources
- Ensure adequate ventilation in storage areas
- Never store chemicals above eye level
- Keep only minimum quantities needed

### Ventilation Requirements

- Many chemicals require adequate ventilation
- Don't block ventilation openings
- Report ventilation problems immediately
- Use local exhaust when recommended by SDS
- Work in well-ventilated areas when using volatile chemicals`
    },
    {
      id: 'section-7',
      type: 'text',
      title: 'Chemical Spill Response',
      content: `## Responding to Chemical Spills

Knowing how to respond to a chemical spill can prevent injuries and minimize damage. The response depends on the chemical and size of the spill.

### Assess the Situation

Before taking action, quickly assess:
1. **What chemical spilled?** - Check the container/label
2. **How much spilled?** - Small drip vs. large container
3. **Is anyone injured or contaminated?**
4. **Are there any immediate dangers?** - Fire, fumes, spreading

### Small Spill Response (Minor drips and splashes)

For small spills of chemicals you're trained to handle:

1. **Alert others** - Warn nearby coworkers
2. **Don PPE** - Appropriate for the chemical (check SDS)
3. **Contain the spill** - Use absorbent materials around edges
4. **Absorb the spill** - Use appropriate absorbent
5. **Clean the area** - Following SDS recommendations
6. **Dispose properly** - As hazardous waste if required
7. **Report** - Document the spill per practice policy

### Large Spill Response

For large spills or unknown chemicals:

1. **Evacuate the area** - Get yourself and others out
2. **Alert others** - Sound alarm if necessary
3. **Do NOT attempt cleanup** - Unless trained and equipped
4. **Call for help** - Supervisor, emergency services if needed
5. **Prevent spread** - Close doors, block drains if safe to do so
6. **Provide information** - Tell responders what spilled

### Mercury Spill Response (Special Procedures)

Mercury from broken thermometers or amalgam requires special handling:

**DO:**
- Evacuate the immediate area
- Turn off HVAC to prevent vapor spread
- Use mercury spill kit (if trained)
- Pick up beads with special equipment
- Store in sealed container

**DO NOT:**
- Touch mercury with bare hands
- Use a vacuum cleaner (spreads vapor)
- Pour mercury down the drain
- Use a regular broom (breaks into smaller beads)

### First Aid for Chemical Exposure

**Skin Contact:**
1. Remove contaminated clothing
2. Flush with water for at least 15-20 minutes
3. Seek medical attention for burns or persistent irritation

**Eye Contact:**
1. Immediately flush with water for at least 15-20 minutes
2. Hold eyelids open during flushing
3. Seek immediate medical attention

**Inhalation:**
1. Move to fresh air immediately
2. Seek medical attention if symptoms persist
3. Provide SDS to medical personnel`
    },
    {
      id: 'section-8',
      type: 'scenario',
      title: 'Chemical Spill Scenario',
      prompt: 'While preparing the sterilization area, you accidentally knock over a bottle of glutaraldehyde (high-level disinfectant). About 500ml spills on the counter and floor. You notice a strong odor. What should you do FIRST?',
      options: [
        'Grab paper towels and quickly wipe it up before it spreads further',
        'Alert coworkers, evacuate the immediate area, and open windows for ventilation',
        'Look up the chemical in the SDS binder to determine cleanup procedures',
        'Put on exam gloves and carefully pour the remaining glutaraldehyde back into the bottle'
      ],
      correct: 1,
      explanation: `**Correct Answer: Alert coworkers, evacuate the immediate area, and open windows for ventilation**

Glutaraldehyde is a respiratory sensitizer with a strong odor that indicates significant vapor concentration. Your first priority is safety.

**Why evacuation and ventilation come first:**

1. **Health hazard:** Glutaraldehyde vapors can cause respiratory irritation and sensitization
2. **Strong odor indicates high exposure:** If you can smell it strongly, vapor levels may be hazardous
3. **Protect yourself and others:** You can't help clean up if you become incapacitated

**Correct sequence for this spill:**
1. Alert coworkers and evacuate immediate area
2. Open windows/doors to increase ventilation
3. Allow vapors to dissipate
4. Don appropriate PPE (chemical-resistant gloves, eye protection, consider respiratory protection)
5. Return to clean up following SDS procedures
6. Use appropriate absorbent materials
7. Dispose as hazardous waste
8. Report and document the spill

**Why the other answers are wrong:**
- **Paper towels immediately** - Exposes you to vapors without protection
- **Look up SDS first** - Takes too long while you're being exposed; evacuate first
- **Save the remaining chemical** - Wrong priority; safety first, property second

**Key Lesson:** When you smell a chemical strongly, that's your warning to get away and ventilate before attempting cleanup.`
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'What does the HazCom Standard\'s "Right to Know" mean?',
        options: [
          'Employers can keep chemical information confidential',
          'Employees have the right to know about chemical hazards they work with',
          'Only supervisors need to know about chemical hazards',
          'Chemical information is only available during emergencies'
        ],
        correct: 1
      },
      {
        id: 'q2',
        question: 'What does the signal word "DANGER" on a GHS label indicate?',
        options: [
          'The chemical is not hazardous',
          'A less severe hazard',
          'A more severe hazard',
          'The chemical is expired'
        ],
        correct: 2
      },
      {
        id: 'q3',
        question: 'How many sections are in a GHS-compliant Safety Data Sheet?',
        options: ['8', '12', '16', '20'],
        correct: 2
      },
      {
        id: 'q4',
        question: 'Which SDS section tells you what PPE to use?',
        options: [
          'Section 2 - Hazard Identification',
          'Section 4 - First-Aid Measures',
          'Section 7 - Handling and Storage',
          'Section 8 - Exposure Controls/PPE'
        ],
        correct: 3
      },
      {
        id: 'q5',
        question: 'What does the CORROSION pictogram (showing material eating through surfaces) indicate?',
        options: [
          'The chemical is flammable',
          'The chemical can cause severe skin burns and eye damage',
          'The chemical is an explosive',
          'The chemical is toxic if swallowed'
        ],
        correct: 1
      },
      {
        id: 'q6',
        question: 'What should you NEVER mix with bleach (sodium hypochlorite)?',
        options: [
          'Water',
          'Ammonia or acids',
          'Alcohol',
          'Soap'
        ],
        correct: 1
      },
      {
        id: 'q7',
        question: 'Which type of gloves should be used when handling methacrylate-based dental materials?',
        options: [
          'Latex gloves',
          'Vinyl gloves',
          'Nitrile gloves',
          'Any exam glove is acceptable'
        ],
        correct: 2
      },
      {
        id: 'q8',
        question: 'What is the FIRST action you should take when you spill a chemical that produces strong fumes?',
        options: [
          'Begin cleanup immediately',
          'Look up the SDS',
          'Alert others and evacuate/ventilate the area',
          'Take a photo for documentation'
        ],
        correct: 2
      },
      {
        id: 'q9',
        question: 'How should you clean up a mercury spill?',
        options: [
          'Vacuum it up for quick removal',
          'Use a broom to sweep it into a dustpan',
          'Use a mercury spill kit with special equipment',
          'Flush it down the drain with water'
        ],
        correct: 2
      },
      {
        id: 'q10',
        question: 'How long should you flush your eyes with water after chemical contact?',
        options: [
          '1-2 minutes',
          '5 minutes',
          'At least 15-20 minutes',
          '30 seconds'
        ],
        correct: 2
      },
      {
        id: 'q11',
        question: 'What is the most effective level of the hierarchy of controls?',
        options: [
          'Personal protective equipment',
          'Administrative controls',
          'Engineering controls',
          'Elimination or substitution'
        ],
        correct: 3
      },
      {
        id: 'q12',
        question: 'Where must Safety Data Sheets be kept?',
        options: [
          'In a locked cabinet accessible only to managers',
          'At the chemical manufacturer\'s facility',
          'Readily accessible to employees during their work shift',
          'Only in electronic format on a password-protected computer'
        ],
        correct: 2
      }
    ]
  }
};

export default hazcomTrainingContent;
