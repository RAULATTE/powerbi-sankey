# Power BI Sankey Visual - Quick Start

This repository contains a custom Power BI visual for creating Sankey diagrams with up to 8 levels.

## 🚀 Quick Start - Get the Visual File

**You need the `.pbiviz` file to import this visual into Power BI. Here's how to get it:**

### Option 1: Build It Yourself (Recommended)

```bash
# 1. Navigate to the visual directory
cd powerbi-sankey-8level

# 2. Install dependencies (first time only)
npm install

# 3. Build the package
npm run package
```

The visual file will be created at: **`powerbi-sankey-8level/dist/powerbi-sankey-8level.1.0.0.pbiviz`**

### Option 2: Download Pre-built (if available)

Check the [Releases](../../releases) page for pre-built `.pbiviz` files.

---

## 📦 What You Need Before Starting

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **Power BI Visuals Tools**:
   ```bash
   npm install -g powerbi-visuals-tools
   ```
3. **Power BI Desktop** - [Download here](https://powerbi.microsoft.com/desktop/)

---

## 📥 Import to Power BI

### Step 1: Build the Package (if not done already)

```bash
cd powerbi-sankey-8level
npm install
npm run package
```

### Step 2: Import in Power BI Desktop

1. Open Power BI Desktop
2. Go to Visualizations pane
3. Click the three dots (**...**) → **"Import a visual from a file"**
4. Select: `powerbi-sankey-8level/dist/powerbi-sankey-8level.1.0.0.pbiviz`
5. Click **Import**
6. Accept the security warning

The Sankey visual icon will now appear in your Visualizations pane! ✅

---

## 🎯 Using the Visual

### Minimum Data Requirements

Your data needs at least:
- **Level1** column (text) - First stage in the flow
- **Value** column (number) - Flow magnitude

### Example Data

| Level1 | Level2   | Level3   | Value |
|--------|----------|----------|-------|
| Intake | Triage   | Resolve  | 120   |
| Intake | Triage   | Escalate | 40    |
| Intake | Bypass   | Resolve  | 10    |

### Configure the Visual

1. Click the Sankey visual icon to add it to your report
2. Drag fields to the visual:
   - **Level1-8**: Your stage/category columns
   - **Value**: Your numeric measure
   - **Tooltip**: (optional) Custom tooltip text
3. Adjust formatting settings as needed

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[CODE_REVIEW.md](CODE_REVIEW.md)** - Code review and quality analysis
- **[powerbi-sankey-8level/README.md](powerbi-sankey-8level/README.md)** - Technical details

---

## 🔧 For Developers

### Development Mode

```bash
cd powerbi-sankey-8level
npm install
npm run start
```

This starts a dev server. In Power BI Desktop (with Developer Mode enabled), the visual will auto-reload when you make changes.

### Project Structure

```
powerbi-sankey-8level/
├── src/
│   ├── visual.ts       # Main visual logic
│   └── settings.ts     # Visual settings
├── style/
│   └── visual.less     # Styling
├── assets/
│   └── icon.png        # Visual icon
├── capabilities.json   # Data roles and capabilities
├── pbiviz.json        # Visual metadata
└── package.json       # Dependencies
```

### Build Commands

- `npm run start` - Start development server
- `npm run package` - Create `.pbiviz` package file

---

## ⚡ Features

- ✅ Up to **8 levels** of flow visualization
- ✅ Simple table (row-column) data input
- ✅ Configurable node width, padding, and alignment
- ✅ Label truncation to prevent overlap
- ✅ Optional label merging across levels
- ✅ Custom tooltips
- ✅ Interactive hover states

---

## 🐛 Troubleshooting

### "pbiviz: command not found"
```bash
npm install -g powerbi-visuals-tools
```

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run package
```

### Visual doesn't show data
- Ensure you've added at least **Level1** and **Value** fields
- Check that Value contains valid positive numbers
- Verify no circular flows (A→B→A not allowed)

---

## 📝 Recent Updates

### Latest Code Review Findings (2026-02-23)

✅ **Fixed Critical Bugs**:
- maxLevel calculation bug
- Settings property access logic
- Added error handling and validation
- Improved TypeScript type safety

📊 **Code Quality**: Improved from ⭐⭐⭐ (3/5) to ⭐⭐⭐⭐ (4/5)

See [CODE_REVIEW.md](CODE_REVIEW.md) for complete details.

---

## 🤝 Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

See LICENSE file for details.

---

**Need Help?** Check the [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions and troubleshooting.
