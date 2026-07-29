import { USER_ROLES } from './constants';

export function hasPermission(userRole, action) {
  if (userRole === USER_ROLES.ADMIN) return true;
  
  if (userRole === USER_ROLES.MANAGER) {
    return action !== 'DELETE_USER' && action !== 'MODIFY_SETTINGS';
  }
  
  if (userRole === USER_ROLES.ANALYST) {
    return action.startsWith('VIEW_') || action.startsWith('READ_');
  }
  
  if (userRole === USER_ROLES.EDITOR) {
    return action !== 'DELETE_USER' && action !== 'MODIFY_SETTINGS';
  }
  
  if (userRole === USER_ROLES.VIEWER) {
    return action.startsWith('VIEW_') || action.startsWith('READ_');
  }
  
  return false;
}
