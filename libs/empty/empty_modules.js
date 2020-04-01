// FIX: Trick sequalize into thinking we've installed the "required" modules
// Despite only using MySQL it still thinks we need to have PostgreSQL and other
// database modules installed. I tell sequalize that they live here but they don't/
// Seeing as we don't use them it behaves fine. Combined issue with webpack and sequalize.