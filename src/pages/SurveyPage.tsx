import React, { useState } from 'react';
import { SurveyProgress } from '../components/survey/SurveyProgress';
import { SurveyOption } from '../components/survey/SurveyOption';
import { SurveyNavigation } from '../components/survey/SurveyNavigation';
import { SurveySuccess } from '../components/survey/SurveySuccess';
import { SectionLabel } from '../components/common/SectionLabel';
import { HeroBackdrop } from '../components/common/HeroBackdrop';
import { ScrollHint } from '../components/common/ScrollHint';
import { SandTransitionImage } from '../components/common/SandTransitionImage';
import { surveyApi } from '../api/survey.api';
import type {
  CreateSurveyInput,
  UsualTravelMode,
  DifficultyFindingRide,
  ProblemFaced,
  LongestWait,
  NeededUrgentTransport,
  SeenVehicleGoingMyWay,
  NearbyVerifiedVehicleUseful,
  TrustFactor,
  WouldUseRideSignal,
  BiggestProblem,
  WouldTryIsahara,
} from '../types/survey';
import { AlertCircle, Building2, User, GraduationCap, Phone, CheckCircle2 } from 'lucide-react';

const STEP_LABELS = [
  'Travel Mode',
  'Ride Difficulty',
  'Problems Faced',
  'Longest Wait Time',
  'Urgent Transport Need',
  'Vehicles Going My Way',
  'Verified Vehicle Signal',
  'Trust & Verification Factors',
  'Ride Signal Utility',
  'Primary Bottleneck',
  'Ishara Adoption Likelihood',
  'Final Recommendations',
];

const getStepAsset = (step: number): string => {
  if (step <= 2) return '/assets/neo-museum/01.png';
  if (step <= 4) return '/assets/neo-museum/02.png';
  if (step <= 6) return '/assets/neo-museum/03.png';
  if (step <= 8) return '/assets/neo-museum/04.png';
  if (step <= 10) return '/assets/neo-museum/05.png';
  return '/assets/neo-museum/pterodactyl.png';
};

export const SurveyPage: React.FC = () => {
  // Step 0: Hero & Student Profile
  // Steps 1 to 12: Questions 1 to 12
  const [currentStep, setCurrentStep] = useState<number>(0);
  const totalSteps = 12;

  // Form State
  const [formData, setFormData] = useState<CreateSurveyInput>({
    student: {
      name: '',
      college: '',
      yearOfStudy: '',
      contact: '',
      interestedInPilot: true,
    },
    travel: {
      usualTravelMode: '' as UsualTravelMode,
      difficultyFindingRide: '' as DifficultyFindingRide,
      problemsFaced: [],
      longestWait: '' as LongestWait,
    },
    neededUrgentTransport: '' as NeededUrgentTransport,
    seenVehicleGoingMyWay: '' as SeenVehicleGoingMyWay,
    nearbyVerifiedVehicleUseful: '' as NearbyVerifiedVehicleUseful,
    trustFactors: [],
    wouldUseRideSignal: '' as WouldUseRideSignal,
    biggestProblem: '' as BiggestProblem,
    wouldTryIsahara: '' as WouldTryIsahara,
    improvementSuggestion: '',
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const handleStepChange = (newStep: number) => {
    setValidationWarning(null);
    setErrorMessage(null);
    setCurrentStep(newStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validation rules for current step
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return formData.student.college.trim().length > 0;
      case 1:
        return Boolean(formData.travel.usualTravelMode);
      case 2:
        return Boolean(formData.travel.difficultyFindingRide);
      case 3:
        return formData.travel.problemsFaced.length > 0;
      case 4:
        return Boolean(formData.travel.longestWait);
      case 5:
        return Boolean(formData.neededUrgentTransport);
      case 6:
        return Boolean(formData.seenVehicleGoingMyWay);
      case 7:
        return Boolean(formData.nearbyVerifiedVehicleUseful);
      case 8:
        return formData.trustFactors.length > 0;
      case 9:
        return Boolean(formData.wouldUseRideSignal);
      case 10:
        return Boolean(formData.biggestProblem);
      case 11:
        return Boolean(formData.wouldTryIsahara);
      case 12:
        return true; // Free-text is optional per backend schema
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!canProceed()) {
      if (currentStep === 0) {
        setValidationWarning('Please specify your college name to proceed.');
      } else if (currentStep === 3 || currentStep === 8) {
        setValidationWarning('Please select at least one option to continue.');
      } else {
        setValidationWarning('Please choose an option to advance.');
      }
      return;
    }

    setValidationWarning(null);
    if (currentStep < totalSteps) {
      handleStepChange(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  };

  // Exclusive option handling for Question 8 (Trust Factors)
  const toggleTrustFactor = (value: TrustFactor) => {
    setFormData((prev) => {
      let updated: TrustFactor[];
      if (value === 'would_not_trust_unknown_vehicle') {
        const alreadySelected = prev.trustFactors.includes('would_not_trust_unknown_vehicle');
        updated = alreadySelected ? [] : ['would_not_trust_unknown_vehicle'];
      } else {
        const filtered = prev.trustFactors.filter(
          (item) => item !== 'would_not_trust_unknown_vehicle'
        );
        if (filtered.includes(value)) {
          updated = filtered.filter((item) => item !== value);
        } else {
          updated = [...filtered, value];
        }
      }
      return { ...prev, trustFactors: updated };
    });
  };

  // Multiple selection helper for Question 3 (Problems Faced)
  const toggleProblemFaced = (value: ProblemFaced) => {
    setFormData((prev) => {
      const exists = prev.travel.problemsFaced.includes(value);
      const updated = exists
        ? prev.travel.problemsFaced.filter((item) => item !== value)
        : [...prev.travel.problemsFaced, value];
      return {
        ...prev,
        travel: {
          ...prev.travel,
          problemsFaced: updated,
        },
      };
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: CreateSurveyInput = {
      student: {
        name: formData.student.name?.trim() || undefined,
        college: formData.student.college.trim(),
        yearOfStudy: formData.student.yearOfStudy?.trim() || undefined,
        contact: formData.student.contact?.trim() || undefined,
        interestedInPilot: Boolean(formData.student.interestedInPilot),
      },
      travel: {
        usualTravelMode: formData.travel.usualTravelMode,
        difficultyFindingRide: formData.travel.difficultyFindingRide,
        problemsFaced: formData.travel.problemsFaced,
        longestWait: formData.travel.longestWait,
      },
      neededUrgentTransport: formData.neededUrgentTransport,
      seenVehicleGoingMyWay: formData.seenVehicleGoingMyWay,
      nearbyVerifiedVehicleUseful: formData.nearbyVerifiedVehicleUseful,
      trustFactors: formData.trustFactors,
      wouldUseRideSignal: formData.wouldUseRideSignal,
      biggestProblem: formData.biggestProblem,
      wouldTryIsahara: formData.wouldTryIsahara,
      improvementSuggestion: formData.improvementSuggestion?.trim() || undefined,
    };

    try {
      await surveyApi.submitSurvey(payload);
      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error('Submission failed:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Something went wrong while saving your survey response. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSurvey = () => {
    setFormData({
      student: {
        name: '',
        college: '',
        yearOfStudy: '',
        contact: '',
        interestedInPilot: true,
      },
      travel: {
        usualTravelMode: '' as UsualTravelMode,
        difficultyFindingRide: '' as DifficultyFindingRide,
        problemsFaced: [],
        longestWait: '' as LongestWait,
      },
      neededUrgentTransport: '' as NeededUrgentTransport,
      seenVehicleGoingMyWay: '' as SeenVehicleGoingMyWay,
      nearbyVerifiedVehicleUseful: '' as NearbyVerifiedVehicleUseful,
      trustFactors: [],
      wouldUseRideSignal: '' as WouldUseRideSignal,
      biggestProblem: '' as BiggestProblem,
      wouldTryIsahara: '' as WouldTryIsahara,
      improvementSuggestion: '',
    });
    setIsSubmitted(false);
    setCurrentStep(0);
    setErrorMessage(null);
  };

  if (isSubmitted) {
    return (
      <div className="py-12 px-6">
        <SurveySuccess
          onReset={resetSurvey}
          collegeName={formData.student.college}
          interestedInPilot={formData.student.interestedInPilot}
        />
      </div>
    );
  }

  // STEP 0: Hero & Student Intake
  if (currentStep === 0) {
    return (
      <div className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden">
        <HeroBackdrop theme="light" overlayOpacity={0.65} />

        <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 pt-12 md:pt-20 pb-12 w-full">
          {/* Top Label & Micro Pill badges */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <SectionLabel number="01" label="STUDENT MOBILITY RESEARCH" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-neutral-300 rounded-full bg-white/80">
                RESEARCH
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-neutral-300 rounded-full bg-white/80">
                AUTHENTIC
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 border border-neutral-300 rounded-full bg-white/80">
                ANONYMIZED
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Headline Column */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-neutral-950 leading-[1.08] font-sans">
                Curated from everyday commutes &amp; discovery.
              </h1>
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed max-w-xl">
                Step into student transit realities. Share your post-class travel friction, wait-time bottlenecks, and test the viability of real-time verified ride signals. Takes ~2 minutes.
              </p>

              {/* Validation Warning */}
              {validationWarning && (
                <div className="rounded-none border border-neutral-900 bg-neutral-900 text-white p-4 text-xs font-mono tracking-wide flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-white shrink-0" />
                  <span>{validationWarning}</span>
                </div>
              )}
            </div>

            {/* Right Student Profile Setup Card */}
            <div className="lg:col-span-5 bg-white/95 border border-neutral-300 p-6 sm:p-8 backdrop-blur-sm shadow-sm">
              <div className="mb-6">
                <SectionLabel number="ID" label="RESPONDENT CONTEXT" className="mb-2" />
                <h2 className="text-lg font-medium text-neutral-900">
                  Select your campus corridor
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Helps us cluster route demand. All entries are strictly confidential.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-700 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>College / University <span className="text-rose-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SR Group of Institutions, DTU, IIT..."
                    value={formData.student.college}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        student: { ...formData.student, college: e.target.value },
                      })
                    }
                    className="w-full border border-neutral-300 bg-[#fcfcfc] px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Name <span className="text-[9px] text-neutral-400">(Optional)</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul"
                      value={formData.student.name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          student: { ...formData.student, name: e.target.value },
                        })
                      }
                      className="w-full border border-neutral-300 bg-[#fcfcfc] px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-700 mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Year <span className="text-[9px] text-neutral-400">(Optional)</span></span>
                    </label>
                    <select
                      value={formData.student.yearOfStudy || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          student: { ...formData.student, yearOfStudy: e.target.value },
                        })
                      }
                      className="w-full border border-neutral-300 bg-[#fcfcfc] px-4 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
                    >
                      <option value="">Select Year...</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Contact <span className="text-[9px] text-neutral-400">(Optional)</span></span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. rahul@example.com or phone"
                    value={formData.student.contact || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        student: { ...formData.student, contact: e.target.value },
                      })
                    }
                    className="w-full border border-neutral-300 bg-[#fcfcfc] px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
                  />
                </div>

                <div className="border border-neutral-200 bg-neutral-50/70 p-3.5">
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.student.interestedInPilot}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          student: {
                            ...formData.student,
                            interestedInPilot: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 h-4 w-4 rounded-none border-neutral-400 text-neutral-900 focus:ring-neutral-900"
                    />
                    <div>
                      <span className="block text-xs font-semibold text-neutral-900 uppercase font-mono tracking-wider">
                        Enroll in Ishara Student Pilot
                      </span>
                      <span className="block text-[11px] text-neutral-500 mt-0.5 leading-snug">
                        Receive early prototype access to our live ride-signal network.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-2">
                  <SurveyNavigation
                    canGoBack={false}
                    onBack={handleBack}
                    onNext={handleNext}
                    isLastStep={false}
                    canProceed={canProceed()}
                    nextButtonText="START SURVEY QUESTIONS"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <ScrollHint label="12 TELEMETRY QUESTIONS BELOW" />
          </div>
        </div>
      </div>
    );
  }

  // STEPS 1-12: The Two-Column Chapter Panel (Section 3C Architecture)
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-12 py-10 md:py-16">
      {/* Top Banner Progress on Mobile */}
      <div className="block lg:hidden mb-6">
        <SurveyProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          categoryTitle={`QUESTION ${currentStep} OF ${totalSteps}`}
        />
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 border border-neutral-900 bg-neutral-900 text-white p-4 font-mono text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-white mt-0.5" />
          <div>
            <p className="font-semibold uppercase tracking-wider">Transmission Error</p>
            <p className="mt-0.5 text-neutral-300">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Validation Warning */}
      {validationWarning && (
        <div className="mb-4 border border-neutral-900 bg-neutral-100 p-3.5 text-neutral-900 font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-neutral-900 shrink-0" />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* Main Split Grid (3C Architecture) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border border-neutral-300 shadow-sm">
        {/* LEFT COLUMN: Museum Artifact Visual & Step Chapter List */}
        <div className="lg:col-span-5 bg-[#0a0a0a] text-white p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800">
          <div>
            <SectionLabel
              number={String(currentStep).padStart(2, '0')}
              label="RESEARCH TELEMETRY"
              theme="dark"
              className="mb-6"
            />

            {/* Artifact Visual with SVG dissolve effect */}
            <div className="my-6 flex items-center justify-center h-48 sm:h-64 border border-neutral-800/80 bg-neutral-950 p-6 overflow-hidden">
              <SandTransitionImage
                src={getStepAsset(currentStep)}
                alt={`Stage ${currentStep} Artifact`}
                className="h-full w-full"
                imageClassName="max-h-48 object-contain filter invert contrast-125"
                transitionKey={currentStep}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            <SurveyProgress
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepsList={STEP_LABELS}
              onSelectStep={(idx) => handleStepChange(idx)}
              variant="chapterList"
              theme="dark"
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Active Question & Interactive Options */}
        <div className="lg:col-span-7 bg-[#fcfcfc] p-6 sm:p-10 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Question Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-500">
                  [ QUESTION {String(currentStep).padStart(2, '0')} ]
                </span>
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-neutral-400">
                  STAGE {currentStep} / {totalSteps}
                </span>
              </div>

              {/* STEP 1 */}
              {currentStep === 1 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    How do you usually travel from college?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Select your primary mode of commute
                  </p>
                </>
              )}

              {/* STEP 2 */}
              {currentStep === 2 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    Have you ever had difficulty finding a ride after college?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Telemetry frequency assessment
                  </p>
                </>
              )}

              {/* STEP 3 */}
              {currentStep === 3 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    What usually causes the problem?
                  </h2>
                  <p className="text-xs font-mono text-neutral-900 font-semibold uppercase tracking-wider mt-1">
                    Multiple options allowed (select all that apply)
                  </p>
                </>
              )}

              {/* STEP 4 */}
              {currentStep === 4 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    How long have you had to wait for a ride?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Longest typical waiting bottleneck
                  </p>
                </>
              )}

              {/* STEP 5 */}
              {currentStep === 5 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    Have you ever needed to leave college urgently but couldn&apos;t find transport quickly?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Medical emergencies, family contingencies, or time-critical deadlines
                  </p>
                </>
              )}

              {/* STEP 6 */}
              {currentStep === 6 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    Have you seen an auto, cab, or vehicle going towards your area but didn&apos;t know if it would stop for you?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Missed corridor capacity and discovery gap
                  </p>
                </>
              )}

              {/* STEP 7 */}
              {currentStep === 7 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    Imagine you could see that a verified vehicle going toward your area is nearby and available to stop.
                  </h2>
                  <p className="text-xs font-mono text-neutral-900 font-semibold uppercase tracking-wider mt-1">
                    Would this signal capability be useful to you?
                  </p>
                </>
              )}

              {/* STEP 8 */}
              {currentStep === 8 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    What would make you trust a vehicle/driver you don&apos;t already know?
                  </h2>
                  <p className="text-xs font-mono text-neutral-900 font-semibold uppercase tracking-wider mt-1">
                    Multiple selections allowed. &quot;I would still not trust it&quot; is exclusive.
                  </p>
                </>
              )}

              {/* STEP 9 */}
              {currentStep === 9 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    If Ishara allowed you to send a simple &quot;I need a ride&quot; signal to a nearby vehicle going your way, would you use it?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    One-touch signal for matching available corridor capacity
                  </p>
                </>
              )}

              {/* STEP 10 */}
              {currentStep === 10 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    What is your BIGGEST problem when travelling from college?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Primary systemic friction
                  </p>
                </>
              )}

              {/* STEP 11 */}
              {currentStep === 11 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    If Ishara was available at your college, how likely would you be to try it?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Early adopter intent assessment
                  </p>
                </>
              )}

              {/* STEP 12 */}
              {currentStep === 12 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-medium text-neutral-950 tracking-tight font-sans">
                    What is ONE thing you would change about travelling from your college?
                  </h2>
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mt-1">
                    Free-form feedback directly for the founding initiative
                  </p>
                </>
              )}
            </div>

            {/* Interactive Options Matrix */}
            <div className="space-y-3 pt-2">
              {currentStep === 1 &&
                [
                  { id: 'college_bus', label: 'College bus', emoji: '🚌' },
                  { id: 'auto', label: 'Auto / E-rickshaw', emoji: '🛺' },
                  { id: 'cab', label: 'Cab', emoji: '🚕' },
                  { id: 'bike', label: 'Bike / Scooty', emoji: '🏍️' },
                  { id: 'car', label: 'Car', emoji: '🚗' },
                  { id: 'walking', label: 'Walk', emoji: '🚶' },
                  { id: 'pickup', label: 'Someone picks me up', emoji: '👨‍👩‍👧' },
                  { id: 'other', label: 'Other', emoji: '✨' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    emoji={opt.emoji}
                    selected={formData.travel.usualTravelMode === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        travel: {
                          ...formData.travel,
                          usualTravelMode: opt.id as UsualTravelMode,
                        },
                      })
                    }
                  />
                ))}

              {currentStep === 2 &&
                [
                  { id: 'often', label: 'Yes, often' },
                  { id: 'sometimes', label: 'Yes, sometimes' },
                  { id: 'rarely', label: 'Rarely' },
                  { id: 'never', label: 'Never' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    selected={formData.travel.difficultyFindingRide === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        travel: {
                          ...formData.travel,
                          difficultyFindingRide: opt.id as DifficultyFindingRide,
                        },
                      })
                    }
                  />
                ))}

              {currentStep === 3 &&
                [
                  { id: 'no_vehicle', label: 'No vehicle available' },
                  { id: 'long_wait', label: 'Have to wait too long' },
                  { id: 'cannot_find_vehicle_same_direction', label: "Can't find a vehicle going my way" },
                  { id: 'expensive', label: 'Ride is too expensive' },
                  { id: 'safety', label: "Don't feel safe" },
                  { id: 'urgent_need', label: 'Need to leave urgently' },
                  { id: 'other', label: 'Other' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    type="checkbox"
                    label={opt.label}
                    selected={formData.travel.problemsFaced.includes(opt.id as ProblemFaced)}
                    onSelect={() => toggleProblemFaced(opt.id as ProblemFaced)}
                  />
                ))}

              {currentStep === 4 &&
                [
                  { id: 'under_5', label: 'Less than 5 minutes' },
                  { id: '5_10', label: '5–10 minutes' },
                  { id: '10_20', label: '10–20 minutes' },
                  { id: '20_30', label: '20–30 minutes' },
                  { id: 'over_30', label: 'More than 30 minutes' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    selected={formData.travel.longestWait === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        travel: {
                          ...formData.travel,
                          longestWait: opt.id as LongestWait,
                        },
                      })
                    }
                  />
                ))}

              {currentStep === 5 &&
                [
                  { id: 'yes_several_times', label: 'Yes, several times' },
                  { id: 'yes_once', label: 'Yes, once' },
                  { id: 'no', label: 'No' },
                  { id: 'dont_remember', label: 'Not sure / Can’t remember' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    selected={formData.neededUrgentTransport === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        neededUrgentTransport: opt.id as NeededUrgentTransport,
                      })
                    }
                  />
                ))}

              {currentStep === 6 &&
                [
                  { id: 'many_times', label: 'Yes, many times' },
                  { id: 'sometimes', label: 'Sometimes' },
                  { id: 'rarely', label: 'Rarely' },
                  { id: 'never', label: 'Never' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    selected={formData.seenVehicleGoingMyWay === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        seenVehicleGoingMyWay: opt.id as SeenVehicleGoingMyWay,
                      })
                    }
                  />
                ))}

              {currentStep === 7 &&
                [
                  { id: 'very_useful', label: 'Very useful', emoji: '⭐' },
                  { id: 'useful', label: 'Useful' },
                  { id: 'maybe', label: 'Maybe' },
                  { id: 'not_useful', label: 'Not useful' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    emoji={opt.emoji}
                    selected={formData.nearbyVerifiedVehicleUseful === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        nearbyVerifiedVehicleUseful: opt.id as NearbyVerifiedVehicleUseful,
                      })
                    }
                  />
                ))}

              {currentStep === 8 &&
                [
                  { id: 'driver_verified', label: 'Driver is verified' },
                  { id: 'vehicle_number', label: 'Vehicle number is shown' },
                  { id: 'driver_details', label: "Driver's details are shown" },
                  { id: 'share_with_friend', label: 'I can share the vehicle details with a friend' },
                  { id: 'used_by_other_students', label: 'Other students have used it' },
                  {
                    id: 'would_not_trust_unknown_vehicle',
                    label: 'I would still not trust it',
                    description: 'Exclusive: clears other selections when chosen',
                  },
                  { id: 'other', label: 'Other' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    type="checkbox"
                    label={opt.label}
                    description={opt.description}
                    selected={formData.trustFactors.includes(opt.id as TrustFactor)}
                    onSelect={() => toggleTrustFactor(opt.id as TrustFactor)}
                  />
                ))}

              {currentStep === 9 &&
                [
                  { id: 'definitely', label: 'Definitely' },
                  { id: 'probably', label: 'Probably' },
                  { id: 'maybe', label: 'Maybe' },
                  { id: 'probably_not', label: 'Probably not' },
                  { id: 'never', label: 'Never' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    selected={formData.wouldUseRideSignal === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        wouldUseRideSignal: opt.id as WouldUseRideSignal,
                      })
                    }
                  />
                ))}

              {currentStep === 10 &&
                [
                  { id: 'long_wait', label: 'Waiting too long', emoji: '⏳' },
                  { id: 'no_vehicle', label: 'No vehicle available', emoji: '🚫' },
                  { id: 'finding_same_direction_vehicle', label: 'Finding a vehicle going my way', emoji: '📍' },
                  { id: 'cost', label: 'Cost', emoji: '💰' },
                  { id: 'safety', label: 'Safety / trust', emoji: '🛡️' },
                  { id: 'emergency', label: 'Emergency situations', emoji: '🚨' },
                  { id: 'no_major_problem', label: "I don't have any major problem", emoji: '✨' },
                  { id: 'other', label: 'Other', emoji: '💬' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    emoji={opt.emoji}
                    selected={formData.biggestProblem === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        biggestProblem: opt.id as BiggestProblem,
                      })
                    }
                  />
                ))}

              {currentStep === 11 &&
                [
                  { id: 'definitely', label: 'Definitely', emoji: '🔥' },
                  { id: 'probably', label: 'Probably' },
                  { id: 'maybe', label: 'Maybe' },
                  { id: 'probably_not', label: 'Probably not' },
                  { id: 'definitely_not', label: 'Definitely not' },
                ].map((opt) => (
                  <SurveyOption
                    key={opt.id}
                    label={opt.label}
                    emoji={opt.emoji}
                    selected={formData.wouldTryIsahara === opt.id}
                    onSelect={() =>
                      setFormData({
                        ...formData,
                        wouldTryIsahara: opt.id as WouldTryIsahara,
                      })
                    }
                  />
                ))}

              {currentStep === 12 && (
                <div>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    placeholder="Describe your ideal post-college travel experience..."
                    value={formData.improvementSuggestion || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        improvementSuggestion: e.target.value,
                      })
                    }
                    className="w-full border border-neutral-300 p-4 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors bg-[#fcfcfc]"
                  />
                  <div className="flex justify-between items-center text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                    <span>OPTIONAL FREE-TEXT</span>
                    <span>{(formData.improvementSuggestion || '').length} / 1000 CHARACTERS</span>
                  </div>

                  <div className="mt-4 border border-neutral-300 bg-neutral-100 p-4 text-xs font-mono text-neutral-800 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold uppercase tracking-wider">READY TO TRANSMIT:</span> Your responses will be securely logged and anonymously added to the research dataset.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <SurveyNavigation
            canGoBack={currentStep > 0}
            onBack={handleBack}
            onNext={handleNext}
            isLastStep={currentStep === totalSteps}
            isSubmitting={isSubmitting}
            canProceed={canProceed()}
            nextButtonText={currentStep === 0 ? 'START SURVEY QUESTIONS' : 'CONTINUE'}
          />
        </div>
      </div>
    </div>
  );
};
