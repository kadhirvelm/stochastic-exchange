import * as tf from "@tensorflow/tfjs-node";
import { StockModel } from "./stockModel";

const convertAgriColaIncInputToArray = (input: IAgriColaIncInputData) => [
    input.averageRainfall,
    input.averageTemperateInCelsius,
    input.averageWindSpeed,
    input.changeInAveragePrice,
    input.previousPrice,
];

export interface IAgriColaIncInputData {
    averageRainfall: number;
    averageTemperateInCelsius: number;
    averageWindSpeed: number;
    changeInAveragePrice: number;
    previousPrice: number;
}

const AgriColaIncModel = new StockModel<IAgriColaIncInputData>(
    {
        epochs: 400,
        optimizer: tf.train.adam(0.1),
        name: "agri-cola-inc-v1",
    },
    convertAgriColaIncInputToArray,
);

export const getPriceForAgriColaInc = AgriColaIncModel.getPrice;

const AVERAGE_CELSIUS = 3.5;
const AVERAGE_WIND_SPEED = 4;
const AVERAGE_RAIN_FALL = 0;

export const trainModelForAgriColaInc = AgriColaIncModel.trainModel([
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 25,
        },
        output: 25,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS - 2,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 25,
        },
        output: 24,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS + 2,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED - 5,
            changeInAveragePrice: 0,
            previousPrice: 25,
        },
        output: 24,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED + 5,
            changeInAveragePrice: 0,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 3,
            previousPrice: 25,
        },
        output: 25.5,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: -3,
            previousPrice: 25,
        },
        output: 24.5,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL + 3,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 25,
        },
        output: 26,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL - 3,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 25,
        },
        output: 24,
    },

    /** Different previous price */
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 50,
        },
        output: 50,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS - 2,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 50,
        },
        output: 48,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS + 2,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 50,
        },
        output: 52,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED - 5,
            changeInAveragePrice: 0,
            previousPrice: 50,
        },
        output: 48,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED + 5,
            changeInAveragePrice: 0,
            previousPrice: 50,
        },
        output: 52,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 3,
            previousPrice: 50,
        },
        output: 51,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: -3,
            previousPrice: 50,
        },
        output: 49,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL + 3,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 50,
        },
        output: 52,
    },
    {
        input: {
            averageRainfall: AVERAGE_RAIN_FALL - 3,
            averageTemperateInCelsius: AVERAGE_CELSIUS,
            averageWindSpeed: AVERAGE_WIND_SPEED,
            changeInAveragePrice: 0,
            previousPrice: 50,
        },
        output: 48,
    },
]);
