export const roleHasPermission = [
  {
    role: 'super admin',
  },
  {
    role: 'admin',
    permissions: [
      'can view dashboard',
      'can view system setting',
      'can view users',
      'can view roles',
      'can view permissions',
    ],
  },
];
