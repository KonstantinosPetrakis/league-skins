/**
 * ┌──────────────────────────────────────────────────────────────────────────────┐
 * │ This module manages the configuration file used by other modules.            │
 * └──────────────────────────────────────────────────────────────────────────────┘
 */

import { dialog } from 'electron'
import path from 'path'
import fs from 'fs-extra'

import { CONFIG_PATH } from './constants'

const DEFAULT_CONFIG = {
  leaguePath: path.join('C:', 'Riot Games', 'League of Legends')
}

/**
 * This function checks if the config file exists.
 * @returns {Promise<boolean>} true if the config file exists, false otherwise.
 */
async function configExists(): Promise<boolean> {
  return fs.pathExists(CONFIG_PATH)
}

/**
 * This function gets a value from the config file.
 * @param key the key to get the value of.
 * @returns {Promise<string>} the value of the key.
 */
export async function getConfigValue(key: string): Promise<string> {
  const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'))
  return config[key]
}

/**
 * This function sets a value in the config file.
 * @param key the key to set the value of.
 * @param value the value to set.
 */
export async function setConfigValue(key: string, value: string): Promise<void> {
  const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf-8'))
  config[key] = value
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2))
}

/**
 * This function checks if the league path is valid.
 * @param leaguePath the league path to check.
 * @returns {Promise<boolean>} true if the league path is valid, false otherwise.
 */
export async function isLeaguePathValid(leaguePath: string): Promise<boolean> {
  return fs.pathExists(path.join(leaguePath, 'LeagueClient.exe'))
}

/**
 * This function sets the league path in the config file.
 * @param leaguePath the league path to set.
 * @returns {Promise<boolean>} true if the league path was set, false otherwise.
 */
export async function setLeaguePath(leaguePath: string): Promise<boolean> {
  if (!(await isLeaguePathValid(leaguePath))) return false
  await setConfigValue('leaguePath', leaguePath)
  return true
}

export async function askAndSetLeaguePath(): Promise<boolean> {
  const leagueDirectory = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })

  return !leagueDirectory.canceled && setLeaguePath(leagueDirectory.filePaths[0])
}

/**
 * This function gets the league path from the config file.
 * @returns {Promise<string>} the league path.
 */
export async function getLeaguePath(): Promise<string> {
  return getConfigValue('leaguePath')
}

/**
 * This function checks if the current league path is valid.
 * @returns {Promise<boolean>} true if the current league path is valid, false otherwise.
 */
export async function isCurrentLeaguePathValid(): Promise<boolean> {
  return isLeaguePathValid(await getLeaguePath())
}

// Create the config file if it doesn't exist.
configExists().then(async (exists) => {
  if (!exists) await fs.writeFile(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2))
})
