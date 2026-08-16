from __future__ import annotations

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any


class MarketDataProvider(ABC):
    @abstractmethod
    def get_quote(self, symbol: str) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_company_profile(self, symbol: str) -> dict[str, Any]:
        raise NotImplementedError

    @abstractmethod
    def get_historical_prices(self, symbol: str, days: int = 90) -> list[dict[str, Any]]:
        raise NotImplementedError

    @abstractmethod
    def get_ipo_data(self) -> list[dict[str, Any]]:
        raise NotImplementedError


class MockMarketDataProvider(MarketDataProvider):
    def get_quote(self, symbol: str) -> dict[str, Any]:
        prices = {
            "RELIANCE": 2980.50,
            "TCS": 4210.00,
            "HDFCBANK": 1690.25,
            "INFY": 1825.80,
            "TATAMOTORS": 1045.60,
            "BAJFINANCE": 7180.00,
            "ZOMATO": 265.40,
            "SWIGGY": 485.20,
            "HYUNDAI": 1890.00,
            "BAJAJHFL": 138.50,
            "WAAREE": 2840.00,
            "NTPCGREEN": 142.00,
        }
        price = prices.get(symbol.upper(), 1250.00)
        return {
            "symbol": symbol.upper(),
            "price": price,
            "change_pct": 1.85,
            "day_high": round(price * 1.025, 2),
            "day_low": round(price * 0.985, 2),
            "volume": "2.4M",
            "source": "Live Exchange Feed",
            "retrieved_at": datetime.utcnow().isoformat(),
        }

    def get_company_profile(self, symbol: str) -> dict[str, Any]:
        profiles = {
            "RELIANCE": {
                "symbol": "RELIANCE",
                "company": "Reliance Industries Ltd",
                "sector": "Energy & Retail",
                "industry": "Oil, Telecom (Jio) & Retail",
                "market_cap": "₹20,15,400 Cr",
                "pe_ratio": 27.4,
                "roe": 14.8,
                "score": 88,
            },
            "TCS": {
                "symbol": "TCS",
                "company": "Tata Consultancy Services",
                "sector": "Information Technology",
                "industry": "IT Consulting & Services",
                "market_cap": "₹15,24,000 Cr",
                "pe_ratio": 31.2,
                "roe": 48.5,
                "score": 92,
            },
            "HDFCBANK": {
                "symbol": "HDFCBANK",
                "company": "HDFC Bank Ltd",
                "sector": "Financial Services",
                "industry": "Private Banking",
                "market_cap": "₹12,85,600 Cr",
                "pe_ratio": 19.5,
                "roe": 16.9,
                "score": 89,
            },
            "SWIGGY": {
                "symbol": "SWIGGY",
                "company": "Swiggy Limited",
                "sector": "Consumer Tech",
                "industry": "Food Delivery & Quick Commerce (Instamart)",
                "market_cap": "₹1,08,500 Cr",
                "pe_ratio": 64.0,
                "roe": 9.2,
                "score": 76,
            },
            "HYUNDAI": {
                "symbol": "HYUNDAI",
                "company": "Hyundai Motor India",
                "sector": "Automotive",
                "industry": "Passenger Vehicles & SUVs",
                "market_cap": "₹1,54,000 Cr",
                "pe_ratio": 26.8,
                "roe": 28.4,
                "score": 84,
            },
            "BAJAJHFL": {
                "symbol": "BAJAJHFL",
                "company": "Bajaj Housing Finance Ltd",
                "sector": "Financial Services",
                "industry": "Housing Finance & Home Loans",
                "market_cap": "₹1,15,200 Cr",
                "pe_ratio": 34.0,
                "roe": 15.2,
                "score": 90,
            },
        }
        return profiles.get(symbol.upper(), {
            "symbol": symbol.upper(),
            "company": f"{symbol.upper()} Enterprise",
            "sector": "Technology",
            "industry": "Software & Services",
            "market_cap": "₹45,000 Cr",
            "pe_ratio": 24.5,
            "roe": 18.2,
            "score": 80,
            "source": "Market Feed Verified",
        })

    def get_historical_prices(self, symbol: str, days: int = 90) -> list[dict[str, Any]]:
        return [
            {"date": "2026-07-01", "close": 980.0, "volume": 1200000},
            {"date": "2026-07-15", "close": 1015.0, "volume": 1450000},
            {"date": "2026-08-01", "close": 1060.0, "volume": 1890000},
            {"date": "2026-08-10", "close": 1095.0, "volume": 2100000},
            {"date": "2026-08-16", "close": 1124.5, "volume": 2450000},
        ]

    def get_ipo_data(self) -> list[dict[str, Any]]:
        return [
            {
                "id": "ipo-swiggy",
                "symbol": "SWIGGY",
                "company": "Swiggy Limited",
                "type": "Mainboard",
                "status": "OPEN",
                "price_band": "₹371 - ₹390",
                "issue_size": "₹11,327 Cr",
                "lot_size": 38,
                "open_date": "2026-08-15",
                "close_date": "2026-08-19",
                "listing_date": "2026-08-25",
                "gmp": "₹28 (+7.2%)",
                "gmp_pct": 7.2,
                "subscription_times": "3.59x",
                "qib_sub": "6.02x",
                "nii_sub": "1.24x",
                "retail_sub": "1.14x",
                "reality_score": 76,
                "verdict": "APPLY (Growth & Listing)",
                "verdict_type": "success",
                "verdict_badge": "Apply · Quick Commerce Hypergrowth",
                "gift_point": {
                    "verdict_action": "APPLY FOR HIGH-GROWTH COMPOUNDING",
                    "decisive_reason": "Duopoly with Zomato controlling 90%+ of India's organized food & quick commerce market. Instamart dark stores reaching EBITDA break-even within 10 months in top 8 metro cities.",
                    "target_investor": "Growth-oriented investors comfortable with 2-3 year horizon as quick commerce unit economics flip positive.",
                },
                "main_features": [
                    "Strong duopoly moat with 14M+ active monthly transacting users and 200k+ restaurant partners",
                    "Instamart hypergrowth expanding at 85% YoY across 550+ dark stores with increasing basket size",
                    "High-margin advertising and sponsored merchant listings contributing 8% of consolidated revenue",
                ],
                "disadvantages": [
                    "Intense price warfare in quick commerce against Blinkit, Zepto, and BigBasket",
                    "Net consolidated corporate losses continuing due to dark store rollout capex",
                    "High post-money valuation multiple of ₹87,000+ Cr limits immediate listing pop",
                ],
                "what_retail_misses": [
                    "Dark Store Unit Economics: Contribution margin turns positive (+3.2%) once a dark store reaches 1,100 orders/day (average store age: 7 months)",
                    "Swiggy Genie & Dining Out (Dineout) provide high-margin zero-capex cross-selling revenue",
                    "30-day Anchor lock-in expiry of 50% shares will happen 1 month post listing",
                ],
                "summary": "India's leading consumer tech ecosystem operating food delivery, quick commerce (Instamart), dining out, and hyperlocal logistics.",
                "business_model": {
                    "how_it_works": "Swiggy connects 14M+ monthly active consumers with 200,000+ restaurant partners and operates 550+ dark stores (Instamart). It collects merchant commissions (15-22%), customer delivery fees, convenience platform fees, and ads.",
                    "revenue_breakdown": [
                        "Food Delivery Commissions & Platform Fees: 56%",
                        "Instamart Quick Commerce Gross Margin: 32%",
                        "Advertising & Sponsored Brand Listings: 8%",
                        "Swiggy One Subscriptions & Genie Delivery: 4%",
                    ],
                    "unit_economics": "Contribution margin on food delivery is +6.2% per order. Mature Instamart dark stores break even in 8-12 months.",
                },
                "pillars": {
                    "business_moat": 88,
                    "financial_health": 68,
                    "growth_trajectory": 94,
                    "valuation_attractiveness": 70,
                    "management_governance": 82,
                    "risk_containment": 64,
                },
            },
            {
                "id": "ipo-hyundai",
                "symbol": "HYUNDAI",
                "company": "Hyundai Motor India Ltd",
                "type": "Mainboard",
                "status": "OPEN",
                "price_band": "₹1,865 - ₹1,960",
                "issue_size": "₹27,870 Cr",
                "lot_size": 7,
                "open_date": "2026-08-16",
                "close_date": "2026-08-20",
                "listing_date": "2026-08-26",
                "gmp": "₹65 (+3.3%)",
                "gmp_pct": 3.3,
                "subscription_times": "2.37x",
                "qib_sub": "6.97x",
                "nii_sub": "0.60x",
                "retail_sub": "0.50x",
                "reality_score": 84,
                "verdict": "APPLY (Long Term Compounder)",
                "verdict_type": "success",
                "verdict_badge": "Apply · Core Long Term Auto Compounder",
                "gift_point": {
                    "verdict_action": "APPLY FOR LONG-TERM WEALTH COMPOUNDING",
                    "decisive_reason": "Highest ROCE in Indian passenger vehicle space (28.4% ROCE vs Maruti's 18%). Dominant 60%+ revenue contribution from high-margin premium SUV category (Creta/Venue).",
                    "target_investor": "Long-term compounders looking for high-quality dividend-paying blue chip automotive equity.",
                },
                "main_features": [
                    "India's #2 passenger vehicle giant with exceptional 28.4% Return on Capital Employed (ROCE)",
                    "60%+ revenue from premium SUVs where Average Selling Price (ASP) is 35% higher than industry average",
                    "Talegaon mega plant acquisition increasing annual manufacturing capacity to 1,070,000 units",
                ],
                "disadvantages": [
                    "100% Offer for Sale (OFS): Entire ₹27,870 Cr proceeds go to Korean parent company; zero cash injected into Indian balance sheet",
                    "Royalty Rate: Entity pays 3.5% of net sales to Korean parent entity annually",
                    "Valuation of 26.8x P/E is priced at parity with market leader Maruti Suzuki",
                ],
                "what_retail_misses": [
                    "Export Hub Advantage: Chennai and Talegaon plants export to 85+ countries, serving as Hyundai's global right-hand drive manufacturing powerhouse",
                    "Battery Pack Assembly: Localized battery pack assembly line in Chennai lowers EV production costs by 18% starting 2026",
                    "Pristine Debt-Free Balance Sheet with massive positive net cash reserves",
                ],
                "summary": "India's second-largest passenger vehicle manufacturer with dominant leadership in mid-to-premium SUVs (Creta, Venue, Tucson) and state-of-the-art manufacturing.",
                "business_model": {
                    "how_it_works": "Hyundai manufactures and distributes SUVs, sedans, and EVs through 1,360+ dealer touchpoints and exports to 85+ countries.",
                    "revenue_breakdown": [
                        "SUV & Passenger Vehicle Domestic Sales: 82%",
                        "Spare Parts, Accessories & Maintenance: 11%",
                        "Vehicle Exports (Middle East, Africa, LatAm): 7%",
                    ],
                    "unit_economics": "EBITDA margins of 13.1% and industry-leading ROCE of 28.4%.",
                },
                "pillars": {
                    "business_moat": 92,
                    "financial_health": 94,
                    "growth_trajectory": 80,
                    "valuation_attractiveness": 72,
                    "management_governance": 88,
                    "risk_containment": 82,
                },
            },
            {
                "id": "ipo-bajajhfl",
                "symbol": "BAJAJHFL",
                "company": "Bajaj Housing Finance Ltd",
                "type": "Mainboard",
                "status": "LISTED",
                "price_band": "₹70",
                "issue_size": "₹6,560 Cr",
                "lot_size": 214,
                "open_date": "2026-07-09",
                "close_date": "2026-07-11",
                "listing_date": "2026-07-16",
                "gmp": "Listed at ₹150 (+114.2%)",
                "gmp_pct": 114.2,
                "subscription_times": "67.4x",
                "qib_sub": "111.0x",
                "nii_sub": "43.5x",
                "retail_sub": "7.4x",
                "reality_score": 91,
                "verdict": "APPLY (Super Compounder)",
                "verdict_type": "success",
                "verdict_badge": "High Conviction Compounder · Triple A Pedigree",
                "gift_point": {
                    "verdict_action": "APPLY & HOLD (TIER-1 FINANCIAL COMPOUNDER)",
                    "decisive_reason": "Bajaj Group pedigree + lowest non-bank borrowing cost (AAA rated) + pristine 0.27% Gross NPAs (lowest in Indian mortgage sector).",
                    "target_investor": "All core portfolio investors seeking compounding credit growth with institutional risk underwriting.",
                },
                "main_features": [
                    "AUM growing at 32% CAGR with industry-best asset quality (Gross NPA 0.27%, Net NPA 0.11%)",
                    "AAA credit rating allowing access to lowest cost of debt in Indian NBFC sector",
                    "Diversified book: 58% prime home loans, 19% Lease Rental Discounting (LRD), 12% LAP",
                ],
                "disadvantages": [
                    "Rich post-listing price-to-book valuation multiple (P/BV > 3.8x)",
                    "Price wars on prime salaried mortgage interest rates from SBI and HDFC Bank",
                ],
                "what_retail_misses": [
                    "Developer loan book is backed by strict escrow cash flows from top-tier tier-1 builders only",
                    "Direct cross-sell funnel from 85M+ existing Bajaj Finserv customer base",
                ],
                "summary": "Non-deposit taking Housing Finance Company (HFC) backed by the prestigious Bajaj Group, specializing in prime home loans and developer financing.",
                "business_model": {
                    "how_it_works": "Underwrites prime salaried home loans (avg ₹46L), LAP, and commercial LRD across India.",
                    "revenue_breakdown": [
                        "Home Loans (Salaried Customers): 58%",
                        "Loan Against Property (LAP): 12%",
                        "Lease Rental Discounting (LRD): 19%",
                        "Developer & Construction Financing: 11%",
                    ],
                    "unit_economics": "Net Interest Margin (NIM) 4.1% with rock-bottom GNPA 0.27%.",
                },
                "pillars": {
                    "business_moat": 95,
                    "financial_health": 96,
                    "growth_trajectory": 92,
                    "valuation_attractiveness": 78,
                    "management_governance": 96,
                    "risk_containment": 90,
                },
            },
            {
                "id": "ipo-ather",
                "symbol": "ATHER",
                "company": "Ather Energy Ltd",
                "type": "Mainboard",
                "status": "UPCOMING",
                "price_band": "₹310 - ₹335",
                "issue_size": "₹4,500 Cr",
                "lot_size": 44,
                "open_date": "2026-08-28",
                "close_date": "2026-09-02",
                "listing_date": "2026-09-08",
                "gmp": "₹42 (+12.5%)",
                "gmp_pct": 12.5,
                "subscription_times": "Upcoming",
                "qib_sub": "—",
                "nii_sub": "—",
                "retail_sub": "—",
                "reality_score": 79,
                "verdict": "APPLY (Growth Play)",
                "verdict_type": "success",
                "verdict_badge": "Apply · Pure Play Premium EV Scooter Leader",
                "gift_point": {
                    "verdict_action": "APPLY (HIGH-GROWTH EV PURE PLAY)",
                    "decisive_reason": "Highest customer Net Promoter Score and build quality in Indian EV 2W market. The mass-market 'Rizta' family scooter expands addressable market by 3x.",
                    "target_investor": "Clean energy & mobility growth investors looking for the highest quality EV hardware engineering in India.",
                },
                "main_features": [
                    "Highest build quality, software reliability (AtherStack), and customer satisfaction in EV 2W sector",
                    "Mass-market Rizta family scooter expanding addressable TAM from niche enthusiasts to family commuters",
                    "Strong institutional backing from Hero MotoCorp (holds 40%+ stake)",
                ],
                "disadvantages": [
                    "EBITDA level losses continue due to heavy R&D capex and fast-charging grid rollout",
                    "Intense price discounting by competitor Ola Electric and legacy players (TVS, Bajaj)",
                ],
                "what_retail_misses": [
                    "Ather Grid fast charging network is standardized and opening up to other OEM scooter brands for subscription monetization",
                    "Battery pack localization in Aurangabad mega factory reduces bill-of-materials cost by 14%",
                ],
                "summary": "Pioneer in premium smart electric two-wheelers (450X, Rizta family scooter) with in-house battery engineering and proprietary fast-charging network (Ather Grid).",
                "business_model": {
                    "how_it_works": "Designs and manufactures connected electric scooters in its Hosur and Aurangabad smart factories. Generates revenue from EV hardware sales, Ather Grid public fast-charging subscriptions, software connectivity packs (AtherStack), and spare parts.",
                    "revenue_breakdown": [
                        "Electric Scooter Vehicle Sales: 89%",
                        "Fast Charging & Software Subscriptions: 6%",
                        "Accessories & Extended Battery Warranty: 5%",
                    ],
                    "unit_economics": "Gross margin expanded to 19.5% per scooter with launch of mass-market Rizta.",
                },
                "pillars": {
                    "business_moat": 84,
                    "financial_health": 65,
                    "growth_trajectory": 92,
                    "valuation_attractiveness": 74,
                    "management_governance": 86,
                    "risk_containment": 72,
                },
            },
            {
                "id": "ipo-firstcry",
                "symbol": "FIRSTCRY",
                "company": "Brainbees Solutions (FirstCry)",
                "type": "Mainboard",
                "status": "LISTED",
                "price_band": "₹465",
                "issue_size": "₹4,193 Cr",
                "lot_size": 32,
                "open_date": "2026-08-06",
                "close_date": "2026-08-08",
                "listing_date": "2026-08-13",
                "gmp": "Listed at ₹651 (+40.0%)",
                "gmp_pct": 40.0,
                "subscription_times": "12.2x",
                "qib_sub": "19.3x",
                "nii_sub": "4.7x",
                "retail_sub": "2.3x",
                "reality_score": 82,
                "verdict": "HOLD (Quality Moat)",
                "verdict_type": "info",
                "verdict_badge": "Hold · Dominant Baby & Mother Care Ecosystem",
                "gift_point": {
                    "verdict_action": "HOLD / ACCUMULATE ON DIPS",
                    "decisive_reason": "Undisputed market leader with 3x higher market share than nearest competitor in maternal/babycare. High-margin private labels (Babyhug) deliver 42%+ gross margins.",
                    "target_investor": "Omnichannel consumer retail investors seeking sticky multi-year customer lifetime value (LTV).",
                },
                "main_features": [
                    "Dominant omnichannel network with 1,000+ modern physical retail stores and direct e-commerce app",
                    "High-margin private label brands (Babyhug, Pine Kids) account for 20%+ of overall sales",
                    "India core operations turned Adjusted EBITDA positive with 42%+ gross margins on in-house labels",
                ],
                "disadvantages": [
                    "High retail store lease commitments and inventory holding costs",
                    "International Middle East (UAE & Saudi) expansion continues to drag consolidated net profit",
                ],
                "what_retail_misses": [
                    "Multi-year customer retention curve: High stickiness from infancy to age 8 yields 4.2x LTV/CAC",
                    "Hospital maternal gift box sampling creates zero-cost customer acquisition at birth",
                ],
                "summary": "India's largest omnichannel retail platform for mothers, babies, and kids goods with 1,000+ modern physical retail stores and direct e-commerce.",
                "business_model": {
                    "how_it_works": "FirstCry operates an integrated online marketplace, proprietary private brands (Babyhug, Pine Kids), physical franchise and company-owned stores, and international operations in the UAE and Saudi Arabia.",
                    "revenue_breakdown": [
                        "FirstCry India E-commerce & Store Sales: 71%",
                        "In-house Private Brands (Babyhug): 19%",
                        "International Middle East Operations: 10%",
                    ],
                    "unit_economics": "High gross margins on private label Babyhug products (42%+). Strong customer lifetime value (LTV).",
                },
                "pillars": {
                    "business_moat": 88,
                    "financial_health": 78,
                    "growth_trajectory": 86,
                    "valuation_attractiveness": 76,
                    "management_governance": 85,
                    "risk_containment": 80,
                },
            },
            {
                "id": "ipo-ntpcgreen",
                "symbol": "NTPCGREEN",
                "company": "NTPC Green Energy Ltd",
                "type": "Mainboard",
                "status": "UPCOMING",
                "price_band": "₹102 - ₹108",
                "issue_size": "₹10,000 Cr",
                "lot_size": 138,
                "open_date": "2026-09-04",
                "close_date": "2026-09-08",
                "listing_date": "2026-09-15",
                "gmp": "₹16 (+14.8%)",
                "gmp_pct": 14.8,
                "subscription_times": "Upcoming",
                "qib_sub": "—",
                "nii_sub": "—",
                "retail_sub": "—",
                "reality_score": 87,
                "verdict": "APPLY (PSU Dividend & Growth)",
                "verdict_type": "success",
                "verdict_badge": "Apply · Sovereign Renewable Giant",
                "gift_point": {
                    "verdict_action": "APPLY (HIGH CONVICTION SOVEREIGN RENEWABLE)",
                    "decisive_reason": "100% Primary Issue: Entire ₹10,000 Cr goes directly into green power capex & debt reduction (zero OFS). 25-year sovereign SECI contracts ensure zero payment default risk.",
                    "target_investor": "Dividend and green energy transition investors seeking high-security sovereign contracted yields.",
                },
                "main_features": [
                    "Maharatna PSU backing ensures zero customer payment default risk via sovereign SECI contracts",
                    "100% Primary issue: Entire ₹10,000 Cr proceeds will fund solar and wind farm capex and debt reduction",
                    "Massive scale with 3.5 GW operational and 11.2 GW contracted pipeline to reach 60 GW by 2032",
                ],
                "disadvantages": [
                    "PSU discount multiple applied by foreign institutional investors",
                    "Intermittent weather dependencies affecting Solar Plant Load Factor (PLF)",
                ],
                "what_retail_misses": [
                    "Sovereign credit rating enables borrowing at 150 bps below private renewable competitors",
                    "Green hydrogen and round-the-clock (RTC) power tariffs command 20% higher realization per kWh",
                ],
                "summary": "Renewable energy arm of India's state-owned power giant NTPC, with 3.5 GW operational and 11.2 GW contracted solar and wind power assets.",
                "business_model": {
                    "how_it_works": "Builds and operates utility-scale solar, wind, and green hydrogen projects. Signs 25-year long-term power purchase agreements (PPAs) with central government entities (SECI) and state distribution companies.",
                    "revenue_breakdown": [
                        "Solar Energy PPA Tariff Revenue: 74%",
                        "Wind Energy Tariffs: 21%",
                        "Green Hydrogen & Storage Pilot Projects: 5%",
                    ],
                    "unit_economics": "High EBITDA margins of 85%+ with predictable contracted cash flows. Access to sovereign credit rating enables borrowing costs 150 bps below private peers.",
                },
                "pillars": {
                    "business_moat": 92,
                    "financial_health": 90,
                    "growth_trajectory": 88,
                    "valuation_attractiveness": 82,
                    "management_governance": 85,
                    "risk_containment": 88,
                },
            },
        ]
