2026-02-21T22:50:05.878Z	Initializing build environment...
2026-02-21T22:50:05.878Z	Initializing build environment...
2026-02-21T22:50:34.164Z	Success: Finished initializing build environment
2026-02-21T22:50:34.445Z	Cloning repository...
2026-02-21T22:50:35.505Z	Detected the following tools from environment: npm@10.0.0, nodejs@22.16.0
2026-02-21T22:50:35.507Z	Restoring from dependencies cache
2026-02-21T22:50:35.508Z	Restoring from build output cache
2026-02-21T22:50:35.658Z	Installing project dependencies: npm clean-install --progress=false
2026-02-21T22:50:43.676Z	
2026-02-21T22:50:43.676Z	added 384 packages, and audited 386 packages in 8s
2026-02-21T22:50:43.676Z	
2026-02-21T22:50:43.677Z	168 packages are looking for funding
2026-02-21T22:50:43.677Z	  run `npm fund` for details
2026-02-21T22:50:43.715Z	
2026-02-21T22:50:43.715Z	4 vulnerabilities (1 low, 2 moderate, 1 high)
2026-02-21T22:50:43.715Z	
2026-02-21T22:50:43.715Z	To address issues that do not require attention, run:
2026-02-21T22:50:43.715Z	  npm audit fix
2026-02-21T22:50:43.715Z	
2026-02-21T22:50:43.715Z	To address all issues (including breaking changes), run:
2026-02-21T22:50:43.715Z	  npm audit fix --force
2026-02-21T22:50:43.716Z	
2026-02-21T22:50:43.716Z	Run `npm audit` for details.
2026-02-21T22:50:43.888Z	Executing user build command: npm run build
2026-02-21T22:50:44.219Z	
2026-02-21T22:50:44.220Z	> web@0.1.0 build
2026-02-21T22:50:44.220Z	> astro build
2026-02-21T22:50:44.220Z	
2026-02-21T22:50:45.627Z	✘ [ERROR] The build was canceled
2026-02-21T22:50:45.627Z	
2026-02-21T22:50:45.632Z	22:50:45 [types] Generated 55ms
2026-02-21T22:50:45.632Z	22:50:45 [build] output: "static"
2026-02-21T22:50:45.632Z	22:50:45 [build] directory: /opt/buildhome/repo/apps/web/dist/
2026-02-21T22:50:45.632Z	22:50:45 [build] Collecting build info...
2026-02-21T22:50:45.633Z	22:50:45 [build] ✓ Completed in 113ms.
2026-02-21T22:50:45.637Z	22:50:45 [build] Building static entrypoints...
2026-02-21T22:50:47.023Z	22:50:47 [WARN] [vite] [plugin:vite:reporter] [plugin vite:reporter] 
2026-02-21T22:50:47.023Z	(!) /opt/buildhome/repo/apps/web/src/i18n/ui.ts is dynamically imported by /opt/buildhome/repo/apps/web/src/layouts/Layout.astro but also statically imported by /opt/buildhome/repo/apps/web/src/i18n/utils.ts, dynamic import will not move module into another chunk.
2026-02-21T22:50:47.023Z	
2026-02-21T22:50:47.042Z	22:50:47 [vite] ✓ built in 1.37s
2026-02-21T22:50:47.043Z	22:50:47 [build] ✓ Completed in 1.41s.
2026-02-21T22:50:47.049Z	
2026-02-21T22:50:47.049Z	 generating static routes 
2026-02-21T22:50:47.056Z	22:50:47 ▶ src/pages/es/index.astro
2026-02-21T22:50:47.065Z	22:50:47   └─ /es/index.html (+8ms)
2026-02-21T22:50:47.067Z	22:50:47 ▶ src/pages/index.astro
2026-02-21T22:50:47.070Z	22:50:47   └─ /index.html (+3ms)
2026-02-21T22:50:47.070Z	22:50:47 ✓ Completed in 23ms.
2026-02-21T22:50:47.070Z	
2026-02-21T22:50:47.073Z	22:50:47 [build] 2 page(s) built in 1.55s
2026-02-21T22:50:47.073Z	22:50:47 [build] Complete!
2026-02-21T22:50:47.102Z	Success: Build command completed
2026-02-21T22:50:47.204Z	Executing user deploy command: npx wrangler deploy
2026-02-21T22:50:48.716Z	npm warn exec The following package was not found and will be installed: wrangler@4.67.0
2026-02-21T22:50:58.077Z	
2026-02-21T22:50:58.077Z	 ⛅️ wrangler 4.67.0
2026-02-21T22:50:58.077Z	───────────────────
2026-02-21T22:50:58.104Z	
2026-02-21T22:50:58.104Z	Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
2026-02-21T22:50:58.105Z	
2026-02-21T22:50:58.194Z	✘ [ERROR] Missing entry-point to Worker script or to assets directory
2026-02-21T22:50:58.194Z	
2026-02-21T22:50:58.194Z	  
2026-02-21T22:50:58.197Z	  If there is code to deploy, you can either:
2026-02-21T22:50:58.197Z	  - Specify an entry-point to your Worker script via the command line (ex: `npx wrangler deploy src/index.ts`)
2026-02-21T22:50:58.197Z	  - Or create a "wrangler.jsonc" file containing:
2026-02-21T22:50:58.201Z	  
2026-02-21T22:50:58.202Z	  ```
2026-02-21T22:50:58.202Z	  {
2026-02-21T22:50:58.202Z	    "name": "worker-name",
2026-02-21T22:50:58.202Z	    "compatibility_date": "2026-02-21",
2026-02-21T22:50:58.202Z	    "main": "src/index.ts"
2026-02-21T22:50:58.203Z	  }
2026-02-21T22:50:58.203Z	  ```
2026-02-21T22:50:58.203Z	  
2026-02-21T22:50:58.203Z	  
2026-02-21T22:50:58.209Z	  If are uploading a directory of assets, you can either:
2026-02-21T22:50:58.210Z	  - Specify the path to the directory of assets via the command line: (ex: `npx wrangler deploy --assets=./dist`)
2026-02-21T22:50:58.210Z	  - Or create a "wrangler.jsonc" file containing:
2026-02-21T22:50:58.210Z	  
2026-02-21T22:50:58.210Z	  ```
2026-02-21T22:50:58.210Z	  {
2026-02-21T22:50:58.211Z	    "name": "worker-name",
2026-02-21T22:50:58.211Z	    "compatibility_date": "2026-02-21",
2026-02-21T22:50:58.211Z	    "assets": {
2026-02-21T22:50:58.211Z	      "directory": "./dist"
2026-02-21T22:50:58.211Z	    }
2026-02-21T22:50:58.211Z	  }
2026-02-21T22:50:58.212Z	  ```
2026-02-21T22:50:58.212Z	  
2026-02-21T22:50:58.212Z	
2026-02-21T22:50:58.212Z	
2026-02-21T22:50:58.250Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-02-21_22-50-57_339.log"
2026-02-21T22:50:58.385Z	Failed: error occurred while running deploy command