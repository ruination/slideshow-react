/* eslint strict: 0 */
'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

import { app, BrowserWindow, Menu, shell } from 'electron';
import path from 'path';

let menu;
let template;
let mainWindow = null;


if (process.env.NODE_ENV === 'development') {
	require('electron-debug')();
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

const installExtensions = async () => {
	if (process.env.NODE_ENV === 'development') {
		const installer = require('electron-devtools-installer'); // eslint-disable-line global-require

		const extensions = [
			'REACT_DEVELOPER_TOOLS',
			'REDUX_DEVTOOLS'
		];
		const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
		for (const name of extensions) {
			try {
				await installer.default(installer[name], forceDownload);
			} catch (e) {} // eslint-disable-line
		}
	}
};

app.on('ready', async () => {
	await installExtensions();

	// const iconPath = path.join(__dirname, "/mobile/assets/icon.ico");

	mainWindow = new BrowserWindow({ 
		show: false,
		width: 1920,
		minWidth: 640,
		minHeight: 360,
		height: 720,
		frame: false,
		transparent: false,
		darkTheme: true,
		backgroundColor: "#151515",
		// icon: iconPath,
	});

	mainWindow.loadURL(`http://localhost:35729/`);

	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.show();
		mainWindow.focus();
		
		if (process.env.NODE_ENV === 'development') {
			mainWindow.openDevTools();
			mainWindow.webContents.on('context-menu', (e, props) => {
				const { x, y } = props;

				Menu.buildFromTemplate(
				[{
					label: 'Inspect element',
					click() {
						mainWindow.inspectElement(x, y);
					}
				}])
				.popup(mainWindow);
			});
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});

	// template = 
	// [
	// 	{
	// 		label: '&View',
	// 		submenu: 
	// 			(process.env.NODE_ENV === 'development') 
	// 				? 
	// 				[
	// 					{
	// 						label: '&Reload',
	// 						accelerator: 'Ctrl+R',
	// 						click() {
	// 							mainWindow.restart();
	// 						}
	// 					},
	// 					{
	// 						label: 'Toggle &Full Screen',
	// 						accelerator: 'F11',
	// 						click() {
	// 							mainWindow.setFullScreen(!mainWindow.isFullScreen());
	// 						}
	// 					},
	// 					{
	// 						label: 'Toggle &Developer Tools',
	// 						accelerator: 'Alt+Ctrl+I',
	// 						click() {
	// 							mainWindow.toggleDevTools();
	// 						}
	// 					}
	// 				]
	// 				: 
	// 				[
	// 					{
	// 						label: 'Toggle &Full Screen',
	// 						accelerator: 'F11',
	// 						click() {
	// 							mainWindow.setFullScreen(!mainWindow.isFullScreen());
	// 						}
	// 					}
	// 				]
	// 	},
	// ];

	// menu = Menu.buildFromTemplate(template);
	// mainWindow.setMenu(menu);
});
