export const MASTER_ADMIN = {
  email: 'admin@investorintelligence.com',
  username: 'admin',
  password: 'admin@123',
  firstName: 'Master',
  lastName: 'Admin',
  role: 'ADMIN' as const,
};

export function isMasterAdmin(emailOrUser: string, password: string) {
  const cleanUser = emailOrUser.trim().toLowerCase();
  const cleanPass = password.trim();

  const validUsers = ['admin', 'admin@investorintelligence.com', 'admin@investoriq.in', 'admin@domain.com'];
  const validPasses = ['admin@123', 'Admin@123', 'admin123', 'Admin123'];

  return validUsers.includes(cleanUser) && validPasses.includes(cleanPass);
}
