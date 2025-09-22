// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

// Mock PermissionManager
jest.mock('./utils/PermissionManager', () => ({
  requestAllPermissions: jest.fn(),
}));