// Device ID management for anonymous profile tracking

const DEVICE_ID_KEY = 'loba_ball_device_id';

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}

function generateDeviceId(): string {
  // Generate a unique ID using crypto API
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function clearDeviceId(): void {
  localStorage.removeItem(DEVICE_ID_KEY);
}
