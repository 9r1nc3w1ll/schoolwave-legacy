export const getInitials = (
  firstName: string | undefined,
  lastName: string | undefined
): string => {
  const firstInitial = firstName ? firstName[0] : "";
  const lastInitial = lastName ? lastName[0] : "";
  const abbreviation = `${firstInitial}${lastInitial}`.toUpperCase();

  return abbreviation;
};
