/**
 * ┌───────────────────────────────────────────────────────────────────────────────┐
 * │ This module is used to drive the cslol-manager tools to patch league of       │
 * │ legends with a custom skin.                                                   │
 * └───────────────────────────────────────────────────────────────────────────────┘
 */

import fs from 'fs-extra'
import path from 'path'
import util from 'node:util'
import { exec, spawn, ChildProcess } from 'child_process'

const promisifiedExec = util.promisify(exec)

import {
  CSLOL_MANAGER_EXECUTABLE,
  CSLOL_MANAGER_CONFIG,
  LOL_SKINS_LOCATION,
  TEMP_DIR
} from './constants'
import type { Skin, Chroma } from './metadata'
import { getLeaguePath } from './config'

let runningProcess: ChildProcess | null = null

/**
 * This function sets the skin of a champion in league of legends.
 * @param skin the skin or chroma to set.
 * @returns {Promise<void>} when the operation is finished.
 */
export async function setSkin(skin: Skin | Chroma): Promise<void> {
  const skinsDirDestination = path.join(TEMP_DIR, 'skins')
  const overlayDirDestination = path.join(TEMP_DIR, 'overlay')
  const skinPath = path.join(LOL_SKINS_LOCATION, skin.championId.toString(), `${skin.id}.fantome`)
  const gamePath = path.join(await getLeaguePath(), 'Game')

  await fs.remove(TEMP_DIR)
  await fs.ensureDir(TEMP_DIR)

  if (runningProcess) {
    runningProcess.kill()
    runningProcess = null
  }

  console.log(`Setting skin ${skin.id} for champion ${skin.championId}`)

  await promisifiedExec(
    `${CSLOL_MANAGER_EXECUTABLE} import "${skinPath}" "${path.join(skinsDirDestination, 'skin')}" --game:"${gamePath}"`
  )

  await promisifiedExec(
    `${CSLOL_MANAGER_EXECUTABLE} mkoverlay "${skinsDirDestination}" "${overlayDirDestination}" --game:"${gamePath}" --mods:"skin"`
  )

  runningProcess = spawn(
    `${CSLOL_MANAGER_EXECUTABLE} runoverlay "${overlayDirDestination}" "${CSLOL_MANAGER_CONFIG}" --game:"${gamePath}"`,
    { shell: true }
  )
}
