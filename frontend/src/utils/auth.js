export const getAuthToken = () => localStorage.getItem('authToken') || '';

export const getAuthUser = () => {
  try {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    return { 'Content-Type': 'application/json' };
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const clearAuth = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  localStorage.removeItem('authRole');
  localStorage.removeItem('authUserId');
  localStorage.removeItem('authEmail');
};
