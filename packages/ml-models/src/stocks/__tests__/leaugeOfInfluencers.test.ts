import { assert } from "../../utils/testUtils";
import { getPriceForLeagueOfInfluencers } from "../leagueOfInfluencers";

describe("it can price Leauge of Influencers as expected", () => {
    it("increases the price when government bills goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: 10,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when government bills go down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: -10,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("increases the price when the air index goes down", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 20,
                changeInGovernmentBills: 0,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeLessThan(changedPrice);
    });

    it("decreases the price when the air index goes up", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: 0,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 50,
                changeInGovernmentBills: 0,
                previousPrice: 200,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);
        expect(originalPrice).toBeGreaterThan(changedPrice);
    });

    it("changes by the same amount regardless of previous price", async () => {
        const [originalPrice, changedPrice] = await Promise.all([
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: 10,
                previousPrice: 200,
            }),
            getPriceForLeagueOfInfluencers({
                airQualityIndex: 30,
                changeInGovernmentBills: 10,
                previousPrice: 400,
            }),
        ]);

        assert(originalPrice !== undefined && changedPrice !== undefined);

        const changeInPriceOriginal = originalPrice - 200;
        expect(changedPrice - 400 - changeInPriceOriginal).toBeLessThan(changeInPriceOriginal * 0.025);
    });
});
