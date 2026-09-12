import { test, expect } from '@playwright/test';

test.describe('cadastro de senha', () => {
  const casosValidos = [
    {
      nome: 'aceita senha com exatamente 8 caracteres',
      senha: 'Aa123456',
    },
    {
      nome: 'aceita senha dentro da faixa permitida',
      senha: 'Senha123',
    },
    {
      nome: 'aceita senha com exatamente 20 caracteres',
      senha: 'Abcdefghijklmnopq123',
    },
  ];

  for (const caso of casosValidos) {
    test(caso.nome, async ({ page }) => {
      await page.goto('/senha');

      await page.getByLabel('Nova senha').fill(caso.senha);
      await page.getByLabel('Confirmar senha').fill(caso.senha);
      await page.getByRole('button', { name: 'Cadastrar senha' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Senha cadastrada');
      await expect(resultado).toHaveAttribute('role', 'status');
    });
  }

  const casosFormatoInvalido = [
    {
      nome: '7 caracteres, imediatamente abaixo do mínimo',
      senha: 'Aa12345',
    },
    {
      nome: '21 caracteres, imediatamente acima do máximo',
      senha: 'Abcdefghijklmnopq1234',
    },
    {
      nome: 'sem letra maiúscula',
      senha: 'senha123',
    },
    {
      nome: 'sem letra minúscula',
      senha: 'SENHA123',
    },
    {
      nome: 'sem número',
      senha: 'SenhaTeste',
    },
    {
      nome: 'com espaço',
      senha: 'Senha 123',
    },
    {
      nome: 'vazia',
      senha: '',
    },
  ];

  for (const caso of casosFormatoInvalido) {
    test(`rejeita senha ${caso.nome}`, async ({ page }) => {
      await page.goto('/senha');

      await page.getByLabel('Nova senha').fill(caso.senha);
      await page.getByLabel('Confirmar senha').fill(caso.senha);
      await page.getByRole('button', { name: 'Cadastrar senha' }).click();

      const resultado = page.locator('#resultado');
      await expect(resultado).toBeVisible();
      await expect(resultado).toHaveText('Senha fora do padrão');
      await expect(resultado).toHaveAttribute('role', 'alert');
    });
  }

  test('rejeita quando a confirmação não coincide com a senha', async ({ page }) => {
    await page.goto('/senha');

    await page.getByLabel('Nova senha').fill('Senha123');
    await page.getByLabel('Confirmar senha').fill('Senha124');
    await page.getByRole('button', { name: 'Cadastrar senha' }).click();

    const resultado = page.locator('#resultado');
    await expect(resultado).toBeVisible();
    await expect(resultado).toHaveText('As senhas não coincidem');
    await expect(resultado).toHaveAttribute('role', 'alert');
  });
});
