export const handleServiceError = (serviceName, error) => {
  console.error(`${serviceName}:`, error);
  throw error;
};
