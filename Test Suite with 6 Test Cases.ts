import { test, expect } from '@playwright/test';
test.describe.configure({ mode: 'serial' });

test('Go to SF and read all previuos notifications', async ({ page }) => 
  {
  await page.goto('https://page-customer-4229.scratch.lightning.force.com/lightning/page/home'); //Login in SF
  await page.waitForLoadState('load');
  await page.waitForTimeout(6000);
  await page.getByRole('button', { name: 'Notifications' }).click(); //Read all previous notifications
  await page.getByLabel('Close', { exact: true }).click();
  });

test('Create Product', async ({ page }) => 
    {
    await page.goto('https://page-customer-4229.scratch.lightning.force.com/lightning/page/home'); 
    await page.waitForLoadState('load');
   await page.getByRole('link', { name: 'Products' }).click();
  await page.getByRole('button', { name: 'New' }).click();
  await page.getByLabel('*Product Name').fill('0123 Anna');
  await page.getByLabel('Active').check();
  await page.getByText('FirstConnection').click();
  await page.getByRole('button', { name: 'Move to Chosen' }).click();
  await page.getByLabel('Product Group', { exact: true }).click();
  await page.getByLabel('Product Group', { exact: true }).fill('Ydelser m/moms');
  await page.locator('#combobox-input-273-1-273').getByText('Ydelser').click();
  await page.getByPlaceholder('Ydelser m/moms').click();
  await page.getByRole('combobox', { name: 'Unit', exact: true }).click();
  await page.getByRole('option', { name: 'meter' }).locator('span').nth(1).click();
  await page.getByLabel('Enabled For E-conomic Sync').check();
  await page.getByLabel('Bar Code').click();
  await page.getByLabel('Bar Code').fill('700');
  await page.getByLabel('Sales Price').click();
  await page.getByLabel('Sales Price').fill('800');
  await page.getByRole('textbox', { name: 'Product Description' }).click();
  await page.getByRole('textbox', { name: 'Product Description' }).fill('Anna Description');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
});

test('Send Product to E1', async ({ page }) => 
  {
  test.setTimeout(200000);
    await page.goto('https://page-customer-4229.scratch.lightning.force.com/lightning/page/home'); 
    await page.waitForLoadState('load');
    await page.getByRole('link', { name: 'Economic Setup' }).click(); // Sending Product to Economic via the first way
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('tab', { name: 'Products' }).click();
    await page.getByRole('combobox', { name: 'Select method of migration' }).click();
    await page.getByText('Update blank fields of').click();
    await page.getByRole('combobox', { name: 'Select mapping field for' }).click();
    await page.getByRole('option', { name: 'Product Number' }).locator('span').nth(1).click();
    await page.getByRole('button', { name: 'Proceed historical data' }).click();
    const counterLabel = page.locator('.counterLabel');
    await expect(counterLabel).toHaveText('3', { timeout: 240000 });
  });

test('Check Id and Message for SF Product', async ({ page }) => 
    {
      await page.goto('https://page-customer-4229.scratch.lightning.force.com/lightning/page/home'); 
      await page.waitForLoadState('load');
      await page.getByRole('link', { name: 'Products' }).click();
    await page.getByRole('button', { name: 'Select a List View: Products' }).click();
    await page.getByRole('option', { name: 'All' }).click();
    await page.getByRole('button', { name: 'Pin this list view.' }).click();
    await page.getByRole('link', { name: '0123 Anna', exact: true }).first().click();
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByLabel('Economic Id', { exact: true });
    const EcId = await page.getByLabel('Economic Id', { exact: true }).inputValue();
    await expect(EcId.trim()).not.toBe('');
    const EconomicMess = await page.getByLabel('Last Integration Message', { exact: true }).inputValue();
    await expect(EconomicMess.trim()).toEqual('Created/Updated successfully in E-conomic!');
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    //await page.getByRole('link', { name: 'Products' }).click();
    //await page.getByRole('row', { name: 'Select item 1 0123 Anna' }).getByRole('button').click();
    //await page.getByRole('menuitem', { name: 'Delete' }).click();
    //await page.getByRole('button', { name: 'Delete' }).click();
  });

test('Check Product in Economic', async ({ page }) => 
      {
    await page.goto('https://bit.ly/E-conomic_login', {timeout : 6000}); //Login in First Economic
    await page.getByRole('button', {name: 'Accept All Cookies'}).click();
    await page.locator('#Username').click();
    await page.locator('#Username').fill('economic.first.12.12.23@gmail.com');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.locator('#Password').click();
    await page.locator('#Password').fill('V&ym6aSB-j5$C%?');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForLoadState('load');
    await page.getByRole('link', { name: 'Sales' }).click();
    await page.getByRole('menuitem', { name: 'Products' }).click();
    await page.locator('a').filter({ hasText: 'Products' }).click();
    await page.getByLabel('Show: Open').click();
    await page.getByText('All').click();
    await page.getByPlaceholder('Search for no. or name').click();
    await page.getByPlaceholder('Search for no. or name').fill('0123 Anna');
    await page.getByLabel('Search', { exact: true }).click();
    await page.getByRole('row', { name: '0123 Anna' }).getByLabel('Edit (e)').first().click();     
    //try {
      //await page.getByText('test Product group 11-1').click();
      //console.log("Step 3 passed");
  //} catch (error) {
  //    console.log("Group in E-conomic:", error);
  //}
    //await page.getByText('test Product group 11-1').click();  // now this is the bug in E-conomic! not proper group is selected
    //await page.getByLabel('No. *').click();
    const EcName = await page.getByLabel('Name *', {exact: true}).inputValue();
    await expect(EcName.trim()).toEqual('0123 Anna');
    const EcSalesPrice = await page.getByLabel('Sales price', {exact: true}).inputValue();
    await expect(EcSalesPrice.trim()).toEqual('800,00');
    const EcBarCode = await page.getByLabel('Barcode', {exact: true}).inputValue();
    await expect(EcBarCode.trim()).toEqual('700');
    const EcDescription = await page.getByLabel('Description').inputValue();
    expect(EcDescription).toEqual('Anna Description');
    const EcActive = await page.getByLabel('AccessOpen');
    expect(EcActive).toHaveText('Open');
    const EcUnit = await page.getByLabel('Unitmeter');
    expect(EcUnit).toHaveText('meter');
    //const EcReccPrice = await page.getByLabel('Rec. price', {exact: true}).inputValue();
    //await expect(EcReccPrice.trim()).toEqual('700,00');
    //const EcCostPrice = await page.getByLabel('Cost price', {exact: true}).inputValue();
    //await expect(EcCostPrice.trim()).toEqual('900,00');
    //await page.getByRole('button', { name: 'Cancel' }).click();
    //await page.getByRole('row', { name: '0123 Anna' }).getByLabel('Delete (del)').first().click();
    //await page.getByRole('button', { name: 'Delete' }).click();

  await page.getByLabel('Name *').click();
  await page.getByLabel('Name *').fill('0123 Anna 0123');
  await page.getByLabel('DescriptionAnna Description').click();
  await page.getByLabel('DescriptionAnna Description').fill('Anna Description Economic');
  await page.getByLabel('Sales price').click();
  await page.getByLabel('Sales price').fill('1800,00');
  await page.getByLabel('Barcode').click();
  await page.getByLabel('Barcode').click();
  await page.getByLabel('Barcode').fill('7002');
  await page.getByLabel('AccessOpen').click();
  await page.getByText('Barred').nth(1).click(); //nth(1) selects the second "Barred" value in the Page
  await page.getByLabel('Unitmeter').click();
  await page.getByText('hours').click();
  await page.getByLabel('Search in list').click();
  await page.getByRole('cell', { name: '9' }).click();
  await page.getByRole('button', { name: 'Save' }).click();
  });

test('Retrieve Product from E-conomic', async ({ page }) => 
    {
    test.setTimeout(240000);
    await page.goto('https://page-customer-4229.scratch.lightning.force.com/lightning/page/home'); 
    await page.waitForLoadState('load');
    await page.waitForTimeout(6000);
    await page.getByRole('button', { name: 'Notifications' }).click(); //Read all previous notifications
    await page.getByLabel('Close', { exact: true }).click();
    await page.getByRole('link', { name: 'Economic Setup' }).click(); // Sending Product from E1 to Sf via the second way
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('tab', { name: 'Products' }).click();
    await page.getByRole('combobox', { name: 'Select method of migration' }).click();
    await page.getByText('Import from E-conomic').click();
    await page.getByRole('combobox', { name: 'Select mapping field for' }).click();
    await page.getByRole('option', { name: 'Product Number' }).locator('span').nth(1).click();
    await page.getByRole('button', { name: 'Proceed historical data' }).click();
    const counterLabel = page.locator('.counterLabel');
    await expect(counterLabel).toHaveText('3', { timeout: 240000 });
  });      



