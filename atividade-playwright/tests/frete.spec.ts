import { test, expect } from '@playwright/test';

test.describe('cálculo de frete', () => {
  const casosValidos = [
    {
      nome: 'CEP iniciado por 8 cobra R$ 15,00',
      cep: '87000000',
      valor: '100,00',
      resultado: 'Frete: R$ 15,00',
    },
    {
      nome: 'CEP não iniciado por 8 cobra R$ 25,00',
      cep: '01001000',
      valor: '100,00',
      resultado: 'Frete: R$ 25,00',
    },
    {
      nome: 'valor imediatamente abaixo de R$ 200,00 ainda cobra frete',
      cep: '87000000',
      valor: '199,99',
      resultado: 'Frete: R$ 15,00',
    },
    {
      nome: 'valor exatamente em R$ 200,00 recebe frete grátis',
      cep: '87000000',
      valor: '200,00',
      resultado: 'Frete grátis',
    },
    {
      nome: 'valor acima de R$ 200,00 recebe frete grátis',
      cep: '01001000',
      valor: '200,01',
      resultado: 'Frete grátis',
    },
  ];

  for (const caso of casosValidos) {
    test(caso.nome, async ({ page }) => {
      await page.goto('/frete');

      await page.getByLabel('CEP').fill(caso.cep);
      await page.getByLabel('Valor do pedido').fill(caso.valor);
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText(caso.resultado);
      await expect(resultado).toHaveAttribute('role', 'status');
    });
  }

  const casosInvalidos = [
    { nome: 'CEP vazio', cep: '', valor: '100,00' },
    { nome: 'CEP com 7 dígitos', cep: '8700000', valor: '100,00' },
    { nome: 'CEP com 9 dígitos', cep: '870000000', valor: '100,00' },
    { nome: 'CEP com letras', cep: '87ABC000', valor: '100,00' },
    { nome: 'valor vazio', cep: '87000000', valor: '' },
    { nome: 'valor igual a zero', cep: '87000000', valor: '0' },
    { nome: 'valor negativo', cep: '87000000', valor: '-1' },
    { nome: 'valor não numérico', cep: '87000000', valor: 'abc' },
    { nome: 'valor com mais de duas casas decimais', cep: '87000000', valor: '10,999' },
  ];

  for (const caso of casosInvalidos) {
    test(`rejeita ${caso.nome}`, async ({ page }) => {
      await page.goto('/frete');

      await page.getByLabel('CEP').fill(caso.cep);
      await page.getByLabel('Valor do pedido').fill(caso.valor);
      await page.getByRole('button', { name: 'Calcular frete' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Dados inválidos');
      await expect(resultado).toHaveAttribute('role', 'alert');
    });
  }
});
