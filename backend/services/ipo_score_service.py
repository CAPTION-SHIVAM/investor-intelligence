from __future__ import annotations


class IPOScoreService:
    def calculate_business_score(self, revenue_growth: float, customer_concentration: float) -> float:
        score = 50 + (revenue_growth * 1.8) - (customer_concentration * 0.6)
        return max(0.0, min(100.0, score))

    def calculate_financial_score(self, net_margin: float, roce: float, debt_to_equity: float) -> float:
        score = 45 + (net_margin * 1.2) + (roce * 0.7) - (debt_to_equity * 18)
        return max(0.0, min(100.0, score))

    def calculate_growth_score(self, revenue_growth: float, ebitda_margin: float) -> float:
        score = 40 + (revenue_growth * 1.7) + (ebitda_margin * 0.9)
        return max(0.0, min(100.0, score))

    def calculate_valuation_score(self, price_to_earnings: float, peer_pe: float) -> float:
        if peer_pe <= 0:
            return 50.0
        ratio = price_to_earnings / peer_pe
        score = 100 - ((ratio - 1) * 60)
        return max(0.0, min(100.0, score))

    def calculate_management_score(self, promoter_holding: float, promoter_pledge: float) -> float:
        score = 55 + (promoter_holding * 0.55) - (promoter_pledge * 10)
        return max(0.0, min(100.0, score))

    def calculate_risk_score(self, debt_to_equity: float, litigation_risk: float, industry_risk: float) -> float:
        score = 90 - (debt_to_equity * 22) - (litigation_risk * 15) - (industry_risk * 12)
        return max(0.0, min(100.0, score))

    def calculate_overall_score(
        self,
        revenue_growth: float,
        net_margin: float,
        ebitda_margin: float,
        roce: float,
        debt_to_equity: float,
        price_to_earnings: float,
        peer_pe: float,
        promoter_holding: float,
        promoter_pledge: float,
        litigation_risk: float,
        industry_risk: float,
        customer_concentration: float,
    ) -> float:
        business = self.calculate_business_score(revenue_growth, customer_concentration)
        financial = self.calculate_financial_score(net_margin, roce, debt_to_equity)
        growth = self.calculate_growth_score(revenue_growth, ebitda_margin)
        valuation = self.calculate_valuation_score(price_to_earnings, peer_pe)
        management = self.calculate_management_score(promoter_holding, promoter_pledge)
        risk = self.calculate_risk_score(debt_to_equity, litigation_risk, industry_risk)

        weighted = (
            business * 0.20
            + financial * 0.20
            + growth * 0.15
            + valuation * 0.20
            + management * 0.10
            + risk * 0.15
        )
        return round(weighted, 2)
