/**
 * Emergency Action Plan Training Content
 * Comprehensive training module for dental practices
 * Duration: 25 minutes
 * Sections: 8 (6 text, 2 scenarios)
 * Quiz Questions: 10
 */

import type { TrainingContent } from './osha-bbp';

export const emergencyActionPlanContent: TrainingContent = {
  sections: [
    {
      id: 'section-1',
      type: 'text',
      title: 'Emergency Preparedness Overview',
      content: `## Being Prepared for Emergencies

Emergencies can happen at any time. Being prepared means knowing what to do before an emergency occurs, so you can respond quickly and effectively when seconds count.

### Why Emergency Planning Matters

In a dental office, emergencies can include:
- **Fires** - Electrical, chemical, or other sources
- **Medical emergencies** - Patient or staff health crises
- **Natural disasters** - Severe weather, earthquakes
- **Workplace violence** - Including active shooter situations
- **Utility failures** - Power outages, gas leaks
- **Chemical spills** - Hazardous material releases

### OSHA's Emergency Action Plan Requirement

OSHA requires employers to have a written Emergency Action Plan (29 CFR 1910.38) that includes:

1. **Emergency escape procedures** and routes
2. **Procedures for employees who must remain** to operate critical equipment
3. **Procedures for accounting** for all employees after evacuation
4. **Rescue and medical duties** for designated employees
5. **Methods for reporting** fires and emergencies
6. **Contact information** for those who can provide more information

### Know Your Practice's Emergency Plan

You should know:
- **Location of emergency exits** - Primary and alternate routes
- **Assembly point** - Where to gather after evacuation
- **Location of emergency equipment** - Fire extinguishers, first aid kits, AED
- **Emergency phone numbers** - Posted and programmed into phones
- **Your specific role** - What you're responsible for during an emergency

### The Emergency Plan Location

Your practice's written Emergency Action Plan is located at:

**_________________________________**

If you don't know where this is, ask your supervisor today!`
    },
    {
      id: 'section-2',
      type: 'text',
      title: 'Fire Emergency Procedures',
      content: `## Responding to Fire Emergencies

Fire can spread rapidly. Knowing how to respond in the first moments of a fire can save lives.

### The RACE Protocol

Use RACE when you discover a fire:

**R - RESCUE/REMOVE**
- Remove anyone in immediate danger
- Move patients and staff away from the fire
- Close doors behind you to slow fire spread

**A - ALARM/ALERT**
- Pull the fire alarm
- Call 911
- Alert others verbally: "Fire! Evacuate!"

**C - CONFINE/CONTAIN**
- Close all doors and windows
- This limits oxygen and slows fire spread
- Do NOT lock doors

**E - EXTINGUISH/EVACUATE**
- If the fire is small and you're trained, attempt to extinguish
- If the fire is large or spreading, evacuate immediately
- Never let the fire get between you and your exit

### Using a Fire Extinguisher - PASS

If you decide to fight a small fire:

**P - PULL** the pin
- Breaks the tamper seal
- Aim low at the base of the fire

**A - AIM** at the base of the fire
- Not at the flames
- Stand 6-8 feet away

**S - SQUEEZE** the handle
- This releases the extinguishing agent
- Maintain pressure throughout

**S - SWEEP** from side to side
- Move the extinguisher in a sweeping motion
- Cover the entire base of the fire
- Watch for re-ignition

### When NOT to Fight a Fire

Evacuate immediately if:
- The fire is spreading rapidly
- The fire is larger than a small trash can
- Smoke is filling the room
- Your escape route might be cut off
- You're not trained or comfortable using an extinguisher
- Your extinguisher runs out

### Fire Extinguisher Locations

Know where fire extinguishers are located in your practice:
- Reception area: _____________
- Treatment areas: _____________
- Lab/sterilization: _____________
- Break room: _____________

### Evacuation Routes

**Primary exit:** _____________
**Secondary exit:** _____________
**Assembly point:** _____________`
    },
    {
      id: 'section-3',
      type: 'scenario',
      title: 'Fire Response Scenario',
      prompt: 'You smell smoke and discover a small fire in a trash can in the break room. The fire is about the size of a basketball. What is the correct order of actions?',
      options: [
        'Evacuate immediately without doing anything else',
        'RACE: Alert others, close the break room door, use extinguisher if trained, call 911',
        'Find the nearest fire extinguisher and immediately try to put out the fire',
        'Open windows to let the smoke out, then call 911'
      ],
      correct: 1,
      explanation: `**Correct Answer: RACE: Alert others, close the break room door, use extinguisher if trained, call 911**

Following the RACE protocol ensures a systematic, safe response:

**Correct sequence:**

1. **R - Rescue** - Make sure no one is in immediate danger in the break room

2. **A - Alert** - Shout "Fire!" to warn others, pull fire alarm if available

3. **C - Confine** - Close the break room door to contain the fire and smoke

4. **E - Extinguish or Evacuate** - Since this is a small, contained fire (basketball-sized), you may attempt to extinguish IF:
   - You're trained
   - You have a clear escape route
   - The fire is small and contained

5. **Call 911** - Even if you extinguish the fire, emergency services should be notified

**Why the other answers are wrong:**

- **Evacuate immediately** - For a small, contained fire, this may be overly cautious if you can safely extinguish it, but it's not wrong if you're unsure
- **Immediately use extinguisher** - Skips alerting others and confining the fire
- **Open windows** - WRONG! Opening windows feeds oxygen to the fire and helps it spread

**Key point:** A basketball-sized fire in a trash can is at the upper limit of what should be attempted with an extinguisher. When in doubt, evacuate!`
    },
    {
      id: 'section-4',
      type: 'text',
      title: 'Medical Emergencies',
      content: `## Responding to Medical Emergencies

Medical emergencies can happen to patients during treatment, to staff, or to visitors. Quick recognition and response are critical.

### Common Medical Emergencies in Dental Settings

**Syncope (Fainting)**
- Most common emergency in dental offices
- Often caused by anxiety, pain, or vasovagal response
- Signs: Pale, sweaty, weak pulse, loss of consciousness

**Allergic Reactions/Anaphylaxis**
- Can be triggered by latex, medications, or dental materials
- Signs: Hives, swelling, difficulty breathing, rapid pulse
- **Life-threatening** - requires immediate action

**Cardiac Events**
- Heart attack, cardiac arrest
- Signs: Chest pain, shortness of breath, sweating, arm pain
- Cardiac arrest: No pulse, not breathing

**Hypoglycemia (Low Blood Sugar)**
- Common in diabetic patients
- Signs: Shakiness, confusion, sweating, weakness

**Seizures**
- Can occur in patients with epilepsy or other conditions
- Signs: Uncontrolled movements, loss of consciousness

### Basic Response Steps

**1. Recognize** the emergency
- Stay calm
- Assess the situation

**2. Call for help**
- Alert other staff
- Call 911 for serious emergencies

**3. Provide initial care**
- Position the patient appropriately
- Start CPR if needed and trained
- Use AED if available and indicated

**4. Gather information**
- Patient's medical history
- What happened before the emergency
- Any medications given

### When to Call 911

Call 911 immediately for:
- Chest pain or signs of heart attack
- Difficulty breathing
- Severe allergic reaction
- Unresponsive patient
- Seizure lasting more than 5 minutes
- Severe bleeding that won't stop
- Suspected stroke (face drooping, arm weakness, speech difficulty)

### AED Location and Use

An AED (Automated External Defibrillator) can save lives during cardiac arrest.

**AED location in your practice:** _____________

**Basic AED Steps:**
1. Turn on the AED
2. Attach pads to bare chest
3. Allow AED to analyze rhythm
4. If shock advised, ensure no one is touching patient
5. Press shock button when prompted
6. Continue CPR as directed

### Emergency Equipment Locations

- **First aid kit:** _____________
- **AED:** _____________
- **Oxygen:** _____________
- **Emergency drug kit:** _____________`
    },
    {
      id: 'section-5',
      type: 'text',
      title: 'Evacuation Procedures',
      content: `## Evacuation: Getting Everyone Out Safely

When evacuation is necessary, organized procedures ensure everyone gets out safely and is accounted for.

### When to Evacuate

Evacuate the building when:
- Fire alarm sounds
- You're instructed to evacuate
- You smell gas
- There's visible fire or heavy smoke
- Building structure is compromised
- Ordered by emergency personnel

### Evacuation Procedures

**1. Stop what you're doing**
- Secure patients if possible
- Don't take time to gather belongings

**2. Alert others**
- Use the buddy system
- Check nearby rooms and restrooms

**3. Help those who need assistance**
- Patients in treatment
- Mobility-impaired individuals
- Visitors unfamiliar with exits

**4. Use proper exit routes**
- Follow marked evacuation routes
- Use stairs, NEVER elevators during fire
- Close doors behind you (don't lock)

**5. Go to the assembly point**
- Don't stop at your car
- Don't leave the premises
- Wait for further instructions

### Patient Considerations During Evacuation

**Patients in treatment:**
- Remove instruments from mouth
- Lower chair to upright position
- Help patient walk or use wheelchair
- Bring any necessary medications

**Special needs:**
- Know which patients have mobility issues
- Plan assistance in advance
- Consider patients under sedation

### The Assembly Point

Your practice's assembly point is: **_____________**

**At the assembly point:**
- Stay together as a group
- Supervisors account for all staff
- Report anyone missing to emergency personnel
- Don't re-enter the building until cleared

### Accounting for Everyone

After evacuation:
1. **Staff accountability** - Supervisor confirms all staff present
2. **Patient accountability** - Confirm all patients evacuated
3. **Visitor check** - Account for vendors, family members
4. **Report** - Inform emergency responders of anyone missing

### Do NOT Re-enter

Never go back into a building during an emergency to:
- Retrieve belongings
- Search for someone
- "Check on things"

Wait for emergency personnel to give the all-clear.`
    },
    {
      id: 'section-6',
      type: 'scenario',
      title: 'Evacuation Scenario',
      prompt: 'The fire alarm sounds while you have a patient in the middle of a procedure. The patient has a rubber dam in place. What should you do?',
      options: [
        'Finish the procedure quickly so the patient can leave safely',
        'Remove the rubber dam and instruments, help the patient up, and evacuate to the assembly point',
        'Leave the patient in the chair and evacuate yourself first - you can\'t help others if you\'re hurt',
        'Wait to see if it\'s a real emergency or just a drill before taking action'
      ],
      correct: 1,
      explanation: `**Correct Answer: Remove the rubber dam and instruments, help the patient up, and evacuate to the assembly point**

Patient safety during evacuation is your responsibility, but you must first make them safe to move.

**Correct procedure:**

1. **Stop the procedure immediately** - Don't try to finish
2. **Remove any items from the patient's mouth:**
   - Rubber dam and clamp
   - Cotton rolls
   - Any instruments
3. **Lower the chair** to upright position
4. **Help the patient up** - Remove the bib
5. **Guide them to the exit** - Stay with them
6. **Evacuate to the assembly point**
7. **Account for the patient** with your team

**Why the other answers are wrong:**

- **Finish the procedure** - NEVER continue during an alarm. Seconds count in emergencies.

- **Leave the patient** - Abandoning a patient is never acceptable. They are your responsibility. The exception is if your own life is in immediate danger (heavy smoke, fire blocking your path).

- **Wait to see if it's real** - ALWAYS treat every alarm as real. You cannot know if it's a drill or actual emergency. Respond every time.

**Key principle:** Stop, secure, evacuate. The procedure can be completed another day; lives cannot be replaced.`
    },
    {
      id: 'section-7',
      type: 'text',
      title: 'Severe Weather Emergencies',
      content: `## Severe Weather Response

Different weather emergencies require different responses. Know what to do for the hazards most common in your area.

### Tornado Warning

A tornado WARNING means a tornado has been sighted or indicated on radar.

**Immediate actions:**
1. Move to the designated shelter area
2. Go to the lowest level of the building
3. Stay away from windows and glass
4. Get under sturdy furniture or cover your head
5. Remain in shelter until all-clear is given

**Best shelter locations:**
- Interior rooms without windows
- Hallways on lowest floor
- Under sturdy desks or tables
- Away from large open rooms

**Avoid:**
- Windows and exterior walls
- Large open areas (waiting rooms)
- Rooms with heavy equipment that could fall

### Severe Thunderstorm/Lightning

**When thunder roars, go indoors!**

- Move patients and staff away from windows
- Unplug sensitive electronic equipment if time permits
- Don't use landline phones during lightning
- Wait 30 minutes after last thunder before resuming outdoor activities

### Earthquake Response

**During the earthquake:**
- **DROP** to your hands and knees
- **COVER** under a sturdy desk or table
- **HOLD ON** until shaking stops
- Stay away from windows and items that could fall
- Do NOT run outside during shaking

**After the earthquake:**
- Check for injuries
- Check for hazards (gas leaks, structural damage)
- Evacuate if building is damaged
- Be prepared for aftershocks

### Power Outages

**Immediate actions:**
- Use flashlights, not candles
- Check on any patients in treatment
- Secure medications requiring refrigeration
- Follow practice protocols for power failure

**Extended outage:**
- May need to reschedule patients
- Protect temperature-sensitive materials
- Know backup power capabilities`
    },
    {
      id: 'section-8',
      type: 'text',
      title: 'Workplace Violence and Active Shooter',
      content: `## Workplace Violence Response

While rare, workplace violence including active shooter situations can occur. Being mentally prepared improves your chances of survival.

### Warning Signs of Potential Violence

Be aware of concerning behaviors:
- Verbal threats or intimidation
- Aggressive or erratic behavior
- Obsession with violence or weapons
- Significant changes in behavior
- Expressions of hopelessness or intent to harm

**Report concerns to your supervisor or security immediately.**

### Active Shooter: RUN - HIDE - FIGHT

**RUN (Evacuate if possible)**

If there is an escape path, attempt to evacuate:
- Leave belongings behind
- Help others escape if possible
- Prevent others from entering the danger zone
- Call 911 when safe
- Follow police instructions

**HIDE (If you can't evacuate)**

Find a place to hide:
- Lock and barricade the door
- Turn off lights
- Silence your phone
- Hide behind large objects
- Remain quiet and out of sight
- Spread out if with others (don't huddle)

**FIGHT (As a last resort)**

If your life is in imminent danger:
- Act with physical aggression
- Throw items at the attacker
- Use improvised weapons
- Commit fully to your actions
- Work together if with others

### Interacting with Law Enforcement

When police arrive:
- Remain calm
- Keep hands visible
- Follow all instructions
- Don't point or yell
- Don't hold anything in your hands
- Don't ask questions - just follow orders
- Evacuate in the direction police indicate

### After an Incident

- Seek medical attention if needed
- Expect to be interviewed by law enforcement
- Access counseling and support services
- Report any lingering concerns

### De-escalation Techniques

For confrontational (non-active shooter) situations:
- Remain calm and speak softly
- Don't argue or challenge
- Maintain a safe distance
- Keep hands visible
- Look for escape routes
- Alert others if possible (code word/signal)

### Your Practice's Code Word

Many practices use a code word to discreetly alert staff to danger:

**Code word: _____________**

If you hear this word, follow your practice's emergency procedures.`
    }
  ],
  quiz: {
    questions: [
      {
        id: 'q1',
        question: 'What does the "R" in the RACE fire response protocol stand for?',
        options: ['Run', 'Rescue/Remove', 'Report', 'Respond'],
        correct: 1
      },
      {
        id: 'q2',
        question: 'When using a fire extinguisher, where should you aim?',
        options: [
          'At the top of the flames',
          'At the middle of the flames',
          'At the base of the fire',
          'Above the fire to smother it'
        ],
        correct: 2
      },
      {
        id: 'q3',
        question: 'What does PASS stand for when using a fire extinguisher?',
        options: [
          'Push, Aim, Spray, Sweep',
          'Pull, Aim, Squeeze, Sweep',
          'Point, Activate, Spray, Stop',
          'Prepare, Alert, Spray, Secure'
        ],
        correct: 1
      },
      {
        id: 'q4',
        question: 'During a fire evacuation, should you use the elevator?',
        options: [
          'Yes, it\'s faster than stairs',
          'Only if you have mobility issues',
          'Never use elevators during a fire',
          'Only if the fire is on a different floor'
        ],
        correct: 2
      },
      {
        id: 'q5',
        question: 'What is the most common medical emergency in dental offices?',
        options: ['Heart attack', 'Allergic reaction', 'Syncope (fainting)', 'Seizure'],
        correct: 2
      },
      {
        id: 'q6',
        question: 'After evacuating, where should you go?',
        options: [
          'To your car to leave the area',
          'Back inside to check on things',
          'To the designated assembly point',
          'Home, since the workday is disrupted'
        ],
        correct: 2
      },
      {
        id: 'q7',
        question: 'During a tornado warning, what is the best action?',
        options: [
          'Go outside to see the tornado',
          'Stand by windows to watch for the tornado',
          'Move to an interior room on the lowest level, away from windows',
          'Get in your car and drive away'
        ],
        correct: 2
      },
      {
        id: 'q8',
        question: 'What is the correct response during an earthquake?',
        options: [
          'Run outside immediately',
          'Drop, Cover, and Hold On',
          'Stand in a doorway',
          'Get under the heaviest furniture'
        ],
        correct: 1
      },
      {
        id: 'q9',
        question: 'In an active shooter situation, what are the three response options in order of preference?',
        options: [
          'Fight, Hide, Run',
          'Hide, Run, Fight',
          'Run, Hide, Fight',
          'Call 911, Run, Hide'
        ],
        correct: 2
      },
      {
        id: 'q10',
        question: 'If a fire alarm sounds while you have a patient in the chair, what should you do?',
        options: [
          'Finish the procedure then evacuate',
          'Wait to see if it\'s a drill',
          'Stop the procedure, secure the patient, and evacuate',
          'Leave the patient and save yourself first'
        ],
        correct: 2
      }
    ]
  }
};

export default emergencyActionPlanContent;
