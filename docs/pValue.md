The pValue display is located in `src/features/charts/SurvivalPlot/SurvivalPlot.tsx`

Around line 364:
```html
<div className="text-xs font-content">
{isNumber(pValue) &&
  `Log-Rank Test P-Value = ${pValue.toExponential(2)}`}
</div>
```
