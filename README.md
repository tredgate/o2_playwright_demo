# Playwright Multi-Environment Testing Demo

This educational project demonstrates the complete journey from basic Playwright testing to advanced multi-environment test automation. Through a series of progressively complex examples, it teaches modern test automation patterns, TypeScript integration, and scalable architecture design.

**Perfect for**: Students, junior developers, and teams learning modern test automation practices.

## Project Goals

1. **Progressive Learning**: Step-by-step progression from basic to advanced patterns
2. **Educational Excellence**: Clear, documented examples with comprehensive explanations
3. **Industry Standards**: Real-world patterns used in professional test automation
4. **Type-Safe Development**: Full TypeScript implementation with proper typing
5. **Environment Management**: Professional multi-environment and localization support
6. **Clean Architecture**: KISS principle with scalable, maintainable code structure

## Architecture Overview

### Environment Management System

The project uses a fixture-based approach with clean separation of concerns:

```
Environment Variables (TEST_ENV, TEST_LANGUAGE)
           ↓
Environment Configuration Manager
           ↓
Playwright Fixtures (testData)
           ↓
Test Functions (automatic injection)
```

### File Structure

```
📁 Project Root
├── 📄 README.md                    # Comprehensive project documentation
├── 📄 package.json                 # Dependencies and npm scripts
├── 📄 playwright.config.ts         # Playwright configuration
│
├── 📁 tests/                       # Test Files (Learning Progression)
│   ├── 📄 first_tests.spec.ts      # 🎯 Level 1: Basic Playwright
│   ├── 📄 failing_tests.spec.ts    # 🎯 Level 2: Test Management
│   ├── 📄 localizations.spec.ts    # 🎯 Level 3: Internationalization
│   ├── 📄 page_objects.spec.ts     # 🎯 Level 4: Page Object Model
│   └── 📄 environment-demo.spec.ts # 🎯 Level 5: Environment Management
│
├── 📁 src/                         # Source Code (Framework)
│   ├── 📁 types/
│   │   └── 📄 environment.ts       # TypeScript interfaces and enums
│   ├── 📁 config/
│   │   ├── 📄 environment-config.ts # Main configuration manager
│   │   └── 📁 environments/
│   │       ├── 📄 prod.config.ts   # Production environment settings
│   │       └── 📄 test.config.ts   # Test environment settings
│   ├── 📁 data/
│   │   ├── 📄 prod-data.ts         # Production test data and credentials
│   │   └── 📄 test-data.ts         # Test environment data (placeholders)
│   ├── 📁 fixtures/
│   │   └── 📄 environment-fixtures.ts # Playwright dependency injection
│   ├── 📁 pages/                   # Page Object Models
│   │   └── 📁 pmtool/
│   │       ├── 📄 login_page.ts    # Login page with testData integration
│   │       └── 📄 dashboard_page.ts # Dashboard page interactions
│   └── 📁 i18n/                    # Internationalization
│       ├── 📄 i18n.ts              # Language management
│       ├── 📄 en.ts                # English translations
│       └── 📄 cs.ts                # Czech translations
│
└── 📁 test-results/                # Generated test outputs
    ├── 📁 playwright-report/       # HTML test reports
    └── 📁 trace/                   # Test execution traces
```

### Learning Path Structure

| Level | Test File                  | Concept           | Dependencies                 |
| ----- | -------------------------- | ----------------- | ---------------------------- |
| 1️⃣    | `first_tests.spec.ts`      | Basic Playwright  | None                         |
| 2️⃣    | `failing_tests.spec.ts`    | Test Management   | Basic Playwright             |
| 3️⃣    | `localizations.spec.ts`    | i18n Testing      | Environment variables, i18n/ |
| 4️⃣    | `page_objects.spec.ts`     | Page Object Model | pages/ directory             |
| 5️⃣    | `environment-demo.spec.ts` | Full Framework    | All src/ components          |

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running Tests

#### Individual Test Files (Learning Progression)

```bash
# Basic tests
npx playwright test first_tests.spec.ts
npx playwright test failing_tests.spec.ts

# Intermediate tests
cross-env TEST_LANGUAGE=cs npx playwright test localizations.spec.ts
npx playwright test page_objects.spec.ts

# Advanced environment management
npm run prod:en:test environment-demo.spec.ts
```

#### Environment-Specific Commands (Production Ready)

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

#### Custom Environment Variables

```bash
# Manual environment variable setting
cross-env TEST_ENV=PROD TEST_LANGUAGE=en playwright test
cross-env TEST_ENV=TEST TEST_LANGUAGE=cs playwright test --ui

# Run specific test file with environment
cross-env TEST_ENV=PROD TEST_LANGUAGE=en playwright test environment-demo.spec.ts
```

## Configuration

### Environment Variables

| Variable        | Values         | Default | Description                |
| --------------- | -------------- | ------- | -------------------------- |
| `TEST_ENV`      | `PROD`, `TEST` | `PROD`  | Target testing environment |
| `TEST_LANGUAGE` | `en`, `cs`     | `en`    | Language for localization  |

### Supported Environments

#### PROD Environment

- **Purpose**: Production-like testing with real applications
- **URLs**: PMTool: `https://tredgate.com/pmtool`, TEGb: `https://tegb-frontend-...`
- **Users**: PMTool: `admin/TEG2023`, `user/user`, `test/test`
- **Timeouts**: Longer timeouts for stability (30s/15s/5s)
- **Retries**: More retries for production reliability

#### TEST Environment

- **Purpose**: Test environment demonstration (placeholder data)
- **URLs**: `https://test.tredgate.com/pmtool` (placeholder)
- **Users**: `test_admin/test_admin_pass`, etc. (placeholder)
- **Timeouts**: Shorter timeouts for faster feedback (20s/10s/3s)
- **Retries**: No retries for immediate failure detection

**Note**: TEST environment uses placeholder URLs for demonstration purposes only.

## Usage Examples

### Basic Test with Fixtures

```typescript
import { test, expect } from "../src/fixtures/environment-fixtures";
import { LoginPage } from "../src/pages/pmtool/login_page";

test("login test", async ({ page, testData }) => {
  const loginPage = new LoginPage(page);

  // Use environment-specific URL
  await loginPage.openFromTestData(testData);

  // Use environment-specific credentials
  await loginPage.loginTestData(testData.users.pmtool.admin);

  // Use environment-specific timeouts
  await expect(page.locator("#dashboard")).toBeVisible({
    timeout: testData.timeouts.medium,
  });
});
```

### Environment-Specific Test Skipping

```typescript
import { skipInEnvironments } from "../src/fixtures/environment-fixtures";
import { TestEnvironment } from "../src/types/environment";

// Skip navigation tests in TEST environment (placeholder URLs)
skipInEnvironments([TestEnvironment.TEST], "Navigation Tests", () => {
  test("full navigation flow", async ({ page, testData }) => {
    // This test only runs in PROD environment
  });
});
```

### Accessing Test Data

```typescript
test("user management", async ({ testData }) => {
  // Access different user types for different applications
  const pmtoolAdmin = testData.users.pmtool.admin;
  const tegbAdmin = testData.users.tegb.admin;

  // Access application URLs
  const pmtoolUrl = testData.urls.pmtool;
  const tegbUrl = testData.urls.tegbUrl;

  // Use environment-specific timeouts
  const timeout = testData.timeouts.medium;
});
```

## Test File Overview

This project contains several test files demonstrating different testing approaches and learning progression:

### Learning Progression

#### 1. **first_tests.spec.ts** - Getting Started

Basic Playwright test without any patterns or abstractions.

```typescript
// Direct page interactions, hardcoded values
await page.goto("http://tredgate.com/pmtool/");
await page.locator("#username").fill("pw_academy");
```

**Learning Focus**: Playwright basics, DOM selectors, simple interactions

#### 2. **failing_tests.spec.ts** - Test Management

Demonstrates test skipping and failure handling.

```typescript
test.skip("Failing test", async ({ page }) => {
  // Intentionally failing test to show skip functionality
});
```

**Learning Focus**: Test lifecycle, debugging, test skipping strategies

#### 3. **localizations.spec.ts** - Internationalization

Shows language switching and localized testing.

```typescript
switch (getCurrentLanguage()) {
  case "cs":
    await page.locator('[data-testid="cz"]').click();
  case "en":
    await page.locator('[data-testid="en"]').click();
}
```

**Learning Focus**: i18n testing, environment variables, conditional logic

#### 4. **page_objects.spec.ts** - Page Object Model

Introduces the Page Object Model pattern for better maintainability.

```typescript
const loginPage = new LoginPage(page);
await loginPage.openPmtool();
await loginPage.login("pw_skoleni", "TEG2023");
```

**Learning Focus**: Code organization, reusability, maintenance patterns

#### 5. **environment-demo.spec.ts** - Advanced Environment Management

Complete environment management system with fixtures and type safety.

```typescript
test("Login and Logout", async ({ page, testData }) => {
  await loginPage.openFromTestData(testData);
  await loginPage.loginTestData(testData.users.pmtool.admin);
});
```

**Learning Focus**: Advanced patterns, dependency injection, scalable architecture

### Test Categories

| Test File                  | Complexity   | Focus Area             | Run Command                                                    |
| -------------------------- | ------------ | ---------------------- | -------------------------------------------------------------- |
| `first_tests.spec.ts`      | Beginner     | Basic Playwright       | `npx playwright test first_tests`                              |
| `failing_tests.spec.ts`    | Beginner     | Test Management        | `npx playwright test failing_tests`                            |
| `localizations.spec.ts`    | Intermediate | i18n Testing           | `cross-env TEST_LANGUAGE=cs npx playwright test localizations` |
| `page_objects.spec.ts`     | Intermediate | POM Pattern            | `npx playwright test page_objects`                             |
| `environment-demo.spec.ts` | Advanced     | Environment Management | `npm run prod:en:test`                                         |

## Educational Features

### For Students Learning Test Automation

1. **Progressive Complexity**: Learn step-by-step from basic to advanced patterns
2. **Modern Patterns**: Fixture-based dependency injection and Page Object Model
3. **Type Safety**: Comprehensive TypeScript implementation
4. **Clean Architecture**: Clear separation of concerns
5. **Environment Management**: Professional multi-environment support
6. **Code Organization**: Scalable file structure
7. **Best Practices**: Security considerations and comprehensive documentation

### Key Learning Points

- **Separation of Concerns**: Configuration, data, and test logic are separated
- **DRY Principle**: Reusable configurations and data structures
- **Type Safety**: Catch errors at compile time, not runtime
- **Scalability**: Patterns that work for small and large projects
- **Maintainability**: Easy to add new environments or modify existing ones
- **KISS Principle**: Keep it simple and understandable
- **Progressive Learning**: Start simple, add complexity gradually

## Security Considerations

### Current Implementation (Demo/Educational)

- Uses hardcoded test credentials for simplicity
- Clearly documents security limitations
- Separates test data from configuration
- Uses environment variables for basic configuration

### Production Recommendations

**IMPORTANT**: In real projects, implement secure credential management:

```typescript
// Example: Secure credential loading
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

## Advanced Configuration

### Adding New Environments

1. **Add to enum**: Update `TestEnvironment` enum in `src/types/environment.ts`
2. **Create data file**: `src/data/staging-data.ts`
3. **Create config file**: `src/config/environments/staging.config.ts`
4. **Update manager**: Add case in `createEnvironmentConfig()` function
5. **Add npm scripts**: Create staging-specific commands in `package.json`

### Adding New Applications

```typescript
// In environment.ts
interface ApplicationUrls {
  pmtool: string;
  tegbUrl: string;
  newApp: string; // Add new application URL
}

interface TestData {
  users: {
    pmtool: {
      /* existing users */
    };
    tegb: {
      /* existing users */
    };
    newApp: {
      // Add new application users
      admin: UserCredentials;
      user: UserCredentials;
    };
  };
}
```

### Environment-Specific Test Filtering

```typescript
// Environment-specific tests
test("production only feature", async ({ testData }) => {
  test.skip(testData.environment !== TestEnvironment.PROD, "PROD only");
  // Test implementation
});
```

## Contributing

This is an educational project following clean code principles:

1. **Maintain Simplicity**: Keep examples clear and understandable
2. **Document Everything**: Add comprehensive comments and documentation
3. **Follow Patterns**: Use established patterns from existing code
4. **Test Changes**: Ensure new features work across all environments
5. **KISS Principle**: Avoid over-engineering solutions

## Troubleshooting

### Common Issues

**Environment not detected correctly**

```bash
# Check environment variables are set
echo $TEST_ENV
echo $TEST_LANGUAGE
```

**TypeScript compilation errors**

```bash
# Check TypeScript configuration
npx tsc --noEmit
```

**Tests failing in TEST environment**

- Expected behavior: TEST environment uses placeholder URLs
- Solution: Use `skipInEnvironments([TestEnvironment.TEST], ...)` for navigation tests

**Cross-platform script issues**

- All scripts use `cross-env` for Windows/Mac/Linux compatibility

## Learning Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Test Automation Patterns](https://martinfowler.com/articles/practical-test-pyramid.html)
- [Page Object Model](https://playwright.dev/docs/pom)

---

**Happy Testing!**

For questions or improvements, please open an issue or contribute to the project.
