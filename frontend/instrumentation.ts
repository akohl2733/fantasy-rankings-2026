export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const appInsights = require('applicationinsights');

        if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
            appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
                .setAutoCollectConsole(true, true)
                .setSendLiveMetrics(true)
                .start();

            console.log("Application Insights successfully registered.");
        }
    }
}