export const roleHasPermission = [
  {
    role: 'super admin',
  },
  {
    role: 'company admin',
    permissions: [
      'can view dashboard menu',
      'can view system setting menu',
      'can view users',
      'can view bookings menu',
      'can view bookings',
      'can view add booking'
    ],
  },
];
