import { Page, expect } from '@playwright/test';
import BuscaCepElements from '../elements/BuscaCepElements';
import BasePage from './BasePage';

export default class BuscaCepPage extends BasePage {
  readonly buscaCepElements: BuscaCepElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.buscaCepElements = new BuscaCepElements(page);
  }

  async abrir(url: string): Promise<void> {
    await this.page.goto(url);
    await this.verifyTitle('Busca CEP');
    await expect(this.buscaCepElements.getCampoEnderecoOuCep()).toBeVisible();
  }

  async informarEnderecoOuCep(valor: string): Promise<void> {
    await this.buscaCepElements.getCampoEnderecoOuCep().fill(valor);
  }

  async informarCaptcha(texto: string): Promise<void> {
    await this.buscaCepElements.getCampoCaptcha().fill(texto);
  }

  async buscar(): Promise<void> {
    await this.buscaCepElements.getBotaoBuscar().click();
  }

  // Envia a busca e espera a resposta do servidor dos Correios
  async buscarAguardandoServidor(): Promise<void> {
    const resposta = this.page.waitForResponse(
      res =>
        res.url().includes('carrega-cep-endereco.php') &&
        res.request().method() === 'POST'
    );
    await this.buscar();
    expect((await resposta).ok()).toBeTruthy();
  }

  async validarAlerta(mensagem: string): Promise<void> {
    await expect(this.buscaCepElements.getAlerta()).toHaveClass(/aberto/);
    await expect(this.buscaCepElements.getMensagemAlerta()).toHaveText(
      mensagem
    );
  }

  async validarFocoNoEnderecoOuCep(): Promise<void> {
    await expect(this.buscaCepElements.getCampoEnderecoOuCep()).toBeFocused();
  }

  async validarFocoNoCaptcha(): Promise<void> {
    await expect(this.buscaCepElements.getCampoCaptcha()).toBeFocused();
  }

  async enderecoDaImagemCaptcha(): Promise<string | null> {
    return this.buscaCepElements.getImagemCaptcha().getAttribute('src');
  }

  async validarCaptchaRenovado(srcAnterior: string | null): Promise<void> {
    await expect(this.buscaCepElements.getCampoCaptcha()).toBeEmpty();
    await expect(this.buscaCepElements.getImagemCaptcha()).not.toHaveAttribute(
      'src',
      srcAnterior ?? ''
    );
  }

  async validarSemResultado(): Promise<void> {
    await expect(this.buscaCepElements.getBotaoNovaBusca()).toBeHidden();
    await expect(this.buscaCepElements.getBotaoBuscar()).toBeVisible();
  }
}
