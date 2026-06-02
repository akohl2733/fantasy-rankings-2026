export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const appInsights = await import('applicationinsights');

        appInsights.setup()
            .setAutoCollectConsole(true, true)
            .setSendLiveMetrics(true)
            .start()
    }
}