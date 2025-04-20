// @ts-check
import { test, expect } from '@playwright/test';

// Test the basic functionality of the kanban board
test('should load the kanban board with columns', async ({ page }) => {
  await page.goto('/');
  
  // Wait for content to load
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for the board to be visible with the correct class
  await page.waitForSelector('.kanban-board', { timeout: 10000 });
  
  // Check if columns are visible with correct class
  await expect(page.locator('.column').filter({ hasText: 'Todo' })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.column').filter({ hasText: 'In Progress' })).toBeVisible({ timeout: 10000 });
  await expect(page.locator('.column').filter({ hasText: 'Done' })).toBeVisible({ timeout: 10000 });
});

// Simplified task creation test
test('create task button is clickable', async ({ page }) => {
  await page.goto('/');
  
  // Wait for content to load
  await page.waitForLoadState('domcontentloaded');
  
  // Wait for the task form to be visible 
  await page.waitForSelector('.task-form', { timeout: 10000 });
  
  // Log form state before filling
  console.log("Form elements found:");
  console.log("Title input count:", await page.locator('.task-form input[placeholder="Task Title"]').count());
  console.log("Description textarea count:", await page.locator('.task-form textarea[placeholder="Task Description"]').count());
  console.log("Create Task button count:", await page.locator('button:has-text("Create Task")').count());
  
  // Make sure the Create Task button exists and is clickable
  await expect(page.locator('button:has-text("Create Task")')).toBeVisible();
  await expect(page.locator('button:has-text("Create Task")')).toBeEnabled();
  
  // Success if we reach this point
  expect(true).toBeTruthy();
}); 