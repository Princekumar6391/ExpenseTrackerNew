# AI_WORKED

## AI used
- This project was assisted by **GitHub Copilot** using the **Raptor mini (Preview)** model.

## Why AI was used
- To diagnose and fix issues in the expense tracker app quickly.
- To help identify where `Total Spend` and `Spending Overview` values were mismatched.
- To improve data handling for chart rendering and weekly filtering.

## What changed
- Fixed the weekly filter logic in `src/utils/HelperFunctions.js` so `Week` includes the last 7 days of transactions.
- Updated `src/components/PieChart.js` so the pie chart uses actual category expense values (`totalExpense`) rather than percentage values.
- These changes ensure the chart and total spend display match.

## Why this is still your code
- The AI only suggested and applied changes based on your existing project structure.
- Your project logic, file organization, and app behavior remain controlled by you.
- The AI did not replace your app; it only helped fix specific bugs and improve the display logic.

## Ownership
- You still own the code in this repository.
- The AI provided implementation support, but the final code is part of your project.
