export type UserPlan = 'FREE' | 'PRO' | 'INSTITUTIONAL';

export type InvestorUser = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  initials: string;
  displayName: string;
  role: 'ADMIN' | 'USER';
  plan: UserPlan;
  joinedDate?: string;
  lastLogin?: string;
  utrRef?: string;
  billingCycle?: 'monthly' | 'annual';
  subscriptionStartDate?: string;
  subscriptionExpiresAt?: string;
  isExpired?: boolean;
};

const STORAGE_KEY = 'investoriq_user';
const USERS_DB_KEY = 'investoriq_registered_users';

// Helper to compute 30-day (1 month) or 365-day expiry timestamps
export function computeExpiryDate(cycle: 'monthly' | 'annual' = 'monthly'): string {
  const days = cycle === 'annual' ? 365 : 30; // 30 days for 1 month
  const expiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  return expiry.toISOString();
}

// Pre-seeded registered users with active vs expired subscription timestamps
const DEFAULT_REGISTERED_USERS: InvestorUser[] = [
  {
    firstName: 'Rohan',
    lastName: 'Sharma',
    email: 'rohan.sharma@example.com',
    password: 'password123',
    initials: 'RS',
    displayName: 'Rohan Sharma',
    role: 'USER',
    plan: 'PRO',
    joinedDate: '2026-08-10',
    lastLogin: 'Today, 04:30 PM',
    utrRef: '423819283921',
    billingCycle: 'monthly',
    subscriptionStartDate: '2026-08-10T10:00:00.000Z',
    subscriptionExpiresAt: '2026-09-09T10:00:00.000Z', // 24 days remaining
    isExpired: false,
  },
  {
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    email: 'ananya.deshmukh@gmail.com',
    password: 'password123',
    initials: 'AD',
    displayName: 'Ananya Deshmukh',
    role: 'USER',
    plan: 'PRO',
    joinedDate: '2026-08-12',
    lastLogin: 'Today, 02:15 PM',
    utrRef: '423984920194',
    billingCycle: 'monthly',
    subscriptionStartDate: '2026-08-12T14:30:00.000Z',
    subscriptionExpiresAt: '2026-09-11T14:30:00.000Z', // 26 days remaining
    isExpired: false,
  },
  {
    firstName: 'Vikram',
    lastName: 'Singhania',
    email: 'vikram.singhania@apexcapital.in',
    password: 'password123',
    initials: 'VS',
    displayName: 'Vikram Singhania',
    role: 'USER',
    plan: 'INSTITUTIONAL',
    joinedDate: '2026-08-01',
    lastLogin: 'Today, 11:45 AM',
    utrRef: '423190284729',
    billingCycle: 'annual',
    subscriptionStartDate: '2026-08-01T09:00:00.000Z',
    subscriptionExpiresAt: '2027-08-01T09:00:00.000Z', // 1 year
    isExpired: false,
  },
  {
    firstName: 'Karan',
    lastName: 'Kapoor',
    email: 'karan.kapoor@techcorp.in',
    password: 'password123',
    initials: 'KK',
    displayName: 'Karan Kapoor',
    role: 'USER',
    plan: 'FREE', // Past 1-month: Expired and reverted to FREE
    joinedDate: '2026-07-01',
    lastLogin: 'Yesterday',
    utrRef: '423719382019',
    billingCycle: 'monthly',
    subscriptionStartDate: '2026-07-01T10:00:00.000Z',
    subscriptionExpiresAt: '2026-07-31T10:00:00.000Z', // Expired on July 31
    isExpired: true,
  },
  {
    firstName: 'Pooja',
    lastName: 'Patel',
    email: 'pooja.patel@outlook.com',
    password: 'password123',
    initials: 'PP',
    displayName: 'Pooja Patel',
    role: 'USER',
    plan: 'FREE',
    joinedDate: '2026-08-14',
    lastLogin: 'Yesterday',
    isExpired: false,
  },
  {
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@investments.org',
    password: 'password123',
    initials: 'SR',
    displayName: 'Sneha Reddy',
    role: 'USER',
    plan: 'FREE',
    joinedDate: '2026-08-16',
    lastLogin: 'Today, 05:10 PM',
    isExpired: false,
  },
];

/**
 * Core Expiration Enforcement Engine:
 * Evaluates whether 1 month (or annual validity) has passed.
 * If expired, automatically reverts plan to 'FREE' and updates database.
 */
export function checkAndEnforceSubscription(user: InvestorUser): InvestorUser {
  if (!user) return user;

  // Master Admin has permanent root access
  if (user.role === 'ADMIN') {
    return { ...user, plan: 'PRO', isExpired: false };
  }

  // If already on Free plan, no expiration downgrade needed
  if (user.plan === 'FREE') {
    return user;
  }

  // For PRO or INSTITUTIONAL plans, check expiration timestamp
  if (user.subscriptionExpiresAt) {
    const expiryTime = new Date(user.subscriptionExpiresAt).getTime();
    const now = Date.now();

    if (now > expiryTime) {
      // 1 month / validity period has passed! Automatically revert to FREE
      const expiredUser: InvestorUser = {
        ...user,
        plan: 'FREE',
        isExpired: true,
      };

      // Persist reversion in localStorage
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expiredUser));
          const dbUsers = getRegisteredUsersRaw();
          const updatedDb = dbUsers.map((u) =>
            u.email.toLowerCase() === user.email.toLowerCase()
              ? { ...u, plan: 'FREE', isExpired: true }
              : u
          );
          window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedDb));
        } catch {
          // ignore
        }
      }

      return expiredUser;
    }
  }

  return user;
}

export function getSubscriptionInfo(user: InvestorUser | null) {
  if (!user) {
    return {
      isActivePro: false,
      isExpired: false,
      plan: 'FREE' as UserPlan,
      daysLeft: 0,
      formattedExpiryDate: 'N/A',
      statusText: 'Free Starter Plan',
    };
  }

  if (user.role === 'ADMIN') {
    return {
      isActivePro: true,
      isExpired: false,
      plan: 'PRO' as UserPlan,
      daysLeft: 9999,
      formattedExpiryDate: 'Lifetime Admin Access',
      statusText: 'Master Admin Access (Permanent)',
    };
  }

  if (user.plan === 'FREE') {
    return {
      isActivePro: false,
      isExpired: !!user.isExpired,
      plan: 'FREE' as UserPlan,
      daysLeft: 0,
      formattedExpiryDate: user.subscriptionExpiresAt
        ? new Date(user.subscriptionExpiresAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : 'N/A',
      statusText: user.isExpired
        ? 'Subscription Expired (Reverted to Free)'
        : 'Free Starter Plan',
    };
  }

  // Active PRO or INSTITUTIONAL
  if (user.subscriptionExpiresAt) {
    const expiryTime = new Date(user.subscriptionExpiresAt).getTime();
    const now = Date.now();
    const diffDays = Math.max(0, Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24)));
    const formatted = new Date(user.subscriptionExpiresAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    if (diffDays <= 0) {
      return {
        isActivePro: false,
        isExpired: true,
        plan: 'FREE' as UserPlan,
        daysLeft: 0,
        formattedExpiryDate: formatted,
        statusText: 'Subscription Expired (Reverted to Free)',
      };
    }

    return {
      isActivePro: true,
      isExpired: false,
      plan: user.plan,
      daysLeft: diffDays,
      formattedExpiryDate: formatted,
      statusText: `Active · ${diffDays} day${diffDays === 1 ? '' : 's'} remaining (Expires ${formatted})`,
    };
  }

  return {
    isActivePro: true,
    isExpired: false,
    plan: user.plan,
    daysLeft: 30,
    formattedExpiryDate: '30 Days from Activation',
    statusText: 'Active Pro Plan (1 Month)',
  };
}

function getRegisteredUsersRaw(): InvestorUser[] {
  if (typeof window === 'undefined') return DEFAULT_REGISTERED_USERS;
  try {
    const raw = window.localStorage.getItem(USERS_DB_KEY);
    if (!raw) return DEFAULT_REGISTERED_USERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_REGISTERED_USERS;
  } catch {
    return DEFAULT_REGISTERED_USERS;
  }
}

export function getRegisteredUsers(): InvestorUser[] {
  const users = getRegisteredUsersRaw();
  // Automatically check expiration on every read
  return users.map((u) => checkAndEnforceSubscription(u));
}

export function registerUser(newUser: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  plan?: UserPlan;
}): { success: boolean; error?: string; user?: InvestorUser } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Browser storage unavailable.' };
  }

  const users = getRegisteredUsers();
  const cleanEmail = newUser.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const fName = newUser.firstName.trim() || 'Investor';
  const lName = newUser.lastName.trim() || 'Member';
  const initials = `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase();

  const plan = newUser.plan || 'FREE';
  const startDate = plan !== 'FREE' ? new Date().toISOString() : undefined;
  const expiresAt = plan !== 'FREE' ? computeExpiryDate('monthly') : undefined;

  const createdUser: InvestorUser = {
    firstName: fName,
    lastName: lName,
    email: cleanEmail,
    password: newUser.password,
    initials: initials,
    displayName: `${fName} ${lName}`.trim(),
    role: 'USER',
    plan,
    joinedDate: new Date().toISOString().split('T')[0],
    lastLogin: 'Just now',
    subscriptionStartDate: startDate,
    subscriptionExpiresAt: expiresAt,
    isExpired: false,
  };

  const updatedUsers = [...users, createdUser];
  window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));
  saveUserProfile(createdUser);

  return { success: true, user: createdUser };
}

export function adminUpdateUserPlan(email: string, newPlan: UserPlan): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const users = getRegisteredUsersRaw();
    const startDate = newPlan !== 'FREE' ? new Date().toISOString() : undefined;
    const expiresAt = newPlan !== 'FREE' ? computeExpiryDate('monthly') : undefined;

    const updated = users.map((u) => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        return {
          ...u,
          plan: newPlan,
          subscriptionStartDate: startDate,
          subscriptionExpiresAt: expiresAt,
          isExpired: false,
          utrRef: newPlan === 'FREE' ? undefined : u.utrRef || `ADMIN-GRANTED-${Date.now().toString().slice(-4)}`,
        };
      }
      return u;
    });

    window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));

    // If current logged-in user is the one being modified, update their session too
    const current = getStoredUser();
    if (current && current.email.toLowerCase() === email.toLowerCase()) {
      saveUserProfile({
        ...current,
        plan: newPlan,
        subscriptionStartDate: startDate,
        subscriptionExpiresAt: expiresAt,
        isExpired: false,
      });
    }
    return true;
  } catch {
    return false;
  }
}

export function adminDeleteUser(email: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const users = getRegisteredUsersRaw();
    const filtered = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

export function authenticateUser(
  emailOrUsername: string,
  pass: string
): { success: boolean; error?: string; user?: InvestorUser } {
  const clean = emailOrUsername.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!clean) {
    return { success: false, error: 'Please enter your email or username.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Please enter your password.' };
  }

  // 1. Master Admin Check (admin / admin123 or admin@123)
  const validAdminUsers = ['admin', 'admin@investorintelligence.com', 'admin@investoriq.in'];
  const validAdminPasses = ['admin123', 'admin@123', 'Admin123', 'Admin@123'];

  if (validAdminUsers.includes(clean) && validAdminPasses.includes(cleanPass)) {
    const adminProfile: InvestorUser = {
      firstName: 'Master',
      lastName: 'Admin',
      email: 'admin@investorintelligence.com',
      initials: 'MA',
      displayName: 'Master Admin',
      role: 'ADMIN',
      plan: 'PRO',
      joinedDate: '2026-01-01',
      lastLogin: 'Now',
      isExpired: false,
    };
    saveUserProfile(adminProfile);
    return { success: true, user: adminProfile };
  }

  // 2. Check Registered Users DB
  const users = getRegisteredUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === clean || u.displayName.toLowerCase() === clean
  );

  if (!found) {
    return {
      success: false,
      error: 'Account not found. Please register first or verify your credentials.',
    };
  }

  if (found.password && found.password !== cleanPass) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again.',
    };
  }

  // Check and enforce expiration on login
  const validUser = checkAndEnforceSubscription(found);
  const updatedUser: InvestorUser = { ...validUser, lastLogin: 'Today' };
  saveUserProfile(updatedUser);
  return { success: true, user: updatedUser };
}

export function getStoredUser(): InvestorUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as InvestorUser;
    // Check and enforce 1-month expiration on retrieval
    return checkAndEnforceSubscription(user);
  } catch {
    return null;
  }
}

export function saveUserProfile(
  user: Partial<InvestorUser> & {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: 'ADMIN' | 'USER';
    plan?: UserPlan;
    utrRef?: string;
    subscriptionStartDate?: string;
    subscriptionExpiresAt?: string;
    isExpired?: boolean;
  }
) {
  if (typeof window === 'undefined') {
    return null;
  }

  const existing = getStoredUser();
  const nextUser: InvestorUser = {
    firstName: user.firstName ?? existing?.firstName ?? 'Investor',
    lastName: user.lastName ?? existing?.lastName ?? 'Member',
    email: user.email ?? existing?.email ?? 'investor@intelligence.com',
    initials: user.initials ?? existing?.initials ?? 'II',
    displayName: user.displayName ?? existing?.displayName ?? 'Investor Member',
    role: user.role ?? existing?.role ?? 'USER',
    plan: user.plan ?? existing?.plan ?? 'FREE',
    joinedDate: user.joinedDate ?? existing?.joinedDate ?? '2026-08-16',
    lastLogin: user.lastLogin ?? existing?.lastLogin ?? 'Today',
    utrRef: user.utrRef ?? existing?.utrRef,
    billingCycle: user.billingCycle ?? existing?.billingCycle ?? 'monthly',
    subscriptionStartDate: user.subscriptionStartDate ?? existing?.subscriptionStartDate,
    subscriptionExpiresAt: user.subscriptionExpiresAt ?? existing?.subscriptionExpiresAt,
    isExpired: user.isExpired ?? existing?.isExpired ?? false,
  };

  const displayName = `${nextUser.firstName} ${nextUser.lastName}`.trim();
  const initials = `${(nextUser.firstName || 'I').charAt(0)}${(nextUser.lastName || 'M').charAt(0)}`.toUpperCase();

  const profile: InvestorUser = {
    ...nextUser,
    displayName: displayName || nextUser.displayName,
    initials: initials || nextUser.initials,
  };

  // If user upgraded to PRO and no expiry date set, set 30-day (1-month) validity
  if (profile.plan !== 'FREE' && !profile.subscriptionExpiresAt && profile.role !== 'ADMIN') {
    profile.subscriptionStartDate = new Date().toISOString();
    profile.subscriptionExpiresAt = computeExpiryDate(profile.billingCycle || 'monthly');
    profile.isExpired = false;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

  // Also update registered users db
  try {
    const users = getRegisteredUsersRaw();
    const updated = users.map((u) =>
      u.email.toLowerCase() === profile.email.toLowerCase()
        ? {
            ...u,
            plan: profile.plan,
            utrRef: profile.utrRef,
            subscriptionStartDate: profile.subscriptionStartDate,
            subscriptionExpiresAt: profile.subscriptionExpiresAt,
            isExpired: profile.isExpired,
          }
        : u
    );
    window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return profile;
}

export function clearUserProfile() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
