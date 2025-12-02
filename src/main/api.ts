/**
 * ┌───────────────────────────────────────────────────────────────────────────────┐
 * │ This module is used to create the api the renderer process utilizes and is    │
 * │ exposed via the preload process.                                              │
 * └───────────────────────────────────────────────────────────────────────────────┘
 */

import { ipcMain } from 'electron'

import { askAndSetLeaguePath, isCurrentLeaguePathValid } from './config'
import { downloadLolSkins } from './download'
import { setSkin } from './skins'
import { type Skin, type Chroma, listSkins, listChampions } from './metadata'

ipcMain.handle('isCurrentLeaguePathValid', isCurrentLeaguePathValid)
ipcMain.handle('askAndSetLeaguePath', askAndSetLeaguePath)
ipcMain.handle('downloadLolSkins', async (_, force: boolean) => downloadLolSkins(force))
ipcMain.handle('listSkins', listSkins)
ipcMain.handle('listChampions', listChampions)
ipcMain.handle('setSkin', (_, skin: Skin | Chroma) => setSkin(skin))
