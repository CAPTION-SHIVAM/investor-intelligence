export type UserPlan = 'FREE' | 'PRO' | 'INSTITUTIONAL';
export type PaymentStatus = 'NONE' | 'PENDING' | 'VERIFIED' | 'REJECTED';

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
  paymentStatus?: PaymentStatus;
  pendingPlan?: UserPlan;
  pendingBillingCycle?: 'monthly' | 'annual';
  pendingAmount?: number;
  paymentSubmittedAt?: string;
  rejectionReason?: string;
};

const STORAGE_KEY = 'investoriq_user';
const USERS_DB_KEY = 'investoriq_registered_users';

const API_BASE =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'
    : 'http://127.0.0.1:8000/api';

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
    paymentStatus: 'VERIFIED',
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
    paymentStatus: 'VERIFIED',
  },
  {
    firstName: 'Arjun',
    lastName: 'Mehta',
    email: 'arjun.mehta@startup.io',
    password: 'password123',
    initials: 'AM',
    displayName: 'Arjun Mehta',
    role: 'USER',
    plan: 'FREE',
    joinedDate: '2026-08-16',
    lastLogin: 'Today, 06:15 PM',
    utrRef: '423819208311',
    paymentStatus: 'PENDING',
    pendingPlan: 'PRO',
    pendingBillingCycle: 'monthly',
    pendingAmount: 299,
    paymentSubmittedAt: '2026-08-16T15:30:00.000Z',
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
    paymentStatus: 'VERIFIED',
  },
  {
    firstName: 'Karan',
    lastName: 'Kapoor',
    email: 'karan.kapoor@techcorp.in',
    password: 'password123',
    initials: 'KK',
    displayName: 'Karan Kapoor',
    role: 'USER',
    plan: 'FREE',
    joinedDate: '2026-07-01',
    lastLogin: 'Yesterday',
    utrRef: '423719382019',
    billingCycle: 'monthly',
    subscriptionStartDate: '2026-07-01T10:00:00.000Z',
    subscriptionExpiresAt: '2026-07-31T10:00:00.000Z',
    isExpired: true,
    paymentStatus: 'NONE',
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
    paymentStatus: 'NONE',
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
    paymentStatus: 'NONE',
  },
];

/**
 * Core Expiration Enforcement Engine:
 * Evaluates whether 1 month (or annual validity) has passed.
 * If expired, automatically reverts plan to 'FREE' and updates database.
 */
export function checkAndEnforceSubscription(user: InvestorUser | null): InvestorUser | null {
  if (!user) return null;

  // Master Admin always has Pro access
  if (user.role === 'ADMIN') {
    return { ...user, plan: 'PRO', isExpired: false, paymentStatus: 'VERIFIED' };
  }

  // If user has paymentStatus === 'PENDING' or 'REJECTED' or 'NONE', they MUST NOT have plan === 'PRO'
  if (user.paymentStatus === 'PENDING' || user.paymentStatus === 'REJECTED') {
    if (user.plan !== 'FREE') {
      const fixedUser = { ...user, plan: 'FREE' as UserPlan };
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fixedUser));
        } catch {}
      }
      return fixedUser;
    }
    return user;
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
      paymentStatus: 'NONE' as PaymentStatus,
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
      paymentStatus: 'VERIFIED' as PaymentStatus,
      plan: 'PRO' as UserPlan,
      daysLeft: 9999,
      formattedExpiryDate: 'Lifetime Access',
      statusText: 'Master Admin Access',
    };
  }

  // Pending Verification Status
  if (user.paymentStatus === 'PENDING') {
    return {
      isActivePro: false,
      isExpired: false,
      paymentStatus: 'PENDING' as PaymentStatus,
      plan: 'FREE' as UserPlan,
      pendingPlan: user.pendingPlan || 'PRO',
      daysLeft: 0,
      formattedExpiryDate: 'Pending Verification',
      statusText: `Payment Verification Pending (${user.pendingPlan || 'PRO'} Plan)`,
    };
  }

  // Rejected Status
  if (user.paymentStatus === 'REJECTED') {
    return {
      isActivePro: false,
      isExpired: false,
      paymentStatus: 'REJECTED' as PaymentStatus,
      plan: 'FREE' as UserPlan,
      daysLeft: 0,
      formattedExpiryDate: 'Verification Failed',
      statusText: `Payment Verification Failed (${user.rejectionReason || 'Invalid UTR'})`,
    };
  }

  const isPro = user.plan === 'PRO' || user.plan === 'INSTITUTIONAL';

  if (!isPro) {
    if (user.isExpired) {
      const expDate = user.subscriptionExpiresAt
        ? new Date(user.subscriptionExpiresAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : 'Recently';
      return {
        isActivePro: false,
        isExpired: true,
        paymentStatus: user.paymentStatus || 'NONE',
        plan: 'FREE' as UserPlan,
        daysLeft: 0,
        formattedExpiryDate: expDate,
        statusText: `Subscription Expired on ${expDate} (Reverted to Free)`,
      };
    }

    return {
      isActivePro: false,
      isExpired: false,
      paymentStatus: user.paymentStatus || 'NONE',
      plan: 'FREE' as UserPlan,
      daysLeft: 0,
      formattedExpiryDate: 'N/A',
      statusText: 'Free Starter Plan',
    };
  }

  // Active Paid User: Compute exact days remaining
  if (user.subscriptionExpiresAt) {
    const expiryTime = new Date(user.subscriptionExpiresAt).getTime();
    const now = Date.now();
    const diffMs = expiryTime - now;
    const daysLeft = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    const expDate = new Date(user.subscriptionExpiresAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    if (daysLeft <= 0) {
      return {
        isActivePro: false,
        isExpired: true,
        paymentStatus: user.paymentStatus || 'VERIFIED',
        plan: 'FREE' as UserPlan,
        daysLeft: 0,
        formattedExpiryDate: expDate,
        statusText: `Subscription Expired (Reverted to Free)`,
      };
    }

    return {
      isActivePro: true,
      isExpired: false,
      paymentStatus: 'VERIFIED' as PaymentStatus,
      plan: user.plan,
      daysLeft,
      formattedExpiryDate: expDate,
      statusText: `Active · ${daysLeft} day${daysLeft > 1 ? 's' : ''} remaining (Expires ${expDate})`,
    };
  }

  return {
    isActivePro: true,
    isExpired: false,
    paymentStatus: 'VERIFIED' as PaymentStatus,
    plan: user.plan,
    daysLeft: 30,
    formattedExpiryDate: '30 Days from Activation',
    statusText: 'Active Pro Subscription',
  };
}

export function getStoredUser(): InvestorUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    const user = JSON.parse(item) as InvestorUser;
    return checkAndEnforceSubscription(user);
  } catch {
    return null;
  }
}

export function saveUserProfile(user: InvestorUser): void {
  if (typeof window === 'undefined') return;
  try {
    const enforced = checkAndEnforceSubscription(user);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(enforced));
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Failed to save user profile to localStorage', error);
  }
}

export function clearUserProfile(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('storage'));
  } catch (error) {
    console.error('Failed to clear user profile', error);
  }
}

function getRegisteredUsersRaw(): InvestorUser[] {
  if (typeof window === 'undefined') return DEFAULT_REGISTERED_USERS;
  try {
    const item = window.localStorage.getItem(USERS_DB_KEY);
    if (!item) {
      window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(DEFAULT_REGISTERED_USERS));
      return DEFAULT_REGISTERED_USERS;
    }
    return JSON.parse(item) as InvestorUser[];
  } catch {
    return DEFAULT_REGISTERED_USERS;
  }
}

export function getRegisteredUsers(): InvestorUser[] {
  const users = getRegisteredUsersRaw();
  return users.map((u) => checkAndEnforceSubscription(u));
}

export async function getRegisteredUsersAsync(): Promise<InvestorUser[]> {
  try {
    const res = await fetch(`${API_BASE}/auth/users`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(data.data));
        }
        return data.data;
      }
    }
  } catch {
    // fallback
  }
  return getRegisteredUsers();
}

/**
 * Register a new user with central Cloud Backend API + Local Storage Sync
 */
export async function registerUserAsync(newUser: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  plan?: UserPlan;
}): Promise<{ success: boolean; error?: string; user?: InvestorUser }> {
  const cleanEmail = newUser.email.trim().toLowerCase();
  const fName = newUser.firstName.trim() || 'Investor';
  const lName = newUser.lastName.trim() || 'Member';
  const displayName = `${fName} ${lName}`.trim();

  // Try Central Cloud Backend API first
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: displayName,
        email: cleanEmail,
        password: newUser.password || 'password123',
      }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.data?.user) {
      const backendUser = data.data.user as InvestorUser;
      const finalUser: InvestorUser = {
        ...backendUser,
        firstName: fName,
        lastName: lName,
        plan: newUser.plan || backendUser.plan || 'FREE',
      };
      saveUserProfile(finalUser);

      if (typeof window !== 'undefined') {
        const localDb = getRegisteredUsersRaw();
        const updated = [...localDb.filter((u) => u.email.toLowerCase() !== cleanEmail), finalUser];
        window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));
      }
      return { success: true, user: finalUser };
    } else if (!res.ok) {
      return { success: false, error: data.detail || data.error || 'Registration failed.' };
    }
  } catch {
    // Cloud API is offline/cold starting, proceed with local registration fallback
  }

  // Local fallback registration
  return registerUser(newUser);
}

export function registerUser(newUser: {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  plan?: UserPlan;
}): { success: boolean; error?: string; user?: InvestorUser } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Cannot register on server side.' };
  }

  const cleanEmail = newUser.email.trim().toLowerCase();
  const users = getRegisteredUsersRaw();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    return { success: false, error: 'An account with this email already exists. Please log in.' };
  }

  const fName = newUser.firstName.trim() || 'Investor';
  const lName = newUser.lastName.trim() || 'Member';
  const initials = `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase();

  const plan: UserPlan = cleanEmail.startsWith('admin@') ? 'PRO' : 'FREE';

  const createdUser: InvestorUser = {
    firstName: fName,
    lastName: lName,
    email: cleanEmail,
    password: newUser.password,
    initials: initials,
    displayName: `${fName} ${lName}`.trim(),
    role: cleanEmail.startsWith('admin@') ? 'ADMIN' : 'USER',
    plan,
    paymentStatus: 'NONE',
    joinedDate: new Date().toISOString().split('T')[0],
    lastLogin: 'Just now',
    subscriptionStartDate: undefined,
    subscriptionExpiresAt: undefined,
    isExpired: false,
  };

  const updatedUsers = [...users, createdUser];
  window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsers));
  saveUserProfile(createdUser);

  return { success: true, user: createdUser };
}

/**
 * Authenticate user with central Cloud Backend API + Local Storage Sync
 */
export async function authenticateUserAsync(
  emailOrUsername: string,
  pass: string
): Promise<{ success: boolean; error?: string; user?: InvestorUser }> {
  const clean = emailOrUsername.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!clean) {
    return { success: false, error: 'Please enter your email or username.' };
  }
  if (!cleanPass) {
    return { success: false, error: 'Please enter your password.' };
  }

  // 1. Try Central Cloud Backend API first
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: clean,
        password: cleanPass,
      }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.data?.user) {
      const user = data.data.user as InvestorUser;
      const parts = (user.displayName || user.email).split(' ');
      const finalUser: InvestorUser = {
        ...user,
        firstName: parts[0] || 'Investor',
        lastName: parts[1] || 'Member',
        lastLogin: 'Today',
      };
      saveUserProfile(finalUser);

      if (typeof window !== 'undefined') {
        const localDb = getRegisteredUsersRaw();
        const updated = [...localDb.filter((u) => u.email.toLowerCase() !== clean), finalUser];
        window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));
      }
      return { success: true, user: finalUser };
    } else if (!res.ok) {
      if (res.status === 401 || res.status === 400) {
        return { success: false, error: data.detail || 'Invalid email or password.' };
      }
    }
  } catch {
    // Cloud API is offline/cold starting, proceed with local fallback
  }

  // Local fallback
  return authenticateUser(emailOrUsername, pass);
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
  const validAdminPasses = ['admin123', 'admin@123', 'Admin123', 'Admin@123', 'password123'];

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
      error: 'Account not found. Please create an account first.',
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
  const updatedUser: InvestorUser = { ...(validUser || found), lastLogin: 'Today' };
  saveUserProfile(updatedUser);
  return { success: true, user: updatedUser };
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

    // Also sync to cloud API in background
    fetch(`${API_BASE}/auth/update-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan: newPlan, durationDays: 30 }),
    }).catch(() => {});

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

    fetch(`${API_BASE}/auth/delete-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => {});

    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Indian UPI UTR / Transaction Reference Number
 * - Must be exactly 12 numeric digits
 * - Rejects dummy repeating numbers (111111111111, 000000000000, 999999999999, etc.)
 * - Rejects test sequential numbers (123456789012, 123456123456, 987654321098, etc.)
 * - Rejects repetitive digit patterns
 */
export function validateUpiUtr(rawUtr: string): { valid: boolean; error?: string } {
  const clean = rawUtr.trim();

  if (!clean) {
    return { valid: false, error: 'Please enter the 12-digit UPI Reference / UTR Number from your payment app.' };
  }

  // 1. Must be numeric only
  if (!/^\d+$/.test(clean)) {
    return { valid: false, error: 'UTR number must contain only numeric digits (0–9).' };
  }

  // 2. Must be exactly 12 digits
  if (clean.length !== 12) {
    return {
      valid: false,
      error: `Invalid UTR length: Must be exactly 12 digits (currently ${clean.length} digits).`,
    };
  }

  // 3. Reject all identical repeating digits (e.g. 111111111111, 000000000000, 222222222222, etc.)
  if (/^(\d)\1{11}$/.test(clean)) {
    return {
      valid: false,
      error: `Fake/dummy UTR rejected: "${clean}" is not a real bank reference. You must complete the UPI payment and enter the genuine 12-digit UTR from GPay / PhonePe / Paytm / your banking app.`,
    };
  }

  // 4. Reject common dummy/test sequences
  const dummySequences = [
    '123456789012',
    '012345678901',
    '987654321098',
    '123456123456',
    '000000123456',
    '123456000000',
    '112233445566',
    '998877665544',
    '121212121212',
    '123123123123',
    '111122223333',
    '000011112222',
    '123456789123',
    '101010101010',
    '202020202020',
  ];

  if (dummySequences.includes(clean)) {
    return {
      valid: false,
      error: `Dummy test sequence rejected: "${clean}". Please enter the real 12-digit transaction ID generated by your UPI payment.`,
    };
  }

  // 5. Reject if any single digit appears 9 or more times (e.g. 111111111234)
  for (let d = 0; d <= 9; d++) {
    const occurrences = clean.split('').filter((c) => c === d.toString()).length;
    if (occurrences >= 9) {
      return {
        valid: false,
        error: `Unrealistic UTR number: "${clean}" contains repeating dummy numbers. Please enter the genuine 12-digit UTR from your bank transaction.`,
      };
    }
  }

  return { valid: true };
}

/**
 * Submit Payment Reference (UTR) for Verification
 * - If amount is 0 (e.g. 100% Free Coupon PRO100), unlocks immediately.
 * - If amount > 0, validates genuine 12-digit non-dummy UTR and marks status as 'PENDING'.
 */
export async function submitPaymentRequest(params: {
  utrRef: string;
  plan: UserPlan;
  billingCycle: 'monthly' | 'annual';
  amount: number;
  couponCode?: string;
}): Promise<{
  success: boolean;
  user: InvestorUser;
  instantUnlock: boolean;
  message: string;
}> {
  let current = getStoredUser();
  if (!current) {
    // If guest user, create a temporary guest profile with plan FREE
    current = {
      firstName: 'Guest',
      lastName: 'Investor',
      email: `guest_${Date.now().toString().slice(-6)}@investor.in`,
      displayName: 'Guest Investor',
      initials: 'GI',
      role: 'USER',
      plan: 'FREE',
      paymentStatus: 'PENDING',
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Just now',
      isExpired: false,
    };
    saveUserProfile(current);
  }

  const cleanUtr = params.utrRef.trim();
  const isZeroAmount = params.amount === 0;
  const nowIso = new Date().toISOString();

  // Validate UTR for paid plans
  if (!isZeroAmount) {
    const validation = validateUpiUtr(cleanUtr);
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid 12-digit UPI UTR number.');
    }
  }

  let updatedUser: InvestorUser;

  if (isZeroAmount) {
    // 100% Free Promo Pass -> Instant Activation
    const startDate = nowIso;
    const expiresAt = computeExpiryDate(params.billingCycle);

    updatedUser = {
      ...current,
      plan: params.plan,
      billingCycle: params.billingCycle,
      subscriptionStartDate: startDate,
      subscriptionExpiresAt: expiresAt,
      isExpired: false,
      paymentStatus: 'VERIFIED',
      utrRef: cleanUtr || `FREE-COUPON-${Date.now().toString().slice(-6)}`,
      pendingPlan: undefined,
      pendingAmount: 0,
      rejectionReason: undefined,
    };
  } else {
    // Paid Subscription -> Set to PENDING VERIFICATION, Keep plan as FREE (or existing)
    updatedUser = {
      ...current,
      plan: current.role === 'ADMIN' ? 'PRO' : 'FREE',
      paymentStatus: 'PENDING',
      pendingPlan: params.plan,
      pendingBillingCycle: params.billingCycle,
      pendingAmount: params.amount,
      paymentSubmittedAt: nowIso,
      utrRef: cleanUtr,
      rejectionReason: undefined,
    };
  }

  // Persist user session
  saveUserProfile(updatedUser);

  // Update Users DB in localStorage
  if (typeof window !== 'undefined') {
    try {
      const users = getRegisteredUsersRaw();
      const updatedList = users.map((u) =>
        u.email.toLowerCase() === current!.email.toLowerCase()
          ? {
              ...u,
              ...updatedUser,
            }
          : u
      );
      window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  }

  // Sync to backend API
  try {
    await fetch(`${API_BASE}/billing/verify-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: `ORD-${Date.now().toString().slice(-6)}`,
        payment_method: 'UPI',
        transaction_ref: cleanUtr,
        email: current.email,
        plan: params.plan,
        billing_cycle: params.billingCycle,
        amount: params.amount,
        is_free_coupon: isZeroAmount,
      }),
    });
  } catch (err) {
    console.warn('Backend payment submission notice:', err);
  }

  return {
    success: true,
    user: updatedUser,
    instantUnlock: isZeroAmount,
    message: isZeroAmount
      ? 'Pro subscription unlocked successfully with free promotional code!'
      : 'Payment reference submitted successfully. Pro plan will be activated once verified by admin.',
  };
}

/**
 * Admin: Approve Pending Payment Reference & Activate Pro
 */
export async function adminApprovePayment(email: string, durationDays = 30): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const users = getRegisteredUsersRaw();
      const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) return false;

      const targetPlan = user.pendingPlan || 'PRO';
      const targetCycle = user.pendingBillingCycle || (durationDays > 60 ? 'annual' : 'monthly');
      const startDate = new Date().toISOString();
      const expiresAt = computeExpiryDate(targetCycle);

      const updated = users.map((u) => {
        if (u.email.toLowerCase() === cleanEmail) {
          return {
            ...u,
            plan: targetPlan,
            billingCycle: targetCycle,
            subscriptionStartDate: startDate,
            subscriptionExpiresAt: expiresAt,
            isExpired: false,
            paymentStatus: 'VERIFIED' as PaymentStatus,
            pendingPlan: undefined,
            pendingAmount: undefined,
            rejectionReason: undefined,
          };
        }
        return u;
      });

      window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));

      // Update current logged-in user if matching
      const current = getStoredUser();
      if (current && current.email.toLowerCase() === cleanEmail) {
        saveUserProfile({
          ...current,
          plan: targetPlan,
          billingCycle: targetCycle,
          subscriptionStartDate: startDate,
          subscriptionExpiresAt: expiresAt,
          isExpired: false,
          paymentStatus: 'VERIFIED',
          pendingPlan: undefined,
          pendingAmount: undefined,
          rejectionReason: undefined,
        });
      }

      // Sync backend
      fetch(`${API_BASE}/billing/approve-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, decision: 'APPROVE', durationDays }),
      }).catch(() => {});

      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Admin: Reject Pending Payment Reference
 */
export async function adminRejectPayment(
  email: string,
  reason = 'Payment not received in bank account / Invalid UTR'
): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const users = getRegisteredUsersRaw();

      const updated = users.map((u) => {
        if (u.email.toLowerCase() === cleanEmail) {
          return {
            ...u,
            plan: 'FREE' as UserPlan,
            paymentStatus: 'REJECTED' as PaymentStatus,
            rejectionReason: reason,
            pendingPlan: undefined,
            pendingAmount: undefined,
          };
        }
        return u;
      });

      window.localStorage.setItem(USERS_DB_KEY, JSON.stringify(updated));

      const current = getStoredUser();
      if (current && current.email.toLowerCase() === cleanEmail) {
        saveUserProfile({
          ...current,
          plan: 'FREE',
          paymentStatus: 'REJECTED',
          rejectionReason: reason,
          pendingPlan: undefined,
          pendingAmount: undefined,
        });
      }

      fetch(`${API_BASE}/billing/approve-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, decision: 'REJECT', reason }),
      }).catch(() => {});

      return true;
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Get all users with pending payment verification
 */
export function getPendingPayments(): InvestorUser[] {
  const users = getRegisteredUsers();
  return users.filter((u) => u.paymentStatus === 'PENDING');
}

