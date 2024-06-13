// Define default roles available in the system.
// Each role has a type, title, description, and an image URL associated with it.
// The roles are 'AGENT' and 'SEEKER', representing two distinct user types in the system.
export const DefaultRole = [
  {
    type: 'AGENT',
    title: 'I am an Agent',
    description: 'An intermediary who helps in the distribution of the service',
    imageUrl: 'assets/images/i_am_agent.png',
  },
  {
    type: 'SEEKER',
    title: 'I am a Seeker',
    description: 'Individual who is seeking for the service.',
    imageUrl: 'assets/images/i_am_seeker.png',
  },
];

// Define error messages related to role management operations.
// These messages are used to inform the user about the outcome of their actions,
// such as creating, updating, or deleting a role, or when a role is not found.
export const ErrorMessage = {
  failedToDelete: 'Failed to delete role',
  failedToUpdate: 'Failed to update role',
  failedToCreate: 'Failed to create role',
  UserNotFound: 'Role not found',
  inValidRole: 'Invalid role',
};
