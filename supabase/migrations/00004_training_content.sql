-- Update Training Modules with Comprehensive Content
-- This migration updates the OSHA Bloodborne Pathogens and HIPAA Privacy & Security
-- training modules with professional, regulation-compliant educational content.

-- Update OSHA Bloodborne Pathogens Training
UPDATE training_modules
SET
  duration_minutes = 60,
  content_json = '{
    "sections": [
      {
        "id": "section-1",
        "type": "text",
        "title": "Introduction to the Bloodborne Pathogens Standard",
        "content": "## OSHA 29 CFR 1910.1030\n\nThe OSHA Bloodborne Pathogens Standard was established in 1991 to protect workers from the health hazards of exposure to blood and other potentially infectious materials (OPIM). This standard applies to **all employees who may reasonably anticipate contact with blood or OPIM** as part of their job duties.\n\n### Why This Training Matters\n\nIn dental settings, you are at increased risk of exposure to bloodborne pathogens due to:\n- Regular contact with patient blood and saliva\n- Use of sharp instruments and needles\n- Aerosol-generating procedures\n- Potential for splashes and splatters\n\n### Key Requirements of the Standard\n\nThe Bloodborne Pathogens Standard requires employers to:\n\n1. **Develop an Exposure Control Plan** - A written plan outlining how the practice will protect employees\n2. **Provide Training** - Annual training for all employees with occupational exposure\n3. **Offer Hepatitis B Vaccination** - Free vaccination within 10 days of initial assignment\n4. **Implement Engineering Controls** - Safer devices, sharps containers, etc.\n5. **Provide Personal Protective Equipment** - At no cost to employees\n6. **Maintain Records** - Training records, medical records, and sharps injury logs\n\n### Penalties for Non-Compliance\n\nOSHA takes bloodborne pathogen violations seriously:\n\n| Violation Type | Maximum Penalty |\n|----------------|-----------------|\n| Serious Violation | $15,625 per violation |\n| Willful Violation | $156,259 per violation |\n| Repeated Violation | $156,259 per violation |\n| Failure to Abate | $15,625 per day |\n\n*Penalty amounts are adjusted annually for inflation*"
      },
      {
        "id": "section-2",
        "type": "text",
        "title": "What Are Bloodborne Pathogens?",
        "content": "## Bloodborne Pathogens Defined\n\n**Bloodborne pathogens** are infectious microorganisms present in human blood that can cause disease in humans. The three primary bloodborne pathogens of concern in healthcare settings are:\n\n### Hepatitis B Virus (HBV)\n\n- **Transmission:** Blood, semen, vaginal fluids, and other body fluids\n- **Survival outside body:** Up to 7 days on environmental surfaces\n- **Risk after needlestick:** 6-30% chance of infection\n- **Prevention:** Highly effective vaccine available (97% effective)\n- **Symptoms:** May be asymptomatic, or cause fatigue, jaundice, abdominal pain\n- **Chronic infection:** 2-6% of infected adults develop chronic infection\n\n### Hepatitis C Virus (HCV)\n\n- **Transmission:** Primarily blood-to-blood contact\n- **Survival outside body:** Up to 3 weeks under optimal conditions\n- **Risk after needlestick:** 1.8% average chance of infection\n- **Prevention:** No vaccine available - prevention is critical\n- **Symptoms:** Often asymptomatic for decades\n- **Chronic infection:** 75-85% of infected individuals develop chronic infection\n\n### Human Immunodeficiency Virus (HIV)\n\n- **Transmission:** Blood, semen, vaginal fluids, breast milk\n- **Survival outside body:** Minutes to hours (fragile virus)\n- **Risk after needlestick:** 0.3% average chance of infection\n- **Prevention:** No vaccine - post-exposure prophylaxis (PEP) available\n- **Progression:** Without treatment, progresses to AIDS\n\n### Other Potentially Infectious Materials (OPIM)\n\nBeyond blood, OSHA''s standard also covers:\n- Semen and vaginal secretions\n- Cerebrospinal, synovial, pleural, pericardial, peritoneal, and amniotic fluids\n- Saliva in dental procedures\n- Any body fluid visibly contaminated with blood\n- Unfixed human tissues or organs\n- Cell or tissue cultures containing HIV/HBV"
      },
      {
        "id": "section-3",
        "type": "text",
        "title": "Exposure Risks in Dental Settings",
        "content": "## Understanding Your Exposure Risk\n\nDental healthcare workers face unique exposure risks due to the nature of dental procedures. Understanding these risks helps you protect yourself.\n\n### High-Risk Situations in Dentistry\n\n**Percutaneous Injuries (Needlesticks and Sharps)**\n- Administering local anesthesia\n- Recapping needles (NEVER do this!)\n- Passing instruments\n- Cleaning instruments before sterilization\n- Disposing of sharps improperly\n\n**Mucous Membrane Exposures**\n- Eye splashes during procedures\n- Oral splashes\n- Exposure through cuts or abrasions on hands\n\n**Aerosol Exposure**\n- High-speed handpiece use\n- Ultrasonic scaling\n- Air/water syringe use\n- Polishing procedures\n\n### Exposure Statistics\n\nAccording to CDC data:\n- Dental professionals experience approximately **2 needlesticks per year** on average\n- **14% of dental workers** report at least one needlestick injury\n- Most injuries occur during:\n  - Injection (32%)\n  - Recapping needles (15%)\n  - Cleaning instruments (12%)\n  - Passing instruments (10%)\n\n### Routes of Transmission\n\nFor a bloodborne pathogen infection to occur, these conditions must be met:\n\n1. **Source** - An infected person''s blood or OPIM must be present\n2. **Vehicle** - The pathogen must have a way to travel (needle, splash, etc.)\n3. **Portal of Entry** - The pathogen must enter your body through:\n   - Broken skin (cuts, abrasions, dermatitis, acne)\n   - Mucous membranes (eyes, nose, mouth)\n   - Parenteral route (needlestick, cut, bite)\n4. **Susceptible Host** - You must be susceptible to the infection\n\n**Breaking any link in this chain prevents transmission!**"
      },
      {
        "id": "section-4",
        "type": "text",
        "title": "The Exposure Control Plan",
        "content": "## Your Practice''s Exposure Control Plan (ECP)\n\nThe Exposure Control Plan is a written document that outlines how your practice protects employees from bloodborne pathogen exposure. **Every dental practice must have an ECP**, and you need to know what it contains and where to find it.\n\n### Where to Find Your ECP\n\nYour practice''s Exposure Control Plan is located:\n- **Ask your supervisor** if you don''t know where it is\n- Common locations: Office manager''s desk, break room, OSHA compliance binder\n- It must be **accessible to all employees** during work hours\n\n### Required Elements of an ECP\n\nYour Exposure Control Plan must include:\n\n**1. Exposure Determination**\n- Lists all job classifications with occupational exposure\n- Lists specific tasks and procedures that may result in exposure\n- Made without regard to PPE use\n\n**2. Methods of Compliance**\n- Universal/Standard Precautions implementation\n- Engineering controls (sharps containers, safety devices)\n- Work practice controls (no recapping, hand hygiene)\n- Personal protective equipment requirements\n- Housekeeping schedules and procedures\n\n**3. Hepatitis B Vaccination Program**\n- Free vaccination offered within 10 days of hire\n- Declination process and form\n- Post-exposure vaccination options\n\n**4. Post-Exposure Evaluation and Follow-up**\n- Reporting procedures\n- Medical evaluation process\n- Documentation requirements\n\n**5. Training Requirements**\n- Initial and annual training\n- Training content requirements\n- Record-keeping\n\n### Annual Review Requirement\n\nThe ECP must be reviewed and updated **at least annually** and whenever:\n- New tasks or procedures are introduced\n- New positions are created with occupational exposure\n- Employee feedback indicates the plan needs revision\n- After an exposure incident to evaluate if changes are needed"
      },
      {
        "id": "section-5",
        "type": "text",
        "title": "Universal/Standard Precautions",
        "content": "## The Foundation of Infection Control\n\n**Universal Precautions** (also called **Standard Precautions**) is the single most important concept in preventing bloodborne pathogen transmission. This approach treats ALL human blood and certain body fluids as if they ARE infectious.\n\n### The Core Principle\n\n> **Treat every patient''s blood and body fluids as if they are infected with HIV, HBV, and HCV.**\n\nWhy? Because:\n- You cannot tell by looking at someone if they have a bloodborne infection\n- Many infected individuals don''t know they''re infected\n- Patients may not disclose their status\n- Medical histories can be incomplete or inaccurate\n\n### What Universal Precautions Covers\n\nApply Universal Precautions to:\n\n| Always Treat as Infectious | Apply Precautions When Visibly Contaminated |\n|---------------------------|---------------------------------------------|\n| Blood | Feces |\n| Semen | Nasal secretions |\n| Vaginal secretions | Saliva (non-dental) |\n| Cerebrospinal fluid | Sputum |\n| Synovial fluid | Sweat |\n| Pleural fluid | Tears |\n| Pericardial fluid | Urine |\n| Peritoneal fluid | Vomitus |\n| Amniotic fluid | |\n| **Saliva in dental procedures** | |\n\n### Implementing Universal Precautions\n\nIn practice, this means you should:\n\n1. **Wear appropriate PPE** for every patient encounter\n2. **Handle all sharps carefully** as if contaminated\n3. **Clean and disinfect surfaces** after every patient\n4. **Dispose of waste properly** following biohazard protocols\n5. **Wash hands** before and after every patient contact\n6. **Never assume** a patient is \"low risk\"\n\n### Common Mistakes to Avoid\n\n- Skipping PPE for \"quick procedures\"\n- Not wearing eye protection because \"I''ll be careful\"\n- Assuming long-term patients are \"safe\"\n- Treating new patients differently than established ones"
      },
      {
        "id": "section-6",
        "type": "text",
        "title": "Personal Protective Equipment (PPE)",
        "content": "## Personal Protective Equipment in Dentistry\n\nPPE creates a barrier between you and potentially infectious materials. Your employer must provide PPE at no cost to you, ensure it''s properly maintained, and provide training on its use.\n\n### Types of PPE in Dental Settings\n\n**Gloves**\n- **When to wear:** ALL patient contact, handling contaminated items\n- **Types:** Non-sterile exam gloves for routine procedures; sterile surgical gloves for surgery\n- **Material options:** Latex, nitrile, vinyl (nitrile recommended for latex sensitivities)\n- **Key rules:**\n  - Change between patients\n  - Change if torn or punctured\n  - Never wash and reuse\n  - Double-glove for high-risk procedures\n\n**Masks**\n- **When to wear:** Procedures likely to generate splashes, sprays, or aerosols\n- **Types:** Surgical masks, N95 respirators (for airborne precautions)\n- **Key rules:**\n  - Must be fluid-resistant\n  - Change if wet, soiled, or after aerosol-generating procedures\n  - Should fit snugly\n\n**Eye Protection**\n- **When to wear:** Any procedure that may generate splashes or spray\n- **Types:** Safety glasses with side shields, goggles, face shields\n- **Key rules:**\n  - Prescription glasses alone are NOT adequate\n  - Must have side protection\n  - Clean between patients\n  - Face shields provide the best protection\n\n**Protective Clothing**\n- **When to wear:** Procedures likely to generate splashes or contact with blood/OPIM\n- **Types:** Gowns, lab coats, clinic jackets\n- **Key rules:**\n  - Remove before leaving work area\n  - Change if visibly soiled\n  - Employer must launder (employees cannot take home)\n\n### PPE Selection Guidelines\n\n| Procedure Type | Minimum PPE Required |\n|----------------|---------------------|\n| Patient examination | Gloves, mask, eyewear |\n| Routine restorative | Gloves, mask, eyewear, protective clothing |\n| Scaling/cleaning | Gloves, mask, eyewear, protective clothing |\n| Oral surgery | Gloves, mask, eyewear, gown, head cover |\n| Instrument cleaning | Heavy-duty utility gloves, mask, eyewear, protective clothing |"
      },
      {
        "id": "section-7",
        "type": "scenario",
        "title": "PPE Selection Scenario",
        "prompt": "You are about to perform an ultrasonic scaling procedure on a patient. Which PPE combination is MOST appropriate?",
        "options": [
          "Exam gloves and surgical mask only",
          "Exam gloves, surgical mask, and regular prescription glasses",
          "Exam gloves, surgical mask, protective eyewear with side shields, and a gown/clinic jacket",
          "Sterile surgical gloves, N95 respirator, face shield, and sterile gown"
        ],
        "correct": 2,
        "explanation": "**Correct Answer: Exam gloves, surgical mask, protective eyewear with side shields, and a gown/clinic jacket**\n\nUltrasonic scaling generates significant aerosols and splatter, requiring comprehensive protection:\n\n- **Exam gloves** - Appropriate for non-surgical procedures\n- **Surgical mask** - Protects against aerosols and splatter\n- **Protective eyewear with side shields** - Regular prescription glasses don''t provide adequate splash protection\n- **Gown/clinic jacket** - Protects clothing from splatter\n\nThe first option lacks eye protection and protective clothing. The second option doesn''t include proper eye protection (regular glasses aren''t adequate). The fourth option is excessive for a routine scaling procedure - N95 respirators and sterile surgical gear are reserved for surgical procedures or airborne disease precautions."
      },
      {
        "id": "section-8",
        "type": "text",
        "title": "Hand Hygiene",
        "content": "## Hand Hygiene: Your First Line of Defense\n\nProper hand hygiene is the single most effective way to prevent the spread of infections. In dental settings, you should clean your hands numerous times throughout the day.\n\n### When to Perform Hand Hygiene\n\n**Wash or sanitize your hands:**\n\n- Before putting on gloves\n- After removing gloves\n- After touching contaminated surfaces\n- Before and after eating\n- After using the restroom\n- After touching your face, hair, or body\n- Before and after patient contact (even with gloves)\n- When moving from contaminated to clean areas\n\n### Handwashing vs. Hand Sanitizer\n\n| Use Soap and Water When: | Use Alcohol-Based Sanitizer When: |\n|--------------------------|-----------------------------------|\n| Hands are visibly soiled | Hands are not visibly soiled |\n| Before eating | Between routine patient contacts |\n| After using restroom | Quick decontamination needed |\n| After contact with blood/OPIM | Soap and water not immediately available |\n| Beginning and end of day | |\n\n### Proper Handwashing Technique\n\n1. **Wet** hands with warm water\n2. **Apply** soap and work into lather\n3. **Scrub** all surfaces for at least 20 seconds:\n   - Palms\n   - Back of hands\n   - Between fingers\n   - Under nails\n   - Wrists\n4. **Rinse** thoroughly under running water\n5. **Dry** with clean paper towel\n6. **Use paper towel** to turn off faucet\n\n**Tip:** Sing \"Happy Birthday\" twice = approximately 20 seconds\n\n### Proper Hand Sanitizer Technique\n\n1. Apply a quarter-sized amount to palm\n2. Rub all surfaces of hands and fingers\n3. Continue rubbing until completely dry (15-20 seconds)\n4. Do not wipe or rinse off\n\n**Important:** Hand sanitizer must contain at least **60% alcohol** to be effective\n\n### Common Hand Hygiene Mistakes\n\n- Not washing long enough\n- Missing areas between fingers and under nails\n- Not changing gloves between patients\n- Assuming gloves replace handwashing\n- Using hand sanitizer when hands are visibly soiled"
      },
      {
        "id": "section-9",
        "type": "text",
        "title": "Sharps Safety",
        "content": "## Preventing Needlestick and Sharps Injuries\n\nSharps injuries are the most common cause of bloodborne pathogen exposure in dental settings. Most of these injuries are **preventable** through proper handling techniques and engineering controls.\n\n### What Are Sharps?\n\nAny object that can penetrate skin, including:\n- Needles and syringes\n- Scalpel blades\n- Broken glass\n- Orthodontic wires\n- Dental burs\n- Explorers and scalers\n- Contaminated broken instruments\n\n### The Cardinal Rules of Sharps Safety\n\n**NEVER RECAP NEEDLES!**\nThis is the #1 cause of needlestick injuries. If recapping is absolutely necessary, use the one-handed scoop technique.\n\n**Pass sharps safely**\n- Use neutral zones for instrument passing\n- Announce when passing sharps\n- Hand instruments handle-first\n\n**Dispose immediately**\n- Place sharps directly into sharps container\n- Never overfill containers (fill line = maximum)\n- Never reach into sharps containers\n\n### Engineering Controls for Sharps Safety\n\nYour practice should use these safer devices:\n\n**Self-sheathing needles** - Automatically cover needle after use\n**Retractable needles** - Needle retracts into syringe\n**Blunted suture needles** - Where appropriate for the procedure\n**Safety scalpels** - Retractable or shielded blades\n**Needleless systems** - For certain applications\n\n### The One-Handed Scoop Technique\n\nIf you must recap a needle (only when no alternative exists):\n\n1. Place the cap on a flat surface\n2. Using one hand, \"scoop\" the cap onto the needle\n3. Once the cap is on the needle, use your other hand to secure it\n4. Never hold the cap with your fingers while recapping\n\n### Sharps Container Requirements\n\n- Puncture-resistant\n- Leak-proof\n- Labeled with biohazard symbol\n- Located as close as practical to use area\n- Replaced when 3/4 full (at the fill line)\n- Never overfilled, reached into, or emptied"
      },
      {
        "id": "section-10",
        "type": "scenario",
        "title": "Needlestick Response Scenario",
        "prompt": "While removing a needle from a patient''s mouth, you accidentally stick your finger through your glove. The patient''s blood is visible on the needle. What is the FIRST thing you should do?",
        "options": [
          "Immediately squeeze the puncture site to push out any contaminated blood",
          "Finish the procedure first, then report the incident to your supervisor",
          "Remove your glove and immediately wash the wound with soap and water",
          "Apply a bandage and continue treating the patient"
        ],
        "correct": 2,
        "explanation": "**Correct Answer: Remove your glove and immediately wash the wound with soap and water**\n\nThe immediate first step after a needlestick injury is to wash the wound:\n\n1. **Remove the glove** and wash immediately\n2. **Wash the puncture site** with soap and water for several minutes\n3. **Do NOT squeeze** the wound - this does not help and may increase damage\n4. **Let it bleed freely** for a short time while washing\n5. **Report immediately** to your supervisor\n6. **Document** the incident\n7. **Seek medical evaluation** - post-exposure prophylaxis must be started within hours for maximum effectiveness\n\n**Why the other answers are wrong:**\n- **Squeezing the wound** is not recommended and may cause more trauma\n- **Finishing the procedure first** delays critical treatment - time is essential for post-exposure prophylaxis\n- **Just applying a bandage** fails to decontaminate the wound and delays reporting"
      },
      {
        "id": "section-11",
        "type": "text",
        "title": "Hepatitis B Vaccination",
        "content": "## Your Right to the Hepatitis B Vaccine\n\nUnder the Bloodborne Pathogens Standard, your employer must offer you the Hepatitis B vaccine **at no cost** if you have occupational exposure to blood or OPIM.\n\n### Key Vaccine Requirements\n\n**Timing**\n- Must be offered within **10 working days** of initial assignment to a job with occupational exposure\n- Offered after required bloodborne pathogens training\n\n**Cost**\n- Completely FREE to employees\n- Includes all doses and follow-up testing\n- No deductibles, copays, or waiting periods\n\n**Vaccination Schedule**\n- Series of 3 shots over 6 months\n- Dose 1: Initial\n- Dose 2: 1 month after first dose\n- Dose 3: 6 months after first dose\n- Post-vaccination testing: 1-2 months after third dose\n\n### Why Get Vaccinated?\n\nThe Hepatitis B vaccine is:\n- **97% effective** after completing the series\n- The **only vaccine** available for any bloodborne pathogen we discuss\n- **Safe** with minimal side effects\n- **Long-lasting** protection (possibly lifetime)\n\nHepatitis B is:\n- **100 times more infectious** than HIV\n- Capable of causing **chronic liver disease and cancer**\n- **Preventable** with vaccination\n\n### Declining the Vaccine\n\nYou have the right to decline the vaccine, but:\n\n1. You must sign a **declination form** (specific OSHA language required)\n2. The declination will be kept in your personnel file\n3. You can **change your mind** and receive the vaccine later at no cost\n4. Your employer must document your decision\n\n### If You Were Vaccinated Elsewhere\n\nIf you''ve already received the HBV vaccine series:\n- Provide documentation to your employer\n- No need to repeat the series\n- Your employer should keep this record on file"
      },
      {
        "id": "section-12",
        "type": "text",
        "title": "Exposure Incident Procedures",
        "content": "## What to Do After an Exposure Incident\n\nAn **exposure incident** is a specific eye, mouth, other mucous membrane, non-intact skin, or parenteral contact with blood or other potentially infectious materials. Knowing how to respond can be critical to your health.\n\n### Immediate Steps (Within Minutes)\n\n**For Needlestick/Cut:**\n1. Wash the wound with soap and water for several minutes\n2. Allow the wound to bleed freely (do not squeeze)\n3. Apply antiseptic and bandage\n\n**For Splash to Eyes/Mucous Membranes:**\n1. Flush with water or saline for at least 15 minutes\n2. For eyes: Use eyewash station or clean running water\n3. For mouth: Rinse repeatedly with water\n\n**For Splash to Skin:**\n1. Wash immediately with soap and water\n2. If skin is intact, risk is minimal\n\n### Reporting Requirements\n\n**Report to your supervisor IMMEDIATELY**\n- Time is critical for post-exposure prophylaxis\n- For HIV exposure, PEP should start within 2 hours if possible\n- Never delay reporting\n\n**Information to document:**\n- Date and time of exposure\n- How the exposure occurred\n- Type of potentially infectious material\n- Source individual (if known)\n- Your job duties at time of exposure\n- PPE you were wearing\n- Actions taken post-exposure\n\n### Post-Exposure Medical Evaluation\n\nYour employer must provide a **confidential medical evaluation** including:\n\n1. **Documentation** of the route of exposure and circumstances\n2. **Source individual testing** (with consent)\n   - If source refuses or is unknown, document this\n   - If source is HBV/HCV/HIV positive, you''ll be notified\n3. **Your blood testing**\n   - Baseline and follow-up testing\n   - You can decline but should consider carefully\n4. **Counseling** on:\n   - Risk of infection\n   - Available post-exposure treatments\n   - Need for follow-up testing\n   - Precautions during follow-up period\n\n### Post-Exposure Prophylaxis (PEP)\n\n**For HIV Exposure:**\n- PEP involves taking antiretroviral medications\n- Most effective when started within 2 hours\n- Must be started within 72 hours maximum\n- Continued for 28 days\n- Reduces infection risk by ~80%\n\n**For HBV Exposure:**\n- If unvaccinated: Begin vaccine series + HBIG\n- If vaccinated with adequate response: Nothing needed\n- If vaccinated with inadequate response: HBIG + vaccine booster\n\n**For HCV Exposure:**\n- No prophylaxis available\n- Close monitoring for early detection and treatment\n\n### Your Rights After an Exposure\n\n- Confidential evaluation and testing\n- Healthcare provider''s written opinion within 15 days\n- Employer cannot terminate or retaliate against you\n- Right to refuse testing (though not recommended)"
      },
      {
        "id": "section-13",
        "type": "text",
        "title": "Housekeeping & Decontamination",
        "content": "## Maintaining a Safe Work Environment\n\nProper housekeeping and decontamination prevent indirect transmission of bloodborne pathogens through contaminated surfaces and equipment.\n\n### Work Surface Decontamination\n\n**Clean and decontaminate work surfaces:**\n- After each patient\n- When visibly contaminated\n- At the end of the work shift\n- After any spill of blood or OPIM\n\n**Approved disinfectants for bloodborne pathogens:**\n- EPA-registered tuberculocidal disinfectants\n- EPA-registered products effective against HIV and HBV\n- Diluted bleach solution (1:10 to 1:100 depending on use)\n\n**Decontamination procedure:**\n1. Put on appropriate PPE (utility gloves, eyewear)\n2. Remove visible organic material\n3. Apply disinfectant according to manufacturer''s instructions\n4. Allow proper contact time (usually 1-10 minutes)\n5. Wipe or allow to air dry per product instructions\n\n### Equipment Decontamination\n\n**Reusable equipment** must be decontaminated before servicing or reuse:\n- Follow manufacturer''s guidelines\n- Use appropriate disinfectant or sterilization method\n- Document sterilization cycles\n\n**Equipment that cannot be decontaminated:**\n- Must be labeled with biohazard warning\n- State which portions are contaminated\n\n### Contaminated Laundry\n\n- Handle as little as possible\n- Do not sort or rinse in patient care areas\n- Bag at location where used\n- If saturated, use leak-proof bag\n- Employer must launder or contract laundering\n- Employees CANNOT take contaminated laundry home\n\n### Regulated Waste Disposal\n\n**What is regulated waste?**\n- Liquid or semi-liquid blood/OPIM\n- Items caked with dried blood/OPIM that can release during handling\n- Contaminated sharps\n- Pathological waste containing blood/OPIM\n\n**Disposal requirements:**\n- Place in closable, leak-proof containers\n- Label with biohazard symbol OR use red containers\n- Dispose through licensed medical waste hauler\n- Document all waste pickups\n\n### Spill Cleanup Procedure\n\n1. **Alert others** - Keep people away from the area\n2. **Get PPE** - At minimum: utility gloves, eye protection, gown\n3. **Contain the spill** - Use absorbent material around edges\n4. **Remove bulk material** - Scoop up with disposable tools\n5. **Disinfect** - Apply appropriate disinfectant, allow contact time\n6. **Clean** - Remove disinfectant and remaining debris\n7. **Dispose** - Place all materials in biohazard container\n8. **Wash hands** - Even after removing gloves"
      },
      {
        "id": "section-14",
        "type": "text",
        "title": "Labels and Signs",
        "content": "## Biohazard Labels and Signs\n\nWarning labels and signs are critical for communicating the presence of bloodborne pathogen hazards. They alert employees and others to potential dangers and required precautions.\n\n### The Biohazard Symbol\n\nThe universal biohazard symbol must appear on:\n\n- Containers of regulated waste\n- Refrigerators/freezers containing blood or OPIM\n- Containers used to store, transport, or ship blood/OPIM\n- Contaminated equipment being shipped or serviced\n- Bags containing contaminated laundry\n- Sharps disposal containers\n- Entrances to HIV/HBV research laboratories\n\n### Label Requirements\n\n**Labels must be:**\n- Fluorescent orange or orange-red\n- Include the biohazard symbol\n- Include the word \"BIOHAZARD\"\n- Affixed to the container by string, wire, adhesive, or other method\n\n**Exception - Red bags/containers:**\n- Red bags or red containers can substitute for labels\n- Must be recognizable as biohazardous material containers\n\n### What Must Be Labeled\n\n| Item | Labeling Requirement |\n|------|---------------------|\n| Sharps containers | Biohazard label OR red color |\n| Regulated waste containers | Biohazard label OR red color |\n| Specimen containers | Biohazard label (if leaving facility) |\n| Contaminated equipment | Biohazard label stating contaminated portions |\n| Contaminated laundry bags | Biohazard label OR red bag |\n| Blood refrigerators | Biohazard label |\n\n### Signs for Laboratory Areas\n\nHIV/HBV research labs and production facilities require entrance signs showing:\n- Biohazard symbol\n- Name of infectious agent\n- Special requirements for entry\n- Name and phone number of responsible person\n\n### What Does NOT Require Labels\n\n- Individual containers of blood/specimens that remain within the facility AND use Universal Precautions AND are recognizable as blood/specimens\n- Regulated waste that has been decontaminated\n- Laundry processed in-facility using Universal Precautions"
      },
      {
        "id": "section-15",
        "type": "scenario",
        "title": "Contamination Cleanup Scenario",
        "prompt": "A patient accidentally knocks over a container, spilling blood on the operatory floor. What is the CORRECT sequence of steps to clean this spill?",
        "options": [
          "Wipe up blood with paper towels, spray with surface cleaner, wipe dry",
          "Put on utility gloves and eyewear, contain spill, absorb blood, apply disinfectant, allow contact time, clean up, dispose in biohazard container",
          "Call housekeeping to handle the spill",
          "Immediately apply bleach directly to the spill, then wipe clean with paper towels"
        ],
        "correct": 1,
        "explanation": "**Correct Answer: Put on utility gloves and eyewear, contain spill, absorb blood, apply disinfectant, allow contact time, clean up, dispose in biohazard container**\n\nThe correct blood spill cleanup procedure:\n\n1. **Don appropriate PPE** - Heavy-duty utility gloves (not exam gloves) and eye protection at minimum\n2. **Contain the spill** - Prevent it from spreading\n3. **Remove bulk material** - Use absorbent materials or scoop tools\n4. **Apply disinfectant** - EPA-registered tuberculocidal or HIV/HBV effective product\n5. **Allow proper contact time** - Usually 1-10 minutes per manufacturer instructions\n6. **Clean the area** - Remove disinfectant and remaining material\n7. **Dispose properly** - All contaminated materials go in biohazard container\n8. **Remove PPE and wash hands**\n\n**Why the other answers are wrong:**\n- **First option** uses inadequate disinfectant (surface cleaner) and no PPE\n- **Third option** delays cleanup and may not be available; you should be trained to handle this\n- **Fourth option** skips PPE and doesn''t allow proper contact time for disinfection"
      }
    ],
    "quiz": {
      "questions": [
        {
          "id": "q1",
          "question": "Which federal agency enforces the Bloodborne Pathogens Standard (29 CFR 1910.1030)?",
          "options": ["CDC", "OSHA", "FDA", "EPA"],
          "correct": 1
        },
        {
          "id": "q2",
          "question": "Which of the following bloodborne pathogens can survive on environmental surfaces for up to 7 days?",
          "options": ["HIV", "Hepatitis B", "Hepatitis C", "All of the above"],
          "correct": 1
        },
        {
          "id": "q3",
          "question": "What is the risk of HIV infection after a needlestick exposure from an HIV-positive source?",
          "options": ["0.3% average", "3% average", "30% average", "0.03% average"],
          "correct": 0
        },
        {
          "id": "q4",
          "question": "Universal Precautions require you to treat which materials as infectious?",
          "options": [
            "Only blood from patients with known HIV/HBV",
            "All blood and certain body fluids from all patients",
            "Only visibly contaminated materials",
            "Blood from emergency patients only"
          ],
          "correct": 1
        },
        {
          "id": "q5",
          "question": "According to OSHA regulations, when must the Exposure Control Plan be reviewed and updated?",
          "options": [
            "Every 5 years",
            "Only when requested by OSHA",
            "At least annually",
            "Every 2 years"
          ],
          "correct": 2
        },
        {
          "id": "q6",
          "question": "Which type of gloves should be worn when manually cleaning instruments before sterilization?",
          "options": [
            "Standard exam gloves",
            "Sterile surgical gloves",
            "Heavy-duty utility gloves",
            "No gloves if instruments are pre-soaked"
          ],
          "correct": 2
        },
        {
          "id": "q7",
          "question": "How long should you wash your hands with soap and water?",
          "options": ["5 seconds", "10 seconds", "At least 20 seconds", "60 seconds"],
          "correct": 2
        },
        {
          "id": "q8",
          "question": "What is the primary cause of needlestick injuries in dental settings?",
          "options": [
            "Passing instruments",
            "Recapping needles",
            "Disposing of sharps",
            "Giving injections"
          ],
          "correct": 1
        },
        {
          "id": "q9",
          "question": "If you must recap a needle, which technique should you use?",
          "options": [
            "Two-handed technique for better control",
            "One-handed scoop technique",
            "Have a coworker hold the cap",
            "Needles should never be recapped under any circumstances"
          ],
          "correct": 1
        },
        {
          "id": "q10",
          "question": "When must the Hepatitis B vaccine be offered to employees with occupational exposure?",
          "options": [
            "Within 30 days of hire",
            "Within 10 working days of initial assignment",
            "Within 90 days of hire",
            "After 6 months of employment"
          ],
          "correct": 1
        },
        {
          "id": "q11",
          "question": "What is the effectiveness rate of the Hepatitis B vaccine after completing the full series?",
          "options": ["50%", "75%", "97%", "100%"],
          "correct": 2
        },
        {
          "id": "q12",
          "question": "After a needlestick injury, what should you do FIRST?",
          "options": [
            "Report to your supervisor",
            "Document the incident",
            "Wash the wound with soap and water",
            "Identify the source patient"
          ],
          "correct": 2
        },
        {
          "id": "q13",
          "question": "For maximum effectiveness, HIV post-exposure prophylaxis (PEP) should ideally be started within:",
          "options": ["2 hours", "24 hours", "72 hours", "1 week"],
          "correct": 0
        },
        {
          "id": "q14",
          "question": "Sharps containers should be replaced when they reach what level?",
          "options": ["Completely full", "The fill line (approximately 3/4 full)", "Half full", "Only when they smell"],
          "correct": 1
        },
        {
          "id": "q15",
          "question": "Which of the following is NOT required on a biohazard label?",
          "options": [
            "The biohazard symbol",
            "Fluorescent orange or orange-red color",
            "The word \"BIOHAZARD\"",
            "The specific pathogen name"
          ],
          "correct": 3
        },
        {
          "id": "q16",
          "question": "When using an alcohol-based hand sanitizer, what is the minimum alcohol concentration required?",
          "options": ["30%", "45%", "60%", "90%"],
          "correct": 2
        },
        {
          "id": "q17",
          "question": "How often should work surfaces be decontaminated at minimum?",
          "options": [
            "Once per day",
            "Once per week",
            "After each patient and at end of shift",
            "Only when visibly contaminated"
          ],
          "correct": 2
        },
        {
          "id": "q18",
          "question": "Who is responsible for laundering contaminated work clothing?",
          "options": [
            "The employee",
            "The employer",
            "A family member",
            "The employee at their own expense"
          ],
          "correct": 1
        },
        {
          "id": "q19",
          "question": "What is the maximum penalty for a willful OSHA violation of the Bloodborne Pathogens Standard?",
          "options": [
            "$15,625 per violation",
            "$78,125 per violation",
            "$156,259 per violation",
            "$500,000 per violation"
          ],
          "correct": 2
        },
        {
          "id": "q20",
          "question": "If an employee declines the Hepatitis B vaccine, what must they do?",
          "options": [
            "Nothing - verbal refusal is sufficient",
            "Sign a specific OSHA-required declination form",
            "Provide a doctor''s note",
            "Pay for their own medical monitoring"
          ],
          "correct": 1
        }
      ]
    }
  }',
  updated_at = NOW()
WHERE type = 'osha' AND title LIKE '%Bloodborne%';

-- Update HIPAA Privacy & Security Training
UPDATE training_modules
SET
  duration_minutes = 45,
  content_json = '{
    "sections": [
      {
        "id": "section-1",
        "type": "text",
        "title": "What is HIPAA?",
        "content": "## The Health Insurance Portability and Accountability Act\n\nHIPAA was enacted by Congress in 1996 to:\n- Improve the portability and continuity of health insurance coverage\n- Combat waste, fraud, and abuse in health insurance and healthcare delivery\n- **Protect the privacy and security of health information**\n\n### Why HIPAA Matters in Dentistry\n\nEvery dental practice handles sensitive patient information daily, including:\n- Medical and dental histories\n- Treatment records and X-rays\n- Insurance information\n- Payment records\n- Personal contact information\n\n**HIPAA compliance is not optional** - it''s federal law, and violations can result in significant penalties and damage to your practice''s reputation.\n\n### Who Must Comply with HIPAA?\n\n**Covered Entities:**\n- Healthcare providers who transmit health information electronically\n- Health plans (insurance companies)\n- Healthcare clearinghouses\n\n**Business Associates:**\n- Third parties who handle PHI on behalf of covered entities\n- Examples: Billing companies, IT service providers, cloud storage vendors\n\n### The Three Main HIPAA Rules\n\n| Rule | Purpose |\n|------|--------|\n| **Privacy Rule** | Establishes standards for protecting patient health information |\n| **Security Rule** | Sets requirements for safeguarding electronic PHI |\n| **Breach Notification Rule** | Requires notification when unsecured PHI is compromised |\n\n### HIPAA Enforcement\n\nThe Office for Civil Rights (OCR) at the U.S. Department of Health and Human Services (HHS) enforces HIPAA. State attorneys general can also enforce HIPAA provisions."
      },
      {
        "id": "section-2",
        "type": "text",
        "title": "Protected Health Information (PHI)",
        "content": "## Understanding Protected Health Information\n\n**Protected Health Information (PHI)** is any information that:\n1. Relates to an individual''s past, present, or future health condition, treatment, or payment for healthcare\n2. Identifies the individual OR could reasonably be used to identify the individual\n3. Is created, received, maintained, or transmitted by a covered entity\n\n### The 18 HIPAA Identifiers\n\nHIPAA specifically identifies 18 types of information that can identify an individual:\n\n| # | Identifier | Examples |\n|---|------------|----------|\n| 1 | Name | First name, last name, maiden name |\n| 2 | Geographic data | Address, city, ZIP code (anything smaller than state) |\n| 3 | Dates | Birth date, admission date, discharge date, death date |\n| 4 | Phone numbers | Home, work, cell numbers |\n| 5 | Fax numbers | Personal or work fax |\n| 6 | Email addresses | Personal or work email |\n| 7 | Social Security numbers | Full or partial SSN |\n| 8 | Medical record numbers | Your practice''s MRN |\n| 9 | Health plan beneficiary numbers | Insurance ID numbers |\n| 10 | Account numbers | Patient account numbers |\n| 11 | Certificate/license numbers | Professional licenses |\n| 12 | Vehicle identifiers | License plate, VIN |\n| 13 | Device identifiers | Medical device serial numbers |\n| 14 | Web URLs | Patient-specific web addresses |\n| 15 | IP addresses | Computer network addresses |\n| 16 | Biometric identifiers | Fingerprints, voice prints |\n| 17 | Full-face photographs | Photos showing the patient''s face |\n| 18 | Any other unique identifying number | Any code that could identify the patient |\n\n### What IS Protected Health Information?\n\n- Patient name + diagnosis\n- Appointment schedule with patient names\n- Insurance claim with patient information\n- X-rays with patient identifiers\n- Treatment notes\n- Email containing patient health information\n\n### What is NOT Protected Health Information?\n\n- Information that has been properly de-identified\n- Education records covered by FERPA\n- Employment records held by a covered entity as an employer\n- General health information not linked to a specific patient\n\n### Electronic PHI (ePHI)\n\n**ePHI** is any PHI that is created, stored, transmitted, or received electronically. This includes:\n- Electronic health records\n- Digital X-rays\n- Email containing patient information\n- Text messages about patients\n- Information stored on computers, phones, or tablets"
      },
      {
        "id": "section-3",
        "type": "text",
        "title": "The Privacy Rule",
        "content": "## HIPAA Privacy Rule Overview\n\nThe Privacy Rule establishes national standards for protecting individuals'' medical records and other personal health information. It:\n- Sets limits on who can access PHI\n- Gives patients rights over their health information\n- Requires appropriate safeguards to protect privacy\n\n### The Minimum Necessary Standard\n\nOne of the most important Privacy Rule concepts:\n\n> **Use, disclose, and request only the minimum amount of PHI necessary to accomplish the intended purpose.**\n\n**Examples:**\n- A referring dentist needs to know about relevant dental history, not the patient''s entire medical record\n- The billing department needs insurance info and procedure codes, not clinical notes\n- A receptionist confirming an appointment doesn''t need to know the patient''s diagnosis\n\n**Exceptions to Minimum Necessary:**\n- Disclosures to the patient themselves\n- Uses for treatment purposes\n- Uses with valid patient authorization\n- Disclosures required by law\n- Disclosures to HHS for enforcement purposes\n\n### Uses vs. Disclosures\n\n**Use** = Sharing, employment, application, utilization, examination, or analysis of PHI **within** the organization\n\n**Disclosure** = Release, transfer, provision of access to, or divulging of PHI **outside** the organization\n\n### Permitted Uses and Disclosures\n\nPHI can be used/disclosed WITHOUT patient authorization for:\n\n**TPO - Treatment, Payment, and Healthcare Operations**\n- **Treatment:** Providing care, consulting with other providers\n- **Payment:** Billing, claims processing, eligibility verification\n- **Healthcare Operations:** Quality assessment, training, business management\n\n**Other Permitted Disclosures:**\n- Required by law\n- Public health activities\n- Victims of abuse, neglect, or domestic violence\n- Health oversight activities\n- Judicial and administrative proceedings\n- Law enforcement purposes (with restrictions)\n- To prevent serious threat to health or safety\n- Workers'' compensation cases\n\n### When Authorization IS Required\n\nYou MUST get written patient authorization to:\n- Use PHI for marketing purposes\n- Sell PHI\n- Disclose psychotherapy notes\n- Disclose to employers for employment decisions\n- Any use not otherwise permitted by HIPAA"
      },
      {
        "id": "section-4",
        "type": "text",
        "title": "The Security Rule",
        "content": "## HIPAA Security Rule Overview\n\nThe Security Rule requires covered entities to implement safeguards to protect electronic PHI (ePHI). It focuses on:\n- **Confidentiality** - ePHI is not available to unauthorized persons\n- **Integrity** - ePHI is not altered or destroyed improperly\n- **Availability** - ePHI is accessible when needed for patient care\n\n### The Three Types of Safeguards\n\n**1. Administrative Safeguards** (Management Actions)\n- Designate a Security Officer\n- Conduct risk assessments\n- Develop policies and procedures\n- Train workforce members\n- Establish sanctions for violations\n- Review system activity regularly\n- Manage access to ePHI\n- Incident response procedures\n\n**2. Physical Safeguards** (Protecting Physical Environment)\n- Facility access controls (locks, alarms)\n- Workstation use policies\n- Workstation security (screen positioning, auto-lock)\n- Device and media controls\n- Proper disposal of electronic media\n\n**3. Technical Safeguards** (Technology Protections)\n- Access controls (unique user IDs, passwords)\n- Audit controls (tracking who accesses what)\n- Integrity controls (preventing unauthorized changes)\n- Transmission security (encryption)\n- Automatic logoff\n- Authentication mechanisms\n\n### Required vs. Addressable Specifications\n\n**Required** = Must be implemented\n**Addressable** = Must assess and implement if reasonable; if not, document why and implement alternative\n\n| Safeguard Type | Required Examples | Addressable Examples |\n|----------------|-------------------|---------------------|\n| Administrative | Risk analysis, sanctions policy, training | Encryption of ePHI at rest |\n| Physical | Facility access controls | Device/media encryption |\n| Technical | Unique user ID, audit logs | Automatic logoff |\n\n### Risk Analysis Requirement\n\nEvery covered entity must:\n1. Identify where ePHI is created, received, maintained, or transmitted\n2. Identify potential threats and vulnerabilities\n3. Assess current security measures\n4. Determine likelihood and impact of threats\n5. Assign risk levels\n6. Implement measures to reduce risks to reasonable levels\n7. Document the analysis and actions taken"
      },
      {
        "id": "section-5",
        "type": "scenario",
        "title": "PHI Identification Scenario",
        "prompt": "A dental assistant posts on her personal Facebook page: \"Had a crazy day! That root canal on the elderly patient in chair 3 took forever. At least I got some great before/after photos for my portfolio!\" Is this a HIPAA violation?",
        "options": [
          "No, because she didn''t use the patient''s name",
          "No, because it was on her personal social media account",
          "Yes, because the information could potentially identify the patient",
          "Yes, but only if her coworkers are Facebook friends with her"
        ],
        "correct": 2,
        "explanation": "**Correct Answer: Yes, because the information could potentially identify the patient**\n\nThis is a HIPAA violation for several reasons:\n\n1. **PHI was disclosed:** The post reveals:\n   - A specific procedure (root canal)\n   - Physical description (elderly)\n   - Location (chair 3)\n   - Date (today)\n   - Photographs of the patient\n\n2. **The combination of identifiers matters:** Even without a name, the combination of date, procedure, location, age description, and photos could allow someone to identify the patient - especially other patients in the waiting room, staff, or anyone who knows the patient goes to that practice.\n\n3. **Photos require explicit authorization:** Clinical photographs can NEVER be shared on social media without explicit written authorization from the patient, regardless of whether identifying information is included.\n\n4. **Personal accounts don''t exempt you:** Using a personal social media account doesn''t make workplace information sharing legal. HIPAA applies regardless of the platform.\n\n**This could result in:**\n- Termination\n- HIPAA penalties up to $50,000 per violation\n- Potential civil lawsuit from the patient"
      },
      {
        "id": "section-6",
        "type": "text",
        "title": "Permitted Uses & Disclosures",
        "content": "## When Can You Share PHI?\n\nUnderstanding when you CAN share patient information is just as important as knowing when you cannot.\n\n### Treatment, Payment, and Healthcare Operations (TPO)\n\n**Treatment**\nYou may share PHI to provide, coordinate, or manage patient care:\n- Discussing a case with a specialist\n- Sending records to a referring provider\n- Consulting with other team members about treatment\n- Coordinating care with other healthcare providers\n\n**Payment**\nYou may share PHI for billing and payment activities:\n- Submitting claims to insurance\n- Verifying insurance coverage\n- Collecting payment from patients\n- Appealing claim denials\n\n**Healthcare Operations**\nYou may use PHI for normal business activities:\n- Quality improvement activities\n- Training new employees (with safeguards)\n- Compliance and auditing\n- Business planning and development\n- Case management and care coordination\n\n### Other Permitted Disclosures Without Authorization\n\n**Required by Law**\n- Court orders\n- Subpoenas (with proper limitations)\n- Reporting laws (abuse, neglect, certain diseases)\n\n**Public Health Activities**\n- Reporting communicable diseases\n- Reporting adverse drug events\n- Workplace medical surveillance\n\n**Abuse, Neglect, or Domestic Violence**\n- Reporting suspected child abuse\n- Reporting suspected elder abuse\n\n**To the Patient**\n- You can always give patients their own information\n- Cannot refuse access except in limited circumstances\n\n### The \"Incidental Use\" Exception\n\nCertain incidental uses/disclosures are permitted if:\n- Reasonable safeguards are in place\n- The minimum necessary standard is applied\n\n**Examples of Permissible Incidental Disclosures:**\n- A patient in the waiting room overhears a receptionist calling another patient''s name\n- A nurse discussing a patient''s condition with a doctor is overheard by a passerby\n\n**These are NOT incidental (they ARE violations):**\n- Leaving patient charts visible on a counter\n- Discussing patient information loudly in a public area\n- Posting the day''s patient schedule where visitors can see it"
      },
      {
        "id": "section-7",
        "type": "text",
        "title": "Patient Rights Under HIPAA",
        "content": "## Patient Rights You Must Respect\n\nHIPAA grants patients specific rights regarding their health information. You must be prepared to respond to these requests.\n\n### Right to Access\n\nPatients have the right to:\n- Obtain copies of their records\n- Receive records in electronic format if maintained electronically\n- Have records sent to a third party they designate\n\n**Your Responsibilities:**\n- Respond within 30 days (can extend once by 30 days)\n- May charge reasonable cost-based fees for copies\n- Must provide in format requested if readily producible\n- Can only deny in very limited circumstances\n\n### Right to Amend\n\nPatients can request amendments to their records if they believe information is inaccurate or incomplete.\n\n**Your Responsibilities:**\n- Respond within 60 days (can extend once by 30 days)\n- May deny if: information is accurate, not created by you, not part of designated record set\n- Must allow patient to submit statement of disagreement if denied\n- Must append amendment or disagreement statement to record\n\n### Right to Accounting of Disclosures\n\nPatients can request a list of disclosures made of their PHI.\n\n**What Must Be Included:**\n- Disclosures made in the past 6 years\n- Date of disclosure\n- Name of recipient\n- Brief description of information disclosed\n- Purpose of disclosure\n\n**What''s Excluded:**\n- Disclosures for TPO\n- Disclosures to the patient\n- Disclosures with patient authorization\n- Disclosures for national security purposes\n\n### Right to Request Restrictions\n\nPatients can ask to restrict uses/disclosures of their PHI.\n\n**Your Responsibilities:**\n- You are NOT required to agree (except in one case)\n- **Mandatory restriction:** If patient pays in full out-of-pocket and requests you not bill insurance, you MUST comply\n- If you agree to a restriction, you must honor it\n\n### Right to Confidential Communications\n\nPatients can request to receive communications:\n- At alternative locations (e.g., work instead of home)\n- By alternative means (e.g., email instead of phone)\n\n**Your Responsibilities:**\n- Must accommodate reasonable requests\n- Cannot require explanation for request\n\n### Right to Notice of Privacy Practices\n\nPatients must receive your Notice of Privacy Practices at first service or as soon as practical."
      },
      {
        "id": "section-8",
        "type": "scenario",
        "title": "Authorization Scenario",
        "prompt": "Dr. Smith calls your dental office requesting records for a mutual patient who is establishing care at his medical practice. The patient told Dr. Smith she''s fine with you sending her dental records. What should you do?",
        "options": [
          "Send the records immediately since the patient gave verbal permission",
          "Send only the minimum necessary information since it''s for treatment purposes",
          "Refuse to send anything until you have written authorization from the patient",
          "Call the patient to verbally confirm permission, then send the records"
        ],
        "correct": 1,
        "explanation": "**Correct Answer: Send only the minimum necessary information since it''s for treatment purposes**\n\nThis disclosure is permitted under HIPAA without written authorization because:\n\n1. **Treatment exception applies:** Sharing PHI with another healthcare provider for treatment purposes does not require patient authorization under the TPO exception.\n\n2. **Minimum necessary standard applies:** Even though you can share for treatment, you should only send information relevant to the patient''s care at the medical practice.\n\n**Why the other answers are incorrect:**\n\n- **Option A (Send immediately):** While you can send without authorization, you should still apply the minimum necessary standard.\n\n- **Option C (Refuse without authorization):** This is overly restrictive. Treatment disclosures between providers are explicitly permitted without authorization.\n\n- **Option D (Call patient):** While not wrong, it''s unnecessary. The TPO exception permits this disclosure.\n\n**Best Practice:**\n- Verify the requesting provider''s identity\n- Confirm the patient is their patient\n- Send relevant records (minimum necessary)\n- Document the disclosure for your records"
      },
      {
        "id": "section-9",
        "type": "text",
        "title": "Safeguarding PHI in the Office",
        "content": "## Practical PHI Protection Measures\n\nProtecting patient privacy requires constant vigilance in daily operations. Here are practical measures for the dental office.\n\n### Physical Environment Controls\n\n**Reception Area**\n- Position computer screens away from patient view\n- Use privacy screens on monitors\n- Keep paper records out of sight\n- Don''t leave sign-in sheets visible (collect and secure immediately)\n- Use coded paging systems instead of calling out names with conditions\n\n**Operatories and Treatment Areas**\n- Close doors during treatment discussions\n- Don''t discuss other patients while treating someone\n- Secure records when leaving the room\n- Turn off or secure computer screens when not in use\n\n**Office Areas**\n- Lock file cabinets containing records\n- Secure unattended workstations\n- Shred (don''t just trash) PHI documents\n- Keep fax machines in secure areas\n\n### Verbal Communications\n\n**Speaking with Patients**\n- Lower your voice when discussing sensitive information\n- Move to private areas for sensitive conversations\n- Be aware of who might overhear\n\n**Phone Calls**\n- Verify caller identity before providing information\n- Don''t leave detailed messages with PHI on answering machines\n- Use callback procedures for sensitive information\n- Be cautious about who can hear your side of the conversation\n\n### Proper PHI Disposal\n\n**Paper Records**\n- Shred or use secure document destruction service\n- Never place PHI in regular trash\n- Maintain chain of custody until destruction\n\n**Electronic Media**\n- Wipe or destroy hard drives before disposal\n- Physically destroy CDs, DVDs, and USB drives\n- Use certified data destruction services for computers\n- Remove all data before returning leased equipment\n\n### Working from Home/Remote Access\n\nIf your practice allows remote work:\n- Use only approved devices\n- Connect through secure VPN\n- Don''t access PHI on public WiFi\n- Ensure home workspace is private\n- Don''t print PHI at home unless approved and shredded after use"
      },
      {
        "id": "section-10",
        "type": "text",
        "title": "Electronic PHI (ePHI) Security",
        "content": "## Protecting Electronic Protected Health Information\n\nElectronic systems require specific security measures to protect patient data from unauthorized access, theft, and breaches.\n\n### Password Best Practices\n\n**Strong Password Requirements:**\n- Minimum 8-12 characters (more is better)\n- Mix of uppercase, lowercase, numbers, and special characters\n- No dictionary words or personal information\n- Unique password for each system\n- Changed every 60-90 days (or per practice policy)\n\n**Password Protection Rules:**\n- Never share your password with anyone\n- Never write passwords on sticky notes or under keyboards\n- Never send passwords via email\n- Use password managers if approved by your practice\n- Log off when leaving your workstation\n\n### Email Security\n\n**Email Best Practices:**\n- Use encrypted email for PHI when possible\n- Verify recipient addresses before sending\n- Never send PHI to personal email accounts\n- Be cautious with attachments\n- Don''t open suspicious emails or links\n\n**Safe Email with PHI:**\n- Use secure patient portals when available\n- If email must be used, encrypt the message\n- Minimize PHI in subject lines\n- Consider phone for sensitive communications\n\n### Device Security\n\n**Workstations:**\n- Set automatic screen lock (5 minutes max)\n- Log off when leaving\n- Keep antivirus software updated\n- Report suspicious activity immediately\n\n**Mobile Devices:**\n- Use strong PINs or biometric locks\n- Enable remote wipe capability\n- Don''t store PHI on personal devices without approval\n- Keep devices physically secure\n- Report lost or stolen devices immediately\n\n### Network Security\n\n- Only use practice-approved WiFi networks\n- Never access ePHI on public WiFi\n- Don''t connect unauthorized devices to the network\n- Report suspicious network activity\n- Keep systems and software updated\n\n### Data Backup\n\n- Regular automated backups\n- Encrypted backup storage\n- Tested recovery procedures\n- Off-site backup storage for disaster recovery\n- Follow your practice''s backup policies"
      },
      {
        "id": "section-11",
        "type": "scenario",
        "title": "Security Incident Response",
        "prompt": "You arrive at work and notice that a laptop that was left in the break room overnight is now missing. The laptop was used to access patient scheduling software and contained some patient names and appointment information. What should you do?",
        "options": [
          "Check the lost and found and ask around before reporting it - it might just be misplaced",
          "Report it to your supervisor immediately as a potential security incident",
          "Don''t worry about it - the laptop probably has password protection",
          "Wait to see if anyone reports finding it before escalating"
        ],
        "correct": 1,
        "explanation": "**Correct Answer: Report it to your supervisor immediately as a potential security incident**\n\nThis is a potential breach that requires immediate reporting:\n\n**Why immediate reporting is critical:**\n\n1. **Time-sensitive obligations:** If this is a breach, your practice may have notification obligations with specific timeframes (60 days to notify patients for certain breaches).\n\n2. **Investigation needed:** The practice needs to determine:\n   - What PHI was on the laptop\n   - Was the data encrypted?\n   - Who had access to the break room?\n   - Is this a reportable breach?\n\n3. **Mitigation efforts:** Quick action may help limit damage:\n   - Remote wipe if that capability exists\n   - Changing passwords\n   - Monitoring for suspicious access\n   - Filing police report if theft suspected\n\n**Why the other answers are wrong:**\n\n- **Option A (Check around first):** This delays investigation and may compromise evidence.\n- **Option C (Trust password protection):** Password protection alone may not prevent a breach - encryption status matters.\n- **Option D (Wait and see):** Every minute of delay increases potential harm and complicates the breach response process.\n\n**Key Takeaway:** When in doubt, report immediately. Let your supervisor and Security Officer determine if it''s a reportable breach."
      },
      {
        "id": "section-12",
        "type": "text",
        "title": "HIPAA Violations & Penalties",
        "content": "## Understanding HIPAA Enforcement\n\nHIPAA violations can result in significant penalties for both organizations and individuals. Understanding the consequences helps emphasize why compliance matters.\n\n### Penalty Tiers (Civil Penalties)\n\nThe Office for Civil Rights (OCR) uses a tiered penalty structure based on the level of culpability:\n\n| Tier | Culpability Level | Penalty Per Violation | Annual Maximum |\n|------|-------------------|----------------------|----------------|\n| 1 | Did Not Know | $127 - $63,973 | $1,919,173 |\n| 2 | Reasonable Cause | $1,280 - $63,973 | $1,919,173 |\n| 3 | Willful Neglect (Corrected) | $12,794 - $63,973 | $1,919,173 |\n| 4 | Willful Neglect (Not Corrected) | $63,973 - $1,919,173 | $1,919,173 |\n\n*Penalty amounts are adjusted annually for inflation*\n\n### Criminal Penalties\n\nIndividuals can face criminal charges for HIPAA violations:\n\n| Offense | Maximum Fine | Maximum Prison Time |\n|---------|-------------|-------------------|\n| Knowingly obtaining/disclosing PHI | $50,000 | 1 year |\n| Under false pretenses | $100,000 | 5 years |\n| For personal gain, malicious harm, or commercial advantage | $250,000 | 10 years |\n\n### Real-World HIPAA Violations\n\n**Examples of violations that have resulted in penalties:**\n\n- **Employee snooping:** Looking at records of friends, family, celebrities, or neighbors out of curiosity\n- **Lost/stolen laptops:** Unencrypted devices containing PHI\n- **Social media posts:** Sharing patient photos or information\n- **Improper disposal:** Throwing PHI in regular trash\n- **Lack of safeguards:** No risk analysis, insufficient training\n- **Unauthorized disclosures:** Sharing information without proper authorization\n\n### Who Can Be Held Liable?\n\n**Organizations:**\n- Dental practices\n- Business associates\n- Health plans\n\n**Individuals:**\n- Employees who violate HIPAA\n- Directors, officers, and employees of covered entities\n- Can be prosecuted personally for criminal violations\n\n### Protecting Yourself\n\n1. **Follow your training** - Apply what you learn\n2. **When in doubt, ask** - Consult your Privacy Officer\n3. **Report violations** - Including your own mistakes\n4. **Don''t snoop** - Only access PHI for your job duties\n5. **Think before posting** - Nothing about patients on social media"
      },
      {
        "id": "section-13",
        "type": "text",
        "title": "Social Media & HIPAA",
        "content": "## Social Media: The Modern HIPAA Minefield\n\nSocial media presents unique risks for HIPAA compliance. Even well-intentioned posts can violate patient privacy.\n\n### The Golden Rules of Social Media\n\n1. **Never post any patient information** - Ever, under any circumstances, without explicit written authorization\n2. **Don''t discuss work** - Even vague references can be pieced together\n3. **Don''t take photos at work** - Patients or their information may accidentally be captured\n4. **Don''t \"friend\" patients** - Maintains professional boundaries\n\n### What NOT to Post\n\n**Explicit Violations:**\n- Patient names or photos\n- Clinical images (even without names)\n- Details about procedures performed\n- Comments about specific patients\n- Responses to patient reviews that reveal PHI\n\n**Subtle Violations:**\n- \"Had a rough day with a difficult patient\"\n- \"Just did my first root canal!\"\n- Photos of the office that may show schedules or charts\n- \"Working late because of an emergency\"\n- Checking in at work during an emergency\n\n### Patient Photos and Testimonials\n\n**If your practice uses patient photos for marketing:**\n- Written authorization REQUIRED\n- Specific authorization for each use (social media, website, print)\n- Patient can revoke authorization\n- Keep copies of all authorizations\n- Never share without explicit consent\n\n### Responding to Online Reviews\n\nPatients may post reviews mentioning their care. **You CANNOT:**\n- Confirm they are a patient\n- Discuss their treatment\n- Reveal any PHI in your response\n\n**Safe Response Example:**\n> \"We take all feedback seriously and strive to provide excellent care. We invite you to contact our office directly to discuss your concerns.\"\n\n**Unsafe Response:**\n> \"We''re sorry your crown didn''t fit properly. We''d be happy to see you again to adjust it.\"\n\n### Social Media Policy\n\nYour practice should have a social media policy that covers:\n- Personal social media use at work\n- Posting about work on personal accounts\n- Official practice social media management\n- Consequences for violations\n\n### Remember\n\n- **The internet is forever** - Screenshots can capture deleted posts\n- **People talk** - Others may identify patients from vague descriptions\n- **It''s not worth the risk** - One post can end your career"
      }
    ],
    "quiz": {
      "questions": [
        {
          "id": "q1",
          "question": "HIPAA was enacted primarily to:",
          "options": [
            "Increase healthcare costs",
            "Protect patient health information privacy and security",
            "Make billing more complicated",
            "Reduce the number of healthcare providers"
          ],
          "correct": 1
        },
        {
          "id": "q2",
          "question": "How many identifiers does HIPAA specifically list that can identify an individual?",
          "options": ["10", "14", "18", "25"],
          "correct": 2
        },
        {
          "id": "q3",
          "question": "Which of the following is NOT one of the 18 HIPAA identifiers?",
          "options": [
            "Email addresses",
            "Blood type",
            "Social Security numbers",
            "Vehicle license plate numbers"
          ],
          "correct": 1
        },
        {
          "id": "q4",
          "question": "The \"minimum necessary\" standard requires that you:",
          "options": [
            "Share no information at all",
            "Use and disclose only the amount of PHI needed to accomplish the purpose",
            "Share the minimum amount of false information",
            "Only treat patients with minimal conditions"
          ],
          "correct": 1
        },
        {
          "id": "q5",
          "question": "Under HIPAA, which of the following does NOT require a written patient authorization?",
          "options": [
            "Marketing communications",
            "Sharing records with another provider for treatment",
            "Selling patient information",
            "Releasing psychotherapy notes"
          ],
          "correct": 1
        },
        {
          "id": "q6",
          "question": "A patient pays out-of-pocket for a procedure and asks that you not submit the claim to their insurance. Under HIPAA, you must:",
          "options": [
            "Submit the claim anyway for your records",
            "Comply with the restriction and not bill insurance",
            "Refuse the patient''s request",
            "Charge extra for not billing insurance"
          ],
          "correct": 1
        },
        {
          "id": "q7",
          "question": "How long does a covered entity have to respond to a patient''s request for access to their records?",
          "options": [
            "10 days",
            "30 days, with one 30-day extension allowed",
            "90 days",
            "7 business days"
          ],
          "correct": 1
        },
        {
          "id": "q8",
          "question": "Which of the following is an appropriate way to dispose of paper documents containing PHI?",
          "options": [
            "Place in regular office trash",
            "Shredding or secure document destruction service",
            "Recycling bin",
            "Burning in office fireplace"
          ],
          "correct": 1
        },
        {
          "id": "q9",
          "question": "What is the minimum recommended password length for systems containing ePHI?",
          "options": ["4 characters", "6 characters", "8-12 characters", "20 characters"],
          "correct": 2
        },
        {
          "id": "q10",
          "question": "If a laptop containing unencrypted PHI is stolen, this is considered a:",
          "options": [
            "Minor inconvenience",
            "Potential breach requiring investigation",
            "Non-issue if the laptop was password protected",
            "Problem only if patient names were stored"
          ],
          "correct": 1
        },
        {
          "id": "q11",
          "question": "What is the maximum criminal penalty for knowingly obtaining PHI under false pretenses?",
          "options": [
            "$10,000 fine and 6 months in prison",
            "$50,000 fine and 1 year in prison",
            "$100,000 fine and 5 years in prison",
            "$250,000 fine and 10 years in prison"
          ],
          "correct": 2
        },
        {
          "id": "q12",
          "question": "A patient posts a negative review online mentioning their treatment. In your response, you may:",
          "options": [
            "Explain why their treatment was appropriate",
            "Confirm they are a patient and apologize",
            "Offer a general response without confirming they are a patient",
            "Share their medical records to prove your point"
          ],
          "correct": 2
        },
        {
          "id": "q13",
          "question": "Which agency is primarily responsible for enforcing HIPAA?",
          "options": [
            "FDA",
            "CDC",
            "Office for Civil Rights (OCR) at HHS",
            "OSHA"
          ],
          "correct": 2
        },
        {
          "id": "q14",
          "question": "Which of the following is an example of an Administrative Safeguard under the Security Rule?",
          "options": [
            "Encryption of ePHI",
            "Locks on file cabinets",
            "Workforce security training",
            "Automatic logoff"
          ],
          "correct": 2
        },
        {
          "id": "q15",
          "question": "Looking at a patient''s record out of curiosity (when not involved in their care) is:",
          "options": [
            "Acceptable if you don''t share what you see",
            "A HIPAA violation even if you don''t share the information",
            "Allowed for employees of the practice",
            "Only a violation if the patient finds out"
          ],
          "correct": 1
        }
      ]
    }
  }',
  updated_at = NOW()
WHERE type = 'hipaa';
