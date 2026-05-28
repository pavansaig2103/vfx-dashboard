export const STATUSES = ['Not Started', 'In Progress', 'Review', 'Changes Required', 'Approved', 'Final Delivered'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const ARTISTS = ['Rohan', 'Meera', 'Arjun', 'Sana', 'Vikram'];
export const FINAL_STATUSES = ['Approved', 'Final Delivered'];

export function slug(value = '') {
  return value.toLowerCase().replaceAll(' ', '-');
}

export function isOverdue(shot) {
  return shot.deadline < new Date().toISOString().slice(0, 10) && !FINAL_STATUSES.includes(shot.status);
}

export function daysUntil(deadline) {
  return Math.ceil((new Date(`${deadline}T23:59:59`) - new Date()) / 86400000);
}

export function nextAction(status) {
  return {
    'Not Started': 'Assign artist and begin first pass.',
    'In Progress': 'Track progress and prepare for internal review.',
    Review: 'Collect supervisor/client feedback.',
    'Changes Required': 'Artist must upload revised version.',
    Approved: 'Prepare final delivery package.',
    'Final Delivered': 'Shot completed and archived.',
  }[status] || 'Review shot status and update the pipeline.';
}
