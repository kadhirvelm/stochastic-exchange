import { ORIGIN, PORT } from "@stochastic-exchange/api";
import bodyParser from "body-parser";
import compression from "compression";
import express from "express";
import { createServer } from "http";
import { instantiateAllCronJobs } from "./cronJobs/instantiateAllCronJobs";
import { configureAllRoutes } from "./routes/configureAllRoutes";
import { configureSecurity } from "./security/configureSecurity";
import { pingServerToPreventSleep } from "./utils/pingServerToPreventSleep";

const app = express();
const server = createServer(app);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

configureSecurity(app);
configureAllRoutes(app);

instantiateAllCronJobs();

if (ORIGIN !== undefined) {
    // DEVELOPMENT
    server.listen(PORT as number | undefined, ORIGIN, () => {
        // eslint-disable-next-line no-console
        console.log({ level: "info", message: `Server started, listening on http://${ORIGIN ?? ""}:${PORT ?? ""}` });
    });
} else {
    // PRODUCTION
    server.listen(PORT || 3000, () => {
        // eslint-disable-next-line no-console
        console.log({ level: "info", message: `Server started, listening on ${PORT ?? ""}` });

        pingServerToPreventSleep();
    });
}
