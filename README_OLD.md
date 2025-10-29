# Playwright Multi-Environment Testing Demo

This project demonstrates a comprehensive approach to managing multiple testing environments, configurations, and test data in Playwright. It showcases best practices for building scalable test automation frameworks that can work across different environments while maintaining type safety and code clarity.

## 🎯 Project Goals

1. **Educational**: Provide a clear, simple example for students learning test automation
2. **Scalable**: Demonstrate patterns that work in large projects
3. **Type-Safe**: Leverage TypeScript for better development experience
4. **Environment-Aware**: Show how to manage different environments effectively

## 🏗️ Architecture Overview

### Environment Management System

The project uses a fixture-based approach with the following key components:

```
Environment Variables (TEST_ENV, TEST_LANGUAGE)
           ↓
Environment Configuration Manager
           ↓
Playwright Fixtures (testData, envConfig, users)
           ↓
Test Functions (automatic injection)
```

### File Structure

```
src/
├── types/
│   └── environment.ts          # TypeScript interfaces and types
├── config/
│   └── environment-config.ts   # Environment configuration management
├── data/
│   ├── prod-data.ts            # Production environment test data
│   └── test-data.ts            # Test environment test data
├── fixtures/
│   └── environment-fixtures.ts # Playwright fixtures for dependency injection
└── pages/                      # Page Object Models (existing)
    └── pmtool/
        ├── login_page.ts
        └── dashboard_page.ts
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running Tests

#### Basic Commands

```bash
# Run all tests with default settings (PROD environment, English)
npm test

# Run tests with UI mode
npm run ui
```

#### Environment-Specific Commands

```bash
# Production environment tests
npm run prod:en:test    # PROD environment, English
npm run prod:en:ui      # PROD environment, English (UI mode)
npm run prod:cs:test    # PROD environment, Czech
npm run prod:cs:ui      # PROD environment, Czech (UI mode)

# Test environment tests
npm run test:en:test    # TEST environment, English
npm run test:en:ui      # TEST environment, English (UI mode)
npm run test:cs:test    # TEST environment, Czech
npm run test:cs:ui      # TEST environment, Czech (UI mode)
```

#### Advanced Commands

```bash
# Run tests in all environments
npm run test:all-envs

# Run tests in all languages (PROD environment)
npm run test:all-langs

# Show current configuration
npm run show:config
```

#### Custom Environment Variables

```bash
# Manual environment variable setting
cross-env TEST_ENV=PROD TEST_LANGUAGE=en playwright test
cross-env TEST_ENV=TEST TEST_LANGUAGE=cs playwright test --ui

# Run specific test file
cross-env TEST_ENV=PROD TEST_LANGUAGE=en playwright test environment-demo.spec.ts
```

## 🛠️ Configuration

### Environment Variables

| Variable        | Values         | Default | Description                |
| --------------- | -------------- | ------- | -------------------------- |
| `TEST_ENV`      | `PROD`, `TEST` | `PROD`  | Target testing environment |
| `TEST_LANGUAGE` | `en`, `cs`     | `en`    | Language for localization  |

### Supported Environments

#### PROD Environment

- **Purpose**: Production-like testing with real application
- **URL**: `https://tredgate.com/pmtool`
- **Users**: `admin/admin`, `user/user`, `test/test`
- **Timeouts**: Longer timeouts for stability
- **Retries**: More retries for production reliability

#### TEST Environment

- **Purpose**: Test environment demonstration (placeholder data)
- **URL**: `https://test.tredgate.com/pmtool` (placeholder)
- **Users**: `test_admin/test_admin_pass`, etc. (placeholder)
- **Timeouts**: Shorter timeouts for faster feedback
- **Retries**: No retries for faster failure feedback

**⚠️ Note**: TEST environment uses placeholder URLs and credentials for demonstration purposes only.

## 💻 Usage Examples

### Basic Test with Fixtures

```typescript
import { test, expect } from "../src/fixtures/environment-fixtures";

test("login test", async ({ page, testData, adminUser }) => {
  // testData and adminUser are automatically injected based on environment
  await page.goto(testData.urls.loginUrl);

  const loginPage = new LoginPage(page);
  await loginPage.login(adminUser.username, adminUser.password);

  // Use environment-specific timeouts
  await expect(page.locator("#dashboard")).toBeVisible({
    timeout: testData.timeouts.medium,
  });
});
```

### Environment-Specific Tests

```typescript
import {
  testInEnvironments,
  skipInEnvironments,
} from "../src/fixtures/environment-fixtures";

// Only run in production
testInEnvironments(["PROD"], "Production Tests", () => {
  test("critical production test", async ({ page, testData }) => {
    // This test only runs when TEST_ENV=PROD
  });
});

// Skip in test environment
skipInEnvironments(["TEST"], "Navigation Tests", () => {
  test("full navigation flow", async ({ page, testData }) => {
    // Skipped in TEST environment due to placeholder URLs
  });
});
```

### Accessing Different User Types

```typescript
test("user role tests", async ({
  page,
  testData,
  adminUser,
  regularUser,
  testUser,
}) => {
  // All user types automatically available based on environment
  console.log(`Admin: ${adminUser.username}`);
  console.log(`Regular: ${regularUser.username}`);
  console.log(`Test: ${testUser.username}`);
});
```

## 🎓 Educational Features

### For Students Learning Test Automation

1. **Fixture Pattern**: Learn modern dependency injection in testing
2. **Type Safety**: Understand TypeScript benefits in test automation
3. **Environment Management**: See how professional teams handle multiple environments
4. **Code Organization**: Study clean architecture for test frameworks
5. **Documentation**: Example of well-documented automation code

### Key Learning Points

- **Separation of Concerns**: Configuration, data, and test logic are separated
- **DRY Principle**: Reusable configurations and data structures
- **Type Safety**: Catch errors at compile time, not runtime
- **Scalability**: Patterns that work for small and large projects
- **Maintainability**: Easy to add new environments or modify existing ones

## 🔒 Security Considerations

### Current Implementation (Demo/Educational)

- ✅ Uses hardcoded test credentials for simplicity
- ✅ Clearly documents security considerations
- ✅ Separates test data from configuration
- ✅ Uses environment variables for basic configuration

### Production Recommendations

For real-world projects, implement these additional security measures:

```typescript
// Example: Secure credential management
interface SecureTestData extends TestData {
  users: {
    admin: UserCredentials; // Loaded from secure vault
    regularUser: UserCredentials; // Loaded from .env file
  };
}

// Use environment-specific .env files
// .env.prod, .env.test, .env.staging
const credentials = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};
```

#### Recommended Security Practices

1. **Secret Management**: Use Azure Key Vault, AWS Secrets Manager, or HashiCorp Vault
2. **Environment Files**: Use `.env` files with `.gitignore` for sensitive data
3. **CI/CD Integration**: Store secrets in CI/CD pipeline secret stores
4. **Access Control**: Limit access to production credentials
5. **Rotation**: Regularly rotate test account passwords
6. **Monitoring**: Log authentication attempts and access patterns

### File Structure for Secure Implementation

```
src/
├── config/
│   ├── environments/
│   │   ├── prod.config.ts      # Production config (no secrets)
│   │   ├── test.config.ts      # Test config
│   │   └── local.config.ts     # Local development
│   └── secrets/
│       ├── secret-manager.ts   # Secret retrieval logic
│       └── .env.example        # Example environment file
```

## 🔧 Advanced Configuration

### Adding New Environments

1. **Create data file**: `src/data/staging-data.ts`
2. **Update types**: Add `STAGING` to `TestEnvironment` type
3. **Update config manager**: Add case in `getTestData()` function
4. **Add npm scripts**: Create staging-specific commands

### Adding New User Types

```typescript
// In environment.ts
interface TestData {
  users: {
    admin: UserCredentials;
    regularUser: UserCredentials;
    testUser: UserCredentials;
    apiUser: UserCredentials; // New user type
    readonlyUser: UserCredentials; // New user type
  };
}

// In fixtures
export const test = base.extend<{
  apiUser: { username: string; password: string };
  readonlyUser: { username: string; password: string };
}>({
  apiUser: async ({ testData }, use) => {
    const { username, password } = testData.users.apiUser;
    await use({ username, password });
  },
  // ... other fixtures
});
```

### Environment-Specific Test Filtering

```typescript
// Custom test runner for specific environments
export function prodOnlyTest(name: string, testFn: any) {
  const currentEnv = getCurrentEnvironment();
  if (currentEnv === "PROD") {
    test(name, testFn);
  } else {
    test.skip(`${name} [PROD only]`, testFn);
  }
}
```

## 🤝 Contributing

This is an educational project. When contributing:

1. **Maintain Simplicity**: Keep examples clear and understandable
2. **Document Everything**: Add comprehensive comments and documentation
3. **Follow Patterns**: Use established patterns from the existing code
4. **Test Changes**: Ensure new features work across all environments

## 📚 Learning Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Test Automation Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Page Object Model](https://playwright.dev/docs/pom)

## 🐛 Troubleshooting

### Common Issues

**Environment not detected correctly**

```bash
# Check environment variables
echo $TEST_ENV
echo $TEST_LANGUAGE

# Verify configuration
npm run show:config
```

**TypeScript compilation errors**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Install missing dependencies
npm install
```

**Tests failing in TEST environment**

- Expected behavior: TEST environment uses placeholder URLs
- Solution: Use `testInEnvironments(["PROD"], ...)` for navigation tests

**Cross-platform script issues**

- All scripts use `cross-env` for Windows/Mac/Linux compatibility
- Ensure `cross-env` is installed: `npm install cross-env`

## 📄 License

This project is for educational purposes. See LICENSE file for details.

---

**Happy Testing! 🚀**

For questions or improvements, please open an issue or contribute to the project.
