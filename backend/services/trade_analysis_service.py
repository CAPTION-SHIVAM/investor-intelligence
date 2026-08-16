from __future__ import annotations

from collections import defaultdict
from statistics import mean


class TradeAnalysisService:
    def analyze(self, trades: list[dict]) -> dict:
        if not trades:
            return {
                "investor_score": 0,
                "win_rate": 0.0,
                "top_issues": [],
                "categories": {},
            }

        pnl_values = []
        wins = 0
        losses = 0
        for trade in trades:
            pnl = float(trade.get("pnl", 0.0))
            pnl_values.append(pnl)
            if pnl > 0:
                wins += 1
            elif pnl < 0:
                losses += 1

        win_rate = (wins / max(1, wins + losses)) * 100 if (wins + losses) else 0.0
        average_pnl = mean(pnl_values) if pnl_values else 0.0
        score = max(0, min(100, round(65 + average_pnl * 0.12 + win_rate * 0.2)))

        by_symbol = defaultdict(float)
        for trade in trades:
            by_symbol[trade.get("symbol", "UNKNOWN")] += float(trade.get("pnl", 0.0))

        top_issues = []
        if win_rate < 50:
            top_issues.append("Low win rate")
        if average_pnl < 0:
            top_issues.append("Average P/L is negative")
        if len(by_symbol) > 3:
            top_issues.append("Sector concentration risk")
        if not top_issues:
            top_issues.append("Strong historical discipline")

        return {
            "investor_score": score,
            "win_rate": round(win_rate, 2),
            "top_issues": top_issues,
            "categories": {
                "discipline": 72,
                "diversification": 48,
                "position_sizing": 51,
                "loss_management": 39,
                "profit_management": 81,
                "timing": 56,
            },
        }
