import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { shoeFittingCatalog, unisexSizeChart } from "../data/virtualSizingData";
import type { ShoeVariant, SizeChartRow } from "../data/virtualSizingData";

// ✅ Import the local asset
import FootGuide from "../assets/foot-guide.jpg";

type Measurement = { lengthCm: number; widthCm: number };

type FitAssessment = {
  variant: ShoeVariant;
  fit: "ideal" | "close" | "out-of-range";
  distanceScore: number;
  notes: string;
};

const defaultMeasurement: Measurement = { lengthCm: 26.8, widthCm: 10.3 };

const normalizeNumber = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : NaN;
};

const VirtualTry: React.FC = () => {
  const [lengthInput, setLengthInput] = useState(
    `${defaultMeasurement.lengthCm}`
  );
  const [widthInput, setWidthInput] = useState(`${defaultMeasurement.widthCm}`);
  const [conversionScale, setConversionScale] = useState<"us" | "uk" | "eu">(
    "us"
  );
  const [conversionSize, setConversionSize] = useState("9");

  const measurement = useMemo<Measurement>(
    () => ({
      lengthCm: normalizeNumber(lengthInput) || defaultMeasurement.lengthCm,
      widthCm: normalizeNumber(widthInput) || defaultMeasurement.widthCm,
    }),
    [lengthInput, widthInput]
  );

  const fitAssessments = useMemo<FitAssessment[]>(() => {
    const results: FitAssessment[] = shoeFittingCatalog.map((variant) => {
      const [minLength, maxLength] = variant.footLengthCm;
      const [minWidth, maxWidth] = variant.footWidthCm;

      const lengthCenter = (minLength + maxLength) / 2;
      const widthCenter = (minWidth + maxWidth) / 2;

      const lengthDistance = Math.abs(lengthCenter - measurement.lengthCm);
      const widthDistance = Math.abs(widthCenter - measurement.widthCm);

      const lengthFits =
        measurement.lengthCm >= minLength && measurement.lengthCm <= maxLength;
      const widthFits =
        measurement.widthCm >= minWidth && measurement.widthCm <= maxWidth;

      const fit: FitAssessment["fit"] =
        lengthFits && widthFits
          ? "ideal"
          : lengthDistance <= 0.6 && widthDistance <= 0.5
          ? "close"
          : "out-of-range";

      let notes = variant.notes ?? "";
      if (fit === "close")
        notes = `${
          notes ? notes + " " : ""
        }Consider a half size adjustment or different width option.`;
      if (fit === "out-of-range")
        notes = `${
          notes ? notes + " " : ""
        }Outside of recommended foot measurements.`;

      const distanceScore = lengthDistance * 0.7 + widthDistance * 0.3;

      return { variant, fit, distanceScore, notes };
    });

    return results
      .filter((r) => r.fit !== "out-of-range")
      .sort((a, b) => a.distanceScore - b.distanceScore)
      .concat(
        results
          .filter((r) => r.fit === "out-of-range")
          .sort((a, b) => a.distanceScore - b.distanceScore)
      );
  }, [measurement]);

  const { exactMatch, nearestMatch, conversionLabel } = useMemo(() => {
    const sizeValue = normalizeNumber(conversionSize);
    if (Number.isNaN(sizeValue)) {
      return {
        exactMatch: undefined,
        nearestMatch: undefined,
        conversionLabel: "Enter a size",
      };
    }
    const match = unisexSizeChart.find(
      (row) => row[conversionScale] === sizeValue
    );
    if (match)
      return {
        exactMatch: match,
        nearestMatch: undefined,
        conversionLabel: "Exact size match",
      };
    const closest = unisexSizeChart.reduce((prev, row) => {
      const d1 = Math.abs(row[conversionScale] - sizeValue);
      const d2 = Math.abs(prev[conversionScale] - sizeValue);
      return d1 < d2 ? row : prev;
    });
    return {
      exactMatch: undefined,
      nearestMatch: closest,
      conversionLabel: "Closest available size",
    };
  }, [conversionScale, conversionSize]);

  const renderFitBadge = (fit: FitAssessment["fit"]) =>
    fit === "ideal" ? (
      <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
        Ideal fit
      </span>
    ) : fit === "close" ? (
      <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-700">
        Close match
      </span>
    ) : (
      <span className="rounded-full bg-rose-100 px-3 py-0.5 text-xs font-semibold text-rose-700">
        Outside range
      </span>
    );

  const recommendedPairs = fitAssessments
    .filter((i) => i.fit !== "out-of-range")
    .slice(0, 4);
  const sizeSummaryRow: SizeChartRow | undefined = exactMatch ?? nearestMatch;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="text-lg font-semibold tracking-wide text-slate-900"
          >
            zuliäm virtual lab
          </Link>
          <nav className="flex items-center space-x-4 text-sm font-medium text-slate-600">
            <Link className="hover:text-slate-900" to="/">
              Home
            </Link>
            <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
              Virtual fit
            </span>
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10 lg:flex-row">
        {/* LEFT: inputs */}
        <section className="w-full rounded-2xl bg-white p-6 shadow-sm lg:w-2/5">
          <h1 className="text-2xl font-semibold text-slate-900">
            Measure your foot
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter length & width (standing, weight evenly distributed). We’ll
            compare against zuliäm ranges.
          </p>

          <form className="mt-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="length"
              >
                Foot length (cm)
              </label>
              <input
                id="length"
                type="number"
                min={20}
                max={32}
                step={0.1}
                value={lengthInput}
                onChange={(e) => setLengthInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="width"
              >
                Foot width (cm)
              </label>
              <input
                id="width"
                type="number"
                min={7}
                max={14}
                step={0.1}
                value={widthInput}
                onChange={(e) => setWidthInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Snapshot table */}
            <div className="rounded-xl bg-indigo-50 p-4 text-xs text-indigo-900">
              <p className="font-semibold">Foot measurements</p>
              <div className="mt-2 overflow-hidden rounded-lg border border-indigo-200 bg-white text-slate-800">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 font-medium">Metric</th>
                      <th className="px-3 py-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-3 py-2">Length</td>
                      <td className="px-3 py-2">
                        {measurement.lengthCm.toFixed(1)} cm
                      </td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2">Width</td>
                      <td className="px-3 py-2">
                        {measurement.widthCm.toFixed(1)} cm
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* How to measure – image guide */}
            <figure className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <img
                src={FootGuide}
                alt="Foot size measurements guide showing width and length"
                className="mx-auto max-h-64 w-auto rounded-md object-contain"
                loading="lazy"
              />
              <figcaption className="mt-2 text-center text-xs text-slate-600">
                How to measure: length (heel to longest toe) and width (widest
                part).
              </figcaption>
            </figure>
          </form>
        </section>

        {/* RIGHT: results + converter */}
        <section className="flex w-full flex-1 flex-col gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Suggested fits
              </h2>
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Based on your foot
              </span>
            </div>

            {recommendedPairs.length > 0 ? (
              <ul className="mt-4 space-y-4">
                {fitAssessments.map(({ variant, fit, notes }) => (
                  <li
                    key={variant.id}
                    className="rounded-xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {variant.brand} {variant.model}
                          {"subType" in variant && (variant as any).subType
                            ? ` — ${(variant as any).subType}`
                            : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          {variant.sizeLabel} • {variant.profile} profile
                        </p>
                      </div>
                      {renderFitBadge(fit)}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-2">
                      <p>
                        Foot length range: {variant.footLengthCm[0].toFixed(1)}–
                        {variant.footLengthCm[1].toFixed(1)}cm
                      </p>
                      <p>
                        Foot width range: {variant.footWidthCm[0].toFixed(1)}–
                        {variant.footWidthCm[1].toFixed(1)}cm
                      </p>
                    </div>

                    {notes && (
                      <p className="mt-3 text-xs text-slate-500">{notes}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                We couldn’t find a match. Try adjusting your measurements
                slightly.
              </p>
            )}
          </div>

          {/* Size converter */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Size converter
                </h2>
                <p className="text-xs text-slate-500">
                  Compare US, UK, and EU unisex sneaker sizing using our
                  reference chart.
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <label
                  className="text-xs font-medium text-slate-600"
                  htmlFor="scale"
                >
                  Base scale
                </label>
                <select
                  id="scale"
                  value={conversionScale}
                  onChange={(e) =>
                    setConversionScale(e.target.value as "us" | "uk" | "eu")
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="us">US</option>
                  <option value="uk">UK</option>
                  <option value="eu">EU</option>
                </select>
                <input
                  type="text"
                  value={conversionSize}
                  onChange={(e) => setConversionSize(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 8.5"
                />
              </div>
            </div>

            {sizeSummaryRow ? (
              <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-slate-100 p-4 text-sm text-slate-700 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    {conversionLabel}
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    US {sizeSummaryRow.us.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    UK complement
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    UK {sizeSummaryRow.uk.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    EU complement
                  </p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    EU {sizeSummaryRow.eu.toFixed(1)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-600">
                Enter a numeric size (e.g. 8, 8.5, 42) to view the closest
                conversion.
              </p>
            )}

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-4 py-2 font-medium">Mondopoint (cm)</th>
                    <th className="px-4 py-2 font-medium">US</th>
                    <th className="px-4 py-2 font-medium">UK</th>
                    <th className="px-4 py-2 font-medium">EU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {unisexSizeChart.map((row) => (
                    <tr
                      key={`${row.mondoCm}-${row.us}`}
                      className={
                        sizeSummaryRow && row === sizeSummaryRow
                          ? "bg-indigo-50 font-semibold text-indigo-900"
                          : undefined
                      }
                    >
                      <td className="px-4 py-2">{row.mondoCm.toFixed(1)}</td>
                      <td className="px-4 py-2">{row.us.toFixed(1)}</td>
                      <td className="px-4 py-2">{row.uk.toFixed(1)}</td>
                      <td className="px-4 py-2">{row.eu.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VirtualTry;
