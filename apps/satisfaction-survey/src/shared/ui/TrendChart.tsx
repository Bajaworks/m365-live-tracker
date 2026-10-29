/**
 * @generated_by_model claude-opus-5-5
 * @generated_at 2026-10-24T17:00:00Z
 * @agent_roles IDE Agent + engineering-frontend-developer + design-ui-designer
 * @vision_command start_sprint --sprint 3
 * @sprint_number 3
 * @task_id T-007
 */
import * as React from 'react';
import { Button, makeStyles, tokens } from '@fluentui/react-components';
import { DIMENSIONS, type DimensionKey, type IMonthlyPoint } from '../model/survey';

export interface ITrendChartProps {
  points: ReadonlyArray<IMonthlyPoint>;
  colors: Record<DimensionKey, string>;
  dimensionLabel: (key: DimensionKey) => string;
  monthLabel: (month: string) => string;
  formatValue: (value: number) => string;
  strings: { showTable: string; showChart: string; month: string; responses: string; title: string };
}

const WIDTH: number = 640;
const HEIGHT: number = 240;
const PAD = { top: 16, right: 116, bottom: 28, left: 32 };

const useStyles = makeStyles({
  root: { display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalS },
  head: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: tokens.spacingHorizontalS },
  legend: { display: 'flex', flexWrap: 'wrap', gap: tokens.spacingHorizontalM, fontSize: tokens.fontSizeBase200, color: tokens.colorNeutralForeground2 },
  key: { display: 'inline-flex', alignItems: 'center', gap: tokens.spacingHorizontalXS },
  swatch: { width: '12px', height: '3px', borderRadius: '2px' },
  wrap: { position: 'relative', width: '100%' },
  svg: { width: '100%', height: 'auto', display: 'block', overflow: 'visible' },
  tooltip: {
    position: 'absolute',
    pointerEvents: 'none',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusMedium,
    boxShadow: tokens.shadow8,
    padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
    fontSize: tokens.fontSizeBase200,
    whiteSpace: 'nowrap',
    transform: 'translate(-50%, -100%)'
  },
  table: {
    borderCollapse: 'collapse',
    width: '100%',
    fontSize: tokens.fontSizeBase200,
    '& th, & td': { padding: '4px 8px', textAlign: 'right', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` },
    '& th:first-child, & td:first-child': { textAlign: 'left' }
  }
});

/**
 * Monthly average per dimension (one 2px line each, fixed colors, ≥8px markers).
 * Identity is never color-alone: legend + direct label at the end of each line,
 * plus a table view. Hover shows a crosshair with all four values for the month.
 */
export function TrendChart(props: ITrendChartProps): React.ReactElement {
  const { points, colors, dimensionLabel, monthLabel, formatValue, strings } = props;
  const styles = useStyles();
  const [asTable, setAsTable] = React.useState<boolean>(false);
  const [hover, setHover] = React.useState<number | undefined>(undefined);
  const svgRef: React.MutableRefObject<SVGSVGElement | null> = React.useRef(null);

  const plotW: number = WIDTH - PAD.left - PAD.right;
  const plotH: number = HEIGHT - PAD.top - PAD.bottom;
  const x = (i: number): number => PAD.left + (points.length <= 1 ? plotW / 2 : (i * plotW) / (points.length - 1));
  const y = (v: number): number => PAD.top + ((5 - v) * plotH) / 4;

  const onMove = (event: React.MouseEvent<SVGSVGElement>): void => {
    const svg: SVGSVGElement | null = svgRef.current;
    if (!svg || points.length === 0) {
      return;
    }
    const rect: DOMRect = svg.getBoundingClientRect();
    const px: number = ((event.clientX - rect.left) / rect.width) * WIDTH;
    let best: number = 0;
    points.forEach((_p, i) => {
      if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) {
        best = i;
      }
    });
    setHover(best);
  };

  // Direct labels at the end of each line, nudged apart so they never collide.
  const last: IMonthlyPoint | undefined = points[points.length - 1];
  const endLabels: Array<{ key: DimensionKey; y: number }> = last
    ? DIMENSIONS.map((d) => ({ key: d.key, y: y(last.byDimension[d.key]) })).sort((a, b) => a.y - b.y)
    : [];
  for (let i = 1; i < endLabels.length; i++) {
    if (endLabels[i].y - endLabels[i - 1].y < 14) {
      endLabels[i].y = endLabels[i - 1].y + 14;
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <div className={styles.legend} aria-hidden={asTable}>
          {DIMENSIONS.map((d) => (
            <span key={d.key} className={styles.key}>
              <span className={styles.swatch} style={{ backgroundColor: colors[d.key] }} />
              {dimensionLabel(d.key)}
            </span>
          ))}
        </div>
        <Button size="small" appearance="subtle" onClick={() => setAsTable(!asTable)}>
          {asTable ? strings.showChart : strings.showTable}
        </Button>
      </div>

      {asTable ? (
        <table className={styles.table}>
          <caption style={{ textAlign: 'left' }}>{strings.title}</caption>
          <thead>
            <tr>
              <th scope="col">{strings.month}</th>
              {DIMENSIONS.map((d) => (
                <th key={d.key} scope="col">
                  {dimensionLabel(d.key)}
                </th>
              ))}
              <th scope="col">{strings.responses}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.month}>
                <th scope="row">{monthLabel(p.month)}</th>
                {DIMENSIONS.map((d) => (
                  <td key={d.key}>{formatValue(p.byDimension[d.key])}</td>
                ))}
                <td>{p.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.wrap}>
          <svg
            ref={svgRef}
            className={styles.svg}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={strings.title}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(undefined)}
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <g key={v}>
                <line x1={PAD.left} x2={PAD.left + plotW} y1={y(v)} y2={y(v)} stroke={tokens.colorNeutralStroke2} strokeWidth={1} />
                <text x={PAD.left - 8} y={y(v) + 4} textAnchor="end" fontSize={11} fill={tokens.colorNeutralForeground3}>
                  {v}
                </text>
              </g>
            ))}
            {points.map((p, i) => (
              <text key={p.month} x={x(i)} y={HEIGHT - 8} textAnchor="middle" fontSize={11} fill={tokens.colorNeutralForeground3}>
                {monthLabel(p.month)}
              </text>
            ))}
            {hover !== undefined && (
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} stroke={tokens.colorNeutralStroke1} strokeWidth={1} strokeDasharray="3 3" />
            )}
            {DIMENSIONS.map((d) => (
              <g key={d.key}>
                <polyline
                  fill="none"
                  stroke={colors[d.key]}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={points.map((p, i) => `${x(i)},${y(p.byDimension[d.key])}`).join(' ')}
                />
                {points.map((p, i) => (
                  <circle
                    key={p.month}
                    cx={x(i)}
                    cy={y(p.byDimension[d.key])}
                    r={hover === i ? 5 : 4}
                    fill={colors[d.key]}
                    stroke={tokens.colorNeutralBackground1}
                    strokeWidth={2}
                  />
                ))}
              </g>
            ))}
            {endLabels.map((l) => (
              <text key={l.key} x={PAD.left + plotW + 10} y={l.y + 4} fontSize={11} fill={tokens.colorNeutralForeground2}>
                {dimensionLabel(l.key)} {last ? formatValue(last.byDimension[l.key]) : ''}
              </text>
            ))}
          </svg>
          {hover !== undefined && points[hover] && (
            <div className={styles.tooltip} style={{ left: `${(x(hover) / WIDTH) * 100}%`, top: 0 }}>
              <strong>{monthLabel(points[hover].month)}</strong> · {points[hover].n} {strings.responses}
              {DIMENSIONS.map((d) => (
                <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 3, borderRadius: 2, backgroundColor: colors[d.key], display: 'inline-block' }} />
                  {dimensionLabel(d.key)}: {formatValue(points[hover].byDimension[d.key])}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
