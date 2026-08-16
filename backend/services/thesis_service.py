from __future__ import annotations


class ThesisHealthService:
    def calculate_health_score(self, assumptions: list[dict]) -> tuple[int, dict]:
        total = len(assumptions)
        if total == 0:
            return 0, {"on_track": 0, "warning": 0, "failed": 0, "not_enough_data": 0}

        counts = {"ON_TRACK": 0, "WARNING": 0, "FAILED": 0, "NOT_ENOUGH_DATA": 0}
        for item in assumptions:
            status = str(item.get("status", "NOT_ENOUGH_DATA")).upper()
            counts[status] = counts.get(status, 0) + 1

        score = round((counts["ON_TRACK"] * 100 + counts["WARNING"] * 50) / total)
        return score, counts
