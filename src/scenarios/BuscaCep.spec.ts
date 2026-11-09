import { test } from '@playwright/test';
import { join } from 'path';
import { TheConfig } from 'sicolo';
import BuscaCepPage from '../support/pages/BuscaCepPage';

test.describe('Correios - Busca CEP', () => {
  const CONFIG = join(__dirname, '../support/fixtures/config.yml');
  const BASE_URL = TheConfig.fromFile(CONFIG)
    .andPath('application.correios_busca_cep')
    .retrieveData();
  const CEP_AV_PAULISTA = '01310100';

  let buscaCepPage: BuscaCepPage;

  test.beforeEach(async ({ page }) => {
    buscaCepPage = new BuscaCepPage(page);
    await buscaCepPage.abrir(BASE_URL);
  });

  test('deve exigir o endereço ou CEP antes de buscar', async () => {
    await test.step('clicar em Buscar com o formulário vazio', async () => {
      await buscaCepPage.buscar();
    });

    await test.step('validar o aviso e o foco no campo', async () => {
      await buscaCepPage.validarAlerta(
        'Informe o Endereço com no mínimo 2 (dois) caracteres!'
      );
      await buscaCepPage.validarFocoNoEnderecoOuCep();
      await buscaCepPage.validarSemResultado();
    });
  });

  test('deve exigir o captcha quando o CEP é informado', async () => {
    await test.step('informar o CEP e buscar sem captcha', async () => {
      await buscaCepPage.informarEnderecoOuCep(CEP_AV_PAULISTA);
      await buscaCepPage.buscar();
    });

    await test.step('validar o aviso e o foco no captcha', async () => {
      await buscaCepPage.validarAlerta(
        'Preencha o campo Captcha! (texto contido na imagem)'
      );
      await buscaCepPage.validarFocoNoCaptcha();
      await buscaCepPage.validarSemResultado();
    });
  });

  test('deve recusar a busca com captcha inválido', async () => {
    const captchaAnterior = await buscaCepPage.enderecoDaImagemCaptcha();

    await test.step('informar CEP e captcha errado e buscar', async () => {
      await buscaCepPage.informarEnderecoOuCep(CEP_AV_PAULISTA);
      await buscaCepPage.informarCaptcha('abc12');
      await buscaCepPage.buscarAguardandoServidor();
    });

    await test.step('validar a recusa e a troca do captcha', async () => {
      await buscaCepPage.validarAlerta('Captcha Inválido!');
      await buscaCepPage.validarCaptchaRenovado(captchaAnterior);
      await buscaCepPage.validarSemResultado();
    });
  });
});
