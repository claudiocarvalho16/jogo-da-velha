import { jest } from '@jest/globals';

export const requestTrackingPermissionsAsync = jest.fn(async () => ({ granted: true, status: 'granted' }));
