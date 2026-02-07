export type AccountProfile = {
  fullname: string;
  avatar_url: string;
};

export type AccountPassword = {
  old_password: string;
  new_password: string;
};

export type LoginHistory = {
  id: number;
  account_id: number;
  ip_address: string;
  user_agent: string;
  device: string;
  browser: string;
  os: string;
  country: string;
  city: string;
  success: number;
  logged_in_at: string;
};
