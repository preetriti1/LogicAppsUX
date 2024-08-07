import { test } from '@playwright/test';
import { GoToMockWorkflow } from './utils/GoToWorkflow';

test.describe(
  'Performance Tests',
  {
    tag: '@mock',
  },
  () => {
    test('Should test perf on "Panel" workflow', async ({ page }) => testWorkflow(page, 'Panel'));
    test('Should test perf on "500 Nodes" workflow', async ({ page }) => testWorkflow(page, '500 Nodes'));
  }
);

async function testWorkflow(page, name) {
  await page.goto('/');
  const session = await page.context().newCDPSession(page);
  await session.send('Performance.enable');
  await GoToMockWorkflow(page, name);
  logMetrics(name, (await session.send('Performance.getMetrics')).metrics);
}

function logMetrics(title, metrics) {
  const trackedMetrics = [
    'JSEventListeners',
    'Nodes',
    'Resources',
    'RecalcStyleCount',
    'RecalcStyleDuration',
    'ScriptDuration',
    'TaskDuration',
    'TastOtherDuration',
    'ThreadTime',
    'ProcessTime',
    'JSHeapUsedSize',
    'JSHeapTotalSize',
  ];
  console.log(`============= [${title}] Performance Metrics ===============`);
  console.log(metrics.filter((metric) => trackedMetrics.includes(metric.name)));
}
