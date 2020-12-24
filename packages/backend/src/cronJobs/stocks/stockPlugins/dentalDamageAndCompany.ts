import { getPriceForDentalDamageAndCompany, IDentalDamageAndCompanyInputData } from "@stochastic-exchange/ml-models";
import { callOnExternalEndpoint } from "../../../utils/callOnExternalEndpoint";
import { changeDateByDays } from "../../../utils/dateUtil";
import { IStockPricerPlugin } from "../types";

const DEFAULT_VALUE = 450;

interface IDentalDamageAndCompanyCalculationNotes extends IDentalDamageAndCompanyInputData {
    previousAveragePalladiumPrice: number;
    previousAveragePlatinumPrice: number;
    previousUsDairyPricesAverage: number;
    previousUsMilkSupplyAverage: number;
}

function getAverageOf2020Values(data: any[][]) {
    if (data.length === 0) {
        return undefined;
    }

    return data.filter(d => d[5].includes("2020")).reduce((previous, next) => previous + next[7], 0) / data.length;
}

function getAverageUsPriceOfMetal(data: any[]) {
    if (data.length === 0) {
        return undefined;
    }

    return (data[1] + data[4]) / 2;
}

export const priceDentalDamageAndCompany: IStockPricerPlugin = async (
    date,
    stock,
    totalOwnedStock,
    previousPriceHistory,
) => {
    const yesterdayDate = changeDateByDays(date, -1);
    const yesterdayHyphenSeparated = `${yesterdayDate.getFullYear()}-${yesterdayDate.getMonth() +
        1}-${yesterdayDate.getDate()}`;

    const [usDairyPrices, usMilkSupply, palladiumPrices, platinumPrices] = await Promise.all([
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datatables/WASDE/DATA?code=DAIRY_US_34&report_month=${date.getFullYear()}-${date.getMonth()}&api_key=${
                process.env.QUANDL_KEY
            }`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datatables/WASDE/DATA?code=MILK_US_33&report_month=${date.getFullYear()}-${date.getMonth()}&api_key=${
                process.env.QUANDL_KEY
            }`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/LPPM/PALL?start_date=${yesterdayHyphenSeparated}&end_date=${yesterdayHyphenSeparated}&api_key=${process.env.QUANDL_KEY}`,
        ),
        callOnExternalEndpoint(
            `https://www.quandl.com/api/v3/datasets/LPPM/PLAT?start_date=${yesterdayHyphenSeparated}&end_date=${yesterdayHyphenSeparated}&api_key=${process.env.QUANDL_KEY}`,
        ),
    ]);

    const previousCalculationNotes: Partial<IDentalDamageAndCompanyCalculationNotes> = JSON.parse(
        previousPriceHistory?.calculationNotes ?? "{}",
    );

    const usDairyPricesAverageValue =
        getAverageOf2020Values(usDairyPrices.datatable.data) ??
        previousCalculationNotes.previousUsDairyPricesAverage ??
        0;
    const changeInUsDairyPricesAverageValue =
        (previousCalculationNotes.previousUsDairyPricesAverage ?? usDairyPricesAverageValue) -
        usDairyPricesAverageValue;

    const usMilkSupplyAverageValue =
        getAverageOf2020Values(usMilkSupply.datatable.data) ??
        previousCalculationNotes.previousUsMilkSupplyAverage ??
        0;
    const changeInUsMilkSupplyAverageValue =
        (previousCalculationNotes.previousUsMilkSupplyAverage ?? usMilkSupplyAverageValue) - usMilkSupplyAverageValue;

    const averagePalladiumPriceToday =
        getAverageUsPriceOfMetal(palladiumPrices.dataset.data[0]) ??
        previousCalculationNotes.previousAveragePalladiumPrice ??
        0;
    const changeInPalladiumPrice =
        (previousCalculationNotes.previousAveragePalladiumPrice ?? averagePalladiumPriceToday) -
        averagePalladiumPriceToday;

    const averagePlatinumPriceToday =
        getAverageUsPriceOfMetal(platinumPrices.dataset.data[0]) ??
        previousCalculationNotes.previousAveragePlatinumPrice ??
        0;
    const changeInPlatinumPrice =
        (previousCalculationNotes.previousAveragePlatinumPrice ?? averagePlatinumPriceToday) -
        averagePlatinumPriceToday;

    const percentOwnership = totalOwnedStock / stock.totalQuantity;

    const previousPrice = previousPriceHistory?.dollarValue ?? DEFAULT_VALUE;

    const inputToModel: IDentalDamageAndCompanyInputData = {
        changeInPalladiumPrice,
        changeInPlatinumPrice,
        changeInUsDairyPricesAverageValue,
        changeInUsMilkSupplyAverageValue,
        percentOwnership,
        previousPrice,
    };

    const dollarValue = await getPriceForDentalDamageAndCompany(inputToModel);

    const calculationNotes: IDentalDamageAndCompanyCalculationNotes = {
        ...inputToModel,
        previousAveragePalladiumPrice: averagePalladiumPriceToday,
        previousAveragePlatinumPrice: averagePlatinumPriceToday,
        previousUsDairyPricesAverage: usDairyPricesAverageValue,
        previousUsMilkSupplyAverage: usMilkSupplyAverageValue,
    };

    return {
        calculationNotes: JSON.stringify(calculationNotes),
        dollarValue: dollarValue ?? previousPrice,
    };
};
