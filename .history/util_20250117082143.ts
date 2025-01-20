export function generateDescription(testName: string): string {
    return `This test case performs the ${testName.replace(/([A-Z])/g, ' $1').toLowerCase()} operation.`;
  }