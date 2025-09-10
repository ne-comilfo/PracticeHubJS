# Project Overview

This project is focused on practicing **HTML, CSS, and native JavaScript**.  
It includes various features for **event handling** as well as **responsive layout**.

---

## Running the Lightweight Version

To run a clean version of the application **without unnecessary files**, follow these steps:

1. Navigate to the `project` folder:  

```bash
cd project
```

2. Start the JSON server:

```bash
json-server db.json
```

3. Build the JavaScript bundle with Webpack:

```bash
npx webpack
```

Running the Full Project (Not Recommended)

The full project is large in size and may take longer to load.
If you want to run it, execute the following commands from the root folder:

```bash
json-server project/db.json
npx webpack --config project/webpack.config.js
```

Summary

Focus: HTML, CSS, native JS practice      
Features: Event handling, responsive layout
Recommended: Run the lightweight version to avoid heavy load
