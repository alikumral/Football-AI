## PLAYER INFORMATION

Player profiles, measurable athletic attributes, position taxonomy and coach-rated skill definitions | Technical Specification v1.2

## 1. Player Profile

| Field | Definition | Example |
| --- | --- | --- |
| First Name | Player first name | James |
| Last Name | Player last name | Mitchell |
| Date of Birth | ISO date; age derived automatically | 1999-04-15 |
| Age | Calculated from date of birth | 27 |
| Nationality | Nationality recorded for the player | American |
| Height | Standing height without footwear | 188 cm |
| Weight | Current body mass | 108 kg |
| Jersey Number | Player jersey number | 55 |
| Primary Position | Primary playing position | DE |
| Secondary Position | Additional playing position | OLB |
| Position Archetype | Team-defined positional playing style | Speed Rusher |
| Dominant Hand | Preferred hand | Right |
| Dominant Foot | Preferred foot | Left |
| Playing Experience | Years of organized American football | 8 years |
| Roster Role | Roster designation | Starter |
| Availability Status | Current participation availability | Active |

Example values are illustrative and shown in muted italic type. Player descriptions are maintained elsewhere in the application and are outside the scope of this specification.

## 2. Physical and Athletic Measurements

## 2.1 Anthropometrics

| Metric | Definition | Example |
| --- | --- | --- |
| Height | Standing height without footwear | 188 cm |
| Weight | Body mass at time of testing | 108 kg |
| Wingspan | Fingertip-to-fingertip distance | 195 cm |
| Arm Length | Standardized arm-length measurement | 84 cm |
| Hand Length | Wrist crease to middle fingertip | 20 cm |
| Hand Span | Thumb-to-little-finger spread | 24 cm |
| Standing Reach | Maximum standing vertical reach | 242 cm |


## 2.2 Speed and Acceleration

| Metric | Definition | Example |
| --- | --- | --- |
| 5-Yard Sprint | Initial sprint time over five yards | 1.04 s |
| 10-Yard Split | Cumulative time from 0 to 10 yards | 1.62 s |
| 20-Yard Split | Cumulative time from 0 to 20 yards | 2.76 s |
| 40-Yard Dash | Total time from 0 to 40 yards | 4.68 s |
| 10-20 Yard Segment | Elapsed time between 10 and 20 yards | 1.14 s |
| 20-40 Yard Segment | Elapsed time between 20 and 40 yards | 1.92 s |
| Flying 10-Yard Sprint | Timed segment following running buildup | 0.99 s |
| Maximum Sprint Speed | Highest measured instantaneous speed | 32.1 km/h |
| Acceleration | Estimated rate of velocity increase | 4.2 m/s² |
| Sprint Momentum | Body mass multiplied by measured velocity | 950 kg·m/s |

## 2.3 Agility and Change of Direction

| Metric | Definition | Example |
| --- | --- | --- |
| 20-Yard Shuttle (5-10-5) | Lateral acceleration, braking and redirection | 4.32 s |
| Three-Cone Drill | Multidirectional movement and turning efficiency | 7.02 s |
| 60-Yard Shuttle | Repeated change-of-direction performance | 11.45 s |
| 505 Agility Test | 180-degree braking and reacceleration | 2.34 s |
| Reactive Agility | Response-based movement under unpredictable stimuli | 1.87 s |
| Deceleration Capacity | Rate of speed reduction during controlled braking | -5.4 m/s² |
| Left/Right COD Asymmetry | Difference between directional cutting performances | 4.1% |

## 2.4 Explosive Power and Strength

| Metric | Definition | Example |
| --- | --- | --- |
| Vertical Jump | Maximum vertical jump displacement | 86 cm |
| Broad Jump | Standing horizontal jump distance | 295 cm |
| Countermovement Jump | Jump height using a countermovement | 42 cm |
| Squat Jump | Jump height from a static squat position | 37 cm |
| Reactive Strength Index | Jump height divided by ground contact time in defined protocol | 2.1 |
| RSI-modified | CMJ jump height divided by time to takeoff | 0.52 m/s |
| Isometric Mid-Thigh Pull | Peak force in standardized isometric pull | 3,200 N |
| Relative Peak Force | Peak measured force normalized by body mass | 29.6 N/kg |
| Bench Press 225 lb | Repetitions at standard load | 24 reps |
| Bench Press 1RM | Maximum one-repetition bench press load | 155 kg |
| Trap Bar Jump Power | Measured or estimated jump power | 5,200 W |


## 2.5 Cardiovascular Capacity and Aerobic Recovery

| Metric | Definition | Example |
| --- | --- | --- |
| VO2max | Maximum oxygen uptake relative to body mass | 52.5 mL/kg/min |
| Absolute VO2max | Maximum total oxygen consumption | 5.67 L/min |
| Maximum Heart Rate | Highest HR recorded during standardized maximal exercise | 193 bpm |
| Resting Heart Rate | HR measured under standardized resting conditions | 54 bpm |
| Heart Rate Recovery - 60s | HR decrease 60 seconds after a defined exercise bout | 32 bpm |
| Heart Rate Recovery - 120s | HR decrease 120 seconds after a defined exercise bout | 51 bpm |
| Ventilatory Threshold 1 | Exercise intensity at first ventilatory threshold | 68% VO2max |
| Ventilatory Threshold 2 | Exercise intensity at second ventilatory threshold | 87% VO2max |

## 2.6 Intermittent Endurance and Repeated Sprint Ability

| Metric | Definition | Example |
| --- | --- | --- |
| Yo-Yo IR1 Distance | Distance completed in Yo-Yo Intermittent Recovery Level 1 | 1,640 m |
| Yo-Yo IR2 Distance | Distance completed in Yo-Yo Intermittent Recovery Level 2 | 800 m |
| 30-15 IFT Final Speed | Highest completed stage speed in 30-15 intermittent test | 19.0 km/h |
| Repeated Sprint Best Time | Fastest sprint in standardized repeat protocol | 3.12 s |
| Repeated Sprint Mean Time | Mean sprint time across repeated bouts | 3.29 s |
| Repeated Sprint Decrement | Percentage deterioration across sprint repetitions | 5.4% |
| Repeated Sprint Total Time | Sum of sprint completion times | 19.74 s |

Illustrative repeated-sprint test protocol: six 20-yard sprints with 25 seconds passive recovery. This is a proposed internal protocol; it is not an established position-specific normative standard. VO2max alone is not a measure of ability to maintain football game performance.

## 2.7 Football-Specific Conditioning and Performance Retention

| Metric | Definition | Example |
| --- | --- | --- |
| Repeated Play Performance | Output maintained from early to late repetitions in a defined | 93% |
| Retention | football drill |   |
| Acceleration Retention | Initial acceleration performance retained after repeated efforts | 91% |
| Late-Session Sprint Retention | Sprint performance retained late in a defined session | 94% |
| Repeated Contact Performance | Initial output maintained through standardized repeated contact | 89% |
|   | actions |   |
| Workload Recovery Index | Team-defined composite of recovery between efforts | 84/100 |

These are proposed application-derived indicators, not established universal laboratory metrics. Implement only after defining and validating consistent tests, formulas and devices.


## 2.8 Video-Tracking Performance Fields (Later Integration)

| Metric | Definition | Example |
| --- | --- | --- |
| Peak In-Game Speed | Maximum observed movement speed during play | 30.8 km/h |
| In-Game Acceleration | Acceleration derived from player tracking | 3.9 m/s² |
| Closing Speed | Defender velocity when approaching a target | 24.5 km/h |
| Distance Traveled | Total travel distance during an identified play | 34.2 m |
| Separation at Target | Distance from receiver to nearest assigned defender at target | 2.4 yd |
| Time to Pressure | Elapsed time from snap to qualifying QB pressure | 2.6 s |
| Route Depth | Downfield route depth referenced to LOS | 14 yd |
| Time to Throw | Elapsed time from snap to pass release | 2.45 s |
| Pre-Snap Motion Speed | Movement speed during pre-snap motion | 12.3 km/h |

Tracking values require a reliable source video, sufficient player visibility and calibrated coordinates. Missing observations must not be

inferred as verified measurements.

## 3. Position Classification

| Unit | Position Group | Position Codes | Example Role |
| --- | --- | --- | --- |
| Offense | Quarterback | QB | Dual-Threat QB |
| Offense | Running Back | RB, HB, FB | Power Back |
| Offense | Wide Receiver | WR, X, Z, Slot | Vertical Threat |
| Offense | Tight End | TE, Y, H-Back | Inline Blocking TE |
| Offense | Offensive Tackle | LT, RT | Blindside Pass Protector |
| Offense | Offensive Guard | LG, RG | Pulling Guard |
| Offense | Center | C | Protection Leader |
| Defense | Interior Defensive Line | NT, DT | 3-Tech Penetrator |
| Defense | Edge Defender | DE, EDGE, OLB | Speed Rusher |
| Defense | Linebacker | MIKE, WILL, SAM, ILB | Coverage Linebacker |
| Defense | Cornerback | CB, Nickel, Slot CB | Press-Man Corner |
| Defense | Safety | FS, SS, Box S | Deep Middle Safety |
| Special Teams | Kicker | K, KO | Kickoff Specialist |
| Special Teams | Punter | P | Directional Punter |
| Special Teams | Long Snapper | LS | Specialist |
| Special Teams | Returner | KR, PR | Kick Return Specialist |
| Special Teams | Holder | H | Placekick Holder |

Position codes, alignment/technique designations, tactical roles and archetypes must remain separate, configurable data objects. A player may have several positions.


## 4. Position-Specific Skills (Coach Rating: 0-100)

The following library provides default skill names and operational definitions. Example ratings are illustrative coach inputs, not benchmark values. Inapplicable skills may remain inactive for a team or position.

## 4.1 Quarterback (QB)

| Skill | Operational Definition |
| --- | --- |
| Short Accuracy | Placement and consistency on short throws |
| Intermediate Accuracy | Accuracy on intermediate passing concepts |
| Deep Accuracy | Placement, timing and trajectory on vertical throws |
| Arm Strength | Ability to generate throwing velocity and distance |
| Release Mechanics | Efficiency and repeatability of throwing motion |
| Release Quickness | Speed of delivery after the decision |
| Footwork | Dropback mechanics, balance and throwing platform |
| Pocket Movement | Navigation under pressure while preserving throwing posture |
| Pressure Management | Decision quality and execution under pressure |
| Coverage Recognition | Identification of structure and post-snap rotations |
| Progression Processing | Speed and accuracy of progression reads |
| Anticipation | Delivery before receivers visibly become open |
| Throwing on the Move | Throwing performance outside a stable platform |
| Play-Action Execution | Selling the run fake and transitioning into pass concepts |
| Ball Security | Protection of the football in the pocket and on runs |
| Scramble Decision-Making | Recognition of appropriate escape or run opportunities |
| RPO Decision-Making | Correct run-pass conflict reads |
| Pre-Snap Command | Management of checks, protections and alignments |

Illustrative rating: Coverage Recognition: 91/100


## 4.2 Running Back (RB / HB / FB)

| Skill | Operational Definition |
| --- | --- |
| Run Vision | Identification and anticipation of developing lanes |
| Gap Discipline | Execution of the intended entry point |
| First-Step Burst | Initial acceleration after taking possession |
| One-Cut Ability | Decisive cuts with limited speed loss |
| Lateral Agility | Lateral redirection in confined space |
| Contact Balance | Maintaining control and progress through contact |
| Pad Level | Effective leverage through contact |
| Tackle Breaking | Defeating attempted tackles |
| Ball Security | Reliable ball protection |
| Inside Zone Execution | Reading and executing inside-zone concepts |
| Outside Zone Execution | Pressing, patience and cutting in outside zone |
| Gap Scheme Execution | Following pullers and intended gap entries |
| Route Running | Precision in RB receiving concepts |
| Receiving | Catch mechanics and ball tracking |
| Pass Protection Recognition | Identification of rushers and protection assignments |
| Pass Blocking Technique | Technique and leverage in pass protection |
| Open-Field Elusiveness | Defeating defenders in space |

Illustrative rating: Run Vision: 90/100


## 4.3 Wide Receiver (WR / X / Z / Slot)

| Skill | Operational Definition |
| --- | --- |
| Press Release | Defeating press coverage at the line |
| Release Variation | Adapting releases to leverage and alignment |
| Route Precision | Depth, angles, stems and route landmarks |
| Route Tempo | Manipulating speed and timing on routes |
| Break Efficiency | Deceleration and redirection at breakpoints |
| Separation Ability | Creating functional space against coverage |
| Leverage Recognition | Identifying and attacking defender leverage |
| Man Coverage Beating | Execution against individual coverage |
| Zone Awareness | Finding windows and adjusting to zone |
| Catch Technique | Receiving mechanics and reliability |
| Catch Radius | Securing balls outside ideal frame |
| Contested Catching | Securing receptions through contact |
| Deep Ball Tracking | Tracking and adjusting to downfield passes |
| Sideline Body Control | Maintaining position and control near boundaries |
| Yards After Catch | Creating additional gains after reception |
| Blocking Technique | Perimeter and stalk blocking execution |
| Scramble Drill Awareness | Adjusting routes when QB leaves the designed structure |

Illustrative rating: Route Precision: 92/100


## 4.4 Tight End (TE / Y / H-Back)

| Skill | Operational Definition |
| --- | --- |
| Inline Run Blocking | Run blocks from attached alignment |
| Reach Blocking | Establishing outside leverage |
| Down Blocking | Angle blocks toward interior defenders |
| Combo Blocking | Coordinating double-team actions and climbs |
| Arc Release | Releasing around the edge without engagement |
| Split Zone Blocking | Backside sift and split-flow blocks |
| Pass Protection | Protection against defensive rushers |
| Chip Technique | Disrupting rushers before releasing |
| Route Running | Timing and precision of TE concepts |
| Seam Threat | Threatening vertical seams |
| Zone Recognition | Identifying voids in zone defense |
| Contested Catching | Securing passes through contact |
| Catch Radius | Completing catches outside ideal frame |
| Yards After Catch | Creating gains after receiving |
| Alignment Versatility | Execution from inline, wing, slot and backfield |

Illustrative rating: Inline Run Blocking: 89/100

## 4.5 Offensive Tackle (LT / RT)

| Skill | Operational Definition |
| --- | --- |
| Pass Set Footwork | Depth, timing and balance on pass sets |
| Kick Slide | Maintaining controlled lateral depth |
| Hand Placement | Effective initial hand contact |
| Punch Timing | Engaging at the correct time and distance |
| Independent Hand Usage | Using each hand independently to control the rusher |
| Pass Protection Anchor | Resisting power and maintaining pocket depth |
| Speed Rush Protection | Protecting against outside speed rush |
| Inside Counter Recognition | Recognizing inside counter moves |
| Run Drive Blocking | Creating displacement at point of attack |
| Reach Blocking | Establishing outside positioning |
| Zone Blocking | Footwork and leverage in zone assignments |
| Pulling & Space Blocking | Movement and blocking in open space |
| Second-Level Blocking | Finding and engaging linebackers |
| Stunt Recognition | Identifying and exchanging line games |
| Recovery Technique | Regaining leverage after disadvantage |

Illustrative rating: Pass Protection Anchor: 88/100


## 4.6 Offensive Guard (LG / RG)

| Skill | Operational Definition |
| --- | --- |
| First-Step Quickness | Initial movement speed and precision |
| Hand Placement | Strike accuracy and hand control |
| Pass Protection Anchor | Resisting interior power rush |
| Interior Pass Set | Balanced protection against interior rush |
| Double-Team Execution | Coordinated displacement with a teammate |
| Combo-to-Linebacker Timing | Timing of climb from combination block |
| Pulling Technique | Footwork and angles when pulling |
| Trap / Kick-Out Blocking | Execution of trap and kick-out blocks |
| Zone Blocking | Zone steps and leverage rules |
| Gap Scheme Blocking | Power, counter and gap-scheme execution |
| Reach Blocking | Crossing defender face to gain leverage |
| Stunt & Twist Recognition | Identification and exchange of rush games |
| Second-Level Targeting | Locating intended second-level defender |
| Recovery Balance | Restoring leverage after displacement |

Illustrative rating: Pulling Technique: 93/100

## 4.7 Center (C)

| Skill | Operational Definition |
| --- | --- |
| Snap Consistency | Accuracy and repeatability of exchange |
| Shotgun Snap Accuracy | Accuracy of shotgun snaps |
| Post-Snap Transition | Immediate transition from snap to block |
| Protection Identification | Identification of pressure and assignments |
| Protection Communication | Effectiveness of line calls and checks |
| Interior Pass Protection | Blocking interior pass rushers |
| Leverage & Anchor | Resisting displacement while protecting pocket |
| Combination Blocking | Coordinating doubles and climb timing |
| Reach Blocking | Reaching shaded defenders |
| Second-Level Blocking | Engaging linebackers |
| Stunt Recognition | Recognizing and communicating line games |
| Hand Placement | Effective initial contact and control |
| Snap-to-Block Coordination | Blocking execution immediately after snapping |

Illustrative rating: Snap Consistency: 96/100


*4.8 EDGE / Defensive End (DE / Rush OLB)*

| Skill | Operational Definition |
| --- | --- |
| Get-Off | Snap timing and initial explosiveness |
| Speed Rush | Threatening the blocker outside shoulder |
| Speed-to-Power | Converting speed into forceful contact |
| Bull Rush | Collapsing protection through direct power |
| Rip Move | Disengaging with upward ripping motion |
| Swim Move | Over-the-top arm movement to defeat blocks |
| Club Move | Displacing blocker hands or upper body |
| Cross-Chop | Removing hands using coordinated chopping action |
| Long-Arm Technique | Extended-arm leverage and control |
| Inside Counter | Redirecting inside following outside threat |
| Bend & Cornering | Maintaining efficient angles around edge |
| Edge Setting | Maintaining outside contain against run |
| Block Shedding | Separating from an engaged blocker |
| Run Fit Discipline | Assigned gap and force responsibilities |
| Pursuit Angles | Efficient paths to ball carrier |
| Tackling | Finishing tackles across situations |
| Pass-Rush Plan | Sequencing and adapting rush moves |
| Zone Coverage | Executing zone drops when assigned |

Illustrative rating: Rip Move: 88/100


## 4.9 Interior Defensive Line (DT / NT)

| Skill | Operational Definition |
| --- | --- |
| First-Step Quickness | Initial post-snap explosiveness |
| Pad Level | Establishing favorable leverage |
| Hand Violence | Power and accuracy of strikes |
| Block Recognition | Identifying offensive blocking concepts |
| Double-Team Resistance | Holding position against coordinated blockers |
| Gap Integrity | Maintaining assigned gaps |
| Two-Gap Control | Controlling blocker and reacting to either assigned gap |
| One-Gap Penetration | Penetrating the designated gap |
| Block Shedding | Separating from blockers |
| Bull Rush | Penetrating through power |
| Push-Pull Technique | Manipulating opponent balance |
| Interior Pass-Rush Moves | Executing interior pressure techniques |
| Stunt Execution | Timing and coordination of line games |
| Run Disruption | Disrupting intended run blocking |
| Tackling in Traffic | Finishing tackles in congested spaces |
| Pursuit Effort | Continuing pursuit beyond initial gap |

Illustrative rating: One-Gap Penetration: 92/100


## 4.10 Linebacker (MIKE / WILL / SAM / ILB)

| Skill | Operational Definition |
| --- | --- |
| Run Recognition | Identifying developing run concepts |
| Key Reading | Reading assigned guards, backs and keys |
| Block Recognition | Recognizing blocking structures |
| Gap Fit Discipline | Executing assigned run fits |
| Downhill Trigger | Decisive reaction toward LOS |
| Block Destruction | Defeating blockers while keeping fit |
| Stack & Shed | Engaging, controlling and shedding blockers |
| Pursuit Angles | Efficient approach to ball carrier |
| Open-Field Tackling | Finishing tackles in space |
| Zone Coverage | Executing defined zone responsibilities |
| Hook/Curl Coverage | Defending intermediate inside windows |
| Man Coverage | Covering backs and tight ends |
| Route Recognition | Recognizing receiving concepts |
| Blitz Timing | Timing pressure relative to snap |
| A-Gap Blitz Technique | Attacking interior pressure lanes |
| Coverage Communication | Coordinating defensive checks |
| Pre-Snap Diagnosis | Identifying formations and threats |

Illustrative rating: Run Recognition: 93/100


## 4.11 Cornerback (CB / Nickel / Slot CB)

| Skill | Operational Definition |
| --- | --- |
| Press Coverage | Disrupting receiver release and timing |
| Press Footwork | Balance and leverage in press |
| Mirror Technique | Matching receiver initial movement |
| Backpedal Technique | Controlled backward movement |
| Hip Transition | Changing direction with efficient hip rotation |
| Man Coverage | Tracking assigned receiver |
| Off-Man Coverage | Leverage and response from off alignment |
| Zone Coverage | Zone rules and distribution |
| Route Recognition | Anticipating receiver routes |
| Leverage Discipline | Preserving assigned leverage |
| Closing Burst | Accelerating toward target |
| Break on Ball | Timing break on thrown ball |
| Ball Tracking | Locating and adjusting to pass |
| Ball Skills | Deflecting, contesting and intercepting |
| Recovery Speed | Regaining position after losing leverage |
| Open-Field Tackling | Tackling in space |
| Run Support | Perimeter run-defense responsibilities |
| Block Defeat | Disengaging from WR/TE blocks |
| Slot Route Recognition | Recognizing interior receiver routes |
| Match Coverage Execution | Executing pattern-match rules |

Illustrative rating: Press Coverage: 92/100


## 4.12 Safety (FS / SS / Box S)

| Skill | Operational Definition |
| --- | --- |
| Deep Coverage Range | Coverage of large deep zones |
| Angle Discipline | Efficient coverage and pursuit angles |
| Route Combination Recognition | Reading coordinated route concepts |
| Coverage Rotation | Executing secondary rotations |
| Zone Coverage | Landmarks and zone assignments |
| Man Coverage | Covering assigned eligible receivers |
| Match Coverage Execution | Executing pattern-match rules |
| Ball Tracking | Tracking downfield throws |
| Ball Skills | Contesting, deflecting and intercepting |
| Closing Burst | Acceleration toward developing play |
| Open-Field Tackling | Finishing tackles in space |
| Run Fit Discipline | Assigned defensive run gaps |
| Block Defeat | Disengaging from perimeter blockers |
| Box Play | Responsibilities near LOS |
| Blitz Timing | Correct entry timing on pressure |
| Communication | Organizing coverage and adjustments |
| Pre-Snap Recognition | Identifying formations, motion and threats |

Illustrative rating: Deep Coverage Range: 94/100

## 4.13 Kicker (K / KO)

| Skill | Operational Definition |
| --- | --- |
| Field Goal Accuracy | Consistency of field goal placement |
| Kick Distance | Effective field goal range |
| Kick Trajectory | Control of kick flight path |
| Kickoff Distance | Distance produced on kickoffs |
| Kickoff Placement | Accuracy toward assigned kickoff area |
| Hang Time Control | Controlling kick flight duration |
| Operation Timing | Executing within snap-to-kick window |
| Pressure Consistency | Reliable performance in pressure situations |
| Environmental Adaptation | Adjusting to weather and surface |

Illustrative rating: Field Goal Accuracy: 89/100


## 4.14 Punter (P)

| Skill | Operational Definition |
| --- | --- |
| Punt Distance | Controlled punt distance |
| Hang Time | Duration of ball flight |
| Directional Punting | Targeting assigned areas |
| Coffin Corner Placement | Placement near the designated boundary |
| Inside-20 Placement | Controlling ball near opponent goal line |
| Operation Time | Catch-to-kick execution speed |
| Pressure Handling | Execution against rushing opponents |
| Punt Consistency | Repeatability of contact and placement |
| Illustrative rating: Directional Punting: 91/100 |   |

## 4.15 Long Snapper (LS)

| Skill | Operational Definition |
| --- | --- |
| Snap Accuracy | Placement consistency |
| Snap Velocity | Speed of ball delivery |
| Snap Consistency | Repeatability across attempts |
| Blocking Transition | Entering protection immediately after snap |
| Protection Technique | Blocking against rush |
| Pressure Execution | Maintaining technique under pressure |

Illustrative rating: Snap Accuracy: 96/100

## 4.16 Return Specialist (KR / PR)

| Skill | Operational Definition |
| --- | --- |
| Ball Tracking | Locating descending kicks |
| Catch Reliability | Securing kicks consistently |
| Return Vision | Identifying developing return lanes |
| Return Decision-Making | Choosing return, fair catch or let-ball-go |
| First-Step Burst | Initial acceleration after securing kick |
| Open-Field Elusiveness | Evading tacklers in space |
| Ball Security | Protecting ball through contact |
| Coverage Recognition | Identifying coverage lanes and leverage |

Illustrative rating: Return Vision: 91/100


## 4.17 Holder (H)

| Skill | Operational Definition |
| --- | --- |
| Snap Handling | Receiving and securing placekick snaps |
| Ball Placement | Accurate placement for kicker |
| Laces Management | Orienting ball for kick contact |
| Operation Timing | Consistent completion of hold |
| Bad-Snap Recovery | Recovering inaccurate snaps |
| Pressure Execution | Executing under opposing rush |

Illustrative rating: Ball Placement: 95/100

## 5. Universal Skills

| Skill | Operational Definition | Example |
| --- | --- | --- |
| Football IQ | Understanding game situations, concepts and responsibilities | 88/100 |
| Assignment Discipline | Consistent execution of assigned duties | 92/100 |
| Play Recognition | Identifying developing opponent concepts | 84/100 |
| Reaction Speed | Response speed to relevant cues | 86/100 |
| Spatial Awareness | Awareness of players and space | 82/100 |
| Decision-Making | Quality of decisions under game conditions | 90/100 |
| Communication | Effectiveness of on-field communication | 87/100 |
| Adaptability | Adjusting to scheme and opponent changes | 80/100 |
| Technique Consistency | Repeatability of fundamentals | 89/100 |
| Motor / Effort | Sustained effort throughout plays | 94/100 |
| Competitive Toughness | Maintaining execution under physical adversity | 85/100 |
| Versatility | Execution across different roles | 76/100 |

## 6. Skill Rating Standard

| Score | Classification | Evaluation Standard |
| --- | --- | --- |
| 0-19 | Very Limited | Skill is not demonstrated reliably |
| 20-39 | Developing | Basic execution with significant inconsistency |
| 40-59 | Functional | Adequate execution in routine situations |
| 60-74 | Above Average | Reliable execution against competitive opposition |
| 75-89 | Advanced | High-quality execution in demanding situations |
| 90-100 | Elite | Exceptional, repeatable execution relative to reference level |

Unassessed means Not Evaluated, never zero. Competitive reference level must be recorded with each assessment. Rating band names are application-defined, not official NFL or PFF scales.


## 6.1 Skill Evaluation Record

| Field | Definition | Example |
| --- | --- | --- |
| Player ID | Unique player identifier | PLY-001 |
| Position | Evaluated position | DE |
| Skill | Selected skill definition | Rip Move |
| Rating | Coach-assigned rating | 88/100 |
| Evaluation Reference | Competitive comparison level | European Professional |
| Evaluator | Assessment owner | Defensive Line Coach |
| Evaluation Date | Assessment date | 2026-11-04 |
| Evidence Source | Supporting observation | Game Film |
| Evaluation Status | Verification state | Verified |

## 7. Data and Configuration Requirements

| Component | Requirement | Example |
| --- | --- | --- |
| Custom Player Attributes | Team-specific data fields and units | Standing Reach |
| Position Definitions | Custom base positions, roles and archetypes | Hybrid LB/S |
| Multiple Positions | Player-position assignments with separate ratings | DE + OLB |
| Skill Library | Add, rename, deactivate and version skill definitions | Ghost Move |
| Position Skill Templates | Activate only applicable skills per role | DE: Rip Move |
| Skill Rating History | Preserve assessor, time and score changes | 78 to 85 |
| Measurement History | Preserve dated tests with protocol and units | 10-yard: 1.72 to 1.68 s |
| Optional Role Weights | Team-defined importance of skills | Speed Rush: 25% |
| Evidence Linking | Link evaluations to approved evidence | Game 04, Play 128 |
| Measurement Provenance | Store testing method, instrument and verification | Electronic Timing Gates |
| Not Evaluated State | Distinguish absence of assessment from zero rating | Not Evaluated |

## 7.1 Core Data Objects

| Object | Scope |
| --- | --- |
| Player | Identity and basic measurements |
| PlayerPosition | Many-to-many positions and role assignments |
| PositionSkillTemplate | Skill definitions applicable to a position or archetype |
| MeasurementDefinition | Standard metric, unit, formula and protocol |
| MeasurementRecord | Value, timestamp, method, source and status |
| SkillDefinition | Stable identifier, name, description, version |
| PlayerSkillRating | Value, reference level, assessor, timestamp and evidence |
| TeamSkillConfiguration | Team overrides and selected skill templates |


## 7.2 Initial Data Capture

| Stage | Required Scope |
| --- | --- |
| Initial release | Player identity, positions, archetypes, basic body measurements and coach-assessed skills |
| Initial athletic testing | 10/20/40-yard timing, 5-10-5 shuttle, vertical and broad jump, and standardized |
|   | conditioning protocols where available |
| Later integration | Video-derived metrics, automated player tracking, matchup analytics and AI personnel |
|   | recommendations |

## 8. Research References

NFL Football Operations - Next Gen Stats https://operations.nfl.com/gameday/technology/nfl-next-gen-stats/

NFL Scouting Combine - Official event

https://www.nfl.com/combine/

The Yo-Yo Intermittent Tests: A Systematic Review (2018) https://pmc.ncbi.nlm.nih.gov/articles/PMC6041409/

The Yo-Yo Intermittent Recovery Test: physiological response, reliability, and validity (2003) https://pubmed.ncbi.nlm.nih.gov/12673156/

Physiological Responses to Repeated Running Sprint Ability Tests: Systematic Review (2020) https://pmc.ncbi.nlm.nih.gov/articles/PMC7523911/

Heart Rate Monitoring in Team Sports (2018)

https://pmc.ncbi.nlm.nih.gov/articles/PMC5990631/
