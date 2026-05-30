// Test for Phoenix.edu email validation
import { validatePhoenixEmail, extractPhoenixUserInfo } from '../utils/phoenixAuth';

console.log('Testing Phoenix.edu email validation:');

// Test cases
const testCases = [
  'student@phoenix.edu',
  'instructor@phoenix.edu',
  'admin@phoenix.edu',
  'user@gmail.com',
  'student@university.edu',
  'invalid-email',
  '',
  null,
  undefined
];

testCases.forEach(email => {
  const result = validatePhoenixEmail(email);
  console.log(`${email}: ${result.isValid ? '✅ Valid' : '❌ Invalid - ' + result.error}`);
});

console.log('\nTesting user info extraction:');

['student@phoenix.edu', 'instructor@phoenix.edu', 'admin@phoenix.edu'].forEach(email => {
  const userInfo = extractPhoenixUserInfo(email);
  if (userInfo) {
    console.log(`${email}: Role = ${userInfo.role}, Username = ${userInfo.username}`);
  }
});

export default function testPhoenixAuth() {
  return 'Phoenix.edu authentication tests completed';
}
