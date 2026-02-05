/**
 * HIPAA Privacy & Security Training Content
 * Comprehensive training module for dental practices
 * Duration: 30-45 minutes
 * Sections: 13 (10 text, 3 scenarios)
 * Quiz Questions: 15
 */

import type { TrainingContent } from './osha-bbp';

export const hipaaPrivacySecurityContent: TrainingContent = {
  sections: [
    {
      id: 'section-1',
      type: 'text',
      title: 'What is HIPAA?',
      content: `## The Health Insurance Portability and Accountability Act

HIPAA was enacted by Congress in 1996 to:
- Improve the portability and continuity of health insurance coverage
- Combat waste, fraud, and abuse in health insurance and healthcare delivery
- **Protect the privacy and security of health information**

### Why HIPAA Matters in Dentistry

Every dental practice handles sensitive patient information daily, including:
- Medical and dental histories
- Treatment records and X-rays
- Insurance information
- Payment records
- Personal contact information

**HIPAA compliance is not optional** - it's federal law, and violations can result in significant penalties and damage to your practice's reputation.

### Who Must Comply with HIPAA?

**Covered Entities:**
- Healthcare providers who transmit health information electronically
- Health plans (insurance companies)
- Healthcare clearinghouses

**Business Associates:**
- Third parties who handle PHI on behalf of covered entities
- Examples: Billing companies, IT service providers, cloud storage vendors

### The Three Main HIPAA Rules

| Rule | Purpose |
|------|---------|
| **Privacy Rule** | Establishes standards for protecting patient health information |
| **Security Rule** | Sets requirements for safeguarding electronic PHI |
| **Breach Notification Rule** | Requires notification when unsecured PHI is compromised |

### HIPAA Enforcement

The Office for Civil Rights (OCR) at the U.S. Department of Health and Human Services (HHS) enforces HIPAA. State attorneys general can also enforce HIPAA provisions.`
    },
    {
      id: 'section-2',
      type: 'text',
      title: 'Protected Health Information (PHI)',
      content: `## Understanding Protected Health Information

**Protected Health Information (PHI)** is any information that:
1. Relates to an individual's past, present, or future health condition, treatment, or payment for healthcare
2. Identifies the individual OR could reasonably be used to identify the individual
3. Is created, received, maintained, or transmitted by a covered entity

### The 18 HIPAA Identifiers

HIPAA specifically identifies 18 types of information that can identify an individual:

| # | Identifier | Examples |
|---|------------|----------|
| 1 | Name | First name, last name, maiden name |
| 2 | Geographic data | Address, city, ZIP code (anything smaller than state) |
| 3 | Dates | Birth date, admission date, discharge date, death date |
| 4 | Phone numbers | Home, work, cell numbers |
| 5 | Fax numbers | Personal or work fax |
| 6 | Email addresses | Personal or work email |
| 7 | Social Security numbers | Full or partial SSN |
| 8 | Medical record numbers | Your practice's MRN |
| 9 | Health plan beneficiary numbers | Insurance ID numbers |
| 10 | Account numbers | Patient account numbers |
| 11 | Certificate/license numbers | Professional licenses |
| 12 | Vehicle identifiers | License plate, VIN |
| 13 | Device identifiers | Medical device serial numbers |
| 14 | Web URLs | Patient-specific web addresses |
| 15 | IP addresses | Computer network addresses |
| 16 | Biometric identifiers | Fingerprints, voice prints |
| 17 | Full-face photographs | Photos showing the patient's face |
| 18 | Any other unique identifying number | Any code that could identify the patient |

### What IS Protected Health Information?

- Patient name + diagnosis
- Appointment schedule with patient names
- Insurance claim with patient information
- X-rays with patient identifiers
- Treatment notes
- Email containing patient health information

### What is NOT Protected Health Information?

- Information that has been properly de-identified
- Education records covered by FERPA
- Employment records held by a covered entity as an employer
- General health information not linked to a specific patient

### Electronic PHI (ePHI)

**ePHI** is any PHI that is created, stored, transmitted, or received electronically. This includes:
- Electronic health records
- Digital X-rays
- Email containing patient information
- Text messages about patients
- Information stored on computers, phones, or tablets`
    },
    {
      id: 'section-3',
      type: 'text',
      title: 'The Privacy Rule',
      content: `## HIPAA Privacy Rule Overview

The Privacy Rule establishes national standards for protecting individuals' medical records and other personal health information. It:
- Sets limits on who can access PHI
- Gives patients rights over their health information
- Requires appropriate safeguards to protect privacy

### The Minimum Necessary Standard

One of the most important Privacy Rule concepts:

> **Use, disclose, and request only the minimum amount of PHI necessary to accomplish the intended purpose.**

**Examples:**
- A referring dentist needs to know about relevant dental history, not the patient's entire medical record
- The billing department needs insurance info and procedure codes, not clinical notes
- A receptionist confirming an appointment doesn't need to know the patient's diagnosis

**Exceptions to Minimum Necessary:**
- Disclosures to the patient themselves
- Uses for treatment purposes
- Uses with valid patient authorization
- Disclosures required by law
- Disclosures to HHS for enforcement purposes

### Uses vs. Disclosures

**Use** = Sharing, employment, application, utilization, examination, or analysis of PHI **within** the organization

**Disclosure** = Release, transfer, provision of access to, or divulging of PHI **outside** the organization

### Permitted Uses and Disclosures

PHI can be used/disclosed WITHOUT patient authorization for:

**TPO - Treatment, Payment, and Healthcare Operations**
- **Treatment:** Providing care, consulting with other providers
- **Payment:** Billing, claims processing, eligibility verification
- **Healthcare Operations:** Quality assessment, training, business management

**Other Permitted Disclosures:**
- Required by law
- Public health activities
- Victims of abuse, neglect, or domestic violence
- Health oversight activities
- Judicial and administrative proceedings
- Law enforcement purposes (with restrictions)
- To prevent serious threat to health or safety
- Workers' compensation cases

### When Authorization IS Required

You MUST get written patient authorization to:
- Use PHI for marketing purposes
- Sell PHI
- Disclose psychotherapy notes
- Disclose to employers for employment decisions
- Any use not otherwise permitted by HIPAA`
    },
    {
      id: 'section-4',
      type: 'text',
      title: 'The Security Rule',
      content: `## HIPAA Security Rule Overview

The Security Rule requires covered entities to implement safeguards to protect electronic PHI (ePHI). It focuses on:
- **Confidentiality** - ePHI is not available to unauthorized persons
- **Integrity** - ePHI is not altered or destroyed improperly
- **Availability** - ePHI is accessible when needed for patient care

### The Three Types of Safeguards

**1. Administrative Safeguards** (Management Actions)
- Designate a Security Officer
- Conduct risk assessments
- Develop policies and procedures
- Train workforce members
- Establish sanctions for violations
- Review system activity regularly
- Manage access to ePHI
- Incident response procedures

**2. Physical Safeguards** (Protecting Physical Environment)
- Facility access controls (locks, alarms)
- Workstation use policies
- Workstation security (screen positioning, auto-lock)
- Device and media controls
- Proper disposal of electronic media

**3. Technical Safeguards** (Technology Protections)
- Access controls (unique user IDs, passwords)
- Audit controls (tracking who accesses what)
- Integrity controls (preventing unauthorized changes)
- Transmission security (encryption)
- Automatic logoff
- Authentication mechanisms

### Required vs. Addressable Specifications

**Required** = Must be implemented
**Addressable** = Must assess and implement if reasonable; if not, document why and implement alternative

| Safeguard Type | Required Examples | Addressable Examples |
|----------------|-------------------|---------------------|
| Administrative | Risk analysis, sanctions policy, training | Encryption of ePHI at rest |
| Physical | Facility access controls | Device/media encryption |
| Technical | Unique user ID, audit logs | Automatic logoff |

### Risk Analysis Requirement

Every covered entity must:
1. Identify where ePHI is created, received, maintained, or transmitted
2. Identify potential threats and vulnerabilities
3. Assess current security measures
4. Determine likelihood and impact of threats
5. Assign risk levels
6. Implement measures to reduce risks to reasonable levels
7. Document the analysis and actions taken`
    },
    {
      id: 'section-5',
      type: 'scenario',
      title: 'PHI Identification Scenario',
      prompt: 'A dental assistant posts on her personal Facebook page: "Had a crazy day! That root canal on the elderly patient in chair 3 took forever. At least I got some great before/after photos for my portfolio!" Is this a HIPAA violation?',
      options: [
        'No, because she didn\'t use the patient\'s name',
        'No, because it was on her personal social media account',
        'Yes, because the information could potentially identify the patient',
        'Yes, but only if her coworkers are Facebook friends with her'
      ],
      correct: 2,
      explanation: `**Correct Answer: Yes, because the information could potentially identify the patient**

This is a HIPAA violation for several reasons:

1. **PHI was disclosed:** The post reveals:
   - A specific procedure (root canal)
   - Physical description (elderly)
   - Location (chair 3)
   - Date (today)
   - Photographs of the patient

2. **The combination of identifiers matters:** Even without a name, the combination of date, procedure, location, age description, and photos could allow someone to identify the patient - especially other patients in the waiting room, staff, or anyone who knows the patient goes to that practice.

3. **Photos require explicit authorization:** Clinical photographs can NEVER be shared on social media without explicit written authorization from the patient, regardless of whether identifying information is included.

4. **Personal accounts don't exempt you:** Using a personal social media account doesn't make workplace information sharing legal. HIPAA applies regardless of the platform.

**This could result in:**
- Termination
- HIPAA penalties up to $50,000 per violation
- Potential civil lawsuit from the patient`
    },
    {
      id: 'section-6',
      type: 'text',
      title: 'Permitted Uses & Disclosures',
      content: `## When Can You Share PHI?

Understanding when you CAN share patient information is just as important as knowing when you cannot.

### Treatment, Payment, and Healthcare Operations (TPO)

**Treatment**
You may share PHI to provide, coordinate, or manage patient care:
- Discussing a case with a specialist
- Sending records to a referring provider
- Consulting with other team members about treatment
- Coordinating care with other healthcare providers

**Payment**
You may share PHI for billing and payment activities:
- Submitting claims to insurance
- Verifying insurance coverage
- Collecting payment from patients
- Appealing claim denials

**Healthcare Operations**
You may use PHI for normal business activities:
- Quality improvement activities
- Training new employees (with safeguards)
- Compliance and auditing
- Business planning and development
- Case management and care coordination

### Other Permitted Disclosures Without Authorization

**Required by Law**
- Court orders
- Subpoenas (with proper limitations)
- Reporting laws (abuse, neglect, certain diseases)

**Public Health Activities**
- Reporting communicable diseases
- Reporting adverse drug events
- Workplace medical surveillance

**Abuse, Neglect, or Domestic Violence**
- Reporting suspected child abuse
- Reporting suspected elder abuse

**To the Patient**
- You can always give patients their own information
- Cannot refuse access except in limited circumstances

### The "Incidental Use" Exception

Certain incidental uses/disclosures are permitted if:
- Reasonable safeguards are in place
- The minimum necessary standard is applied

**Examples of Permissible Incidental Disclosures:**
- A patient in the waiting room overhears a receptionist calling another patient's name
- A nurse discussing a patient's condition with a doctor is overheard by a passerby

**These are NOT incidental (they ARE violations):**
- Leaving patient charts visible on a counter
- Discussing patient information loudly in a public area
- Posting the day's patient schedule where visitors can see it`
    },
    {
      id: 'section-7',
      type: 'text',
      title: 'Patient Rights Under HIPAA',
      content: `## Patient Rights You Must Respect

HIPAA grants patients specific rights regarding their health information. You must be prepared to respond to these requests.

### Right to Access

Patients have the right to:
- Obtain copies of their records
- Receive records in electronic format if maintained electronically
- Have records sent to a third party they designate

**Your Responsibilities:**
- Respond within 30 days (can extend once by 30 days)
- May charge reasonable cost-based fees for copies
- Must provide in format requested if readily producible
- Can only deny in very limited circumstances

### Right to Amend

Patients can request amendments to their records if they believe information is inaccurate or incomplete.

**Your Responsibilities:**
- Respond within 60 days (can extend once by 30 days)
- May deny if: information is accurate, not created by you, not part of designated record set
- Must allow patient to submit statement of disagreement if denied
- Must append amendment or disagreement statement to record

### Right to Accounting of Disclosures

Patients can request a list of disclosures made of their PHI.

**What Must Be Included:**
- Disclosures made in the past 6 years
- Date of disclosure
- Name of recipient
- Brief description of information disclosed
- Purpose of disclosure

**What's Excluded:**
- Disclosures for TPO
- Disclosures to the patient
- Disclosures with patient authorization
- Disclosures for national security purposes

### Right to Request Restrictions

Patients can ask to restrict uses/disclosures of their PHI.

**Your Responsibilities:**
- You are NOT required to agree (except in one case)
- **Mandatory restriction:** If patient pays in full out-of-pocket and requests you not bill insurance, you MUST comply
- If you agree to a restriction, you must honor it

### Right to Confidential Communications

Patients can request to receive communications:
- At alternative locations (e.g., work instead of home)
- By alternative means (e.g., email instead of phone)

**Your Responsibilities:**
- Must accommodate reasonable requests
- Cannot require explanation for request

### Right to Notice of Privacy Practices

Patients must receive your Notice of Privacy Practices at first service or as soon as practical.`
    },
    {
      id: 'section-8',
      type: 'scenario',
      title: 'Authorization Scenario',
      prompt: 'Dr. Smith calls your dental office requesting records for a mutual patient who is establishing care at his medical practice. The patient told Dr. Smith she\'s fine with you sending her dental records. What should you do?',
      options: [
        'Send the records immediately since the patient gave verbal permission',
        'Send only the minimum necessary information since it\'s for treatment purposes',
        'Refuse to send anything until you have written authorization from the patient',
        'Call the patient to verbally confirm permission, then send the records'
      ],
      correct: 1,
      explanation: `**Correct Answer: Send only the minimum necessary information since it's for treatment purposes**

This disclosure is permitted under HIPAA without written authorization because:

1. **Treatment exception applies:** Sharing PHI with another healthcare provider for treatment purposes does not require patient authorization under the TPO exception.

2. **Minimum necessary standard applies:** Even though you can share for treatment, you should only send information relevant to the patient's care at the medical practice.

**Why the other answers are incorrect:**

- **Option A (Send immediately):** While you can send without authorization, you should still apply the minimum necessary standard.

- **Option C (Refuse without authorization):** This is overly restrictive. Treatment disclosures between providers are explicitly permitted without authorization.

- **Option D (Call patient):** While not wrong, it's unnecessary. The TPO exception permits this disclosure.

**Best Practice:**
- Verify the requesting provider's identity
- Confirm the patient is their patient
- Send relevant records (minimum necessary)
- Document the disclosure for your records`
    },
    {
      id: 'section-9',
      type: 'text',
      title: 'Safeguarding PHI in the Office',
      content: `## Practical PHI Protection Measures

Protecting patient privacy requires constant vigilance in daily operations. Here are practical measures for the dental office.

### Physical Environment Controls

**Reception Area**
- Position computer screens away from patient view
- Use privacy screens on monitors
- Keep paper records out of sight
- Don't leave sign-in sheets visible (collect and secure immediately)
- Use coded paging systems instead of calling out names with conditions

**Operatories and Treatment Areas**
- Close doors during treatment discussions
- Don't discuss other patients while treating someone
- Secure records when leaving the room
- Turn off or secure computer screens when not in use

**Office Areas**
- Lock file cabinets containing records
- Secure unattended workstations
- Shred (don't just trash) PHI documents
- Keep fax machines in secure areas

### Verbal Communications

**Speaking with Patients**
- Lower your voice when discussing sensitive information
- Move to private areas for sensitive conversations
- Be aware of who might overhear

**Phone Calls**
- Verify caller identity before providing information
- Don't leave detailed messages with PHI on answering machines
- Use callback procedures for sensitive information
- Be cautious about who can hear your side of the conversation

### Proper PHI Disposal

**Paper Records**
- Shred or use secure document destruction service
- Never place PHI in regular trash
- Maintain chain of custody until destruction

**Electronic Media**
- Wipe or destroy hard drives before disposal
- Physically destroy CDs, DVDs, and USB drives
- Use certified data destruction services for computers
- Remove all data before returning leased equipment

### Working from Home/Remote Access

If your practice allows remote work:
- Use only approved devices
- Connect through secure VPN
- Don't access PHI on public WiFi
- Ensure home workspace is private
- Don't print PHI at home unless approved and shredded after use`
    },
    {
      id: 'section-10',
      type: 'text',
      title: 'Electronic PHI (ePHI) Security',
      content: `## Protecting Electronic Protected Health Information

Electronic systems require specific security measures to protect patient data from unauthorized access, theft, and breaches.

### Password Best Practices

**Strong Password Requirements:**
- Minimum 8-12 characters (more is better)
- Mix of uppercase, lowercase, numbers, and special characters
- No dictionary words or personal information
- Unique password for each system
- Changed every 60-90 days (or per practice policy)

**Password Protection Rules:**
- Never share your password with anyone
- Never write passwords on sticky notes or under keyboards
- Never send passwords via email
- Use password managers if approved by your practice
- Log off when leaving your workstation

### Email Security

**Email Best Practices:**
- Use encrypted email for PHI when possible
- Verify recipient addresses before sending
- Never send PHI to personal email accounts
- Be cautious with attachments
- Don't open suspicious emails or links

**Safe Email with PHI:**
- Use secure patient portals when available
- If email must be used, encrypt the message
- Minimize PHI in subject lines
- Consider phone for sensitive communications

### Device Security

**Workstations:**
- Set automatic screen lock (5 minutes max)
- Log off when leaving
- Keep antivirus software updated
- Report suspicious activity immediately

**Mobile Devices:**
- Use strong PINs or biometric locks
- Enable remote wipe capability
- Don't store PHI on personal devices without approval
- Keep devices physically secure
- Report lost or stolen devices immediately

### Network Security

- Only use practice-approved WiFi networks
- Never access ePHI on public WiFi
- Don't connect unauthorized devices to the network
- Report suspicious network activity
- Keep systems and software updated

### Data Backup

- Regular automated backups
- Encrypted backup storage
- Tested recovery procedures
- Off-site backup storage for disaster recovery
- Follow your practice's backup policies`
    },
    {
      id: 'section-11',
      type: 'scenario',
      title: 'Security Incident Response',
      prompt: 'You arrive at work and notice that a laptop that was left in the break room overnight is now missing. The laptop was used to access patient scheduling software and contained some patient names and appointment information. What should you do?',
      options: [
        'Check the lost and found and ask around before reporting it - it might just be misplaced',
        'Report it to your supervisor immediately as a potential security incident',
        'Don\'t worry about it - the laptop probably has password protection',
        'Wait to see if anyone reports finding it before escalating'
      ],
      correct: 1,
      explanation: `**Correct Answer: Report it to your supervisor immediately as a potential security incident**

This is a potential breach that requires immediate reporting:

**Why immediate reporting is critical:**

1. **Time-sensitive obligations:** If this is a breach, your practice may have notification obligations with specific timeframes (60 days to notify patients for certain breaches).

2. **Investigation needed:** The practice needs to determine:
   - What PHI was on the laptop
   - Was the data encrypted?
   - Who had access to the break room?
   - Is this a reportable breach?

3. **Mitigation efforts:** Quick action may help limit damage:
   - Remote wipe if that capability exists
   - Changing passwords
   - Monitoring for suspicious access
   - Filing police report if theft suspected

**Why the other answers are wrong:**

- **Option A (Check around first):** This delays investigation and may compromise evidence.
- **Option C (Trust password protection):** Password protection alone may not prevent a breach - encryption status matters.
- **Option D (Wait and see):** Every minute of delay increases potential harm and complicates the breach response process.

**Key Takeaway:** When in doubt, report immediately. Let your supervisor and Security Officer determine if it's a reportable breach.`
    },
    {
      id: 'section-12',
      type: 'text',
      title: 'HIPAA Violations & Penalties',
      content: `## Understanding HIPAA Enforcement

HIPAA violations can result in significant penalties for both organizations and individuals. Understanding the consequences helps emphasize why compliance matters.

### Penalty Tiers (Civil Penalties)

The Office for Civil Rights (OCR) uses a tiered penalty structure based on the level of culpability:

| Tier | Culpability Level | Penalty Per Violation | Annual Maximum |
|------|-------------------|----------------------|----------------|
| 1 | Did Not Know | $127 - $63,973 | $1,919,173 |
| 2 | Reasonable Cause | $1,280 - $63,973 | $1,919,173 |
| 3 | Willful Neglect (Corrected) | $12,794 - $63,973 | $1,919,173 |
| 4 | Willful Neglect (Not Corrected) | $63,973 - $1,919,173 | $1,919,173 |

*Penalty amounts are adjusted annually for inflation*

### Criminal Penalties

Individuals can face criminal charges for HIPAA violations:

| Offense | Maximum Fine | Maximum Prison Time |
|---------|-------------|-------------------|
| Knowingly obtaining/disclosing PHI | $50,000 | 1 year |
| Under false pretenses | $100,000 | 5 years |
| For personal gain, malicious harm, or commercial advantage | $250,000 | 10 years |

### Real-World HIPAA Violations

**Examples of violations that have resulted in penalties:**

- **Employee snooping:** Looking at records of friends, family, celebrities, or neighbors out of curiosity
- **Lost/stolen laptops:** Unencrypted devices containing PHI
- **Social media posts:** Sharing patient photos or information
- **Improper disposal:** Throwing PHI in regular trash
- **Lack of safeguards:** No risk analysis, insufficient training
- **Unauthorized disclosures:** Sharing information without proper authorization

### Who Can Be Held Liable?

**Organizations:**
- Dental practices
- Business associates
- Health plans

**Individuals:**
- Employees who violate HIPAA
- Directors, officers, and employees of covered entities
- Can be prosecuted personally for criminal violations

### Protecting Yourself

1. **Follow your training** - Apply what you learn
2. **When in doubt, ask** - Consult your Privacy Officer
3. **Report violations** - Including your own mistakes
4. **Don't snoop** - Only access PHI for your job duties
5. **Think before posting** - Nothing about patients on social media`
    },
    {
      id: 'section-13',
      type: 'text',
      title: 'Social Media & HIPAA',
      content: `## Social Media: The Modern HIPAA Minefield

Social media presents unique risks for HIPAA compliance. Even well-intentioned posts can violate patient privacy.

### The Golden Rules of Social Media

1. **Never post any patient information** - Ever, under any circumstances, without explicit written authorization
2. **Don't discuss work** - Even vague references can be pieced together
3. **Don't take photos at work** - Patients or their information may accidentally be captured
4. **Don't "friend" patients** - Maintains professional boundaries

### What NOT to Post

**Explicit Violations:**
- Patient names or photos
- Clinical images (even without names)
- Details about procedures performed
- Comments about specific patients
- Responses to patient reviews that reveal PHI

**Subtle Violations:**
- "Had a rough day with a difficult patient"
- "Just did my first root canal!"
- Photos of the office that may show schedules or charts
- "Working late because of an emergency"
- Checking in at work during an emergency

### Patient Photos and Testimonials

**If your practice uses patient photos for marketing:**
- Written authorization REQUIRED
- Specific authorization for each use (social media, website, print)
- Patient can revoke authorization
- Keep copies of all authorizations
- Never share without explicit consent

### Responding to Online Reviews

Patients may post reviews mentioning their care. **You CANNOT:**
- Confirm they are a patient
- Discuss their treatment
- Reveal any PHI in your response

**Safe Response Example:**
> "We take all feedback seriously and strive to provide excellent care. We invite you to contact our office directly to discuss your concerns."

**Unsafe Response:**
> "We're sorry your crown didn't fit properly. We'd be happy to see you again to adjust it."

### Social Media Policy

Your practice should have a social media policy that covers:
- Personal social media use at work
- Posting about work on personal accounts
- Official practice social media management
- Consequences for violations

### Remember

- **The internet is forever** - Screenshots can capture deleted posts
- **People talk** - Others may identify patients from vague descriptions
- **It's not worth the risk** - One post can end your career`
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'HIPAA was enacted primarily to:',
        options: [
          'Increase healthcare costs',
          'Protect patient health information privacy and security',
          'Make billing more complicated',
          'Reduce the number of healthcare providers'
        ],
        correct: 1
      },
      {
        id: 'q2',
        question: 'How many identifiers does HIPAA specifically list that can identify an individual?',
        options: ['10', '14', '18', '25'],
        correct: 2
      },
      {
        id: 'q3',
        question: 'Which of the following is NOT one of the 18 HIPAA identifiers?',
        options: [
          'Email addresses',
          'Blood type',
          'Social Security numbers',
          'Vehicle license plate numbers'
        ],
        correct: 1
      },
      {
        id: 'q4',
        question: 'The "minimum necessary" standard requires that you:',
        options: [
          'Share no information at all',
          'Use and disclose only the amount of PHI needed to accomplish the purpose',
          'Share the minimum amount of false information',
          'Only treat patients with minimal conditions'
        ],
        correct: 1
      },
      {
        id: 'q5',
        question: 'Under HIPAA, which of the following does NOT require a written patient authorization?',
        options: [
          'Marketing communications',
          'Sharing records with another provider for treatment',
          'Selling patient information',
          'Releasing psychotherapy notes'
        ],
        correct: 1
      },
      {
        id: 'q6',
        question: 'A patient pays out-of-pocket for a procedure and asks that you not submit the claim to their insurance. Under HIPAA, you must:',
        options: [
          'Submit the claim anyway for your records',
          'Comply with the restriction and not bill insurance',
          'Refuse the patient\'s request',
          'Charge extra for not billing insurance'
        ],
        correct: 1
      },
      {
        id: 'q7',
        question: 'How long does a covered entity have to respond to a patient\'s request for access to their records?',
        options: [
          '10 days',
          '30 days, with one 30-day extension allowed',
          '90 days',
          '7 business days'
        ],
        correct: 1
      },
      {
        id: 'q8',
        question: 'Which of the following is an appropriate way to dispose of paper documents containing PHI?',
        options: [
          'Place in regular office trash',
          'Shredding or secure document destruction service',
          'Recycling bin',
          'Burning in office fireplace'
        ],
        correct: 1
      },
      {
        id: 'q9',
        question: 'What is the minimum recommended password length for systems containing ePHI?',
        options: ['4 characters', '6 characters', '8-12 characters', '20 characters'],
        correct: 2
      },
      {
        id: 'q10',
        question: 'If a laptop containing unencrypted PHI is stolen, this is considered a:',
        options: [
          'Minor inconvenience',
          'Potential breach requiring investigation',
          'Non-issue if the laptop was password protected',
          'Problem only if patient names were stored'
        ],
        correct: 1
      },
      {
        id: 'q11',
        question: 'What is the maximum criminal penalty for knowingly obtaining PHI under false pretenses?',
        options: [
          '$10,000 fine and 6 months in prison',
          '$50,000 fine and 1 year in prison',
          '$100,000 fine and 5 years in prison',
          '$250,000 fine and 10 years in prison'
        ],
        correct: 2
      },
      {
        id: 'q12',
        question: 'A patient posts a negative review online mentioning their treatment. In your response, you may:',
        options: [
          'Explain why their treatment was appropriate',
          'Confirm they are a patient and apologize',
          'Offer a general response without confirming they are a patient',
          'Share their medical records to prove your point'
        ],
        correct: 2
      },
      {
        id: 'q13',
        question: 'Which agency is primarily responsible for enforcing HIPAA?',
        options: [
          'FDA',
          'CDC',
          'Office for Civil Rights (OCR) at HHS',
          'OSHA'
        ],
        correct: 2
      },
      {
        id: 'q14',
        question: 'Which of the following is an example of an Administrative Safeguard under the Security Rule?',
        options: [
          'Encryption of ePHI',
          'Locks on file cabinets',
          'Workforce security training',
          'Automatic logoff'
        ],
        correct: 2
      },
      {
        id: 'q15',
        question: 'Looking at a patient\'s record out of curiosity (when not involved in their care) is:',
        options: [
          'Acceptable if you don\'t share what you see',
          'A HIPAA violation even if you don\'t share the information',
          'Allowed for employees of the practice',
          'Only a violation if the patient finds out'
        ],
        correct: 1
      }
    ]
  }
};

export default hipaaPrivacySecurityContent;
