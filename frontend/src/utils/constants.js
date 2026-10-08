export const INCIDENT_TYPES = [
  'Medical',
  'Fire',
  'Accident',
  'Harassment',
  'Theft',
  'Unsafe Area',
  'Other',
];

export const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

export const PRIORITY_LEVELS = ['Low', 'Normal', 'Urgent', 'Immediate'];

export const INCIDENT_STATUSES = ['Reported', 'Assigned', 'Responding', 'Resolved'];

export const RESPONDERS = [
  'Campus Security Team A',
  'Campus Security Team B',
  'Medical Team',
  'Fire Response Team',
  'Student Welfare Team',
];

export const CAMPUS_LOCATIONS = [
  'Science & Tech Complex - Lab B-204',
  'Central Library - 3rd Floor',
  'North Dining Hall & Cafeteria',
  'Main University Gate & East Ave',
  'Parking Lot 4 - Behind Residence Hall C',
  'Engineering Block East Entrance',
  'Sports Arena & Gymnasium',
  'Student Center & Auditorium',
  'Hostel Block A - Courtyard',
];

export const EMERGENCY_CONTACTS = [
  {
    title: 'Campus Security Dispatch',
    number: '+1 (555) 019-SAFE',
    badge: '24/7 Patrol',
    desc: 'Main campus security desk and rapid response fleet.',
    color: 'border-blue-500 bg-blue-50 text-blue-800',
  },
  {
    title: 'Emergency Medical & Ambulance',
    number: '+1 (555) 019-HELP',
    badge: 'Immediate',
    desc: 'University Health Center and trauma triage team.',
    color: 'border-red-500 bg-red-50 text-red-800',
  },
  {
    title: 'Fire Safety & Hazard Response',
    number: '+1 (555) 019-FIRE',
    badge: 'Priority',
    desc: 'Campus fire marshals and hazmat control unit.',
    color: 'border-amber-500 bg-amber-50 text-amber-800',
  },
  {
    title: 'Women Safety & Escort Service',
    number: '+1 (555) 019-WSHP',
    badge: 'Night Escort',
    desc: 'Late-night campus walk escorts and crisis support.',
    color: 'border-purple-500 bg-purple-50 text-purple-800',
  },
  {
    title: 'Student Welfare & Counseling',
    number: '+1 (555) 019-CARE',
    badge: 'Confidential',
    desc: 'Mental wellness counselors and conflict mediation.',
    color: 'border-emerald-500 bg-emerald-50 text-emerald-800',
  },
];

export const DEMO_CREDENTIALS = {
  student: {
    email: 'student@campus.com',
    password: 'student123',
    name: 'Alex Rivera',
    role: 'student',
  },
  admin: {
    email: 'admin@campus.com',
    password: 'admin123',
    name: 'Commander Marcus Vance',
    role: 'admin',
  },
};
