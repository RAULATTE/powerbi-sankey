# Power BI Sankey Visual - Deployment Guide

This guide explains how to build and deploy this custom Sankey visual to your Power BI dashboard.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Building the Visual](#building-the-visual)
4. [Importing to Power BI](#importing-to-power-bi)
5. [Using the Visual](#using-the-visual)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

**TL;DR** - Three commands to get the `.pbiviz` file:

```bash
cd powerbi-sankey-8level
npm install
npm run package
```

The deployable file will be created at: `powerbi-sankey-8level/dist/powerbi-sankey-8level.1.0.0.pbiviz`

---

## Prerequisites

### 1. Install Node.js

Download and install Node.js LTS (version 18 or higher recommended):
- **Windows/Mac**: Download from [nodejs.org](https://nodejs.org/)
- **Linux**: Use your package manager:
  ```bash
  # Ubuntu/Debian
  sudo apt install nodejs npm

  # CentOS/RHEL
  sudo yum install nodejs npm
  ```

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### 2. Install Power BI Visuals Tools

Install the Power BI visuals tools globally:

```bash
npm install -g powerbi-visuals-tools
```

Verify installation:
```bash
pbiviz --version  # Should show version info
```

**Note**: On Linux/Mac, you might need to use `sudo`:
```bash
sudo npm install -g powerbi-visuals-tools
```

### 3. Install Power BI Desktop

Download and install Power BI Desktop:
- **Download**: [Power BI Desktop](https://powerbi.microsoft.com/desktop/)
- **Requirement**: Windows 10 or higher
- **Alternative**: Use Power BI Service (online) for importing custom visuals

---

## Building the Visual

### Step 1: Navigate to Project Directory

```bash
cd powerbi-sankey-8level
```

### Step 2: Install Dependencies

Install all required npm packages:

```bash
npm install
```

This will install:
- TypeScript compiler
- D3.js and d3-sankey libraries
- Power BI visuals API
- Webpack and build tools
- All other dependencies

**Expected output**: You should see a `node_modules/` directory created.

### Step 3: Build and Package

Create the distributable `.pbiviz` file:

```bash
npm run package
```

**What this does**:
1. Compiles TypeScript to JavaScript
2. Bundles all dependencies
3. Processes LESS styles to CSS
4. Creates the `.pbiviz` package file

**Expected output**:
```
info Building visual...
info Compiled successfully
info visual.pbiviz created
```

### Step 4: Locate the Package

The packaged visual will be at:
```
powerbi-sankey-8level/dist/powerbi-sankey-8level.1.0.0.pbiviz
```

This `.pbiviz` file is what you'll import into Power BI!

---

## Importing to Power BI

### Method 1: Power BI Desktop

1. **Open Power BI Desktop**

2. **Enable Developer Mode** (if testing from development server):
   - Go to File → Options and Settings → Options
   - Select "Preview features"
   - Check "Developer mode"
   - Restart Power BI Desktop

3. **Import the Custom Visual**:
   - In the Visualizations pane, click the three dots (**...**)
   - Select "Import a visual from a file"
   - Browse to `powerbi-sankey-8level/dist/powerbi-sankey-8level.1.0.0.pbiviz`
   - Click "OK" to import

4. **Accept Security Warning**:
   - Power BI will warn about importing custom visuals
   - Read the warning and click "Import" if you trust the source

5. **Visual Appears**:
   - The Sankey visual icon should now appear in your Visualizations pane
   - Look for the Sankey diagram icon

### Method 2: Power BI Service (Online)

1. **Sign in to Power BI Service**: https://app.powerbi.com

2. **Open a Report** or create a new one

3. **Import Custom Visual**:
   - In the Visualizations pane, click the three dots (**...**)
   - Select "Import a visual from a file"
   - Upload the `.pbiviz` file
   - Click "Import"

4. **Use the Visual** in your report

### Method 3: Organization Custom Visuals (Enterprise)

For enterprise deployments:

1. **Admin Access Required**: You need Power BI Admin permissions

2. **Upload to Organization**:
   - Go to Admin Portal → Tenant Settings → Custom Visuals
   - Upload the `.pbiviz` file
   - Make it available to your organization

3. **Users can then**:
   - Access it from "My Organization" in the visuals pane
   - No need for individual imports

---

## Using the Visual

### Step 1: Prepare Your Data

Create a table in Power BI with the following columns:

| Column Name | Type | Required | Description |
|------------|------|----------|-------------|
| Level1 | Text | Yes | First level/stage in the flow |
| Level2 | Text | Optional | Second level/stage |
| Level3 | Text | Optional | Third level/stage |
| Level4 | Text | Optional | Fourth level/stage |
| Level5 | Text | Optional | Fifth level/stage |
| Level6 | Text | Optional | Sixth level/stage |
| Level7 | Text | Optional | Seventh level/stage |
| Level8 | Text | Optional | Eighth level/stage |
| Value | Number | Yes | Flow magnitude/volume |
| Tooltip | Text | Optional | Custom tooltip text |

**Example Data**:

```
Level1    Level2      Level3       Value
----------------------------------------
Intake    Triage      Resolve      120
Intake    Triage      Escalate     40
Intake    Bypass      Resolve      10
Online    Processing  Complete     200
Online    Processing  Pending      50
Store     Queue       Complete     80
```

### Step 2: Add Visual to Report

1. Click the Sankey visual icon in the Visualizations pane
2. The visual will appear on your canvas

### Step 3: Configure Data Fields

Drag and drop fields to the visual's field wells:

1. **Level1-8**: Drag your level/stage columns here
   - Order matters: Level1 is leftmost, Level8 is rightmost
   - You don't need to use all 8 levels
   - Empty/null values are allowed

2. **Value**: Drag your numeric measure here
   - This determines the width of flows
   - Must be a numeric field

3. **Tooltip** (optional): Drag a text field for custom tooltips

### Step 4: Format the Visual

Click the paint roller icon to access formatting options:

**Sankey Settings**:
- **Node width** (1-100): Width of the rectangular nodes
- **Node padding** (0-100): Vertical spacing between nodes
- **Link opacity** (0-1): Transparency of flow links
- **Alignment**: Layout algorithm
  - `justify`: Spreads nodes across width (default)
  - `left`: Aligns nodes to the left
  - `right`: Aligns nodes to the right
  - `center`: Centers nodes
- **Truncate labels** (true/false): Whether to shorten long labels
- **Label max length** (1-200): Maximum characters for labels
- **Merge same labels across levels** (true/false):
  - Off: Each level has unique nodes
  - On: Nodes with same name merge across levels

---

## Development Mode (Optional)

For rapid development and testing:

### Start Development Server

```bash
cd powerbi-sankey-8level
npm run start
```

This starts a local dev server at `https://localhost:8080`

### Use in Power BI Desktop

1. Enable Developer Mode (see above)
2. In Visualizations pane, click "Developer Visual" icon
3. Visual will load from local server
4. Changes to code will auto-reload

---

## Troubleshooting

### Build Issues

**Problem**: `npm install` fails with permission errors

**Solution**:
```bash
# Linux/Mac: Use sudo
sudo npm install -g powerbi-visuals-tools

# Or fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

---

**Problem**: `pbiviz: command not found`

**Solution**:
```bash
# Verify global npm bin path
npm bin -g

# Add to your PATH or reinstall globally
npm install -g powerbi-visuals-tools
```

---

**Problem**: `npm run package` fails with TypeScript errors

**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run package
```

---

**Problem**: Build succeeds but `.pbiviz` file not created

**Solution**:
- Check the `dist/` directory was created
- Look for error messages in build output
- Verify `pbiviz.json` has correct configuration
- Check that all source files exist in `src/`

---

### Import Issues

**Problem**: "Import failed" when loading `.pbiviz` in Power BI

**Solutions**:
- Ensure file is not corrupted (rebuild if needed)
- Check file size (should be 500KB - 2MB typically)
- Try closing and reopening Power BI Desktop
- Verify you're using a recent version of Power BI Desktop

---

**Problem**: Visual doesn't appear after import

**Solutions**:
- Scroll through the Visualizations pane
- Look for a custom visual icon (may be at the bottom)
- Try restarting Power BI Desktop
- Check if visual was imported to "My organization" instead

---

**Problem**: Security warning blocks import

**Solutions**:
- This is expected for custom visuals
- Review the source code if concerned
- Only import visuals from trusted sources
- Click "Import" to proceed if you trust this visual

---

### Runtime Issues

**Problem**: Visual shows "Add columns Level1..Level8 and Value to build a Sankey path"

**Solution**:
- You need to add data fields to the visual
- At minimum, add Level1 and Value
- Drag fields from your data model to the visual's field wells

---

**Problem**: Visual shows "Error rendering Sankey diagram"

**Solutions**:
- Check browser console (F12) for detailed error
- Verify your data has no cycles (A→B→A)
- Ensure Value field contains valid positive numbers
- Check for extremely large or small values
- Try with a smaller dataset first

---

**Problem**: Labels are cut off or overlapping

**Solutions**:
- Increase visual size on canvas
- Enable "Truncate labels" in formatting
- Reduce "Label max length" setting
- Adjust "Node padding" for more vertical space

---

**Problem**: Visual is too crowded

**Solutions**:
- Reduce "Node width" in settings
- Increase "Node padding" in settings
- Filter your data to show fewer flows
- Make the visual larger on the canvas
- Try different alignment options

---

## Files Overview

Important files in the project:

| File | Purpose |
|------|---------|
| `package.json` | Project dependencies and build scripts |
| `pbiviz.json` | Visual metadata and configuration |
| `capabilities.json` | Data roles and visual capabilities |
| `tsconfig.json` | TypeScript compiler configuration |
| `src/visual.ts` | Main visual rendering logic |
| `src/settings.ts` | Visual settings/properties |
| `style/visual.less` | Visual styling |
| `assets/icon.png` | Visual icon (shown in Power BI) |
| `dist/*.pbiviz` | **Packaged visual (this is what you import!)** |

---

## Next Steps

After successfully importing the visual:

1. ✅ **Verify** it appears in your Visualizations pane
2. ✅ **Test** with sample data
3. ✅ **Customize** settings to match your needs
4. ✅ **Share** your Power BI report with others
5. ✅ **Deploy** to Power BI Service if needed

For enterprise deployments, consider:
- Publishing to organizational custom visuals
- Setting up automated builds
- Version control for visual updates
- User training and documentation

---

## Support

- **Issues**: Report at the GitHub repository
- **Documentation**: See README.md in project root
- **Power BI Docs**: [Microsoft Power BI Documentation](https://docs.microsoft.com/power-bi/)
- **Custom Visuals**: [Power BI Visuals Documentation](https://docs.microsoft.com/power-bi/developer/visuals/)

---

**Last Updated**: 2026-02-23
**Version**: 1.0.0
