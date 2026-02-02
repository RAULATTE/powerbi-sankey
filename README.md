# Power BI Sankey Visual Repository

This repository contains a Power BI custom visual for Sankey Diagrams.

## Structure

- **skill/** - The main Power BI custom visual (Sankey Diagram with up to 8 levels)
  - Contains the complete source code, configuration, and assets for the visual
  - See [skill/README.md](skill/README.md) for detailed information about the visual

- **powerbi-sankey-8level/** - Original visual source (for reference)

- **powerbi-sankey-8level-crossfilter.zip** - Packaged version with crossfilter support

## Quick Start

To build and use the skill:

```bash
cd skill
npm install
npm run start    # Start development server
npm run package  # Create .pbiviz package file
```

For detailed instructions, see the [skill README](skill/README.md).
