import { Locator, Page } from "@playwright/test";
import { TestData, UserCredentials } from "../../types/environment.ts";

export class LoginPage {
  readonly page: Page;
  readonly url = "https://tredgate.com/pmtool"; // ? URL is used when more apps are present, better to store it in TestData and pass it to POMs
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator("#username"); // ! V případě nastavování lokátorů, nedáváme await před page
    this.passwordInput = page.locator("#password");
    this.loginButton = page.locator(".btn");
  }

  // Při vytváření metod doporučím přístup začít s atomickými (malými) metodami s jedním krokem a pak vytvářet sdružující metody
  // Například: typeUsername - jeden krok, login - sdružení více kroků
  // Atomické metody používáme, když danou funkcionalitu testujeme a sdružující metody například pro preconditions jiných testů

  async openPmtool() {
    await this.page.goto(this.url);
  }

  // Only usable when environments and TestData are implemented
  async openFromTestData(testData: TestData) {
    await this.page.goto(testData.urls.pmtool);
  }

  // ! Testovací data NIKDY nedáváme do metod, ale posíláme je parametrems
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  async loginTestData(user: UserCredentials) {
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.clickLogin();
  }
}
