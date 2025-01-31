import config from '../config'
import {test, expect} from '@playwright/test'

test.describe('restrospective-demo / reflect page', () => {
  test('allows the user to enter feedback in start column', async ({page}) => {
    await config.goto(page, '/retrospective-demo')
    await page.click('text=Start Demo')

    const startTextbox = '[data-cy=reflection-column-Start] [role=textbox]'
    await page.click(startTextbox)
    await page.type(startTextbox, 'Start doing this')
    await page.press(startTextbox, 'Enter')

    await expect(
      page.locator('[data-cy="reflection-stack-Start"] :text("Start doing this")')
    ).toBeVisible()
  })

  // test('allows the user to enter feedback in the stop column')
  // test('allows the user to enter feedback in the continue column')
  // test('allows the user to delete previously entered feedback')

  test('displays simulated users writing reflections in the start column', async ({page}) => {
    await config.goto(page, '/retrospective-demo')

    await page.click('text=Start Demo')

    await expect(
      page.locator(
        '[data-cy=reflection-column-Start] :text("2 team members writing reflections...")'
      )
    ).toBeVisible()

    await expect(
      page.locator(
        '[data-cy=reflection-column-Start] :text("1 team member reflection + 2 in progress")'
      )
    ).toBeVisible()

    await expect(
      page.locator(
        '[data-cy=reflection-column-Start] :text("2 team member reflections + 2 in progress")'
      )
    ).toBeVisible()

    await expect(
      page.locator(
        '[data-cy=reflection-column-Start] :text("2 team member reflections + 1 in progress")'
      )
    ).toBeVisible()

    await expect(
      page.locator('[data-cy=reflection-column-Start] :text("2 team member reflections")')
    ).toBeVisible()
  })

  // test('displays simulated users writing reflections in the stop column')
  // test('displays simulated users writing reflections in the continue column')
})
