Get Started
Quickstart
Firecrawl allows you to turn entire websites into LLM-ready markdown

Hero Light
​
Welcome to Firecrawl
Firecrawl is an API service that takes a URL, crawls it, and converts it into clean markdown. We crawl all accessible subpages and give you clean markdown for each. No sitemap required.

​
How to use it?
We provide an easy to use API with our hosted version. You can find the playground and documentation here. You can also self host the backend if you’d like.

Check out the following resources to get started:

API
Python SDK
Node SDK
Go SDK
Rust SDK
Langchain Integration 🦜🔗
Langchain JS Integration 🦜🔗
Llama Index Integration 🦙
Dify Integration
Langflow Integration
Crew.ai Integration
Flowise AI Integration
Composio Integration
PraisonAI Integration
Zapier Integration
Cargo Integration
Pipedream Integration
Pabbly Connect Integration
Want an SDK or Integration? Let us know by opening an issue.
Self-host: To self-host refer to guide here.

​
API Key
To use the API, you need to sign up on Firecrawl and get an API key.

​
Crawling
Used to crawl a URL and all accessible subpages. This submits a crawl job and returns a job ID to check the status of the crawl.

​
Installation

Python

Node

Go

Rust

npm install @mendable/firecrawl-js
​
Usage

Python

Node

Go

Rust

cURL

import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

const crawlResponse = await app.crawlUrl('https://firecrawl.dev', {
limit: 100,
scrapeOptions: {
formats: ['markdown', 'html'],
}
})

if (!crawlResponse.success) {
throw new Error(`Failed to crawl: ${crawlResponse.error}`)
}

console.log(crawlResponse)
If you’re using cURL or async crawl functions on SDKs, this will return an ID where you can use to check the status of the crawl.

{
"success": true,
"id": "123-456-789",
"url": "https://api.firecrawl.dev/v1/crawl/123-456-789"
}
​
Check Crawl Job
Used to check the status of a crawl job and get its result.

Python

Node

Go

Rust

cURL

const crawlResponse = await app.checkCrawlStatus("<crawl_id>");

if (!crawlResponse.success) {
throw new Error(`Failed to check crawl status: ${crawlResponse.error}`)
}

console.log(crawlResponse)
​
Response
The response will be different depending on the status of the crawl. For not completed or large responses exceeding 10MB, a next URL parameter is provided. You must request this URL to retrieve the next 10MB of data. If the next parameter is absent, it indicates the end of the crawl data.

Scraping

Completed

{
"status": "scraping",
"total": 36,
"completed": 10,
"creditsUsed": 10,
"expiresAt": "2024-00-00T00:00:00.000Z",
"next": "https://api.firecrawl.dev/v1/crawl/123-456-789?skip=10",
"data": [
{
"markdown": "[Firecrawl Docs home page![light logo](https://mintlify.s3-us-west-1.amazonaws.com/firecrawl/logo/light.svg)!...",
"html": "<!DOCTYPE html><html lang=\"en\" class=\"js-focus-visible lg:[--scroll-mt:9.5rem]\" data-js-focus-visible=\"\">...",
"metadata": {
"title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
"language": "en",
"sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
"description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
"ogLocaleAlternate": [],
"statusCode": 200
}
},
...
]
}
​
Scraping
To scrape a single URL, use the scrape_url method. It takes the URL as a parameter and returns the scraped data as a dictionary.

Python

Node

Go

Rust

cURL

import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

// Scrape a website:
const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'] }) as ScrapeResponse;

if (!scrapeResult.success) {
throw new Error(`Failed to scrape: ${scrapeResult.error}`)
}

console.log(scrapeResult)
​
Response
SDKs will return the data object directly. cURL will return the payload exactly as shown below.

{
"success": true,
"data" : {
"markdown": "Launch Week I is here! [See our Day 2 Release 🚀](https://www.firecrawl.dev/blog/launch-week-i-day-2-doubled-rate-limits)[💥 Get 2 months free...",
"html": "<!DOCTYPE html><html lang=\"en\" class=\"light\" style=\"color-scheme: light;\"><body class=\"**variable_36bd41 **variable_d7dc5d font-inter ...",
"metadata": {
"title": "Home - Firecrawl",
"description": "Firecrawl crawls and converts any website into clean markdown.",
"language": "en",
"keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
"robots": "follow, index",
"ogTitle": "Firecrawl",
"ogDescription": "Turn any website into LLM-ready data.",
"ogUrl": "https://www.firecrawl.dev/",
"ogImage": "https://www.firecrawl.dev/og.png?123",
"ogLocaleAlternate": [],
"ogSiteName": "Firecrawl",
"sourceURL": "https://firecrawl.dev",
"statusCode": 200
}
}
}
​
Extraction
With LLM extraction, you can easily extract structured data from any URL. We support pydantic schemas to make it easier for you too. Here is how you to use it:

v1 is only supported on node, python and cURL at this time.

Python

Node

cURL

import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const app = new FirecrawlApp({
apiKey: "fc-YOUR_API_KEY"
});

// Define schema to extract contents into
const schema = z.object({
company_mission: z.string(),
supports_sso: z.boolean(),
is_open_source: z.boolean(),
is_in_yc: z.boolean()
});

const scrapeResult = await app.scrapeUrl("https://docs.firecrawl.dev/", {
formats: ["extract"],
extract: { schema: schema }
});

if (!scrapeResult.success) {
throw new Error(`Failed to scrape: ${scrapeResult.error}`)
}

console.log(scrapeResult.data["extract"]);
Output:

JSON

{
"success": true,
"data": {
"extract": {
"company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
"supports_sso": true,
"is_open_source": false,
"is_in_yc": true
},
"metadata": {
"title": "Mendable",
"description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"robots": "follow, index",
"ogTitle": "Mendable",
"ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"ogUrl": "https://docs.firecrawl.dev/",
"ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
"ogLocaleAlternate": [],
"ogSiteName": "Mendable",
"sourceURL": "https://docs.firecrawl.dev/"
},
}
}
​
Extracting without schema (New)
You can now extract without a schema by just passing a prompt to the endpoint. The llm chooses the structure of the data.

cURL

curl -X POST https://api.firecrawl.dev/v1/scrape \
 -H 'Content-Type: application/json' \
 -H 'Authorization: Bearer YOUR_API_KEY' \
 -d '{
"url": "https://docs.firecrawl.dev/",
"formats": ["extract"],
"extract": {
"prompt": "Extract the company mission from the page."
}
}'
Output:

JSON

{
"success": true,
"data": {
"extract": {
"company_mission": "Train a secure AI on your technical resources that answers customer and employee questions so your team doesn't have to",
},
"metadata": {
"title": "Mendable",
"description": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"robots": "follow, index",
"ogTitle": "Mendable",
"ogDescription": "Mendable allows you to easily build AI chat applications. Ingest, customize, then deploy with one line of code anywhere you want. Brought to you by SideGuide",
"ogUrl": "https://docs.firecrawl.dev/",
"ogImage": "https://docs.firecrawl.dev/mendable_new_og1.png",
"ogLocaleAlternate": [],
"ogSiteName": "Mendable",
"sourceURL": "https://docs.firecrawl.dev/"
},
}
}
​
Extraction (v0)

Python

JavaScript

Go

Rust

cURL

app = FirecrawlApp(version="v0")

class ArticleSchema(BaseModel):
title: str
points: int
by: str
commentsURL: str

class TopArticlesSchema(BaseModel):
top: List[ArticleSchema] = Field(..., max_items=5, description="Top 5 stories")

data = app.scrape_url('https://news.ycombinator.com', {
'extractorOptions': {
'extractionSchema': TopArticlesSchema.model_json_schema(),
'mode': 'llm-extraction'
},
'pageOptions':{
'onlyMainContent': True
}
})
print(data["llm_extraction"])
​
Interacting with the page with Actions
Firecrawl allows you to perform various actions on a web page before scraping its content. This is particularly useful for interacting with dynamic content, navigating through pages, or accessing content that requires user interaction.

Here is an example of how to use actions to navigate to google.com, search for Firecrawl, click on the first result, and take a screenshot.

It is important to almost always use the wait action before/after executing other actions to give enough time for the page to load.

​
Example

Python

Node

cURL

import FirecrawlApp, { ScrapeResponse } from '@mendable/firecrawl-js';

const app = new FirecrawlApp({apiKey: "fc-YOUR_API_KEY"});

// Scrape a website:
const scrapeResult = await app.scrapeUrl('firecrawl.dev', { formats: ['markdown', 'html'], actions: [
{ type: "wait", milliseconds: 2000 },
{ type: "click", selector: "textarea[title=\"Search\"]" },
{ type: "wait", milliseconds: 2000 },
{ type: "write", text: "firecrawl" },
{ type: "wait", milliseconds: 2000 },
{ type: "press", key: "ENTER" },
{ type: "wait", milliseconds: 3000 },
{ type: "click", selector: "h3" },
{"type": "screenshot"}
] }) as ScrapeResponse;

if (!scrapeResult.success) {
throw new Error(`Failed to scrape: ${scrapeResult.error}`)
}

console.log(scrapeResult)
​
Output

JSON

{
"success": true,
"data": {
"markdown": "Our first Launch Week is over! [See the recap 🚀](blog/firecrawl-launch-week-1-recap)...",
"actions": {
"screenshots": [
"https://alttmdsdujxrfnakrkyi.supabase.co/storage/v1/object/public/media/screenshot-75ef2d87-31e0-4349-a478-fb432a29e241.png"
]
},
"metadata": {
"title": "Home - Firecrawl",
"description": "Firecrawl crawls and converts any website into clean markdown.",
"language": "en",
"keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
"robots": "follow, index",
"ogTitle": "Firecrawl",
"ogDescription": "Turn any website into LLM-ready data.",
"ogUrl": "https://www.firecrawl.dev/",
"ogImage": "https://www.firecrawl.dev/og.png?123",
"ogLocaleAlternate": [],
"ogSiteName": "Firecrawl",
"sourceURL": "http://google.com",
"statusCode": 200
}
}
}
