import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class BuscaCepElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  getCampoEnderecoOuCep(): Locator {
    return this.page.getByLabel('Digite um CEP ou um Endereço:');
  }

  getCampoCaptcha(): Locator {
    return this.page.getByLabel('Digite o texto contido na imagem');
  }

  getImagemCaptcha(): Locator {
    return this.page.getByAltText('CAPTCHA Image');
  }

  getBotaoBuscar(): Locator {
    return this.page.getByRole('button', { name: 'Buscar', exact: true });
  }

  // Faixa de aviso que o site abre no rodapé (não tem role/aria, por isso o id)
  getAlerta(): Locator {
    return this.page.locator('#alerta');
  }

  getMensagemAlerta(): Locator {
    return this.page.locator('#alerta .msg');
  }

  // Só aparece depois que uma busca retorna resultado
  getBotaoNovaBusca(): Locator {
    return this.page.getByRole('button', { name: 'Nova Busca' });
  }
}
