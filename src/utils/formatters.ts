export const formatEnum = (val?: string): string => {
  if (!val) return '—';
  const labelMap: Record<string, string> = {
    college_bus: 'College bus',
    auto: 'Auto',
    e_rickshaw: 'E-rickshaw',
    cab: 'Cab',
    bike: 'Bike',
    scooty: 'Scooty',
    car: 'Car',
    walking: 'Walk',
    pickup: 'Someone picks me up',
    other: 'Other',

    often: 'Often',
    sometimes: 'Sometimes',
    rarely: 'Rarely',
    never: 'Never',

    no_vehicle: 'No vehicle available',
    long_wait: 'Long wait times',
    cannot_find_vehicle_same_direction: "Can't find vehicle going my way",
    expensive: 'Too expensive',
    safety: 'Safety concerns',
    urgent_need: 'Urgent transport need',
    cost: 'High cost',
    finding_same_direction_vehicle: 'Finding vehicle in same direction',
    emergency: 'Emergency situations',
    no_major_problem: 'No major problem',

    under_5: '< 5 minutes',
    '5_10': '5–10 minutes',
    '10_20': '10–20 minutes',
    '20_30': '20–30 minutes',
    over_30: '> 30 minutes',

    yes_several_times: 'Yes, several times',
    yes_once: 'Yes, once',
    no: 'No',
    dont_remember: "Don't remember",

    many_times: 'Many times',

    very_useful: 'Very useful',
    useful: 'Useful',
    maybe: 'Maybe',
    not_useful: 'Not useful',

    driver_verified: 'Driver verified',
    vehicle_number: 'Vehicle number shown',
    driver_details: 'Driver details shown',
    share_with_friend: 'Share details with friend',
    used_by_other_students: 'Used by other students',
    would_not_trust_unknown_vehicle: 'Would not trust unknown vehicle',

    definitely: 'Definitely',
    probably: 'Probably',
    probably_not: 'Probably not',
    definitely_not: 'Definitely not',
  };

  return labelMap[val] || val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
};
