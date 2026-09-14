import React, { useState } from 'react';
import { SurveyProgress } from '../components/survey/SurveyProgress';
import { SurveyOption } from '../components/survey/SurveyOption';
import { SurveyNavigation } from '../components/survey/SurveyNavigation';
import { SurveySuccess } from '../components/survey/SurveySuccess';
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
import { AlertCircle, GraduationCap, Building2, User, Phone, CheckCircle2 } from 'lucide-react';

export const SurveyPage: React.FC = () => {
  // Step 0: Student Profile
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

  // Clear warning when changing steps
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
        setValidationWarning('Please enter your college name to continue.');
      } else if (currentStep === 3 || currentStep === 8) {
        setValidationWarning('Please select at least one option.');
      } else {
        setValidationWarning('Please select an option to continue.');
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
        // Exclusive: if toggling on, clear all others
        const alreadySelected = prev.trustFactors.includes('would_not_trust_unknown_vehicle');
        updated = alreadySelected ? [] : ['would_not_trust_unknown_vehicle'];
      } else {
        // If selecting another option, remove the exclusive option
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

    // Final payload sanitization
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
          : 'Something went wrong while submitting your response. Please try again.';
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
      <div className="py-12 px-4">
        <SurveySuccess
          onReset={resetSurvey}
          collegeName={formData.student.college}
          interestedInPilot={formData.student.interestedInPilot}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      {/* Header Info */}
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-3">
          <span>🚗</span>
          <span>Isahara MVP Research</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Travel Survey
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Help us understand how students travel after college — especially when finding a ride is difficult. Takes ~2–3 minutes.
        </p>
      </div>

      {/* Progress Bar (visible for questions 1 to 12) */}
      <div className="mb-8">
        <SurveyProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          categoryTitle={currentStep === 0 ? 'Student Context' : `Question ${currentStep} of ${totalSteps}`}
        />
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">Submission Error</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Inline Validation Warning */}
      {validationWarning && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-amber-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* Question Cards */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        {/* STEP 0: Student Profile */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Step 1 of 2: About You
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Tell us a little about your college
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                College name helps us cluster route demand. Your contact details remain private.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>College Name <span className="text-rose-500">*</span></span>
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Your Name <span className="text-xs font-normal text-slate-400">(Optional)</span></span>
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
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-slate-500" />
                    <span>Year of Study <span className="text-xs font-normal text-slate-400">(Optional)</span></span>
                  </label>
                  <select
                    value={formData.student.yearOfStudy || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        student: { ...formData.student, yearOfStudy: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
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
                <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>Email or Phone <span className="text-xs font-normal text-slate-400">(Optional)</span></span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. rahul@example.com or 9876543210"
                  value={formData.student.contact || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      student: { ...formData.student, contact: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
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
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="block text-sm font-semibold text-slate-800">
                      Interested in Isahara Student Pilot program?
                    </span>
                    <span className="block text-xs text-slate-500 mt-0.5">
                      Get invited to test our live ride-signal prototype before public campus release.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* QUESTION 1 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 1</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                How do you usually travel from college?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select your primary mode of commute</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 2 */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 2</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Have you ever had difficulty finding a ride after college?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">How frequently does this happen?</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 3: Multiple Selection */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 3</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                What usually causes the problem?
              </h2>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                Multiple selection allowed (select all that apply)
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 4 */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 4</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                How long have you had to wait for a ride?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Longest typical waiting period</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 5 */}
        {currentStep === 5 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 5</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Have you ever needed to leave college urgently but couldn't find transport quickly?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">e.g. for medical emergencies, urgent commitments, etc.</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 6 */}
        {currentStep === 6 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 6</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Have you ever seen an auto/cab/other vehicle going towards your area but didn't know if it would stop for you?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Missed ride opportunity signal</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 7 */}
        {currentStep === 7 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 7</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                Imagine you could see that a verified vehicle going toward your area is nearby and available to stop.
              </h2>
              <p className="text-sm font-medium text-emerald-700 mt-0.5">Would this be useful to you?</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 8: Multiple Selection with Exclusive Option */}
        {currentStep === 8 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 8</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                What would make you trust a vehicle/driver you don't already know?
              </h2>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                Multiple selection allowed. "I would still not trust it" is exclusive.
              </p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
                { id: 'driver_verified', label: 'Driver is verified' },
                { id: 'vehicle_number', label: 'Vehicle number is shown' },
                { id: 'driver_details', label: "Driver's details are shown" },
                { id: 'share_with_friend', label: 'I can share the vehicle details with a friend' },
                { id: 'used_by_other_students', label: 'Other students have used it' },
                {
                  id: 'would_not_trust_unknown_vehicle',
                  label: 'I would still not trust it',
                  description: 'Clears other selections when chosen',
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
            </div>
          </div>
        )}

        {/* QUESTION 9 */}
        {currentStep === 9 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 9</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                If Isahara allowed you to send a simple "I need a ride" signal to a nearby vehicle going your way, would you use it?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">One-touch signal for matching rides</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 10 */}
        {currentStep === 10 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 10</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                What is your BIGGEST problem when travelling from college?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select the single primary bottleneck</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 11 */}
        {currentStep === 11 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 11</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                If Isahara was available at your college, how likely would you be to try it?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Overall adoption intent</p>
            </div>
            <div className="space-y-2.5 pt-2">
              {[
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
            </div>
          </div>
        )}

        {/* QUESTION 12 */}
        {currentStep === 12 && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Question 12</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                What is ONE thing you would change about travelling from your college?
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Free-text response (optional but invaluable for the founding team)
              </p>
            </div>
            <div className="pt-2">
              <textarea
                rows={4}
                maxLength={1000}
                placeholder="Your answer..."
                value={formData.improvementSuggestion || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    improvementSuggestion: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <div className="text-right text-xs text-slate-400 mt-1">
                {(formData.improvementSuggestion || '').length} / 1000 characters
              </div>
            </div>

            {/* Quick summary of review */}
            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-xs text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Ready to submit!</span> Your responses are validated against the backend schema and will immediately be saved to the database.
              </div>
            </div>
          </div>
        )}

        {/* Navigation Bar */}
        <SurveyNavigation
          canGoBack={currentStep > 0}
          onBack={handleBack}
          onNext={handleNext}
          isLastStep={currentStep === totalSteps}
          isSubmitting={isSubmitting}
          canProceed={canProceed()}
          nextButtonText={currentStep === 0 ? 'Start Questions' : 'Continue'}
        />
      </div>
    </div>
  );
};
