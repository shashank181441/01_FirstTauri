# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## To run this code in your device, you need node and rust installed on your device.
then run 
```
npm install
```
which will install required node modules for vite, react and the library being used.
then run 
```
npm run tauri dev
```
this will run your react code on tauri environment, note that it is not "npm run dev", which will open the react app on browser.
Finally, to build the desktop app, you need to run the command:
```
npm run tauri build
```

This worked completely fine for me(on macOS), but don't know about windows and linux users.
